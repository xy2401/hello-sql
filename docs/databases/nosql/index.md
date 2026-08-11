# 主流 NoSQL：先选模型，再选产品

NoSQL 不是一种数据库，也不是“不要 Schema”。它是一组围绕特定访问模式、扩展方式或一致性选择设计的数据系统。

| 模型 | 产品 | 关键问题 |
| :--- | :--- | :--- |
| 文档 | [MongoDB](./mongodb/)、[CouchDB](./couchdb/) | 文档边界是否与事务边界一致？ |
| Key-Value | [Redis](./redis/)、[Valkey](./valkey/)、[DynamoDB](./dynamodb/) | 键设计能否覆盖所有访问路径？ |
| 宽列 | [Cassandra](./cassandra/)、[ScyllaDB](./scylladb/) | 分区键是否避免热点与超大分区？ |
| 搜索 | [Elasticsearch](./elasticsearch/)、[OpenSearch](./opensearch/) | 它是派生索引还是业务事实源？ |
| 图 | [Neo4j](./neo4j/) | 核心查询是否真的是多跳关系？ |
| 时序 | [InfluxDB](./influxdb/)、[TimescaleDB](./timescaledb/) | 写入、保留、降采样和高基数如何治理？ |

## 一条重要边界

没有正式浏览器运行内核的服务端数据库不会在本站伪装成 WASM Live。相关页面专注模型、查询和工程选型；可运行多模型示例使用 SurrealDB WASM 明确标注。
