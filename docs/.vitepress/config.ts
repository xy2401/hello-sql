import { defineConfig } from 'vitepress';
import { splitDuckDbWasm } from './plugins/splitDuckDbWasm';
import { allDatabases } from './theme/data/databaseNavigation';

const featuredDatabaseIds = new Set(['postgresql', 'mysql', 'duckdb', 'mongodb', 'redis']);
const featuredDatabases = allDatabases.filter(database => featuredDatabaseIds.has(database.id));
const moreDatabases = allDatabases.filter(database => !featuredDatabaseIds.has(database.id));

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
  head: [
    ['meta', { name: 'theme-color', content: '#0f766e' }],
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
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
      ...featuredDatabases.map(database => ({
        text: database.name,
        link: `${database.link}/`,
      })),
      {
        text: '更多',
        items: [
          ...moreDatabases.map(database => ({
            text: database.name,
            link: `${database.link}/`,
          })),
        ],
      },
      { text: '对比矩阵', link: '/matrix/' },
      { text: '试验场', link: '/playground/' },
      { text: '参考资料', link: '/reference/' },
    ],
    sidebar: {
      '/products/': [
        {
          text: '数据库列表',
          items: databaseSidebarItems(allDatabases),
        },
      ],
      '/reference/': [{ text: '参考资料', items: [
        { text: '参考资料总览', link: '/reference/' },
        { text: '浏览器数据层总览', link: '/reference/browser/' },
        { text: 'IndexedDB 原理与实践', link: '/reference/browser/indexeddb' },
        { text: 'OPFS 与存储配额', link: '/reference/browser/opfs' },
        { text: '离线、本地优先与同步', link: '/reference/browser/local-first' },
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
