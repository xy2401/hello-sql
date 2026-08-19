<template>
  <div class="engine-table-wrap">
    <table>
      <thead><tr><th>运行环境</th><th>查询语言</th><th>持久化</th><th>导入</th><th>成熟度</th></tr></thead>
      <tbody>
        <tr v-for="id in engineOrder" :key="id">
          <td><div class="engine-identity"><DatabaseLogo :id="engineCatalog[id].brandId" :size="34" /><span><strong>{{ engineCatalog[id].label }}</strong><small>{{ engineCatalog[id].runtime }}</small></span></div></td>
          <td>{{ engineCatalog[id].editorLanguage === 'javascript' ? 'JavaScript API' : engineCatalog[id].editorLanguage.toUpperCase() }}</td>
          <td>{{ engineCatalog[id].capabilities.persistenceLabel }}</td>
          <td>{{ engineCatalog[id].capabilities.importFormats.join(' / ') || '—' }}</td>
          <td><span class="status-pill">正式支持</span></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { engineCatalog, engineOrder } from '../data/engineCatalog';
import DatabaseLogo from './DatabaseLogo.vue';
</script>

<style scoped>
.engine-table-wrap { margin: 1rem 0; overflow-x: auto; }
table { width: 100%; margin: 0; }
td small { display: block; color: var(--vp-c-text-3); font-size: .68rem; }
.engine-identity { display: flex; min-width: 210px; align-items: center; gap: .65rem; }
.engine-identity span { display: grid; }
.status-pill { display: inline-block; padding: .2rem .45rem; border-radius: 999px; background: var(--vp-c-brand-soft); color: var(--vp-c-brand-1); font-size: .68rem; font-weight: 800; }
</style>
