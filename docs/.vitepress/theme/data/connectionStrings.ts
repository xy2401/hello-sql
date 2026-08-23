export type ConnectionKind = 'URI' | 'JDBC' | 'HTTP' | 'SDK 参数' | '嵌入式' | '浏览器 API';

export interface ConnectionStringProfile {
  id: string;
  group: '关系型' | '分析与分布式' | 'NoSQL';
  kind: ConnectionKind;
  protocol: string;
  defaultPort: string;
  example: string;
  namespace: string;
  tls: string;
  note: string;
  docs: string;
}

export const connectionStringProfiles: ConnectionStringProfile[] = [
  {
    id: 'postgresql', group: '关系型', kind: 'URI', protocol: 'PostgreSQL wire / libpq', defaultPort: '5432',
    example: 'postgresql://USER@db.example:5432/app?sslmode=verify-full', namespace: '路径是 database；schema 在会话内选择',
    tls: 'sslmode=verify-full', note: 'libpq 同时支持 URI 与 key=value；多主机、证书路径和 application_name 都可作为参数。',
    docs: 'https://www.postgresql.org/docs/current/libpq-connect.html',
  },
  {
    id: 'mysql', group: '关系型', kind: 'JDBC', protocol: 'MySQL classic protocol', defaultPort: '3306',
    example: 'jdbc:mysql://db.example:3306/app?sslMode=VERIFY_IDENTITY', namespace: '路径是 database/schema',
    tls: 'sslMode=VERIFY_IDENTITY', note: 'URI 形式取决于驱动；Connector/J 还提供 loadbalance、replication 和 SRV 子协议。',
    docs: 'https://dev.mysql.com/doc/connector-j/en/connector-j-reference-jdbc-url-format.html',
  },
  {
    id: 'mariadb', group: '关系型', kind: 'JDBC', protocol: 'MariaDB/MySQL protocol', defaultPort: '3306',
    example: 'jdbc:mariadb://db.example:3306/app?sslMode=verify-full', namespace: '路径是 database',
    tls: 'sslMode=verify-full', note: 'MariaDB Connector/J 3.x 默认只接受 jdbc:mariadb:；不要假定 MySQL 驱动参数完全相同。',
    docs: 'https://mariadb.com/docs/connectors/mariadb-connector-j/about-mariadb-connector-j',
  },
  {
    id: 'sqlite', group: '关系型', kind: '嵌入式', protocol: '文件 URI / 进程内 API', defaultPort: '—',
    example: 'file:./data/app.db?mode=rwc', namespace: '路径就是数据库文件；main/temp 是 schema',
    tls: '不适用', note: '没有服务器、用户和网络端口；URI 参数是否启用取决于宿主绑定和编译选项。',
    docs: 'https://sqlite.org/uri.html',
  },
  {
    id: 'sql-server', group: '关系型', kind: 'JDBC', protocol: 'TDS', defaultPort: '1433',
    example: 'jdbc:sqlserver://db.example:1433;databaseName=app;encrypt=true;trustServerCertificate=false', namespace: 'databaseName；schema 通常为 dbo 或用户默认值',
    tls: 'encrypt=true + 证书校验', note: 'JDBC 属性使用分号；实例名、集成认证和 Azure 身份认证是不同连接路径。',
    docs: 'https://learn.microsoft.com/en-us/sql/connect/jdbc/building-the-connection-url',
  },
  {
    id: 'oracle', group: '关系型', kind: 'JDBC', protocol: 'Oracle Net / JDBC Thin', defaultPort: '1521',
    example: 'jdbc:oracle:thin:@tcps://db.example:1521/app_service', namespace: '末段通常是 service name，不是 SID',
    tls: 'TCPS + wallet/信任库', note: '优先 service name 与 Easy Connect Plus；RAC/多主机通常需要扩展 Easy Connect 或描述符。',
    docs: 'https://docs.oracle.com/en/database/oracle/oracle-database/19/jjdbc/data-sources-and-URLs.html',
  },
  {
    id: 'duckdb', group: '分析与分布式', kind: '嵌入式', protocol: '进程内 API / JDBC', defaultPort: '—',
    example: 'jdbc:duckdb:./data/analytics.duckdb', namespace: '路径是本地文件；空路径创建内存库',
    tls: '不适用；远程文件由扩展处理', note: 'DuckDB 不是远程数据库服务；数据库文件和进程资源属于宿主应用。',
    docs: 'https://duckdb.org/docs/stable/clients/java',
  },
  {
    id: 'clickhouse', group: '分析与分布式', kind: 'JDBC', protocol: 'HTTPS / Native TCP', defaultPort: '8123 / 9000',
    example: 'jdbc:clickhouse:https://db.example:8443/analytics', namespace: '路径是 database',
    tls: 'HTTPS 或 secure native port', note: '客户端可能走 HTTP 或 Native 协议，端口、压缩和负载均衡参数不能混用。',
    docs: 'https://clickhouse.com/integrations/java',
  },
  {
    id: 'tidb', group: '分析与分布式', kind: 'JDBC', protocol: 'MySQL protocol', defaultPort: '4000',
    example: 'jdbc:mysql://gateway.example:4000/app?sslMode=VERIFY_IDENTITY', namespace: '路径是 database',
    tls: '按 TiDB Cloud/自托管证书配置', note: '使用 MySQL 兼容驱动，但认证插件、collation 和部分会话变量需要按 TiDB 文档确认。',
    docs: 'https://docs.pingcap.com/tidb/stable/dev-guide-choose-driver-or-orm/',
  },
  {
    id: 'cockroachdb', group: '分析与分布式', kind: 'URI', protocol: 'PostgreSQL wire', defaultPort: '26257',
    example: 'postgresql://USER@cluster.example:26257/app?sslmode=verify-full', namespace: '路径是 database；schema 与 PostgreSQL 相近',
    tls: 'sslmode=verify-full + CA/客户端证书', note: '协议兼容 PostgreSQL，但驱动/ORM 仍需验证事务重试和 CockroachDB 适配。',
    docs: 'https://www.cockroachlabs.com/docs/stable/connect-to-the-database',
  },
  {
    id: 'snowflake', group: '分析与分布式', kind: 'JDBC', protocol: 'HTTPS', defaultPort: '443',
    example: 'jdbc:snowflake://ORG-ACCOUNT.snowflakecomputing.com/?db=APP&schema=PUBLIC&warehouse=WH&role=ROLE', namespace: 'account → database → schema；warehouse 是计算资源',
    tls: 'HTTPS；不要中间人替换证书', note: '用户、OAuth、密钥或工作负载身份应放 Properties/安全配置，不要把密码写入 URL。',
    docs: 'https://docs.snowflake.com/en/developer-guide/jdbc/jdbc-configure',
  },
  {
    id: 'bigquery', group: '分析与分布式', kind: 'SDK 参数', protocol: 'Google APIs / REST/gRPC', defaultPort: '443',
    example: 'project=PROJECT_ID; location=REGION; dataset=DATASET', namespace: 'project → dataset → table',
    tls: 'Google API HTTPS + ADC/OAuth', note: '没有跨语言统一数据库 URI；JDBC/ODBC URL 由具体驱动定义，应用通常使用 ADC 与 SDK 配置。',
    docs: 'https://cloud.google.com/bigquery/docs/authentication',
  },
  {
    id: 'mongodb', group: 'NoSQL', kind: 'URI', protocol: 'MongoDB wire / DNS SRV', defaultPort: '27017',
    example: 'mongodb+srv://USER@cluster.example/app?retryWrites=true&w=majority', namespace: '路径是默认 authentication/database 上下文',
    tls: 'SRV 默认启用 TLS', note: '优先 mongodb+srv；标准 mongodb:// 需要列出 seed hosts，并显式处理 replicaSet 与 TLS。',
    docs: 'https://www.mongodb.com/docs/manual/reference/connection-string/',
  },
  {
    id: 'couchdb', group: 'NoSQL', kind: 'HTTP', protocol: 'HTTP/JSON', defaultPort: '5984',
    example: 'https://db.example:6984/app', namespace: 'URL 路径就是 database；文档 ID 继续追加',
    tls: '生产使用 HTTPS 或 TLS 终止代理', note: '认证更适合放 Authorization/Cookie 头；复制源和目标也以数据库 URL 表达。',
    docs: 'https://docs.couchdb.org/en/stable/api/basics.html',
  },
  {
    id: 'redis', group: 'NoSQL', kind: 'URI', protocol: 'RESP', defaultPort: '6379',
    example: 'rediss://default@cache.example:6379/0', namespace: '路径数字是逻辑 DB；Cluster 通常只使用 DB 0',
    tls: 'rediss:// + CA/主机名校验', note: 'URI 支持取决于客户端；Cluster/Sentinel 还需要拓扑发现参数，不能只看单节点地址。',
    docs: 'https://redis.io/docs/latest/develop/clients/',
  },
  {
    id: 'valkey', group: 'NoSQL', kind: 'URI', protocol: 'RESP', defaultPort: '6379',
    example: 'valkeys://default@cache.example:6379/0', namespace: '路径数字是逻辑 DB',
    tls: 'valkeys://', note: 'valkey-cli 使用 valkey:// 与 valkeys://；部分兼容客户端仍使用 redis:// / rediss://。',
    docs: 'https://valkey.io/topics/cli/',
  },
  {
    id: 'dynamodb', group: 'NoSQL', kind: 'SDK 参数', protocol: 'AWS JSON API over HTTPS', defaultPort: '443',
    example: 'region=ap-southeast-1; credentials=AWS default chain', namespace: 'AWS account + region → table',
    tls: 'AWS HTTPS + SigV4', note: '没有数据库连接 URI；SDK 根据 region、身份与 endpoint 构造并签名请求，本地模拟器才常覆写 endpoint。',
    docs: 'https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Programming.SDKOverview.html',
  },
  {
    id: 'cassandra', group: 'NoSQL', kind: 'SDK 参数', protocol: 'CQL native protocol', defaultPort: '9042',
    example: 'contactPoints=db1:9042,db2:9042; localDatacenter=dc1; keyspace=app', namespace: 'cluster → keyspace → table',
    tls: '驱动 SSL context + 节点证书', note: '没有统一 URI；驱动需要 seed contact points 和 local datacenter，并自行发现拓扑。',
    docs: 'https://cassandra.apache.org/doc/stable/cassandra/getting-started/drivers.html',
  },
  {
    id: 'scylladb', group: 'NoSQL', kind: 'SDK 参数', protocol: 'CQL native protocol', defaultPort: '9042',
    example: 'contactPoints=db1:9042,db2:9042; localDatacenter=dc1; keyspace=app', namespace: 'cluster → keyspace → table',
    tls: '驱动 SSL context + 节点证书', note: '使用兼容 CQL 驱动；token-aware、DC-aware 负载均衡比把所有节点拼成 URL 更重要。',
    docs: 'https://docs.scylladb.com/stable/developers/drivers/',
  },
  {
    id: 'elasticsearch', group: 'NoSQL', kind: 'HTTP', protocol: 'HTTPS/JSON', defaultPort: '9200',
    example: 'https://search.example:9200', namespace: 'URL/API 中选择 index 或 data stream',
    tls: 'HTTPS + CA fingerprint/证书', note: '凭证通常单独使用 API key；Elastic Cloud 还提供 Cloud ID，但标准 endpoint URL 更通用。',
    docs: 'https://www.elastic.co/docs/solutions/elasticsearch-solution-project/search-connection-details',
  },
  {
    id: 'opensearch', group: 'NoSQL', kind: 'HTTP', protocol: 'HTTPS/JSON', defaultPort: '9200',
    example: 'https://search.example:9200', namespace: 'URL/API 中选择 index',
    tls: 'HTTPS + CA；托管服务可能使用 SigV4', note: '自托管通常 basic/cert，Amazon OpenSearch Service 常用 AWS SigV4；两者客户端配置不同。',
    docs: 'https://docs.opensearch.org/latest/clients/',
  },
  {
    id: 'neo4j', group: 'NoSQL', kind: 'URI', protocol: 'Bolt + routing', defaultPort: '7687',
    example: 'neo4j+s://graph.example:7687', namespace: 'database 通常由驱动 session 配置，不放 URI 路径',
    tls: 'neo4j+s:// 校验证书；neo4j+ssc:// 自签名', note: 'neo4j:// 启用路由发现，bolt:// 直连单个服务器；集群应用通常应使用 neo4j scheme。',
    docs: 'https://neo4j.com/docs/operations-manual/current/clustering/setup/routing/',
  },
  {
    id: 'influxdb', group: 'NoSQL', kind: 'HTTP', protocol: 'HTTP API / FlightSQL（按产品）', defaultPort: '8086 / 8181',
    example: 'host=https://influx.example:8181; database=metrics; token=环境变量', namespace: '1.x database/RP；2.x org/bucket；3.x database',
    tls: 'HTTPS + Bearer/Token header', note: '不同代际不是同一种连接串；token 应放环境变量或 secret store，而不是 URL 查询参数。',
    docs: 'https://docs.influxdata.com/influxdb3/cloud/reference/cli/influxdb3/',
  },
  {
    id: 'timescaledb', group: 'NoSQL', kind: 'URI', protocol: 'PostgreSQL wire', defaultPort: '5432',
    example: 'postgresql://USER@ts.example:5432/app?sslmode=verify-full', namespace: 'database → schema；TimescaleDB 是扩展',
    tls: 'sslmode=verify-full', note: '连接方式与 PostgreSQL 相同；连接成功后仍需确认目标 database 已安装正确版本的 timescaledb 扩展。',
    docs: 'https://docs.timescale.com/integrations/latest/',
  },
  {
    id: 'browser', group: 'NoSQL', kind: '浏览器 API', protocol: 'IndexedDB / Storage API', defaultPort: '—',
    example: 'indexedDB.open("app", 1)', namespace: 'origin → database → object store',
    tls: '由 HTTPS 安全上下文与同源策略保护', note: '没有网络连接串；数据库由浏览器按 origin 隔离，OPFS 和持久化资格由 Storage API 管理。',
    docs: 'https://www.w3.org/TR/IndexedDB/',
  },
];
