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

export const sqlDatabaseItems = [
  { id: 'postgresql', name: 'PostgreSQL', link: '/databases/sql/postgresql' },
  { id: 'mysql', name: 'MySQL', link: '/databases/sql/mysql' },
  { id: 'mariadb', name: 'MariaDB', link: '/databases/sql/mariadb' },
  { id: 'sqlite', name: 'SQLite', link: '/databases/sql/sqlite' },
  { id: 'sql-server', name: 'SQL Server', link: '/databases/sql/sql-server' },
  { id: 'oracle', name: 'Oracle Database', link: '/databases/sql/oracle' },
] as const satisfies readonly DatabaseNavigationItem[];

export const analyticalDatabaseItems = [
  { id: 'duckdb', name: 'DuckDB', link: '/databases/analytical/duckdb' },
  { id: 'clickhouse', name: 'ClickHouse', link: '/databases/analytical/clickhouse' },
  { id: 'tidb', name: 'TiDB', link: '/databases/analytical/tidb' },
  { id: 'cockroachdb', name: 'CockroachDB', link: '/databases/analytical/cockroachdb' },
  { id: 'snowflake', name: 'Snowflake', link: '/databases/analytical/snowflake' },
  { id: 'bigquery', name: 'BigQuery', link: '/databases/analytical/bigquery' },
] as const satisfies readonly DatabaseNavigationItem[];

export const noSqlDatabaseItems = [
  { id: 'mongodb', name: 'MongoDB', link: '/databases/nosql/mongodb' },
  { id: 'couchdb', name: 'CouchDB', link: '/databases/nosql/couchdb' },
  { id: 'redis', name: 'Redis', link: '/databases/nosql/redis' },
  { id: 'valkey', name: 'Valkey', link: '/databases/nosql/valkey' },
  { id: 'dynamodb', name: 'DynamoDB', link: '/databases/nosql/dynamodb' },
  { id: 'cassandra', name: 'Cassandra', link: '/databases/nosql/cassandra' },
  { id: 'scylladb', name: 'ScyllaDB', link: '/databases/nosql/scylladb' },
  { id: 'elasticsearch', name: 'Elasticsearch', link: '/databases/nosql/elasticsearch' },
  { id: 'opensearch', name: 'OpenSearch', link: '/databases/nosql/opensearch' },
  { id: 'neo4j', name: 'Neo4j', link: '/databases/nosql/neo4j' },
  { id: 'influxdb', name: 'InfluxDB', link: '/databases/nosql/influxdb' },
  { id: 'timescaledb', name: 'TimescaleDB', link: '/databases/nosql/timescaledb' },
] as const satisfies readonly DatabaseNavigationItem[];

export const databaseNavigationGroups = {
  sql: { id: 'sql', title: 'SQL 数据库', overviewText: '关系型数据库', overviewLink: '/databases/sql/', items: sqlDatabaseItems },
  analytical: { id: 'analytical', title: '分析、分布式与云', overviewText: '能力总览', overviewLink: '/databases/analytical/', items: analyticalDatabaseItems },
  nosql: { id: 'nosql', title: 'NoSQL 数据库', overviewText: 'NoSQL 总览', overviewLink: '/databases/nosql/', items: noSqlDatabaseItems },
} as const satisfies Record<string, DatabaseNavigationGroup>;
