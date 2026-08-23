<template>
  <div class="database-catalog-grid">
    <a v-for="item in group.items" :key="item.id" class="database-catalog-card" :href="`${item.link}/`">
      <DatabaseLogo :id="item.id" :size="42" />
      <span><strong>{{ item.name }}</strong><small>{{ databaseProfiles[item.id].family }}</small></span>
      <p>{{ databaseProfiles[item.id].positioning }}</p>
    </a>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { databaseProfiles } from '../data/databaseProfiles';
import { allDatabases } from '../data/databaseNavigation';
import DatabaseLogo from './DatabaseLogo.vue';

const props = defineProps<{ category: 'sql' | 'analytical' | 'nosql' }>();

const group = computed(() => ({
  id: props.category,
  title: props.category === 'sql' ? 'SQL 族关系型数据库' : 
         props.category === 'analytical' ? '分析型数据库' : 'NoSQL 数据库',
  items: allDatabases.filter(db => {
    // SQL 族 (6): postgresql, mysql, mariadb, sqlite, sql-server, oracle
    if (props.category === 'sql') {
      return ['postgresql', 'mysql', 'mariadb', 'sqlite', 'sql-server', 'oracle'].includes(db.id);
    }
    // Analytical (4): duckdb, clickhouse, tidb, cockroachdb
    if (props.category === 'analytical') {
      return ['duckdb', 'clickhouse', 'tidb', 'cockroachdb'].includes(db.id);
    }
    // NoSQL (11): mongodb, couchdb, redis, valkey, cassandra, scylladb, elasticsearch, opensearch, neo4j, influxdb, timescaledb
    if (props.category === 'nosql') {
      return ['mongodb', 'couchdb', 'redis', 'valkey', 'cassandra', 'scylladb', 'elasticsearch', 'opensearch', 'neo4j', 'influxdb', 'timescaledb'].includes(db.id);
    }
    return false;
  })
}));
</script>

<style scoped>
.database-catalog-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: .8rem; margin: 1.2rem 0 2rem; }
.database-catalog-card { display: grid; grid-template-columns: auto minmax(0, 1fr); align-items: center; gap: .8rem; border: 1px solid var(--sql-line); border-radius: .85rem; padding: 1rem; background: var(--vp-c-bg); color: var(--vp-c-text-1); box-shadow: var(--sql-shadow-sm); text-decoration: none; transition: border-color .2s, transform .2s; }
.database-catalog-card:hover { border-color: var(--vp-c-brand-2); transform: translateY(-2px); }
.database-catalog-card span { display: grid; min-width: 0; }
.database-catalog-card strong { font-size: .95rem; }
.database-catalog-card small { overflow: hidden; color: var(--vp-c-text-3); font-size: .68rem; text-overflow: ellipsis; white-space: nowrap; }
.database-catalog-card p { grid-column: 1 / -1; margin: 0; color: var(--vp-c-text-2); font-size: .78rem; line-height: 1.6; }
</style>
