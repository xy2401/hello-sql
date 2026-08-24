# Hello SQL - 数据库产品总览

**22 款可自托管、嵌入式或浏览器本地运行的数据库，使用统一结构讲解。**

---

## 📖 导航说明

所有数据库采用**扁平化目录结构**，直接按产品名称组织，不再分 `sql/`、`analytical/`、`nosql/` 等分类嵌套。

分类信息通过元数据标签展示（见每个数据库首页顶部），便于灵活筛选和对比。

---

## 💾 SQL 族关系型数据库 (6)

支持标准 SQL 查询、ACID 事务、强一致性：

- [PostgreSQL](/products/postgresql/) - 开源首选，功能最全面
- [MySQL](/products/mysql/) - Web 应用事实标准
- [MariaDB](/products/mariadb/) - MySQL 分支，增强兼容性与性能
- [SQLite](/products/sqlite/) - 嵌入式数据库王者
- [SQL Server](/products/mssqlserver/) - Microsoft 企业级方案
- [Oracle](/products/oracle/) - 传统企业数据库标杆

---

## 📊 分析型数据库 (4)

列式存储、MPP 架构、适合大规模数据分析：

- [DuckDB](/products/duckdb/) - 嵌入式分析数据库
- [ClickHouse](/products/clickhouse/) - Yandex 开源，实时 OLAP
- [TiDB](/products/tidb/) - PingCAP 分布式 NewSQL
- [CockroachDB](/products/cockroachdb/) - Google Spanner 开源版

---

## 🗃️ NoSQL 与浏览器数据库 (12)

多模型、灵活 schema、高扩展性：

### KV / 文档
- [MongoDB](/products/mongodb/) - 文档数据库领导者
- [CouchDB](/products/couchdb/) - 复制与同步专长
- [Redis](/products/redis/) / [Valkey](/products/valkey/) - 内存 KV 缓存与消息
- [Cassandra](/products/cassandra/) / [ScyllaDB](/products/scylladb/) - 宽表存储

### 搜索引擎
- [Elasticsearch](/products/elasticsearch/) / [OpenSearch](/products/opensearch/) - 全文检索与日志分析

### 图数据库
- [Neo4j](/products/neo4j/) - 图数据库标准

### 时序数据库
- [InfluxDB](/products/influxdb/) / [TimescaleDB](/products/timescaledb/) - 时间序列数据专用

### 浏览器数据库
- [Browser Database](/products/browser/) - 浏览器原生数据库，覆盖 IndexedDB、OPFS、存储配额与本地优先同步

---

## 🔍 快速筛选

使用浏览器数据库的**标签筛选功能**或访问**[数据库对比矩阵](/matrix/)**查看能力边界。

详细分类依据：
- **Category**: `sql` / `analytical` / `nosql`
- **WASM**: 是否支持浏览器 WASM 运行
- **Deployment**: 部署模式（嵌入式 / 客户端 - 服务器 / 云原生）

---

## 🧪 WASM 实验环境

部分数据库支持在浏览器中直接运行（无需后端）：

| 数据库 | 实验环境 | 说明 |
|--------|---------|------|
| SQLite | [在线工作台](/playground/sqlite) | OPFS 持久化存储 |
| PostgreSQL | [PGlite](/playground/pglite) | WebAssembly 版本 |
| DuckDB | [DuckDB-Wasm](/playground/duckdb) | 分析型 WASM |
| SurrealDB | [SurrealDB WASM](/playground/surrealdb) | 多模型云原生 |

详见 [WASM 数据库实验台](/playground/catalog)。
