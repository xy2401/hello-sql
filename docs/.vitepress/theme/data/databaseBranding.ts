export const databaseBrands = {
  postgresql: { name: 'PostgreSQL', assetId: 'postgresql' },
  mysql: { name: 'MySQL', assetId: 'mysql' },
  mariadb: { name: 'MariaDB', assetId: 'mariadb' },
  sqlite: { name: 'SQLite', assetId: 'sqlite' },
  'sql-server': { name: 'Microsoft SQL Server', assetId: 'sql-server' },
  oracle: { name: 'Oracle Database', assetId: 'oracle' },
  duckdb: { name: 'DuckDB', assetId: 'duckdb' },
  clickhouse: { name: 'ClickHouse', assetId: 'clickhouse' },
  tidb: { name: 'TiDB', assetId: 'tidb' },
  cockroachdb: { name: 'CockroachDB', assetId: 'cockroachdb' },
  snowflake: { name: 'Snowflake', assetId: 'snowflake' },
  bigquery: { name: 'BigQuery', assetId: 'bigquery' },
  mongodb: { name: 'MongoDB', assetId: 'mongodb' },
  couchdb: { name: 'Apache CouchDB', assetId: 'couchdb' },
  redis: { name: 'Redis', assetId: 'redis' },
  valkey: { name: 'Valkey', assetId: 'valkey' },
  dynamodb: { name: 'Amazon DynamoDB', assetId: 'dynamodb' },
  cassandra: { name: 'Apache Cassandra', assetId: 'cassandra' },
  scylladb: { name: 'ScyllaDB', assetId: 'scylladb' },
  elasticsearch: { name: 'Elasticsearch', assetId: 'elasticsearch' },
  opensearch: { name: 'OpenSearch', assetId: 'opensearch' },
  neo4j: { name: 'Neo4j', assetId: 'neo4j' },
  influxdb: { name: 'InfluxDB', assetId: 'influxdb' },
  timescaledb: { name: 'TimescaleDB', assetId: 'timescaledb' },
  browser: { name: 'Browser Database', assetId: 'browser' },
  pglite: { name: 'PGlite', assetId: 'postgresql' },
  surrealdb: { name: 'SurrealDB', assetId: 'surrealdb' },
  indexeddb: { name: 'IndexedDB', assetId: 'indexeddb' },
} as const;

export type DatabaseBrandId = keyof typeof databaseBrands;

export const databaseProductBrandIds = [
  'postgresql', 'mysql', 'mariadb', 'sqlite', 'sql-server', 'oracle',
  'duckdb', 'clickhouse', 'tidb', 'cockroachdb', 'snowflake', 'bigquery',
  'mongodb', 'couchdb', 'redis', 'valkey', 'dynamodb', 'cassandra',
  'scylladb', 'elasticsearch', 'opensearch', 'neo4j', 'influxdb', 'timescaledb',
  'browser',
] as const satisfies readonly DatabaseBrandId[];

export function databaseLogoPath(id: DatabaseBrandId) {
  return `/logos/databases/${databaseBrands[id].assetId}.svg`;
}
