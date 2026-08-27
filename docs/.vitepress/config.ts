import { defineConfig } from 'vitepress';
import { splitDuckDbWasm } from './plugins/splitDuckDbWasm';
import { allDatabases } from './theme/data/databaseNavigation';

const featuredDatabaseIds = new Set(['postgresql', 'mysql', 'duckdb', 'mongodb', 'redis']);
const featuredDatabases = allDatabases.filter(database => featuredDatabaseIds.has(database.id));
const databaseVersionItems = {
  'browser': [
    { text: "OPFS + SyncAccessHandle 普及", link: '/products/browser/version/opfs-syncaccesshandle' },
    { text: "IndexedDB 3.0 规范草案", link: '/products/browser/version/indexeddb-3.0' },
    { text: "IndexedDB 2.0 W3C 推荐标准", link: '/products/browser/version/indexeddb-2.0-w3c' },
  ],
  'cassandra': [
    { text: "Cassandra 5.0", link: '/products/cassandra/version/cassandra-5.0' },
    { text: "Cassandra 4.1", link: '/products/cassandra/version/cassandra-4.1' },
    { text: "Cassandra 4.0", link: '/products/cassandra/version/cassandra-4.0' },
    { text: "Cassandra 3.11", link: '/products/cassandra/version/cassandra-3.11' },
  ],
  'clickhouse': [
    { text: "ClickHouse 26.3 LTS", link: '/products/clickhouse/version/clickhouse-26.3' },
    { text: "ClickHouse 24.8 LTS", link: '/products/clickhouse/version/clickhouse-24.8' },
    { text: "ClickHouse 24.3 LTS", link: '/products/clickhouse/version/clickhouse-24.3' },
    { text: "ClickHouse 23.8 LTS", link: '/products/clickhouse/version/clickhouse-23.8' },
    { text: "ClickHouse 22.8 LTS", link: '/products/clickhouse/version/clickhouse-22.8' },
  ],
  'cockroachdb': [
    { text: "CockroachDB v26.1", link: '/products/cockroachdb/version/cockroachdb-v26.1' },
    { text: "CockroachDB v24.1", link: '/products/cockroachdb/version/cockroachdb-v24.1' },
    { text: "CockroachDB v23.2", link: '/products/cockroachdb/version/cockroachdb-v23.2' },
    { text: "CockroachDB v22.2", link: '/products/cockroachdb/version/cockroachdb-v22.2' },
  ],
  'couchdb': [
    { text: "CouchDB 3.5", link: '/products/couchdb/version/couchdb-3.5' },
    { text: "CouchDB 3.3", link: '/products/couchdb/version/couchdb-3.3' },
    { text: "CouchDB 3.0", link: '/products/couchdb/version/couchdb-3.0' },
    { text: "CouchDB 2.0", link: '/products/couchdb/version/couchdb-2.0' },
  ],
  'duckdb': [
    { text: "DuckDB 1.5", link: '/products/duckdb/version/duckdb-1.5' },
    { text: "DuckDB 1.4 LTS", link: '/products/duckdb/version/duckdb-1.4' },
    { text: "DuckDB 1.1", link: '/products/duckdb/version/duckdb-1.1' },
    { text: "DuckDB 1.0", link: '/products/duckdb/version/duckdb-1.0' },
    { text: "DuckDB 0.10", link: '/products/duckdb/version/duckdb-0.10' },
    { text: "DuckDB 0.9", link: '/products/duckdb/version/duckdb-0.9' },
  ],
  'elasticsearch': [
    { text: "Elasticsearch 9.0", link: '/products/elasticsearch/version/elasticsearch-9.0' },
    { text: "Elasticsearch 8.15", link: '/products/elasticsearch/version/elasticsearch-8.15' },
    { text: "Elasticsearch 8.0", link: '/products/elasticsearch/version/elasticsearch-8.0' },
    { text: "Elasticsearch 7.17", link: '/products/elasticsearch/version/elasticsearch-7.17' },
    { text: "Elasticsearch 7.0", link: '/products/elasticsearch/version/elasticsearch-7.0' },
    { text: "Elasticsearch 6.0", link: '/products/elasticsearch/version/elasticsearch-6.0' },
  ],
  'influxdb': [
    { text: "InfluxDB 3 Core 3.11", link: '/products/influxdb/version/influxdb-3.11' },
    { text: "InfluxDB 3.0 (IOx)", link: '/products/influxdb/version/influxdb-3.0' },
    { text: "InfluxDB 2.0", link: '/products/influxdb/version/influxdb-2.0' },
    { text: "InfluxDB 1.8", link: '/products/influxdb/version/influxdb-1.8' },
  ],
  'mariadb': [
    { text: "MariaDB 11.8 LTS", link: '/products/mariadb/version/mariadb-11.8' },
    { text: "MariaDB 12.0 Rolling", link: '/products/mariadb/version/mariadb-12.0-rolling' },
    { text: "MariaDB 11.4 LTS", link: '/products/mariadb/version/mariadb-11.4' },
    { text: "MariaDB 10.11 LTS", link: '/products/mariadb/version/mariadb-10.11' },
    { text: "MariaDB 10.6 LTS", link: '/products/mariadb/version/mariadb-10.6' },
    { text: "MariaDB 10.5", link: '/products/mariadb/version/mariadb-10.5' },
  ],
  'mongodb': [
    { text: "MongoDB 8.2", link: '/products/mongodb/version/mongodb-8.2' },
    { text: "MongoDB 8.0", link: '/products/mongodb/version/mongodb-8.0' },
    { text: "MongoDB 7.0", link: '/products/mongodb/version/mongodb-7.0' },
    { text: "MongoDB 6.0", link: '/products/mongodb/version/mongodb-6.0' },
    { text: "MongoDB 5.0", link: '/products/mongodb/version/mongodb-5.0' },
    { text: "MongoDB 4.4", link: '/products/mongodb/version/mongodb-4.4' },
    { text: "MongoDB 4.2", link: '/products/mongodb/version/mongodb-4.2' },
    { text: "MongoDB 4.0", link: '/products/mongodb/version/mongodb-4.0' },
  ],
  'mssqlserver': [
    { text: "SQL Server 2025（17.x）", link: '/products/mssqlserver/version/sql-server-2025' },
    { text: "SQL Server 2022", link: '/products/mssqlserver/version/sql-server-2022' },
    { text: "SQL Server 2019", link: '/products/mssqlserver/version/sql-server-2019' },
    { text: "SQL Server 2017", link: '/products/mssqlserver/version/sql-server-2017' },
    { text: "SQL Server 2016", link: '/products/mssqlserver/version/sql-server-2016' },
  ],
  'mysql': [
    { text: "MySQL 9.x Innovation", link: '/products/mysql/version/mysql-9.x-innovation' },
    { text: "MySQL 8.4 LTS", link: '/products/mysql/version/mysql-8.4' },
    { text: "MySQL 8.0", link: '/products/mysql/version/mysql-8.0' },
    { text: "MySQL 5.7", link: '/products/mysql/version/mysql-5.7' },
    { text: "MySQL 5.6", link: '/products/mysql/version/mysql-5.6' },
  ],
  'neo4j': [
    { text: "Neo4j 2026.07", link: '/products/neo4j/version/neo4j-2026.07' },
    { text: "Neo4j 5.23", link: '/products/neo4j/version/neo4j-5.23' },
    { text: "Neo4j 5.0", link: '/products/neo4j/version/neo4j-5.0' },
    { text: "Neo4j 4.4 LTS", link: '/products/neo4j/version/neo4j-4.4' },
    { text: "Neo4j 4.0", link: '/products/neo4j/version/neo4j-4.0' },
  ],
  'opensearch': [
    { text: "OpenSearch 3.0", link: '/products/opensearch/version/opensearch-3.0' },
    { text: "OpenSearch 2.17", link: '/products/opensearch/version/opensearch-2.17' },
    { text: "OpenSearch 2.0", link: '/products/opensearch/version/opensearch-2.0' },
    { text: "OpenSearch 1.0", link: '/products/opensearch/version/opensearch-1.0' },
  ],
  'oracle': [
    { text: "Oracle AI Database 26ai", link: '/products/oracle/version/oracle-ai-database-26ai' },
    { text: "Oracle Database 23ai", link: '/products/oracle/version/oracle-database-23ai' },
    { text: "Oracle Database 21c", link: '/products/oracle/version/oracle-database-21c' },
    { text: "Oracle Database 19c", link: '/products/oracle/version/oracle-database-19c' },
    { text: "Oracle Database 12c R2", link: '/products/oracle/version/oracle-database-12c-r2' },
  ],
  'postgresql': [
    { text: "PostgreSQL 18", link: '/products/postgresql/version/postgresql-18' },
    { text: "PostgreSQL 17", link: '/products/postgresql/version/postgresql-17' },
    { text: "PostgreSQL 16", link: '/products/postgresql/version/postgresql-16' },
    { text: "PostgreSQL 15", link: '/products/postgresql/version/postgresql-15' },
    { text: "PostgreSQL 14", link: '/products/postgresql/version/postgresql-14' },
    { text: "PostgreSQL 13", link: '/products/postgresql/version/postgresql-13' },
    { text: "PostgreSQL 12", link: '/products/postgresql/version/postgresql-12' },
  ],
  'redis': [
    { text: "Redis 8.10", link: '/products/redis/version/redis-8.10' },
    { text: "Redis 8.0", link: '/products/redis/version/redis-8.0' },
    { text: "Redis 7.4", link: '/products/redis/version/redis-7.4' },
    { text: "Redis 7.2", link: '/products/redis/version/redis-7.2' },
    { text: "Redis 7.0", link: '/products/redis/version/redis-7.0' },
    { text: "Redis 6.2", link: '/products/redis/version/redis-6.2' },
    { text: "Redis 6.0", link: '/products/redis/version/redis-6.0' },
    { text: "Redis 5.0", link: '/products/redis/version/redis-5.0' },
  ],
  'scylladb': [
    { text: "ScyllaDB 2026.2", link: '/products/scylladb/version/scylladb-2026.2' },
    { text: "ScyllaDB 2026.1 LTS", link: '/products/scylladb/version/scylladb-2026.1' },
    { text: "ScyllaDB 6.0", link: '/products/scylladb/version/scylladb-6.0' },
    { text: "ScyllaDB 5.4", link: '/products/scylladb/version/scylladb-5.4' },
    { text: "ScyllaDB 5.0", link: '/products/scylladb/version/scylladb-5.0' },
  ],
  'sqlite': [
    { text: "SQLite 3.53", link: '/products/sqlite/version/sqlite-3.53' },
    { text: "SQLite 3.46", link: '/products/sqlite/version/sqlite-3.46' },
    { text: "SQLite 3.45", link: '/products/sqlite/version/sqlite-3.45' },
    { text: "SQLite 3.38", link: '/products/sqlite/version/sqlite-3.38' },
    { text: "SQLite 3.37", link: '/products/sqlite/version/sqlite-3.37' },
    { text: "SQLite 3.35", link: '/products/sqlite/version/sqlite-3.35' },
  ],
  'tidb': [
    { text: "TiDB 8.5 LTS", link: '/products/tidb/version/tidb-8.5' },
    { text: "TiDB 8.1 LTS", link: '/products/tidb/version/tidb-8.1' },
    { text: "TiDB 7.5 LTS", link: '/products/tidb/version/tidb-7.5' },
    { text: "TiDB 7.1 LTS", link: '/products/tidb/version/tidb-7.1' },
    { text: "TiDB 6.5 LTS", link: '/products/tidb/version/tidb-6.5' },
  ],
  'timescaledb': [
    { text: "TimescaleDB 2.27", link: '/products/timescaledb/version/timescaledb-2.27' },
    { text: "TimescaleDB 2.16", link: '/products/timescaledb/version/timescaledb-2.16' },
    { text: "TimescaleDB 2.13", link: '/products/timescaledb/version/timescaledb-2.13' },
    { text: "TimescaleDB 2.0", link: '/products/timescaledb/version/timescaledb-2.0' },
  ],
  'valkey': [
    { text: "Valkey 9.1", link: '/products/valkey/version/valkey-9.1' },
    { text: "Valkey 8.0", link: '/products/valkey/version/valkey-8.0' },
    { text: "Valkey 7.2", link: '/products/valkey/version/valkey-7.2' },
  ],
};

const moreDatabases = allDatabases.filter(database => !featuredDatabaseIds.has(database.id));

function databaseProductSidebar(id: string, name: string, link: string) {
  return [
    {
      text: name,
      items: [
        { text: '概览', link: `${link}/` },
        { text: '核心知识', link: `${link}/core-concepts` },
        { text: '版本演进', link: `${link}/version/`, collapsed: false, items: databaseVersionItems[id] },
        { text: 'Docker 验证', link: `${link}/DockerTooling` },
      ],
    },
  ];
}

const databaseProductSidebars = Object.fromEntries(
  allDatabases.map(({ id, name, link }) => [`${link}/`, databaseProductSidebar(id, name, link)]),
);

function databaseDirectoryItems(items: readonly { name: string; link: string }[]) {
  return items.map(({ name, link }) => ({
    text: name,
    link: `${link}/`,
  }));
}

const base = process.env.DOCS_BASE || '/';

export default defineConfig({
  base,
  title: 'Hello SQL',
  titleTemplate: ':title | SQL 与数据库手册',
  description: '数据库学习与工程选型（22 款可本地运行数据库 · WASM 实验 · Docker 验证 · 选型指南）',
  cleanUrls: true,
  lastUpdated: true,
  head: [
    ['meta', { name: 'theme-color', content: '#0f766e' }],
    ['link', { rel: 'icon', type: 'image/svg+xml', href: `${base}favicon.svg` }],
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
        text: '📦 更多',
        items: [
          ...moreDatabases.map(database => ({
            text: database.name,
            link: `${database.link}/`,
          })),
        ],
      },
      { text: '🧪 实验台', link: '/playground/' },
      { text: '⚖️ 对比矩阵', link: '/matrix/' },
      { text: '📚 参考资料', link: '/reference/' },
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
          { text: '版本演进', link: '/products/browser/version/', collapsed: false, items: databaseVersionItems.browser },
          { text: 'IndexedDB 原理与实践', link: '/products/browser/indexeddb' },
          { text: 'OPFS 与存储配额', link: '/products/browser/opfs' },
          { text: '离线、本地优先与同步', link: '/products/browser/local-first' },
        ],
      }],
      '/reference/': [{ text: '参考资料', items: [
        { text: '参考资料总览', link: '/reference/' },
      ] }],
      '/playground/': [{ text: 'WASM 数据库实验台', items: [
        { text: '实验台总览', link: '/playground/' },
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
