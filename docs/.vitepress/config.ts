import { defineConfig } from 'vitepress';
import { splitDuckDbWasm } from './plugins/splitDuckDbWasm';
import { allDatabases } from './theme/data/databaseNavigation';

function databaseSidebarItems(items: readonly { name: string; link: string }[]) {
  return items.map(({ name, link }) => ({
    text: name,
    collapsed: true,
    items: [
      { text: '概览', link: `${link}/` },
      { text: '核心知识', link: `${link}/core-concepts` },
      { text: '版本演进', link: `${link}/versions` },
    ],
  }));
}

export default defineConfig({
  base: '/',
  title: 'Hello SQL',
  description: '数据库与数据交互百科全书（24 款数据库 · WASM 实验 · 技术矩阵 · 选型指南）',
  cleanUrls: true,
  lastUpdated: true,
  ignoreDeadLinks: true,
  head: [
    ['meta', { name: 'theme-color', content: '#0f766e' }],
    ['link', { rel: 'icon', href: '/logo.svg' }],
  ],
  vite: {
    plugins: [splitDuckDbWasm()],
    optimizeDeps: {
      exclude: ['@surrealdb/wasm', '@sqlite.org/sqlite-wasm', '@duckdb/duckdb-wasm', '@electric-sql/pglite'],
    },
    worker: { format: 'es' },
  },
  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'Hello SQL',
    sidebarMenuLabel: '数据库',
    outline: { level: [2, 3], label: '本页导航' },
    nav: [
      // 前 5 个典型数据库全部平铺在主导航
      { text: 'PostgreSQL', link: '/products/postgresql/' },
      { text: 'MySQL', link: '/products/mysql/' },
      { text: 'DuckDB', link: '/products/duckdb/' },
      { text: 'MongoDB', link: '/products/mongodb/' },
      { text: 'Redis', link: '/products/redis/' },
      // 第 6 个起在「更多」下拉中展开选择
      {
        text: '更多',
        items: allDatabases.slice(5).map(db => ({
          text: db.name,
          link: db.link,
        })),
      },
      { text: 'SQL 基础', link: '/concepts/' },
      { text: '浏览器数据库', link: '/browser/' },
      { text: 'WASM 实验室', link: '/playground/' },
      { text: '数据库对比', link: '/matrix/' },
    ],
    sidebar: {
      '/concepts/': [{
        text: 'SQL 基础',
        items: [
          { text: '学习路线总览', link: '/concepts/' },
          { text: '查询与过滤', link: '/concepts/query' },
          { text: '聚合、JOIN 与子查询', link: '/concepts/joins' },
          { text: 'CTE 与窗口函数', link: '/concepts/advanced-query' },
          { text: 'DDL、约束与数据建模', link: '/concepts/schema' },
          { text: '事务、锁与并发', link: '/concepts/transactions' },
          { text: '索引与执行计划', link: '/concepts/indexes-explain' },
        ],
      }],
      '/products/': [
        {
          text: '数据库列表',
          items: databaseSidebarItems(allDatabases),
        },
      ],
      '/browser/': [{ text: 'Browser Database', items: [
        { text: '浏览器数据层总览', link: '/browser/' },
        { text: 'IndexedDB 原理与实践', link: '/browser/indexeddb' },
        { text: 'OPFS 与存储配额', link: '/browser/opfs' },
        { text: '离线、本地优先与同步', link: '/browser/local-first' },
      ] }],
      '/playground/': [{ text: 'WASM 数据库实验室', items: [
        { text: '统一工作台', link: '/playground/' },
        { text: 'SQLite WASM', link: '/playground/sqlite' },
        { text: 'DuckDB-Wasm', link: '/playground/duckdb' },
        { text: 'PGlite / PostgreSQL', link: '/playground/pglite' },
        { text: 'SurrealDB WASM', link: '/playground/surrealdb' },
        { text: 'IndexedDB', link: '/playground/indexeddb' },
        { text: 'WASM 成熟度目录', link: '/playground/catalog' },
      ] }],
      '/matrix/': [{ text: '数据库对比', items: [
        { text: '矩阵总览', link: '/matrix/' },
        { text: 'SQL 方言与查询能力', link: '/matrix/sql-dialects' },
        { text: '事务与一致性', link: '/matrix/transactions' },
        { text: '索引、搜索与 JSON', link: '/matrix/indexes-json' },
        { text: '扩展、复制与分片', link: '/matrix/scaling' },
        { text: '浏览器与 WASM 能力', link: '/matrix/browser-wasm' },
        { text: '连接串与驱动', link: '/matrix/connection-strings' },
      ] }],
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/xy2401/hello-sql' }],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2026 Hello SQL',
    },
    search: { provider: 'local' },
  },
});
