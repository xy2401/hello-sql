import { defineConfig } from 'vitepress';

const sqlItems = [
  ['PostgreSQL', '/databases/sql/postgresql'],
  ['MySQL', '/databases/sql/mysql'],
  ['MariaDB', '/databases/sql/mariadb'],
  ['SQLite', '/databases/sql/sqlite'],
  ['SQL Server', '/databases/sql/sql-server'],
  ['Oracle Database', '/databases/sql/oracle'],
];

const analyticalItems = [
  ['DuckDB', '/databases/analytical/duckdb'],
  ['ClickHouse', '/databases/analytical/clickhouse'],
  ['TiDB', '/databases/analytical/tidb'],
  ['CockroachDB', '/databases/analytical/cockroachdb'],
  ['Snowflake', '/databases/analytical/snowflake'],
  ['BigQuery', '/databases/analytical/bigquery'],
];

const noSqlItems = [
  ['MongoDB', '/databases/nosql/mongodb'],
  ['CouchDB', '/databases/nosql/couchdb'],
  ['Redis', '/databases/nosql/redis'],
  ['Valkey', '/databases/nosql/valkey'],
  ['DynamoDB', '/databases/nosql/dynamodb'],
  ['Cassandra', '/databases/nosql/cassandra'],
  ['ScyllaDB', '/databases/nosql/scylladb'],
  ['Elasticsearch', '/databases/nosql/elasticsearch'],
  ['OpenSearch', '/databases/nosql/opensearch'],
  ['Neo4j', '/databases/nosql/neo4j'],
  ['InfluxDB', '/databases/nosql/influxdb'],
  ['TimescaleDB', '/databases/nosql/timescaledb'],
];

function databaseSidebarItems(items: string[][]) {
  return items.map(([text, link]) => ({
    text,
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
  description: '主流 SQL、NoSQL、Browser Database 与 WebAssembly 数据库交互学习平台',
  cleanUrls: true,
  lastUpdated: true,
  head: [
    ['meta', { name: 'theme-color', content: '#0f766e' }],
    ['link', { rel: 'icon', href: '/logo.svg' }],
  ],
  vite: {
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
      { text: '首页', link: '/' },
      { text: 'SQL 基础', link: '/learn/' },
      { text: '主流 SQL', link: '/databases/sql/' },
      { text: '主流 NoSQL', link: '/databases/nosql/' },
      { text: 'Browser Database', link: '/browser/' },
      { text: 'WASM 实验室', link: '/playground/' },
      { text: '数据库矩阵', link: '/matrix/' },
    ],
    sidebar: {
      '/learn/': [{
        text: 'SQL 学习路线',
        items: [
          { text: '路线总览', link: '/learn/' },
          { text: '查询与过滤', link: '/learn/query' },
          { text: '聚合、JOIN 与子查询', link: '/learn/joins' },
          { text: 'CTE 与窗口函数', link: '/learn/advanced-query' },
          { text: 'DDL、约束与数据建模', link: '/learn/schema' },
          { text: '事务、锁与并发', link: '/learn/transactions' },
          { text: '索引与执行计划', link: '/learn/indexes-explain' },
        ],
      }],
      '/databases/sql/': [
        { text: '关系型数据库', items: [
          { text: 'SQL 数据库总览', link: '/databases/sql/' },
          ...databaseSidebarItems(sqlItems),
        ] },
        { text: '分析、分布式与云', items: [
          { text: '能力总览', link: '/databases/analytical/' },
          ...databaseSidebarItems(analyticalItems),
        ] },
      ],
      '/databases/analytical/': [{ text: '分析、分布式与云', items: [
        { text: '能力总览', link: '/databases/analytical/' },
        ...databaseSidebarItems(analyticalItems),
      ] }],
      '/databases/nosql/': [{ text: 'NoSQL 数据模型', items: [
        { text: 'NoSQL 总览', link: '/databases/nosql/' },
        ...databaseSidebarItems(noSqlItems),
      ] }],
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
      '/matrix/': [{ text: '数据库对比矩阵', items: [
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
