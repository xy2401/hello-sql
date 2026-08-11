# 分析、分布式与云 SQL

这些产品仍提供 SQL，但优化目标分别是本地分析、实时 OLAP、分布式事务或云数据仓库。不能因为“都会 SELECT”就互相替代。

| 数据库 | 执行定位 | 状态管理 | 典型场景 |
| :--- | :--- | :--- | :--- |
| [DuckDB](./duckdb/) | 进程内列式 OLAP | 本地文件/内存 | 数据探索、嵌入式分析 |
| [ClickHouse](./clickhouse/) | 分布式实时 OLAP | MergeTree 集群 | 日志、事件、可观测性 |
| [TiDB](./tidb/) | 分布式 HTAP | TiKV + TiFlash | MySQL 兼容水平扩展 |
| [CockroachDB](./cockroachdb/) | 强一致分布式 SQL | Raft ranges | 跨区域事务 |
| [Snowflake](./snowflake/) | 云数据仓库 | 计算存储分离 | 企业分析与共享 |
| [BigQuery](./bigquery/) | Serverless 仓库 | 托管列式存储 | 超大规模批量分析 |
