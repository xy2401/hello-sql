<template>
  <section class="overview-pane">
    <template v-if="selectedNode">
      <div class="overview-heading">
        <div><p>{{ metadata.label }} / {{ selectedNode.type === 'store' ? '对象仓库' : '数据表' }}</p><h4>{{ selectedNode.name }}</h4></div>
        <div class="overview-actions">
          <button type="button" @click="$emit('insertQuery', selectedNode)">插入查询</button>
          <button v-if="isQueryableObject(selectedNode)" class="primary" type="button" :disabled="busy" @click="$emit('preview', selectedNode)">预览前 100 行</button>
        </div>
      </div>
      <div class="object-layout">
        <article>
          <h5>对象定义</h5>
          <pre v-if="selectedNode.detail"><code>{{ selectedNode.detail }}</code></pre>
          <p v-else>当前引擎没有返回完整 DDL；字段与索引信息仍可用于生成查询。</p>
        </article>
        <article>
          <h5>{{ selectedNode.type === 'store' ? '索引' : '字段' }} · {{ selectedNode.children?.length || 0 }}</h5>
          <table v-if="selectedNode.children?.length">
            <thead><tr><th>名称</th><th>类型 / 定义</th></tr></thead>
            <tbody><tr v-for="child in selectedNode.children" :key="`${child.type}:${child.name}`"><td><strong>{{ child.name }}</strong></td><td><code>{{ child.detail || child.type }}</code></td></tr></tbody>
          </table>
          <p v-else>暂无可展示的字段或索引元数据。</p>
        </article>
      </div>
    </template>

    <template v-else>
      <div class="overview-heading">
        <div><p>{{ metadata.runtime }}</p><h4>{{ metadata.label }} 数据库概览</h4><span>{{ metadata.description }}</span></div>
        <span class="status-pill" :class="statusClass"><i />{{ statusText }}</span>
      </div>
      <div class="overview-facts">
        <div><span>数据对象</span><strong>{{ schemaCount }}</strong></div>
        <div><span>查询语言</span><strong>{{ editorLabel }}</strong></div>
        <div><span>持久化</span><strong>{{ persistenceLabel }}</strong></div>
        <div><span>事务</span><strong>{{ metadata.capabilities.transactions ? '支持' : '不支持' }}</strong></div>
        <div><span>执行计划</span><strong>{{ metadata.capabilities.explain ? '支持' : '不支持' }}</strong></div>
        <div><span>隔离环境</span><strong>Dedicated Worker</strong></div>
      </div>
      <div class="workspace-controls">
        <label v-if="metadata.capabilities.persistence" class="toggle"><input :checked="persistLocally" type="checkbox" :disabled="busy" @change="$emit('setPersistence', ($event.target as HTMLInputElement).checked)"><span>本地持久工作区</span></label>
        <label v-if="persistLocally"><span>工作区</span><input :value="workspaceId" maxlength="48" :disabled="busy" @change="$emit('setWorkspace', ($event.target as HTMLInputElement).value)"></label>
        <small>{{ metadata.capabilities.persistenceLabel }}</small>
      </div>
      <div class="database-actions">
        <input ref="fileInput" class="visually-hidden" type="file" :accept="metadata.capabilities.importFormats.join(',')" @change="selectFile">
        <button v-if="metadata.capabilities.importFormats.length" type="button" :disabled="busy" @click="fileInput?.click()">导入文件</button>
        <button v-if="canExportDatabase" type="button" :disabled="busy" @click="$emit('exportDatabase')">导出数据库</button>
        <button type="button" :disabled="busy" @click="$emit('refresh')">刷新对象</button>
        <template v-if="resetArmed">
          <button type="button" @click="resetArmed = false">取消</button>
          <button class="danger" type="button" :disabled="busy" @click="confirmReset">确认重置</button>
        </template>
        <button v-else class="danger-ghost" type="button" :disabled="busy" @click="resetArmed = true">重置样例库</button>
      </div>
    </template>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { isQueryableObject } from '../../runtime/workbenchQueries';
import type { EngineMetadata, SchemaNode } from '../../runtime/types';

defineProps<{
  metadata: EngineMetadata;
  selectedNode?: SchemaNode;
  statusText: string;
  statusClass: string;
  schemaCount: number;
  editorLabel: string;
  persistenceLabel: string;
  persistLocally: boolean;
  workspaceId: string;
  canExportDatabase: boolean;
  busy: boolean;
}>();

const emit = defineEmits<{
  insertQuery: [node: SchemaNode];
  preview: [node: SchemaNode];
  setPersistence: [enabled: boolean];
  setWorkspace: [workspace: string];
  importFile: [file: File];
  exportDatabase: [];
  refresh: [];
  reset: [];
}>();

const fileInput = ref<HTMLInputElement>();
const resetArmed = ref(false);

function selectFile(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (file) emit('importFile', file);
  input.value = '';
}
function confirmReset() {
  resetArmed.value = false;
  emit('reset');
}
</script>

<style scoped>
.overview-pane { min-height: 330px; padding: 1rem; overflow: auto; }
.overview-heading { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; }
.overview-heading p { margin: 0 0 .2rem; color: var(--vp-c-brand-1); font-size: .65rem; font-weight: 850; letter-spacing: .06em; text-transform: uppercase; }
.overview-heading h4 { margin: 0; font-size: 1.15rem; }
.overview-heading span { display: block; max-width: 720px; margin-top: .3rem; color: var(--vp-c-text-2); font-size: .76rem; }
.overview-actions, .database-actions { display: flex; flex-wrap: wrap; gap: .4rem; }
button { border: 1px solid var(--vp-c-divider); border-radius: .45rem; padding: .42rem .65rem; background: var(--vp-c-bg); color: var(--vp-c-text-2); cursor: pointer; font-size: .7rem; font-weight: 750; }
button:hover:not(:disabled) { border-color: var(--vp-c-brand-2); color: var(--vp-c-brand-1); }
button:disabled { cursor: wait; opacity: .55; }
button.primary { border-color: var(--vp-c-brand-1); background: var(--vp-c-brand-1); color: var(--sql-on-accent); }
button.danger { border-color: var(--sql-danger); background: var(--sql-danger); color: var(--sql-on-accent); }
button.danger-ghost { color: var(--sql-danger); }
.status-pill { display: inline-flex !important; flex: 0 0 auto; align-items: center; gap: .4rem; margin: 0 !important; border: 1px solid var(--vp-c-divider); border-radius: 999px; padding: .35rem .55rem; background: var(--vp-c-bg); font-size: .68rem !important; font-weight: 750; }
.status-pill i { width: .45rem; height: .45rem; border-radius: 50%; background: var(--sql-status-idle); }
.status-pill.ready i { background: var(--sql-status-ready); box-shadow: 0 0 0 4px var(--sql-status-ring); }
.status-pill.busy i { background: var(--sql-status-busy); }
.overview-facts { display: grid; grid-template-columns: repeat(3, minmax(130px, 1fr)); gap: .65rem; margin-top: 1rem; }
.overview-facts div { padding: .75rem; border: 1px solid var(--sql-line); border-radius: .65rem; background: var(--sql-panel); }
.overview-facts span { display: block; color: var(--vp-c-text-3); font-size: .62rem; }
.overview-facts strong { font-size: .78rem; }
.workspace-controls { display: flex; flex-wrap: wrap; align-items: end; gap: .7rem; margin-top: .8rem; padding: .75rem; border-radius: .65rem; background: var(--sql-panel); }
.workspace-controls label:not(.toggle) { display: grid; gap: .2rem; color: var(--vp-c-text-2); font-size: .64rem; font-weight: 700; }
.workspace-controls input[type="text"], .workspace-controls label:not(.toggle) input { min-height: 2rem; border: 1px solid var(--vp-c-divider); border-radius: .4rem; padding: 0 .5rem; background: var(--vp-c-bg); color: var(--vp-c-text-1); }
.workspace-controls small { margin-left: auto; color: var(--vp-c-text-3); font-size: .65rem; }
.toggle { display: inline-flex; align-items: center; gap: .4rem; min-height: 2rem; font-size: .72rem; font-weight: 750; }
.database-actions { margin-top: .8rem; }
.object-layout { display: grid; grid-template-columns: minmax(220px, .8fr) minmax(320px, 1.2fr); gap: .8rem; margin-top: 1rem; }
.object-layout article { min-width: 0; border: 1px solid var(--sql-line); border-radius: .65rem; padding: .8rem; }
.object-layout h5 { margin: 0 0 .55rem; font-size: .72rem; }
.object-layout p { color: var(--vp-c-text-3); font-size: .72rem; }
.object-layout pre { max-height: 220px; margin: 0; overflow: auto; white-space: pre-wrap; }
.object-layout table { width: 100%; margin: 0; font-size: .68rem; }
.object-layout th, .object-layout td { padding: .4rem .45rem; }
.object-layout code { font-size: .64rem; }
.visually-hidden { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
@media (max-width: 700px) {
  .overview-heading { display: grid; }
  .overview-facts { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .object-layout { grid-template-columns: 1fr; }
}
</style>
