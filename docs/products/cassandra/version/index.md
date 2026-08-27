# Apache Cassandra 版本演进

Apache Cassandra 以大版本发布，跨大版本升级需按节点滚动执行并遵守 SSTable 版本格式兼容规则。

## 版本索引

### [Cassandra 5.0](./cassandra-5.0)

- **发布时间：** 2024 年 9 月
- **版本重点：** Storage-Attached Indexing (SAI)：全新设计的二级索引，磁盘空间节省高达 70%，消除历史 2i 瓶颈。

### [Cassandra 4.1](./cassandra-4.1)

- **发布时间：** 2022 年 12 月
- **版本重点：** 引入 Guardrails 框架：在服务端强制限制不合理的建表参数（如单表列数、分区大小）。

### [Cassandra 4.0](./cassandra-4.0)

- **发布时间：** 2021 年 7 月
- **版本重点：** Zero-Copy Streaming：基于内核 sendfile 传输 SSTable，节点扩容与数据重平衡提速高达 5x。

### [Cassandra 3.11](./cassandra-3.11)

- **发布时间：** 2017 年 6 月
- **版本重点：** 引入 SASI（SSTable-Attached Secondary Index）实验特性与物化视图（Materialized Views）。

## 滚动升级步骤
1. 升级前先在集群各节点执行 `nodetool repair` 与 `nodetool snapshot`。
2. 逐节点升级二进制并重启，观察 `nodetool describecluster` 中的 Schema Agreement。
3. 全部节点升级后，执行 `nodetool upgradesstables` 将旧版本 SSTable 重写为新格式。
