<template>
  <ClientOnly>
    <section class="db-workbench" :aria-label="workbenchTitle">
      <header class="workbench-header">
        <div class="workbench-identity">
          <DatabaseLogo :id="metadata.brandId" :size="32" />
          <div><p>{{ metadata.runtime }}</p><h3>{{ workbenchTitle }}</h3></div>
        </div>
        <span class="runtime-status" :class="statusClass"><i />{{ statusText }}</span>
      </header>

      <div v-if="runtimeWarning" class="runtime-warning" role="status">{{ runtimeWarning }}</div>

      <div class="manager-shell">
        <div class="workbench-center">
          <div class="main-tabs" role="tablist" aria-label="数据库工作区">
            <button type="button" role="tab" :aria-selected="activeView === 'overview'" :class="{ active: activeView === 'overview' }" @click="showOverview">
              {{ selectedNode ? `对象 · ${selectedNode.name}` : '数据库概览' }}
            </button>
            <button type="button" role="tab" :aria-selected="activeView === 'query'" :class="{ active: activeView === 'query' }" @click="openQuery()">查询 1</button>
            <span />
            <small>{{ metadata.editorLanguage === 'javascript' ? 'JavaScript API' : metadata.editorLanguage.toUpperCase() }}</small>
          </div>

          <div class="workbench-upper">
            <WorkbenchOverview
              v-if="activeView === 'overview'"
              :metadata="metadata"
              :selected-node="selectedNode"
              :status-text="statusText"
              :status-class="statusClass"
              :schema-count="schema.length"
              :editor-label="editorLabel"
              :persistence-label="persistenceLabel"
              :persist-locally="persistLocally"
              :workspace-id="workspaceId"
              :can-export-database="canExportDatabase"
              :busy="busy"
              @insert-query="insertObjectQuery"
              @preview="previewObject"
              @set-persistence="setPersistence"
              @set-workspace="setWorkspace"
              @import-file="importSelectedFile"
              @export-database="downloadDatabase"
              @refresh="refreshSchema"
              @reset="resetWorkspace"
            />

            <section v-else class="query-pane">
              <div class="pane-toolbar">
                <div><span>{{ editorLabel }}</span><small>Ctrl/⌘ + Enter 运行 · 最多展示 1,000 行</small></div>
                <div class="toolbar-actions">
                  <button type="button" :disabled="busy" @click="restoreDefaultQuery">恢复示例</button>
                  <button class="run-button" type="button" :disabled="busy || !ready" @click="runQuery">
                    {{ busy ? '处理中…' : '▶ 运行' }}
                  </button>
                </div>
              </div>
              <div ref="editorHost" class="query-editor" />
            </section>
          </div>

          <WorkbenchResultPanel
            :active-tab="activeResultTab"
            :active-result="activeResult"
            :error-message="errorMessage"
            :history="history"
            :capabilities="capabilityRows"
            :can-export-database="canExportDatabase"
            :busy="busy"
            @select-tab="activeResultTab = $event"
            @restore-history="restoreHistory"
            @download-csv="downloadCsv"
            @download-database="downloadDatabase"
          />
        </div>
      </div>
    </section>
  </ClientOnly>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch, watchEffect } from 'vue';
import { Compartment, EditorState } from '@codemirror/state';
import { EditorView, keymap } from '@codemirror/view';
import { sql } from '@codemirror/lang-sql';
import { javascript } from '@codemirror/lang-javascript';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { tags } from '@lezer/highlight';
import { useData } from 'vitepress';
import { defaultSources, engineCatalog } from '../data/engineCatalog';
import { EngineWorkerClient } from '../runtime/EngineWorkerClient';
import { buildObjectPreviewSource } from '../runtime/workbenchQueries';
import { connectWorkbenchSidebar, workbenchSidebarState } from '../runtime/workbenchSidebar';
import type { EngineId, EngineStatus, ExecutionResult, ResultTab, SchemaNode } from '../runtime/types';
import WorkbenchOverview from './workbench/WorkbenchOverview.vue';
import WorkbenchResultPanel from './workbench/WorkbenchResultPanel.vue';
import DatabaseLogo from './DatabaseLogo.vue';

const props = withDefaults(defineProps<{
  engine?: EngineId;
  title?: string;
  initialSource?: string;
  allowEngineSwitch?: boolean;
}>(), {
  engine: 'sqlite',
  allowEngineSwitch: false,
});

const { isDark } = useData();

const selectedEngine = ref<EngineId>(props.engine);
const persistLocally = ref(false);
const workspaceId = ref('main');
const busy = ref(false);
const ready = ref(false);
const runtimeWarning = ref('');
const explorerMessage = ref('');
const errorMessage = ref('');
const results = ref<ExecutionResult[]>([]);
const schema = ref<SchemaNode[]>([]);
const selectedNode = ref<SchemaNode>();
const activeView = ref<'overview' | 'query'>('overview');
const activeResultTab = ref<ResultTab>('result');
const sidebarBound = ref(false);
const editorHost = ref<HTMLElement>();
const currentSource = ref(props.initialSource || defaultSources[props.engine]);
const drafts = ref<Record<EngineId, string>>({ ...defaultSources, [props.engine]: currentSource.value });
const history = ref<Array<{ source: string; time: number }>>([]);
let editor: EditorView | undefined;
let client: EngineWorkerClient | undefined;
let disconnectSidebar: (() => void) | undefined;
const editorTheme = new Compartment();

const metadata = computed(() => engineCatalog[selectedEngine.value]);
const workbenchTitle = computed(() => props.title || `${metadata.value.label} 数据库工作台`);
const editorLabel = computed(() => metadata.value.editorLanguage === 'javascript' ? 'JavaScript / IndexedDB' : metadata.value.editorLanguage === 'surrealql' ? 'SurrealQL' : 'SQL 查询');
const statusText = computed(() => busy.value ? '运行中' : ready.value ? '已连接' : '等待初始化');
const statusClass = computed(() => busy.value ? 'busy' : ready.value ? 'ready' : 'idle');
const activeResult = computed(() => [...results.value].reverse().find((result) => result.rows.length) || results.value.at(-1));
const canExportDatabase = computed(() => ['sqlite', 'pglite', 'indexeddb'].includes(selectedEngine.value));
const persistenceLabel = computed(() => persistLocally.value ? metadata.value.capabilities.persistenceLabel : '内存工作区');
const capabilityRows = computed(() => [
  { label: '持久化', value: metadata.value.capabilities.persistence ? metadata.value.capabilities.persistenceLabel : '仅内存' },
  { label: '事务', value: metadata.value.capabilities.transactions ? '支持' : '不支持' },
  { label: '执行计划', value: metadata.value.capabilities.explain ? '支持' : '不支持' },
  { label: '导入', value: metadata.value.capabilities.importFormats.join(' / ') || '不提供' },
  { label: '导出', value: metadata.value.capabilities.exportFormats.join(' / ') || '结果 CSV' },
  { label: '隔离', value: 'Dedicated Worker' },
]);

function createEditorTheme(dark: boolean) {
  const palette = dark ? {
    keyword: '#d8b4fe', string: '#86efac', literal: '#fcd34d', comment: '#94a3b8', variable: '#dbeafe', type: '#67e8f9',
  } : {
    keyword: '#7e22ce', string: '#15803d', literal: '#a16207', comment: '#64748b', variable: '#1e3a8a', type: '#0e7490',
  };
  const highlightStyle = HighlightStyle.define([
    { tag: tags.keyword, color: palette.keyword, fontWeight: '600' },
    { tag: [tags.string, tags.special(tags.string)], color: palette.string },
    { tag: [tags.number, tags.bool, tags.null], color: palette.literal },
    { tag: [tags.comment, tags.lineComment, tags.blockComment], color: palette.comment, fontStyle: 'italic' },
    { tag: [tags.variableName, tags.propertyName], color: palette.variable },
    { tag: tags.typeName, color: palette.type },
  ]);
  return [
    syntaxHighlighting(highlightStyle),
    EditorView.theme({
      '&': { height: '100%', backgroundColor: 'var(--sql-editor-bg)', color: 'var(--sql-editor-text)', fontSize: '13.5px' },
      '.cm-content': { padding: '14px 0', caretColor: 'var(--sql-editor-caret)', fontFamily: 'ui-monospace, SFMono-Regular, Consolas, monospace' },
      '.cm-line': { padding: '0 16px' },
      '.cm-gutters': { backgroundColor: 'var(--sql-editor-gutter-bg)', color: 'var(--sql-editor-gutter-text)', border: 'none' },
      '.cm-activeLine, .cm-activeLineGutter': { backgroundColor: 'var(--sql-editor-active-line)' },
      '.cm-selectionBackground, &.cm-focused .cm-selectionBackground': { backgroundColor: 'var(--sql-editor-selection) !important' },
      '.cm-scroller': { scrollbarColor: 'var(--sql-scrollbar-thumb) var(--sql-scrollbar-track)' },
      '.cm-scroller::-webkit-scrollbar': { width: '10px', height: '10px' },
      '.cm-scroller::-webkit-scrollbar-track': { background: 'var(--sql-scrollbar-track)' },
      '.cm-scroller::-webkit-scrollbar-thumb': { background: 'var(--sql-scrollbar-thumb)', borderRadius: '999px', border: '2px solid var(--sql-scrollbar-track)' },
      '&.cm-focused': { outline: 'none' },
    }, { dark }),
  ];
}

function editorExtensions() {
  return [
    metadata.value.editorLanguage === 'javascript' ? javascript() : sql(),
    EditorView.lineWrapping,
    EditorView.updateListener.of((update) => {
      if (!update.docChanged) return;
      currentSource.value = update.state.doc.toString();
      drafts.value[selectedEngine.value] = currentSource.value;
    }),
    keymap.of([{ key: 'Mod-Enter', run: () => { void runQuery(); return true; } }]),
    editorTheme.of(createEditorTheme(isDark.value)),
  ];
}

function createEditor(source: string) {
  editor?.destroy();
  editor = undefined;
  if (!editorHost.value) return;
  editor = new EditorView({ state: EditorState.create({ doc: source, extensions: editorExtensions() }), parent: editorHost.value });
}

async function initializeClient() {
  busy.value = true;
  ready.value = false;
  runtimeWarning.value = '';
  explorerMessage.value = '';
  errorMessage.value = '';
  schema.value = [];
  try {
    await client?.close();
    client = new EngineWorkerClient(selectedEngine.value);
    const status = await client.init({
      persistence: persistLocally.value ? 'browser' : 'memory',
      workspaceId: workspaceId.value || 'main',
      seedId: 'lessons',
    });
    applyStatus(status);
    ready.value = true;
    await refreshSchema(false);
  } catch (error) {
    explorerMessage.value = `连接失败：${messageOf(error)}`;
    runtimeWarning.value = explorerMessage.value;
  } finally {
    busy.value = false;
  }
}

async function selectEngine(id: EngineId) {
  selectedNode.value = undefined;
  showOverview();
  if (id === selectedEngine.value || busy.value) return;
  drafts.value[selectedEngine.value] = currentSource.value;
  selectedEngine.value = id;
  persistLocally.value = false;
  workspaceId.value = 'main';
  currentSource.value = drafts.value[id];
  results.value = [];
  loadHistory();
  await initializeClient();
}

function selectNode(node: SchemaNode) {
  selectedNode.value = node;
  showOverview();
}

function showOverview() {
  activeView.value = 'overview';
  editor?.destroy();
  editor = undefined;
}

async function openQuery(source?: string) {
  if (source !== undefined) {
    currentSource.value = source;
    drafts.value[selectedEngine.value] = source;
  }
  activeView.value = 'query';
  await nextTick();
  createEditor(currentSource.value);
}

async function insertObjectQuery(node: SchemaNode) {
  await openQuery(buildObjectPreviewSource(selectedEngine.value, node.name));
}

async function previewObject(node: SchemaNode) {
  await openQuery(buildObjectPreviewSource(selectedEngine.value, node.name, 100));
  await runQuery();
}

async function setPersistence(enabled: boolean) {
  persistLocally.value = enabled;
  await initializeClient();
}

async function setWorkspace(value: string) {
  workspaceId.value = value.trim() || 'main';
  await initializeClient();
}

async function runQuery() {
  if (!client || busy.value || !ready.value) return;
  busy.value = true;
  errorMessage.value = '';
  activeResultTab.value = 'result';
  try {
    results.value = await client.execute(currentSource.value, 1000);
    addHistory(currentSource.value);
    await refreshSchema(false);
  } catch (error) {
    errorMessage.value = messageOf(error);
  } finally {
    busy.value = false;
  }
}

async function resetWorkspace() {
  if (!client || busy.value) return;
  busy.value = true;
  errorMessage.value = '';
  try {
    const status = await client.reset('lessons');
    applyStatus(status);
    currentSource.value = props.initialSource && selectedEngine.value === props.engine ? props.initialSource : defaultSources[selectedEngine.value];
    drafts.value[selectedEngine.value] = currentSource.value;
    results.value = [];
    selectedNode.value = undefined;
    await refreshSchema(false);
  } catch (error) {
    runtimeWarning.value = `重置失败：${messageOf(error)}`;
  } finally {
    busy.value = false;
  }
}

async function refreshSchema(manageBusy = true) {
  if (!client) return;
  if (manageBusy) busy.value = true;
  explorerMessage.value = '';
  try {
    const nextSchema = await client.listSchema();
    schema.value = nextSchema;
    if (selectedNode.value) selectedNode.value = nextSchema.find((node) => node.name === selectedNode.value?.name && node.type === selectedNode.value?.type);
  } catch (error) {
    explorerMessage.value = `对象读取失败：${messageOf(error)}`;
  } finally {
    if (manageBusy) busy.value = false;
  }
}

async function importSelectedFile(file: File) {
  if (!client || busy.value) return;
  busy.value = true;
  try {
    await client.importFile?.(file);
    runtimeWarning.value = `${file.name} 已导入；请按当前引擎的文件函数进行查询。`;
    await refreshSchema(false);
  } catch (error) {
    errorMessage.value = messageOf(error);
    activeResultTab.value = 'result';
  } finally {
    busy.value = false;
  }
}

async function downloadDatabase() {
  if (!client || busy.value) return;
  busy.value = true;
  try {
    const blob = await client.exportDatabase?.();
    if (!blob) return;
    const extension = selectedEngine.value === 'indexeddb' ? '.json' : selectedEngine.value === 'pglite' ? '.tar.gz' : '.sqlite3';
    downloadBlob(blob, `hello-sql-${selectedEngine.value}-${workspaceId.value}${extension}`);
  } catch (error) {
    errorMessage.value = messageOf(error);
  } finally {
    busy.value = false;
  }
}

function downloadCsv() {
  if (!activeResult.value) return;
  const headers = activeResult.value.columns.map((column) => csvCell(column.name)).join(',');
  const body = activeResult.value.rows.map((row) => activeResult.value!.columns.map((column) => csvCell(row[column.name])).join(',')).join('\n');
  downloadBlob(new Blob([`${headers}\n${body}`], { type: 'text/csv;charset=utf-8' }), `hello-sql-${selectedEngine.value}-result.csv`);
}

function downloadBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = name;
  anchor.click();
  URL.revokeObjectURL(url);
}

function restoreDefaultQuery() {
  currentSource.value = props.initialSource && selectedEngine.value === props.engine ? props.initialSource : defaultSources[selectedEngine.value];
  drafts.value[selectedEngine.value] = currentSource.value;
  createEditor(currentSource.value);
}
function addHistory(source: string) {
  history.value = [{ source, time: Date.now() }, ...history.value.filter((item) => item.source !== source)].slice(0, 20);
  localStorage.setItem(historyKey(), JSON.stringify(history.value));
}
function loadHistory() {
  try { history.value = JSON.parse(localStorage.getItem(historyKey()) || '[]'); } catch { history.value = []; }
}
async function restoreHistory(source: string) {
  activeResultTab.value = 'result';
  await openQuery(source);
}
function historyKey() { return `hello-sql:v1:history:${selectedEngine.value}`; }
function applyStatus(status: EngineStatus) {
  runtimeWarning.value = status.warning || '';
  persistLocally.value = status.persistence === 'browser';
}
function csvCell(value: unknown) { return `"${formatCell(value).replaceAll('"', '""')}"`; }
function formatCell(value: unknown) { return value === null ? 'NULL' : typeof value === 'object' ? JSON.stringify(value) : String(value); }
function messageOf(error: unknown) { return error instanceof Error ? error.message : String(error); }

watchEffect(() => {
  if (!sidebarBound.value) return;
  workbenchSidebarState.allowEngineSwitch = props.allowEngineSwitch;
  workbenchSidebarState.activeEngine = selectedEngine.value;
  workbenchSidebarState.schema = schema.value;
  workbenchSidebarState.selectedNode = selectedNode.value;
  workbenchSidebarState.ready = ready.value;
  workbenchSidebarState.busy = busy.value;
  workbenchSidebarState.message = explorerMessage.value;
});

watch(isDark, (dark) => {
  editor?.dispatch({ effects: editorTheme.reconfigure(createEditorTheme(dark)) });
});

onMounted(async () => {
  disconnectSidebar = connectWorkbenchSidebar({ selectEngine, selectNode, refresh: refreshSchema });
  sidebarBound.value = true;
  loadHistory();
  await initializeClient();
});
onBeforeUnmount(() => {
  sidebarBound.value = false;
  disconnectSidebar?.();
  editor?.destroy();
  void client?.close();
});
</script>

<style scoped>
.db-workbench { margin: 1.2rem 0 2.4rem; overflow: hidden; border: 1px solid var(--vp-c-divider); border-radius: 14px; background: var(--vp-c-bg); box-shadow: var(--sql-shadow-lg); }
.workbench-header { display: flex; min-height: 3.8rem; align-items: center; justify-content: space-between; gap: .8rem; padding: .65rem .85rem; border-bottom: 1px solid var(--vp-c-divider); background: linear-gradient(125deg, var(--sql-panel), var(--vp-c-bg)); }
.workbench-identity { display: flex; min-width: 0; align-items: center; gap: .65rem; }
.workbench-identity div { min-width: 0; }
.workbench-identity p { margin: 0; overflow: hidden; color: var(--vp-c-brand-1); font-size: .59rem; font-weight: 800; letter-spacing: .05em; text-overflow: ellipsis; text-transform: uppercase; white-space: nowrap; }
.workbench-identity h3 { margin: .12rem 0 0; overflow: hidden; font-size: .92rem; text-overflow: ellipsis; white-space: nowrap; }
.runtime-status { display: inline-flex; flex: 0 0 auto; align-items: center; gap: .4rem; border: 1px solid var(--vp-c-divider); border-radius: 999px; padding: .32rem .5rem; background: var(--vp-c-bg); color: var(--vp-c-text-2); font-size: .66rem; font-weight: 750; }
.runtime-status i { width: .42rem; height: .42rem; border-radius: 50%; background: var(--sql-status-idle); }
.runtime-status.ready i { background: var(--sql-status-ready); box-shadow: 0 0 0 4px var(--sql-status-ring); }
.runtime-status.busy i { background: var(--sql-status-busy); animation: pulse 1s infinite; }
.runtime-warning { padding: .5rem .8rem; border-bottom: 1px solid var(--sql-warning-border); background: var(--sql-warning-bg); color: var(--sql-warning-text); font-size: .7rem; }
.manager-shell { min-height: 650px; }
.workbench-center { min-width: 0; }
.main-tabs { display: flex; min-height: 3rem; align-items: end; gap: .15rem; padding: 0 .7rem; border-bottom: 1px solid var(--vp-c-divider); background: var(--sql-panel); }
.main-tabs > span { flex: 1; }
.main-tabs small { align-self: center; color: var(--vp-c-text-3); font: .62rem/1 ui-monospace, monospace; }
button { border: 1px solid var(--vp-c-divider); border-radius: .42rem; padding: .36rem .58rem; background: var(--vp-c-bg); color: var(--vp-c-text-2); cursor: pointer; font-size: .7rem; font-weight: 700; }
button:hover:not(:disabled) { border-color: var(--vp-c-brand-2); color: var(--vp-c-brand-1); }
button:disabled { cursor: wait; opacity: .55; }
.main-tabs button { min-height: 2.45rem; border: 0; border-bottom: 2px solid transparent; border-radius: 0; background: transparent; }
.main-tabs button.active { border-bottom-color: var(--vp-c-brand-1); color: var(--vp-c-brand-1); }
.workbench-upper { height: 390px; min-height: 390px; overflow: hidden; }
.workbench-upper :deep(.overview-pane) { box-sizing: border-box; height: 100%; min-height: 0; }
.query-pane { display: grid; height: 100%; min-width: 0; grid-template-rows: auto minmax(0, 1fr); }
.pane-toolbar { display: flex; min-height: 3rem; align-items: center; justify-content: space-between; gap: .6rem; padding: .45rem .7rem; border-bottom: 1px solid var(--vp-c-divider); background: var(--sql-editor-toolbar); color: var(--sql-editor-text); }
.pane-toolbar > div:first-child { display: grid; gap: .08rem; }
.pane-toolbar span { font-size: .72rem; font-weight: 800; }
.pane-toolbar small { color: var(--sql-editor-gutter-text); font-size: .59rem; }
.toolbar-actions { display: flex; gap: .35rem; }
.toolbar-actions button { border-color: var(--sql-line); background: var(--sql-editor-toolbar-button); color: var(--sql-editor-text); }
.run-button { border-color: var(--vp-c-brand-1) !important; background: var(--vp-c-brand-1) !important; color: var(--sql-on-accent) !important; }
.query-editor { height: 100%; min-height: 0; overflow: hidden; }
@keyframes pulse { 50% { opacity: .35; } }
@media (max-width: 840px) {
  .manager-shell { min-height: 0; }
  .workbench-upper { height: 390px; min-height: 390px; }
  .main-tabs small { display: none; }
}
@media (max-width: 520px) {
  .workbench-header { flex-wrap: wrap; }
  .workbench-identity { order: -1; width: calc(100% - 7rem); }
  .runtime-status { margin-left: auto; }
}
</style>
