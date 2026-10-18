<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, shallowRef, useId, watch } from 'vue';
import { withBase } from 'vitepress';
import { formatSampleCell, parseSampleDataset, sampleResultTable, sampleStatusLabels, type SampleDataset } from '../data/sampleData';
import SampleQueryCode from './SampleQueryCode.vue';

const props = defineProps<{ datasetUrl: string }>();
const uid = useId();
const dataset = shallowRef<SampleDataset>();
const loading = ref(true);
const error = ref('');
const search = ref('');
const category = ref('');
const selectedId = ref('');
const view = ref<'table' | 'json'>('table');
const page = ref(1);
const pageSize = 10;
const copyMessage = ref('');
let request: AbortController | undefined;
let mounted = false;

const categories = computed(() => [...new Set(dataset.value?.examples.map(item => item.category) ?? [])]);
const filtered = computed(() => {
  const keyword = search.value.trim().toLowerCase();
  return (dataset.value?.examples ?? []).filter(item => (!category.value || item.category === category.value)
    && (!keyword || [item.title, item.operation, item.query, ...item.notes].join(' ').toLowerCase().includes(keyword)));
});
const selected = computed(() => filtered.value.find(item => item.id === selectedId.value));
const recordedCount = computed(() => dataset.value?.examples.filter(item => item.status === 'passed').length ?? 0);
const table = computed(() => selected.value?.status === 'passed' ? sampleResultTable(selected.value.result!) : { columns: [], rows: [] });
const pageCount = computed(() => Math.max(1, Math.ceil(table.value.rows.length / pageSize)));
const visibleRows = computed(() => table.value.rows.slice((page.value - 1) * pageSize, page.value * pageSize));
const json = computed(() => selected.value?.status === 'passed' ? JSON.stringify(selected.value.result, null, 2) : '');
const queryDisplay = computed(() => {
  const query = selected.value?.query ?? '';
  const comments = query.match(dataset.value?.language === 'sql'
    ? /^(?:[ \t]*--[^\r\n]*(?:\r?\n|$))+/
    : /^(?:[ \t]*\/\/[^\r\n]*(?:\r?\n|$))+/)?.[0] ?? '';
  return { code: query.slice(comments.length).trim(), comments: comments.trim() };
});

watch(filtered, items => {
  if (!items.some(item => item.id === selectedId.value)) selectedId.value = items[0]?.id ?? '';
});
watch(selected, () => { page.value = 1; copyMessage.value = ''; });

async function load() {
  request?.abort();
  const current = new AbortController();
  request = current;
  loading.value = true;
  error.value = '';
  dataset.value = undefined;
  try {
    const response = await fetch(withBase(props.datasetUrl), { signal: current.signal, cache: 'no-cache' });
    if (!response.ok) throw new Error(`示例数据请求失败（HTTP ${response.status}）。`);
    if (!response.headers.get('content-type')?.includes('application/json')) throw new Error('示例数据响应不是 JSON。');
    const value = parseSampleDataset(await response.json());
    if (request !== current || current.signal.aborted) return;
    search.value = '';
    category.value = '';
    dataset.value = value;
    selectedId.value = value.defaultExampleId ?? value.examples[0].id;
  } catch (cause) {
    if (request === current && !current.signal.aborted) error.value = cause instanceof Error ? cause.message : '示例数据读取失败。';
  } finally {
    if (request === current) loading.value = false;
  }
}

function adjacent(offset: number) {
  const index = filtered.value.findIndex(item => item.id === selectedId.value);
  const next = filtered.value[index + offset];
  if (next) selectedId.value = next.id;
}

async function copy(target: 'query' | 'result') {
  if (!selected.value) return;
  try {
    await navigator.clipboard.writeText(target === 'query' ? selected.value.query : json.value);
    copyMessage.value = target === 'query' ? '已复制查询语句。' : '已复制完整 JSON。';
  } catch {
    copyMessage.value = '复制失败，可直接选择内容复制。';
  }
}

onMounted(() => { mounted = true; void load(); });
watch(() => props.datasetUrl, () => { if (mounted) void load(); });
onBeforeUnmount(() => { mounted = false; request?.abort(); });
</script>

<template>
  <ClientOnly>
    <section class="sample-workbench" aria-label="示例查询与结果">
      <p v-if="loading" class="sample-empty" role="status">正在读取查询与采集结果…</p>
      <div v-else-if="error" class="sample-error" role="alert">
        <strong>示例数据读取失败</strong><p>{{ error }}</p><button type="button" @click="load">重新读取</button>
      </div>
      <template v-else-if="dataset">
        <header class="sample-header">
          <h2 :title="dataset.description">{{ dataset.title }}</h2>
          <span class="sample-recording">已采集 {{ recordedCount }} / {{ dataset.examples.length }}</span>
        </header>

        <div class="sample-filters">
          <label :for="`${uid}-search`"><span class="sample-sr-only">查找操作</span><input :id="`${uid}-search`" v-model="search" type="search" placeholder="搜索标题、语句或备注" /></label>
          <label :for="`${uid}-category`"><span class="sample-sr-only">操作分类</span><select :id="`${uid}-category`" v-model="category"><option value="">全部分类</option><option v-for="item in categories" :key="item" :value="item">{{ item }}</option></select></label>
          <label :for="`${uid}-example`" class="sample-example-select"><span class="sample-sr-only">操作示例</span><select :id="`${uid}-example`" v-model="selectedId" :disabled="!filtered.length"><option v-if="!filtered.length" value="">没有匹配的操作</option><option v-for="item in filtered" :key="item.id" :value="item.id">{{ item.title }}{{ item.status === 'passed' ? '' : ` · ${sampleStatusLabels[item.status]}` }}</option></select></label>
          <div class="sample-step"><button type="button" aria-label="上一个操作" :disabled="!selected || selected.id === filtered[0]?.id" @click="adjacent(-1)">←</button><button type="button" aria-label="下一个操作" :disabled="!selected || selected.id === filtered[filtered.length - 1]?.id" @click="adjacent(1)">→</button></div>
        </div>

        <div v-if="selected" class="sample-panels">
          <section class="sample-pane" aria-label="查询条件与备注">
            <div class="sample-pane-heading"><div class="sample-pane-label"><h3>查询条件</h3><span>{{ dataset.language === 'javascript' ? 'JavaScript' : 'SQL' }}<template v-if="selected.operation"> · {{ selected.operation }}</template></span><code v-if="selected.namespace">{{ selected.namespace }}</code></div><button type="button" @click="copy('query')">复制语句</button></div>
            <SampleQueryCode :code="queryDisplay.code" :language="dataset.language" label="查询条件（只读）" />
            <div v-if="selected.notes.length" class="sample-notes"><strong>备注</strong><div><span v-for="note in selected.notes" :key="note">{{ note }}</span></div></div>
          </section>

          <section class="sample-pane" aria-label="已采集的查询结果">
            <div class="sample-pane-heading"><div class="sample-pane-label"><h3>查询结果</h3><span class="sample-status" :class="selected.status">{{ sampleStatusLabels[selected.status] }}</span><span v-if="selected.status === 'passed'">{{ table.rows.length }} 行 · {{ table.columns.length }} 列</span></div><div class="sample-result-actions"><div class="sample-view-switch" role="group" aria-label="结果视图"><button type="button" :aria-pressed="view === 'table'" :disabled="selected.status !== 'passed'" @click="view = 'table'">表格</button><button type="button" :aria-pressed="view === 'json'" :disabled="selected.status !== 'passed'" @click="view = 'json'">JSON</button></div><button v-if="selected.status === 'passed'" type="button" @click="copy('result')">复制 JSON</button></div></div>
            <template v-if="selected.status === 'passed'">
              <template v-if="view === 'table'">
                <div v-if="table.rows.length" class="sample-table-scroll" tabindex="0" aria-label="查询结果表格，可横向滚动">
                  <table class="sample-result-table"><thead><tr><th scope="col" class="sample-row-number">#</th><th v-for="column in table.columns" :key="column.id" scope="col">{{ column.label }}</th></tr></thead><tbody><tr v-for="(row, index) in visibleRows" :key="index"><th scope="row" class="sample-row-number">{{ (page - 1) * pageSize + index + 1 }}</th><td v-for="(value, columnIndex) in row" :key="table.columns[columnIndex].id"><code :title="formatSampleCell(value)">{{ formatSampleCell(value) }}</code></td></tr></tbody></table>
                </div>
                <p v-else class="sample-empty">这项查询返回空数组（[]），没有数据行。</p>
                <div v-if="table.rows.length > pageSize" class="sample-pagination"><button type="button" :disabled="page === 1" @click="page--">上一页</button><span aria-live="polite">第 {{ page }} / {{ pageCount }} 页 · 共 {{ table.rows.length }} 行</span><button type="button" :disabled="page === pageCount" @click="page++">下一页</button></div>
              </template>
              <SampleQueryCode v-else :code="json" language="json" label="完整查询结果 JSON（只读）" />
            </template>
            <div v-else class="sample-unrecorded"><strong>{{ sampleStatusLabels[selected.status] }}，没有可展示的成功结果。</strong><details v-if="selected.reason"><summary>查看采集记录</summary><pre>{{ selected.reason }}</pre></details></div>
          </section>
        </div>
        <p v-else class="sample-empty">没有匹配的操作，请调整搜索词或分类。</p>

        <div class="sample-footer"><span>已保存的采集结果 · 嵌套内容见 JSON · — 表示缺少字段</span><span role="status" aria-live="polite">{{ copyMessage }}</span></div>
        <details class="sample-source"><summary>采集来源与许可<span>{{ dataset.source.engine }} · {{ dataset.source.recordedAt.slice(0, 10) }}</span></summary><p><a :href="dataset.source.url" target="_blank" rel="noopener noreferrer">{{ dataset.source.label }}</a></p><p v-if="dataset.source.repository">上游：<a :href="dataset.source.repository" target="_blank" rel="noopener noreferrer">{{ dataset.source.repository }}</a><br />提交：<code>{{ dataset.source.commit }}</code></p><p v-if="dataset.source.license">许可：<a v-if="dataset.source.licenseUrl" :href="withBase(dataset.source.licenseUrl)" target="_blank" rel="noopener noreferrer">{{ dataset.source.license }}</a><span v-else>{{ dataset.source.license }}</span></p><p v-if="dataset.source.note">{{ dataset.source.note }}</p><template v-if="queryDisplay.comments"><strong>当前语句注释（复制语句时一并保留）</strong><pre>{{ queryDisplay.comments }}</pre></template></details>
      </template>
    </section>
  </ClientOnly>
</template>

<style scoped>
.sample-workbench { margin: 12px 0; overflow: hidden; border: 1px solid var(--sql-line); border-radius: 8px; background: var(--vp-c-bg); }
.sample-header { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 8px 12px; background: var(--sql-panel); }
.sample-header h2 { margin: 0; border: 0; padding: 0; font-size: 15px; line-height: 1.5; }
.sample-recording { flex-shrink: 0; font-size: 11px; color: var(--vp-c-brand-1); }
.sample-filters { display: grid; grid-template-columns: minmax(130px, .8fr) 108px minmax(180px, 1.4fr) auto; align-items: center; gap: 8px; padding: 8px 12px; border-block: 1px solid var(--sql-line); }
label { display: block; min-width: 0; color: var(--vp-c-text-2); font-size: 12px; }
.sample-sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
input, select { width: 100%; min-width: 0; height: 32px; border: 1px solid var(--vp-c-divider); border-radius: 5px; padding: 0 8px; background: var(--vp-c-bg); color: var(--vp-c-text-1); font: inherit; }
select { padding-right: 25px; }
button { border: 1px solid var(--vp-c-divider); border-radius: 5px; padding: 3px 8px; background: var(--vp-c-bg); color: var(--vp-c-text-2); font-size: 12px; line-height: 1.6; cursor: pointer; white-space: nowrap; }
button:hover:not(:disabled) { border-color: var(--vp-c-brand-1); color: var(--vp-c-brand-1); }
button:disabled { cursor: default; opacity: .4; }
button:focus-visible, input:focus-visible, select:focus-visible, .sample-table-scroll:focus-visible { outline: 2px solid var(--vp-c-brand-1); outline-offset: 2px; }
.sample-step { display: flex; gap: 4px; }
.sample-step button { width: 32px; height: 32px; }
.sample-panels { display: grid; grid-template-columns: minmax(0, 1fr); align-items: start; }
.sample-pane { min-width: 0; }
.sample-pane + .sample-pane { border-top: 1px solid var(--sql-line); }
.sample-pane-heading { display: flex; align-items: center; justify-content: space-between; gap: 8px; min-height: 40px; padding: 6px 12px; border-bottom: 1px solid var(--sql-line); }
.sample-pane-label { display: flex; align-items: center; flex-wrap: wrap; gap: 4px 10px; min-width: 0; }
.sample-pane-heading h3 { margin: 0; font-size: 13px; line-height: 1.5; }
.sample-pane-heading span, .sample-pane-heading code { color: var(--vp-c-text-2); font-size: 11px; }
.sample-pane-heading code { overflow-wrap: anywhere; padding: 0; background: transparent; }
.sample-notes { display: flex; gap: 10px; border-top: 1px solid var(--sql-line); padding: 7px 12px; color: var(--vp-c-text-2); font-size: 12px; line-height: 1.65; }
.sample-notes strong { flex-shrink: 0; color: var(--vp-c-text-1); font-weight: 600; }
.sample-notes span + span::before { content: ' '; white-space: pre; }
.sample-result-actions { display: flex; flex-shrink: 0; align-items: center; gap: 8px; }
.sample-view-switch { display: flex; gap: 3px; }
.sample-view-switch button[aria-pressed="true"] { border-color: var(--vp-c-brand-1); background: var(--vp-c-brand-soft); color: var(--vp-c-brand-1); }
.sample-pane-heading .sample-status.passed { color: var(--sql-status-ready); }
.sample-pane-heading .sample-status.skipped { color: var(--sql-warning-text); }
.sample-table-scroll { max-height: 400px; overflow: auto; }
.sample-result-table { display: table; width: max-content; min-width: 100%; margin: 0; overflow: visible; border-collapse: collapse; font-size: 12px; }
.sample-result-table th, .sample-result-table td { border: 1px solid var(--sql-line); padding: 6px 10px; text-align: left; line-height: 1.5; }
.sample-result-table th { position: sticky; top: 0; z-index: 1; background: var(--sql-panel); white-space: nowrap; }
.sample-result-table .sample-row-number { width: 38px; color: var(--vp-c-text-3); font-weight: 400; }
.sample-result-table td code { display: block; max-width: 240px; overflow: hidden; padding: 0; background: transparent; color: var(--vp-c-text-1); font-size: 11px; text-overflow: ellipsis; white-space: nowrap; }
.sample-result-table tbody th { position: static; }
.sample-pagination { display: flex; align-items: center; justify-content: center; gap: 10px; padding: 7px 12px; font-size: 12px; color: var(--vp-c-text-2); }
.sample-unrecorded { padding: 14px 12px; font-size: 12px; line-height: 1.7; }
.sample-unrecorded strong { color: var(--sql-warning-text); }
.sample-unrecorded p { color: var(--vp-c-text-2); line-height: 1.8; }
.sample-unrecorded pre { overflow: auto; white-space: pre-wrap; font-size: 12px; }
.sample-empty { margin: 0; padding: 20px 12px; color: var(--vp-c-text-2); text-align: center; font-size: 12px; }
.sample-error { margin: 20px; padding: 18px; border-radius: 8px; background: var(--sql-danger-bg); color: var(--sql-danger); font-size: 13px; }
.sample-footer { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 6px; padding: 5px 12px; border-top: 1px solid var(--sql-line); color: var(--vp-c-text-3); font-size: 11px; line-height: 1.6; }
.sample-source { border-top: 1px solid var(--sql-line); padding: 6px 12px; font-size: 11px; }
.sample-source summary { cursor: pointer; color: var(--vp-c-text-2); }
.sample-source summary span { margin-left: 12px; color: var(--vp-c-text-3); }
.sample-source p { margin: 8px 0; overflow-wrap: anywhere; line-height: 1.7; }
.sample-source pre { margin: 6px 0 0; overflow: auto; white-space: pre-wrap; overflow-wrap: anywhere; font-size: 11px; }
@media (max-width: 760px) { .sample-filters { grid-template-columns: minmax(0, 1fr) 108px; }.sample-example-select { grid-column: 1; }.sample-step { justify-content: flex-end; } }
@media (max-width: 560px) { .sample-pane-heading { flex-wrap: wrap; }.sample-source summary span { display: block; margin-left: 0; } }
</style>
