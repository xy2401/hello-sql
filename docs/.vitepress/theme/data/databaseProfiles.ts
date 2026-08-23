import type { DatabaseBrandId } from './databaseBranding';

export interface DatabaseProfileData {
  id: DatabaseBrandId;
  name: string;
  family: string;
  license: string;
  positioning: string;
  model: string;
  query: string;
  transactions: string[];
  indexes: string[];
  scaling: string[];
  deployment: string[];
  useCases: string[];
  limitations: string[];
  recommendation: string;
  liveEngine?: 'sqlite' | 'duckdb' | 'pglite' | 'surrealdb' | 'indexeddb';
}

export const databaseProfiles: Record<string, DatabaseProfileData> = {
  postgresql: {
    id: 'postgresql', name: 'PostgreSQL', family: '关系型 · 通用 OLTP', license: 'PostgreSQL License',
    positioning: '以标准兼容、可扩展性和严谨事务语义见长的通用关系数据库。既能承担核心业务，也能通过扩展覆盖 GIS、向量、时序与全文检索。',
    model: '关系表为核心，同时原生支持 JSONB、数组、Range、复合类型与自定义类型。', query: 'PostgreSQL SQL；窗口函数、CTE、LATERAL、RETURNING 与丰富类型运算符是常用优势。',
    transactions: ['完整 ACID 与 MVCC', 'Read Committed 默认隔离，可选 Repeatable Read / Serializable', 'DDL 绝大多数可参与事务'],
    indexes: ['B-tree、Hash、GiST、SP-GiST、GIN、BRIN', '表达式索引、部分索引、覆盖索引', 'JSONB 与全文检索可使用 GIN'],
    scaling: ['流复制与逻辑复制', '读副本、分区表和外部数据包装器', '原生分片能力有限，通常借助 Citus 等扩展'],
    deployment: ['自托管单机或高可用集群', '主要云厂商托管服务', 'PGlite 可在浏览器运行 PostgreSQL WASM 子集'],
    useCases: ['交易系统与复杂业务模型', '需要复杂 SQL、JSON 与扩展的应用', 'GIS、RAG 元数据与多租户 SaaS'],
    limitations: ['水平分片不是内建默认路径', '高写入规模需要认真设计 vacuum、索引与连接池', '版本升级和扩展兼容需要运维规划'],
    recommendation: '当业务数据关系复杂、事务正确性优先，并且希望保留扩展空间时，PostgreSQL 通常是最稳妥的默认选择。', liveEngine: 'pglite',
  },
  mysql: {
    id: 'mysql', name: 'MySQL', family: '关系型 · Web OLTP', license: 'GPLv2 / Commercial',
    positioning: '生态成熟、托管选择丰富的通用关系数据库，在传统 Web、CMS 与读多写少业务中具有广泛基础。',
    model: '关系表为主，InnoDB 是默认事务存储引擎；支持 JSON、生成列和分区。', query: 'MySQL SQL；需注意 GROUP BY、布尔值、日期函数、UPSERT 等方言差异。',
    transactions: ['InnoDB 提供 ACID 与 MVCC', '默认 Repeatable Read', '间隙锁和 next-key lock 会影响并发行为'],
    indexes: ['B-tree 为主，支持全文与空间索引', '组合索引遵循最左前缀', '生成列可辅助 JSON 路径索引'],
    scaling: ['异步/半同步复制与 Group Replication', '读写分离成熟', '分片通常由中间件或云服务承担'],
    deployment: ['自托管与各云托管服务', 'InnoDB Cluster / Group Replication', '没有正式浏览器 WASM 内核'],
    useCases: ['内容管理、电商与传统 Web', '已有 MySQL 技术栈的业务系统', '托管数据库优先的中小团队'],
    limitations: ['复杂查询优化与统计信息需要持续验证', '方言与标准 SQL 存在差异', '大规模分片会引入中间件复杂度'],
    recommendation: '团队已有 MySQL 经验、生态依赖明确或云平台围绕 MySQL 建设时优先采用；新系统仍应与 PostgreSQL 按查询和扩展需求比较。',
  },
  mariadb: {
    id: 'mariadb', name: 'MariaDB', family: '关系型 · MySQL 分支', license: 'GPLv2',
    positioning: '源自 MySQL 的社区驱动关系数据库，提供多存储引擎、Galera 集群与独立演进的 SQL 能力。',
    model: '关系表为主，可按工作负载选择 InnoDB、Aria、ColumnStore 等引擎。', query: '与 MySQL 高度相似但已产生显著方言与系统行为差异，不能假定完全兼容。',
    transactions: ['事务能力取决于存储引擎', 'InnoDB 提供 MVCC 与 ACID', 'Galera 采用同步认证复制'],
    indexes: ['B-tree、全文与空间索引', '虚拟列与函数索引能力随版本演进', 'ColumnStore 采用列式执行路径'],
    scaling: ['主从复制与 Galera 多主集群', 'Spider 等引擎提供分布式能力', '读写扩展需要明确冲突策略'],
    deployment: ['自托管、容器与部分云托管', '适合偏好社区治理的 MySQL 用户', '没有正式浏览器 WASM 内核'],
    useCases: ['MySQL 兼容应用迁移', '需要 Galera 或特定存储引擎', '开源数据库基础设施'],
    limitations: ['与 MySQL 的兼容差距会随功能扩大', '驱动和托管生态小于 MySQL', '迁移前必须执行真实 SQL 回归'],
    recommendation: '只有在治理、Galera 或特定 MariaDB 能力带来明确价值时选择，不能仅把它当作可无缝替换的 MySQL。',
  },
  sqlite: {
    id: 'sqlite', name: 'SQLite', family: '关系型 · 嵌入式', license: 'Public Domain',
    positioning: '零配置、单文件、进程内的关系数据库，是移动端、桌面端、边缘设备和本地优先应用的基础组件。',
    model: '关系表与动态类型亲和性；支持严格表、JSON 函数、FTS5、R-Tree。', query: 'SQLite SQL；覆盖现代查询能力，但 ALTER TABLE、并发和类型规则与服务端数据库不同。',
    transactions: ['完整 ACID', '单写者、多读者模型', 'WAL 改善读写并发但不把它变成分布式服务'],
    indexes: ['B-tree、部分索引、表达式索引', 'FTS5 全文索引与 R-Tree', '查询规划器可通过 EXPLAIN QUERY PLAN 检查'],
    scaling: ['垂直扩展到单机本地文件', '复制与同步由宿主应用或外部系统完成', '不适合多节点并发写入服务'],
    deployment: ['应用内嵌，无独立服务器', '移动、桌面、IoT 与浏览器 WASM', 'OPFS 可在浏览器持久化数据库文件'],
    useCases: ['离线和本地优先应用', '测试、缓存、配置与边缘数据', '中小数据量的嵌入式业务'],
    limitations: ['高并发写入受单写者约束', '缺少内建用户与网络访问控制', '分布式复制不是核心职责'],
    recommendation: '数据属于单个设备或应用实例、运维成本必须接近零时优先 SQLite；多写节点服务应选择服务端数据库。', liveEngine: 'sqlite',
  },
  'sql-server': {
    id: 'sql-server', name: 'Microsoft SQL Server', family: '关系型 · 企业 OLTP/BI', license: 'Commercial / Developer',
    positioning: '与 .NET、Azure 和 Microsoft BI 生态深度集成的企业级关系数据库。',
    model: '关系表为核心，支持 JSON、XML、图表、列存储和内存优化表。', query: 'T-SQL；TOP、APPLY、MERGE、存储过程和系统函数具有明显方言特征。',
    transactions: ['ACID、锁与行版本并存', 'Read Committed 默认，可开启快照隔离', 'Always On 面向高可用'],
    indexes: ['聚集/非聚集 B-tree', '列存储、全文、空间与内存优化索引', 'Query Store 辅助计划回归分析'],
    scaling: ['Always On 可用性组', '分区、读副本与 Azure 弹性能力', '水平分片通常在应用或云层实现'],
    deployment: ['Windows/Linux 自托管', 'Azure SQL 多种托管形态', '没有浏览器 WASM 版本'],
    useCases: ['.NET 与 Microsoft 数据平台', '企业 ERP、报表和混合事务分析', '需要成熟商业支持的组织'],
    limitations: ['许可与版本功能边界复杂', '跨平台生态仍以 Microsoft 工具为中心', '云产品之间兼容能力需逐项确认'],
    recommendation: '组织已经采用 .NET、Azure、Power BI 或需要 Microsoft 商业支持时具有明显协同优势。',
  },
  oracle: {
    id: 'oracle', name: 'Oracle Database', family: '关系型 · 企业关键业务', license: 'Commercial',
    positioning: '面向大型企业关键业务、复杂事务和成熟治理流程的商业数据库平台。',
    model: '关系模型为核心，支持对象、JSON、XML、空间、图与多租户容器。', query: 'Oracle SQL 与 PL/SQL；分析函数、层次查询、包和过程生态深厚。',
    transactions: ['成熟 MVCC 与一致性读', '默认 Read Committed', 'RAC 与 Data Guard 覆盖高可用场景'],
    indexes: ['B-tree、Bitmap、函数、分区与域索引', '自动索引能力依版本和许可', '优化器依赖统计信息和计划管理'],
    scaling: ['RAC 横向扩展单数据库服务', 'Data Guard 灾备与读副本', 'Sharding 为特定版本能力'],
    deployment: ['本地专有基础设施', 'Oracle Cloud 与 Exadata', '没有浏览器 WASM 版本'],
    useCases: ['银行、电信、ERP 等关键系统', '复杂 PL/SQL 存量平台', '需要完整商业支持和审计能力'],
    limitations: ['许可成本和合规管理复杂', '平台专有能力造成迁移锁定', '需要专业 DBA 与容量治理'],
    recommendation: '只有关键业务能力、既有资产或商业支持要求能够覆盖成本时采用；普通新应用通常存在更轻量选择。',
  },
  duckdb: {
    id: 'duckdb', name: 'DuckDB', family: '分析型 · 嵌入式 OLAP', license: 'MIT',
    positioning: '面向进程内分析的列式数据库，可直接查询 Parquet、CSV、JSON 和 Arrow 数据。',
    model: '关系模型、向量化列式执行和嵌套类型；强调本地数据分析。', query: '接近 PostgreSQL 的分析 SQL，提供丰富文件扫描、列表和结构体函数。',
    transactions: ['单进程内 ACID', '面向批量分析而非高并发 OLTP', '查询在连接上顺序执行'],
    indexes: ['自适应基数树索引', '列式统计信息和跳过扫描', '性能重点通常是向量化与文件裁剪'],
    scaling: ['单节点垂直扩展', '直接处理对象存储和本地文件', '不提供分布式协调服务'],
    deployment: ['Python/R/Node/Java 等进程内客户端', 'CLI 与服务封装', '官方 DuckDB-Wasm 浏览器运行时'],
    useCases: ['本地数据探索与 Notebook', '浏览器内 CSV/Parquet 分析', '数据管道中的嵌入式转换'],
    limitations: ['不适合大量并发短事务', '浏览器受内存、线程和 CORS 约束', '不是共享业务主库'],
    recommendation: '分析数据就在文件或当前进程中，并且不值得部署数据仓库服务时优先 DuckDB。', liveEngine: 'duckdb',
  },
  clickhouse: profile('clickhouse', 'ClickHouse', '分析型 · 分布式 OLAP', 'Apache 2.0', '面向实时分析和大规模事件数据的列式数据库。', '列式 MergeTree 表与分区分片。', 'ClickHouse SQL，支持数组、窗口、近似聚合和物化视图。', ['高吞吐事件分析', '可观测性与日志', '用户行为分析'], ['不适合作为强事务业务主库', '更新删除成本高于 OLTP', '分区和排序键错误代价较大']),
  tidb: profile('tidb', 'TiDB', '分布式 SQL · HTAP', 'Apache 2.0', '兼容 MySQL 协议的分布式 SQL 与混合事务分析平台。', '关系模型，计算与存储分离，TiKV 行存与 TiFlash 列存。', 'MySQL 方言兼容层，复杂功能兼容度需逐项验证。', ['需要水平扩展的 MySQL 工作负载', '强一致分布式事务', 'HTAP 混合负载'], ['集群组件与运维复杂', '跨区域事务延迟', '并非所有 MySQL 特性完全兼容']),
  cockroachdb: profile('cockroachdb', 'CockroachDB', '分布式 SQL · 强一致', 'BSL / Commercial', '面向故障恢复和跨区域部署的 PostgreSQL 协议分布式 SQL。', '分片的关系键值模型与 Raft 复制。', 'PostgreSQL wire protocol 与相近 SQL 方言。', ['跨区域高可用业务', '需要水平扩展的事务系统', '自动分片和副本调度'], ['高争用事务代价高', '与 PostgreSQL 并非完全兼容', '跨区域拓扑设计复杂']),
  snowflake: profile('snowflake', 'Snowflake', '云数据仓库', 'Commercial SaaS', '计算存储分离的全托管云数据平台。', '列式微分区、半结构化 VARIANT 与共享数据。', 'Snowflake SQL，覆盖分析、任务、流和数据应用。', ['企业数据仓库', '跨团队安全数据共享', '弹性分析计算'], ['成本治理依赖良好仓库策略', '平台锁定', '不适合低延迟 OLTP']),
  bigquery: profile('bigquery', 'BigQuery', 'Serverless 数据仓库', 'Commercial SaaS', 'Google Cloud 的无服务器大规模分析服务。', '列式存储、分区聚簇与嵌套重复字段。', 'GoogleSQL，支持数组、结构体、地理与机器学习函数。', ['海量日志和事件分析', 'GCP 数据生态', '按查询或容量计费的仓库'], ['扫描成本需要主动控制', '低延迟逐行事务不是目标', '平台和区域约束']),
  mongodb: nosql('mongodb', 'MongoDB', '文档数据库', 'SSPL / Commercial', '以 BSON 文档和灵活 Schema 为核心的通用 NoSQL 数据库。', 'MongoDB Query API 与 Aggregation Pipeline。', ['内容与产品目录', '事件和应用对象', 'Schema 快速演进'], ['跨文档建模仍需谨慎', 'JOIN 能力不同于关系数据库', '没有可靠浏览器 WASM 内核']),
  couchdb: nosql('couchdb', 'Apache CouchDB', '文档数据库 · 同步', 'Apache 2.0', '以 HTTP、JSON 文档、MVCC 和多主复制为核心。', 'Mango Query、MapReduce View 与 HTTP API。', ['离线同步和多主复制', '边缘节点数据收集', 'HTTP 原生文档存储'], ['查询能力弱于关系数据库', '冲突需要应用处理', '压缩与 View 维护有成本']),
  redis: nosql('redis', 'Redis', '内存数据结构', 'RSALv2 / SSPLv1 / AGPLv3 by version', '以低延迟数据结构操作为核心的内存数据库。', '命令协议、Lua/Functions 与模块查询。', ['缓存、会话和限流', '排行榜与实时计数', 'Stream 消息处理'], ['内存成本高', '持久化和一致性需明确权衡', '浏览器中没有正式 Redis WASM']),
  valkey: nosql('valkey', 'Valkey', '内存数据结构', 'BSD 3-Clause', 'Linux Foundation 治理、兼容 Redis OSS 生态的键值数据库。', 'RESP 命令协议与数据结构命令。', ['开源 Redis 兼容替代', '缓存与实时数据结构', '现有 RESP 客户端生态'], ['生态仍在快速演进', '兼容边界需随版本验证', '持久数据仍受内存模型影响']),
  dynamodb: nosql('dynamodb', 'Amazon DynamoDB', '托管 Key-Value / 文档', 'Commercial SaaS', 'AWS 全托管、按分区键扩展的低延迟数据库。', 'Get/Put/Query/Scan、PartiQL 与事务 API。', ['AWS Serverless 应用', '大规模键值访问', '全球表和事件驱动'], ['访问模式必须前置设计', 'Scan 和热点分区代价高', '平台锁定明显']),
  cassandra: nosql('cassandra', 'Apache Cassandra', '宽列数据库', 'Apache 2.0', '面向多节点持续可用和高写入吞吐的宽列数据库。', 'CQL，查询能力围绕分区键和聚簇键设计。', ['时序和事件写入', '跨机房高可用', '可预测访问模式的大规模数据'], ['不支持任意 JOIN 与聚合', '数据模型必须按查询反向设计', '修复和压缩需要运维经验']),
  scylladb: nosql('scylladb', 'ScyllaDB', '宽列数据库 · Cassandra 兼容', 'AGPL / Source Available / Commercial', '以 C++ shard-per-core 架构提供 Cassandra 兼容的高吞吐低尾延迟。', 'CQL 与 DynamoDB 兼容 API（Alternator）。', ['高吞吐 Cassandra 工作负载', '低尾延迟事件存储', '减少节点数量的场景'], ['兼容性需按驱动和功能验证', '容量与 shard 调优复杂', '部分高级能力依商业版本']),
  elasticsearch: nosql('elasticsearch', 'Elasticsearch', '搜索与分析引擎', 'Elastic License / SSPL', '基于倒排索引的全文搜索、日志检索和聚合平台。', 'Query DSL、ES|QL、聚合与向量检索。', ['全文搜索', '日志与可观测性', '混合关键词和向量检索'], ['不是事务业务主库', '映射和分片设计影响巨大', '更新和存储放大需控制']),
  opensearch: nosql('opensearch', 'OpenSearch', '搜索与分析引擎', 'Apache 2.0', '社区治理的 Elasticsearch 分支，面向搜索、日志和可观测性。', 'Query DSL、PPL、SQL 与聚合。', ['开源搜索平台', '日志分析和告警', 'AWS 托管搜索生态'], ['与 Elasticsearch 功能继续分化', '集群运维和 JVM 成本', '不是强事务数据库']),
  neo4j: nosql('neo4j', 'Neo4j', '属性图数据库', 'GPL / Commercial', '围绕节点、关系和路径遍历优化的原生图数据库。', 'Cypher 图查询语言。', ['知识图谱', '欺诈检测和关系分析', '推荐与网络拓扑'], ['大规模全图分析需专门产品能力', '建模方式与关系数据库不同', '企业集群能力依许可']),
  influxdb: nosql('influxdb', 'InfluxDB', '时序数据库', 'MIT / Commercial by generation', '面向指标、传感器与时间窗口聚合的时序平台。', 'SQL、InfluxQL 或 Flux 能力取决于产品代际。', ['监控指标', 'IoT 时序数据', '时间窗口聚合和保留策略'], ['不同代际查询与存储架构差异大', '高基数标签需要治理', '不是通用事务数据库']),
  timescaledb: nosql('timescaledb', 'TimescaleDB', 'PostgreSQL 时序扩展', 'Apache 2.0 / Timescale License', '在 PostgreSQL 上增加 hypertable、压缩和连续聚合。', '完整 PostgreSQL SQL 加时序函数。', ['希望保留 SQL 与 JOIN 的时序业务', '监控和金融时间序列', 'PostgreSQL 生态整合'], ['分布式能力和许可边界需确认', '高写入仍需分区与索引治理', '不是独立浏览器 WASM 引擎']),
  browser: {
    id: 'browser', name: 'Browser Database', family: 'NoSQL · 浏览器原生', license: 'Web Standard',
    positioning: '运行在浏览器安全沙箱内的原生数据库，以 IndexedDB 的事务对象仓库存储结构化数据，并与 OPFS 等持久化能力共同构成本地数据层。',
    model: 'IndexedDB 使用数据库、对象仓库、记录、主键和二级索引；OPFS 为 SQLite、PGlite 等浏览器数据库提供文件持久化。',
    query: 'IndexedDB JavaScript API；通过 IDBRequest、事务、Object Store 与 Index 访问数据。',
    transactions: ['IndexedDB 提供只读与读写事务', '事务作用域由对象仓库集合确定', '事件循环中的异步边界会影响事务存活时间'],
    indexes: ['对象仓库按 keyPath 或显式键组织记录', 'IDBIndex 提供派生键查询', '查询能力围绕键、索引和游标，不支持通用 SQL'],
    scaling: ['数据隔离在同源范围内', '容量受浏览器配额和存储回收策略约束', '跨设备同步需要应用协议，不能直接复制内部存储'],
    deployment: ['浏览器内置，无独立服务器', 'Worker 可承载数据库与 OPFS 文件 I/O', '站点数据清理、隐私模式和浏览器兼容性会影响持久化'],
    useCases: ['离线与本地优先 Web 应用', '结构化客户端状态和 Blob', '浏览器内数据库与 WASM 数据库持久化'],
    limitations: ['没有统一 SQL 查询接口', '配额与持久化策略由浏览器控制', '多设备同步、身份和冲突处理由应用负责'],
    recommendation: 'Web 应用需要可靠的本地结构化数据、事务和索引时，应把 Browser Database 作为正式数据库层设计，而不是退化为 localStorage。',
    liveEngine: 'indexeddb',
  },
};

function profile(id: DatabaseBrandId, name: string, family: string, license: string, positioning: string, model: string, query: string, useCases: string[], limitations: string[]): DatabaseProfileData {
  return {
    id, name, family, license, positioning, model, query,
    transactions: ['事务和一致性能力按产品工作负载设计', '必须结合官方隔离级别和失败语义验证', '跨节点事务会引入协调成本'],
    indexes: ['核心访问路径依赖排序键、分区或列式统计', '应使用 EXPLAIN/查询剖析验证', '索引与物化结构会放大写入和存储'],
    scaling: ['支持计算或存储横向扩展', '拓扑、数据分布和热点决定实际扩展效率', '跨区域需要在延迟、一致性和成本间取舍'],
    deployment: ['提供自托管或云托管形态', '浏览器只提供知识页，不模拟服务端集群', '评估时必须验证版本、许可和云平台差异'],
    useCases, limitations,
    recommendation: `当${useCases[0]}是首要目标，且团队能够接受“${limitations[0]}”这一边界时，${name}值得进入概念验证。`,
  };
}

function nosql(id: DatabaseBrandId, name: string, family: string, license: string, positioning: string, query: string, useCases: string[], limitations: string[]): DatabaseProfileData {
  return {
    id, name, family, license, positioning,
    model: `${family}的数据模型围绕主要访问路径设计，不应机械套用关系表范式。`, query,
    transactions: ['事务范围和隔离能力依产品而异', '跨分区或跨文档原子性需要单独确认', '一致性级别必须与业务失败模型共同设计'],
    indexes: ['索引必须服务已知访问模式', '二级索引、全文或向量能力依产品实现', '热点键和高基数字段需要专项治理'],
    scaling: ['通常通过分区与副本横向扩展', '分区键决定数据局部性和负载均衡', '跨区域复制需要明确冲突与一致性策略'],
    deployment: ['以服务端集群或云托管为主', '没有正式 WASM 的产品不提供伪在线运行器', '本地演示应使用真实服务或官方模拟器'],
    useCases, limitations,
    recommendation: `只有当${useCases[0]}带来的模型收益明显高于“${limitations[0]}”的代价时，才应以 ${name} 替代通用关系数据库。`,
  };
}
