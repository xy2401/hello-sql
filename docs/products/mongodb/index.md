# MongoDB 概览

MongoDB 是一款成熟的通用分布式文档型数据库系统，采用灵活的 BSON（二进制 JSON）格式存储数据，支持动态 Schema、丰富的嵌套字段查询与聚合管道（Aggregation Pipeline）。

## 核心技术点

- **数据模型**：Database -> Collection -> Document，文档支持多层嵌套对象与数组。
- **存储引擎**：WiredTiger 引擎，支持行级并发、Snappy 压缩以及内存 Cache 管理。
- **高可用与分片**：原生副本集（Replica Set，Raft 变种选举）与基于分片键的水平分片（Sharded Cluster）。
