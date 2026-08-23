---
title: Docker、连接 CLI 与查询证据
description: 对比 25 个数据库产品的容器形态、客户端命令、结构查看、查询闭环和验证等级
---

# Docker、连接 CLI 与查询证据

所有 25 个产品都有条目，但并非都适合本地容器。状态分为：可由无凭证 CI 实测、需要云凭证、受限官方镜像、浏览器环境不适用。

| 类别 | 产品 | 代表 CLI / 接口 | 采集方式 |
| :--- | :--- | :--- | :--- |
| 关系型 | PostgreSQL、MySQL、MariaDB、SQL Server、CockroachDB、TiDB、TimescaleDB | `psql`、`mysql`、`mariadb`、`sqlcmd`、`cockroach` | 服务容器 + 客户端闭环 |
| 嵌入式 | SQLite、DuckDB | `sqlite3`、`duckdb` | 官方基础镜像安装锁定 CLI，查询文件数据库 |
| 企业受限 | Oracle | `sqlplus` | 仅官方镜像可合法无登录拉取时实测 |
| 分析/文档 | ClickHouse | `clickhouse-client` | 服务容器 + 原生 CLI |
| 文档/搜索 | MongoDB、CouchDB、Elasticsearch、OpenSearch | `mongosh`、HTTP JSON API | 原生查询和 explain/status |
| KV/流 | Redis、Valkey、DynamoDB Local | `redis-cli`、`valkey-cli`、AWS CLI | 固定数据写入、读取与结构复查 |
| 宽列 | Cassandra、ScyllaDB | `cqlsh`、`nodetool` | CQL 会话与 tracing |
| 图 | Neo4j | `cypher-shell` | Cypher + `SHOW INDEXES` + `PROFILE` |
| 时序 | InfluxDB | `influx` / HTTP | 固定 points、查询与 bucket 状态 |
| 云服务 | Snowflake、BigQuery | `snow`、`bq` | 只验证官方 CLI；查询需凭证，明确未执行 |
| 浏览器 | Browser Database | IndexedDB / Storage API | Docker 不适用，链接浏览器 Playground |

每个产品页展示自己的连接命令、查询会话规格、快照状态和明确限制。非 SQL 产品使用真实原生接口，不强行包装成 SQL。
