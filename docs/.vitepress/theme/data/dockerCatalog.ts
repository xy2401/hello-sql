import { allDatabases } from './databaseNavigation'
import type { DatabaseBrandId } from './databaseBranding'

export type DockerEvidenceStatus = 'verified' | 'partial' | 'documented' | 'unsupported'
export type DockerRunMode = 'container' | 'custom-image' | 'cloud' | 'browser' | 'restricted-image'

export interface DockerImageRef {
  role: 'builder' | 'runtime' | 'server' | 'client'
  tag: string
  digest?: string
  digestKey?: string
  source: 'official' | 'vendor' | 'custom-official-base' | 'native'
}

export interface DockerCatalogEntry {
  id: DatabaseBrandId
  name: string
  mode: DockerRunMode
  status: DockerEvidenceStatus
  images: DockerImageRef[]
  toolRoots: string[]
  keyTools: string[]
  connectCommand: string
  queryCommand: string
  note?: string
}

type DockerProductSpec = Omit<DockerCatalogEntry, 'id' | 'name'>

const server = (digestKey: string, source: DockerImageRef['source'] = 'vendor'): DockerImageRef => ({
  role: 'server', tag: `由 ${digestKey} 锁定`, digestKey, source,
})

const local = (
  digestKey: string,
  keyTools: string[],
  connectCommand: string,
  queryCommand: string,
  toolRoots = ['/usr/local/bin', '/usr/bin'],
): DockerProductSpec => ({
  mode: 'container', status: 'documented', images: [server(digestKey)], toolRoots, keyTools, connectCommand, queryCommand,
})

const specs = {
  postgresql: local('POSTGRESQL_IMAGE', ['postgres', 'psql', 'pg_dump', 'pg_restore', 'pg_isready'], 'psql postgresql://postgres@postgres:5432/postgres', 'CREATE TABLE → INSERT 3 rows → SELECT → \\dt → EXPLAIN'),
  mysql: local('MYSQL_IMAGE', ['mysqld', 'mysql', 'mysqladmin', 'mysqldump'], 'mysql -h mysql -u root -p', 'CREATE TABLE → INSERT → SELECT → SHOW TABLES → EXPLAIN'),
  mariadb: local('MARIADB_IMAGE', ['mariadbd', 'mariadb', 'mariadb-admin', 'mariadb-dump'], 'mariadb -h mariadb -u root -p', 'CREATE TABLE → INSERT → SELECT → SHOW TABLES → EXPLAIN'),
  sqlite: { ...local('SQLITE_BASE_IMAGE', ['sqlite3'], 'sqlite3 /data/hello.db', 'CREATE TABLE → INSERT → SELECT → .tables → EXPLAIN QUERY PLAN'), mode: 'custom-image', note: 'SQLite 为嵌入式数据库；只有在官方基础镜像中安装锁定源码版本并核验校验和后才会标记实测。' },
  'sql-server': local('SQLSERVER_IMAGE', ['sqlservr', 'sqlcmd'], 'sqlcmd -S sqlserver -U sa -P "$MSSQL_SA_PASSWORD"', 'CREATE TABLE → INSERT → SELECT → sys.tables → SHOWPLAN'),
  oracle: { mode: 'restricted-image', status: 'documented', images: [server('ORACLE_IMAGE')], toolRoots: ['$ORACLE_HOME/bin'], keyTools: ['sqlplus', 'lsnrctl'], connectCommand: 'sqlplus system@//oracle:1521/FREEPDB1', queryCommand: 'CREATE TABLE → INSERT → SELECT → USER_TABLES → EXPLAIN PLAN', note: '仅在官方 Oracle Database Free 镜像可由无登录 Actions 合法拉取时实测；否则保持文档状态，不替换社区镜像。' },
  duckdb: { ...local('DUCKDB_BASE_IMAGE', ['duckdb'], 'duckdb /data/hello.duckdb', 'CREATE TABLE → INSERT → SELECT → SHOW TABLES → EXPLAIN'), mode: 'custom-image', note: 'DuckDB 为嵌入式数据库；只有在官方基础镜像中安装锁定发布包并核验校验和后才会标记实测。' },
  clickhouse: local('CLICKHOUSE_IMAGE', ['clickhouse', 'clickhouse-client', 'clickhouse-server'], 'clickhouse-client --host clickhouse', 'CREATE TABLE → INSERT → SELECT → SHOW TABLES → EXPLAIN'),
  tidb: local('TIDB_IMAGE', ['tidb-server', 'mysql'], 'mysql -h tidb -P 4000 -u root', 'MySQL 协议：CREATE TABLE → INSERT → SELECT → SHOW TABLES → EXPLAIN'),
  cockroachdb: local('COCKROACHDB_IMAGE', ['cockroach'], 'cockroach sql --insecure --host cockroach', 'CREATE TABLE → INSERT → SELECT → SHOW TABLES → EXPLAIN'),
  snowflake: { mode: 'cloud', status: 'documented', images: [{ role: 'client', tag: '官方 Snowflake CLI 固定版本', digestKey: 'SNOWFLAKE_CLI_BASE_IMAGE', source: 'custom-official-base' }], toolRoots: ['/usr/local/bin'], keyTools: ['snow'], connectCommand: 'snow connection test --connection HELLO_SQL', queryCommand: 'snow sql -q "SELECT ..."', note: 'CI 只验证官方 CLI 的版本和帮助；查询需要外部账号与凭证，不执行、不伪造输出。' },
  bigquery: { mode: 'cloud', status: 'documented', images: [{ role: 'client', tag: 'google-cloud-cli 固定版本', digestKey: 'GCLOUD_CLI_IMAGE', source: 'vendor' }], toolRoots: ['/google-cloud-sdk/bin'], keyTools: ['bq', 'gcloud'], connectCommand: 'gcloud auth list / bq version', queryCommand: 'bq query --use_legacy_sql=false "SELECT ..."', note: 'CI 实测 bq/gcloud 的版本和帮助，但不注入 Google Cloud 凭证。' },
  mongodb: local('MONGODB_IMAGE', ['mongod', 'mongosh'], 'mongosh mongodb://mongodb:27017', 'insertMany → find().sort() → show collections → explain'),
  couchdb: local('COUCHDB_IMAGE', ['couchdb', 'curl'], 'curl http://couchdb:5984/', 'PUT database → bulk docs → _find → _all_docs → _explain'),
  redis: local('REDIS_IMAGE', ['redis-server', 'redis-cli', 'redis-check-aof', 'redis-check-rdb'], 'redis-cli -h redis', 'XGROUP CREATE → XADD → XREADGROUP → XLEN/XPENDING'),
  valkey: local('VALKEY_IMAGE', ['valkey-server', 'valkey-cli', 'valkey-check-aof'], 'valkey-cli -h valkey', 'XGROUP CREATE → XADD → XREADGROUP → XLEN/XPENDING'),
  dynamodb: { ...local('DYNAMODB_LOCAL_IMAGE', ['java', 'aws'], 'aws dynamodb --endpoint-url http://dynamodb:8000', 'create-table → put-item ×3 → scan/query → list-tables'), images: [server('DYNAMODB_LOCAL_IMAGE'), { role: 'client', tag: '由 AWS_CLI_IMAGE 锁定', digestKey: 'AWS_CLI_IMAGE', source: 'vendor' }], note: '使用 AWS 官方 DynamoDB Local 模拟器，明确不等同于云端 DynamoDB。' },
  cassandra: local('CASSANDRA_IMAGE', ['cassandra', 'cqlsh', 'nodetool'], 'cqlsh cassandra 9042', 'CREATE KEYSPACE/TABLE → INSERT → SELECT → DESCRIBE TABLES → tracing'),
  scylladb: local('SCYLLADB_IMAGE', ['scylla', 'cqlsh', 'nodetool'], 'cqlsh scylladb 9042', 'CREATE KEYSPACE/TABLE → INSERT → SELECT → DESCRIBE TABLES → tracing'),
  elasticsearch: local('ELASTICSEARCH_IMAGE', ['elasticsearch', 'elasticsearch-cli', 'curl'], 'curl http://elasticsearch:9200', 'PUT index → bulk docs → _search → _cat/indices → _explain'),
  opensearch: local('OPENSEARCH_IMAGE', ['opensearch', 'opensearch-cli', 'curl'], 'curl http://opensearch:9200', 'PUT index → bulk docs → _search → _cat/indices → _explain'),
  neo4j: local('NEO4J_IMAGE', ['neo4j', 'neo4j-admin', 'cypher-shell'], 'cypher-shell -a neo4j://neo4j -u neo4j -p "$NEO4J_PASSWORD"', 'CREATE nodes → MATCH/ORDER BY → SHOW INDEXES → PROFILE'),
  influxdb: local('INFLUXDB_IMAGE', ['influxd', 'influx'], 'influx ping --host http://influxdb:8086', 'write fixed points → query → bucket list → query plan/status'),
  timescaledb: local('TIMESCALEDB_IMAGE', ['postgres', 'psql', 'timescaledb-tune'], 'psql postgresql://postgres@timescaledb:5432/postgres', 'CREATE EXTENSION/hypertable → INSERT → SELECT → \\dt → EXPLAIN'),
  browser: { mode: 'browser', status: 'unsupported', images: [], toolRoots: [], keyTools: ['IndexedDB', 'Storage API'], connectCommand: '浏览器页面内 API', queryCommand: '使用 /playground/ 的浏览器工作台', note: '浏览器数据库依赖浏览器存储上下文，不适用 Docker 服务与 CLI；保留为明确例外。' },
} satisfies Record<DatabaseBrandId, DockerProductSpec>

export const dockerCatalog: DockerCatalogEntry[] = allDatabases.map((product) => ({
  id: product.id,
  name: product.name,
  ...specs[product.id],
}))

export const dockerCatalogById = Object.fromEntries(dockerCatalog.map((entry) => [entry.id, entry])) as Record<DatabaseBrandId, DockerCatalogEntry>
