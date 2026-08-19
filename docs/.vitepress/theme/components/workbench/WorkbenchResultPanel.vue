<template>
  <section class="result-pane">
    <div class="result-tabs" role="tablist" aria-label="运行输出">
      <button v-for="tab in tabs" :key="tab.id" type="button" role="tab" :aria-selected="activeTab === tab.id" :class="{ active: activeTab === tab.id }" @click="$emit('selectTab', tab.id)">{{ tab.label }}</button>
      <span class="result-spacer" />
      <button v-if="activeResult?.rows.length" type="button" @click="$emit('downloadCsv')">导出 CSV</button>
      <button v-if="canExportDatabase" type="button" :disabled="busy" @click="$emit('downloadDatabase')">导出数据库</button>
    </div>

    <div v-if="activeTab === 'result'" class="result-content">
      <div v-if="errorMessage" class="query-error" role="alert"><strong>执行失败</strong><pre>{{ errorMessage }}</pre></div>
      <template v-else-if="activeResult">
        <div class="result-summary">
          <span>{{ activeResult.message || '执行完成' }}</span>
          <span>{{ activeResult.elapsedMs.toFixed(1) }} ms</span>
          <span v-if="activeResult.affectedRows !== undefined">影响 {{ activeResult.affectedRows }} 行</span>
          <span v-if="activeResult.truncated">结果已截断</span>
        </div>
        <div v-if="activeResult.rows.length" class="result-table-wrap">
          <table class="result-table">
            <thead><tr><th v-for="column in activeResult.columns" :key="column.name">{{ column.name }}</th></tr></thead>
            <tbody><tr v-for="(row, rowIndex) in activeResult.rows" :key="rowIndex"><td v-for="column in activeResult.columns" :key="column.name"><code>{{ formatCell(row[column.name]) }}</code></td></tr></tbody>
          </table>
        </div>
        <p v-else class="empty-state">语句执行成功，没有返回数据行。</p>
      </template>
      <p v-else class="empty-state">运行查询或预览数据后，结果、消息和耗时会显示在这里。</p>
    </div>

    <div v-else-if="activeTab === 'history'" class="history-list">
      <button v-for="item in history" :key="item.time" type="button" @click="$emit('restoreHistory', item.source)">
        <time>{{ new Date(item.time).toLocaleTimeString() }}</time><code>{{ item.source }}</code>
      </button>
      <p v-if="!history.length" class="empty-state">当前浏览器还没有查询历史。</p>
    </div>

    <div v-else class="capabilities-grid">
      <div v-for="capability in capabilities" :key="capability.label"><span>{{ capability.label }}</span><strong>{{ capability.value }}</strong></div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { ExecutionResult, ResultTab } from '../../runtime/types';

defineProps<{
  activeTab: ResultTab;
  activeResult?: ExecutionResult;
  errorMessage: string;
  history: Array<{ source: string; time: number }>;
  capabilities: Array<{ label: string; value: string }>;
  canExportDatabase: boolean;
  busy: boolean;
}>();

defineEmits<{
  selectTab: [tab: ResultTab];
  restoreHistory: [source: string];
  downloadCsv: [];
  downloadDatabase: [];
}>();

const tabs: Array<{ id: ResultTab; label: string }> = [
  { id: 'result', label: '结果' },
  { id: 'history', label: '历史' },
  { id: 'capabilities', label: '运行能力' },
];

function formatCell(value: unknown) {
  return value === null ? 'NULL' : typeof value === 'object' ? JSON.stringify(value) : String(value);
}
</script>

<style scoped>
.result-pane { min-height: 205px; border-top: 1px solid var(--vp-c-divider); background: var(--vp-c-bg); }
.result-tabs { display: flex; min-height: 2.75rem; align-items: center; gap: .25rem; padding: .45rem .65rem; border-bottom: 1px solid var(--vp-c-divider); }
button { border: 1px solid var(--vp-c-divider); border-radius: .42rem; padding: .36rem .58rem; background: var(--vp-c-bg); color: var(--vp-c-text-2); cursor: pointer; font-size: .7rem; font-weight: 700; }
button:hover:not(:disabled) { border-color: var(--vp-c-brand-2); color: var(--vp-c-brand-1); }
button:disabled { cursor: wait; opacity: .55; }
.result-tabs button { border-color: transparent; background: transparent; }
.result-tabs button.active { background: var(--sql-panel); color: var(--vp-c-brand-1); }
.result-spacer { flex: 1; }
.result-content { min-height: 160px; }
.result-summary { display: flex; flex-wrap: wrap; gap: .8rem; padding: .52rem .75rem; border-bottom: 1px solid var(--vp-c-divider); color: var(--vp-c-text-3); font-size: .66rem; }
.result-table-wrap { max-height: 320px; overflow: auto; }
.result-table { width: 100%; margin: 0; border-collapse: collapse; font-size: .72rem; }
.result-table th { position: sticky; top: 0; z-index: 1; background: var(--sql-panel); text-align: left; }
.result-table th, .result-table td { max-width: 340px; border: 1px solid var(--vp-c-divider); padding: .48rem .62rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.result-table code { background: transparent; font-size: .69rem; }
.empty-state { margin: 0; padding: 1.2rem; color: var(--vp-c-text-3); font-size: .76rem; text-align: center; }
.query-error { margin: .75rem; padding: .75rem; border: 1px solid var(--sql-danger-border); border-radius: .55rem; background: var(--sql-danger-bg); color: var(--sql-danger); }
.query-error pre { margin: .4rem 0 0; overflow: auto; background: transparent; color: inherit; white-space: pre-wrap; }
.history-list { display: grid; max-height: 300px; overflow: auto; }
.history-list button { display: grid; grid-template-columns: 85px minmax(0, 1fr); gap: .7rem; border: 0; border-bottom: 1px solid var(--vp-c-divider); border-radius: 0; padding: .65rem .8rem; text-align: left; }
.history-list code { overflow: hidden; background: transparent; text-overflow: ellipsis; white-space: nowrap; }
.capabilities-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: .6rem; padding: .8rem; }
.capabilities-grid div { padding: .7rem; border-radius: .55rem; background: var(--sql-panel); }
.capabilities-grid span { display: block; color: var(--vp-c-text-3); font-size: .64rem; }
.capabilities-grid strong { font-size: .75rem; }
</style>
