import type { DatabaseBrandId } from './databaseBranding';

export interface DatabaseNavigationItem {
  id: DatabaseBrandId;
  name: string;
  link: string;
}

export interface DatabaseNavigationGroup {
  id: 'sql' | 'analytical' | 'nosql';
  title: string;
  overviewText: string;
  overviewLink: string;
  items: readonly DatabaseNavigationItem[];
}

// 所有数据库（平铺在 /products/）
export const allDatabases = [
  // SQL 关系型 (6)
  { id: 'postgresql', name: 'PostgreSQL', link: '/products/postgresql' },
  { id: 'mysql', name: 'MySQL', link: '/products/mysql' },
  { id: 'mariadb', name: 'MariaDB', link: '/products/mariadb' },
  { id: 'sqlite', name: 'SQLite', link: '/products/sqlite' },
  { id: 'sql-server', name: 'SQL Server', link: '/products/mssqlserver' },
  { id: 'oracle', name: 'Oracle Database', link: '/products/oracle' },
  // Analytical (6)
  { id: 'duckdb', name: 'DuckDB', link: '/products/duckdb' },
  { id: 'clickhouse', name: 'ClickHouse', link: '/products/clickhouse' },
  { id: 'tidb', name: 'TiDB', link: '/products/tidb' },
  { id: 'cockroachdb', name: 'CockroachDB', link: '/products/cockroachdb' },
  { id: 'snowflake', name: 'Snowflake', link: '/products/snowflake' },
  { id: 'bigquery', name: 'BigQuery', link: '/products/bigquery' },
  // NoSQL (12)
  { id: 'mongodb', name: 'MongoDB', link: '/products/mongodb' },
  { id: 'couchdb', name: 'Apache CouchDB', link: '/products/couchdb' },
  { id: 'redis', name: 'Redis', link: '/products/redis' },
  { id: 'valkey', name: 'Valkey', link: '/products/valkey' },
  { id: 'dynamodb', name: 'Amazon DynamoDB', link: '/products/dynamodb' },
  { id: 'cassandra', name: 'Apache Cassandra', link: '/products/cassandra' },
  { id: 'scylladb', name: 'ScyllaDB', link: '/products/scylladb' },
  { id: 'elasticsearch', name: 'Elasticsearch', link: '/products/elasticsearch' },
  { id: 'opensearch', name: 'OpenSearch', link: '/products/opensearch' },
  { id: 'neo4j', name: 'Neo4j', link: '/products/neo4j' },
  { id: 'influxdb', name: 'InfluxDB', link: '/products/influxdb' },
  { id: 'timescaledb', name: 'TimescaleDB', link: '/products/timescaledb' },
] as const satisfies readonly DatabaseNavigationItem[];
