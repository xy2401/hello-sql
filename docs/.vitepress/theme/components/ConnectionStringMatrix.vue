<template>
  <section class="connection-matrix">
    <div class="matrix-toolbar">
      <label><span>筛选数据库、协议或连接方式</span><input v-model.trim="query" type="search" placeholder="例如 PostgreSQL、JDBC、HTTP"></label>
      <strong>{{ filteredProfiles.length }} / {{ connectionStringProfiles.length }}</strong>
    </div>

    <div class="connection-table-wrap">
      <table class="connection-table">
        <thead><tr><th>数据库</th><th>形式 / 端口</th><th>代表性模板</th><th>命名空间与关键差异</th></tr></thead>
        <tbody>
          <tr v-for="item in filteredProfiles" :key="item.id">
            <td><a :href="databaseLink(item)"><strong>{{ databaseProfiles[item.id].name }}</strong></a><small>{{ item.group }}</small></td>
            <td><span class="kind-badge">{{ item.kind }}</span><code>{{ item.protocol }}</code><small>默认端口 {{ item.defaultPort }}</small></td>
            <td><code class="connection-example">{{ item.example }}</code><small class="tls-note">TLS：{{ item.tls }}</small></td>
            <td><strong>{{ item.namespace }}</strong><p>{{ item.note }}</p><a :href="item.docs" target="_blank" rel="noreferrer">官方连接文档 ↗</a></td>
          </tr>
        </tbody>
      </table>
    </div>
    <p v-if="!filteredProfiles.length" class="empty-state">没有匹配的数据库或协议。</p>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { connectionStringProfiles, type ConnectionStringProfile } from '../data/connectionStrings';
import { allDatabases } from '../data/databaseNavigation';
import { databaseProfiles } from '../data/databaseProfiles';

const query = ref('');
const filteredProfiles = computed(() => {
  const keyword = query.value.toLocaleLowerCase();
  if (!keyword) return connectionStringProfiles;
  return connectionStringProfiles.filter((item) => [
    databaseProfiles[item.id].name, item.group, item.kind, item.protocol, item.example, item.note,
  ].join(' ').toLocaleLowerCase().includes(keyword));
});

function databaseLink(item: ConnectionStringProfile) {
  const product = allDatabases.find((database) => database.id === item.id);
  return product ? `${product.link}/` : '/products/';
}
</script>

<style scoped>
.connection-matrix { margin: 1.2rem 0 2rem; }
.matrix-toolbar { display: flex; align-items: end; justify-content: space-between; gap: 1rem; margin-bottom: .7rem; padding: .8rem; border: 1px solid var(--vp-c-divider); border-radius: 12px; background: var(--sql-panel); }
.matrix-toolbar label { display: grid; flex: 1; gap: .3rem; color: var(--vp-c-text-2); font-size: .72rem; font-weight: 700; }
.matrix-toolbar input { width: min(34rem, 100%); min-height: 2.3rem; border: 1px solid var(--vp-c-divider); border-radius: 8px; padding: 0 .7rem; background: var(--vp-c-bg); color: var(--vp-c-text-1); }
.matrix-toolbar strong { color: var(--vp-c-brand-1); font: 800 .8rem/2.3rem ui-monospace, monospace; }
.connection-table-wrap { overflow-x: auto; }
.connection-table { min-width: 980px; margin: 0; font-size: .76rem; }
.connection-table th { white-space: nowrap; }
.connection-table td { min-width: 130px; vertical-align: top; }
.connection-table td:nth-child(3) { min-width: 330px; }
.connection-table td:nth-child(4) { min-width: 280px; }
.connection-table td > small, .connection-table td > code, .connection-table td > p, .connection-table td > a { display: block; margin-top: .35rem; }
.connection-table small { color: var(--vp-c-text-3); }
.connection-table p { margin-bottom: .35rem; color: var(--vp-c-text-2); line-height: 1.55; }
.connection-table a { font-weight: 700; }
.kind-badge { display: inline-block; margin-bottom: .25rem; border-radius: 999px; padding: .15rem .42rem; background: var(--vp-c-brand-soft); color: var(--vp-c-brand-1); font-size: .64rem; font-weight: 800; }
.connection-example { overflow-wrap: anywhere; white-space: normal; }
.tls-note { color: var(--vp-c-text-2) !important; }
@media (max-width: 640px) { .matrix-toolbar { align-items: stretch; flex-direction: column; } .matrix-toolbar input { width: 100%; } }
</style>
