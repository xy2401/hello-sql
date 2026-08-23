import { defineConfig } from 'vitepress';
import { splitDuckDbWasm } from './plugins/splitDuckDbWasm';
import { allDatabases } from './theme/data/databaseNavigation';

const featuredDatabaseIds = new Set(['postgresql', 'mysql', 'duckdb', 'mongodb', 'redis']);
const featuredDatabases = allDatabases.filter(database => featuredDatabaseIds.has(database.id));
const moreDatabases = allDatabases.filter(database => !featuredDatabaseIds.has(database.id));

function databaseProductSidebar(name: string, link: string) {
  return [
    {
      text: name,
      items: [
        { text: '概览', link: `${link}/` },
        { text: '核心知识', link: `${link}/core-concepts` },
        { text: '版本演进', link: `${link}/versions` },
        { text: 'Docker 工具', link: `${link}/DockerTooling` },
      ],
    },
  ];
}

const databaseProductSidebars = Object.fromEntries(
  allDatabases.map(({ name, link }) => [`${link}/`, databaseProductSidebar(name, link)]),
);

function databaseDirectoryItems(items: readonly { name: string; link: string }[]) {
  return items.map(({ name, link }) => ({
    text: name,
    link: `${link}/`,
  }));
}

export default defineConfig({
  base: '/',
  title: 'Hello SQL',
  description: '数据库学习与工程选型（22 款可本地运行数据库 · WASM 实验 · Docker 工具 · 选型指南）',
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
    logo: '/favicon.svg',
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
      ...databaseProductSidebars,
      '/products/': [
        {
          text: '数据库列表',
          items: databaseDirectoryItems(allDatabases),
        },
      ],
      '/products/browser/': [{
        text: 'Browser Database',
        items: [
          { text: '数据库总览', link: '/products/browser/' },
          { text: '核心知识', link: '/products/browser/core-concepts' },
          { text: '版本演进', link: '/products/browser/versions' },
          { text: 'IndexedDB 原理与实践', link: '/products/browser/indexeddb' },
          { text: 'OPFS 与存储配额', link: '/products/browser/opfs' },
          { text: '离线、本地优先与同步', link: '/products/browser/local-first' },
        ],
      }],
      '/reference/': [{ text: '参考资料', items: [
        { text: '参考资料总览', link: '/reference/' },
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
        { text: 'Docker 与 CLI', link: '/matrix/docker-tools' },
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
