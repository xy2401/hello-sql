# Apache Cassandra 版本演进

Apache Cassandra 以大版本发布，跨大版本升级需按节点滚动执行并遵守 SSTable 版本格式兼容规则。

## 核心版本演进与关键里程碑

### Cassandra 5.0（2024 年 9 月）

**主要功能与架构演进：**

- Storage-Attached Indexing (SAI)：全新设计的二级索引，磁盘空间节省高达 70%，消除历史 2i 瓶颈
- 原生引入 Vector 向量数据类型与近似最近邻检索（ANN）
- 统一压缩策略（Unified Compaction Strategy, UCS）：自动适应读写倾斜负载

**工程影响与选型建议：**

> Cassandra 历史最大规模的功能与性能飞跃。

### Cassandra 4.1（2022 年 12 月）

**主要功能与架构演进：**

- 引入 Guardrails 框架：在服务端强制限制不合理的建表参数（如单表列数、分区大小）
- 支持可插拔的节点间身份鉴权与可观测性指标

**工程影响与选型建议：**

> 防范开发人员反模式建表的治理利器。

### Cassandra 4.0（2021 年 7 月）

**主要功能与架构演进：**

- Zero-Copy Streaming：基于内核 `sendfile` 传输 SSTable，节点扩容与数据重平衡提速高达 5x
- 全面提升 Netty 异步网络通信与垃圾回收效率

**工程影响与选型建议：**

> 4.x 系列的超稳健企业级基线。

### Cassandra 3.11（2017 年 6 月）

**主要功能与架构演进：**

- 引入 SASI（SSTable-Attached Secondary Index）实验特性与物化视图（Materialized Views）
- 完善 CQL 集合操作与轻量级事务（LWT）

**工程影响与选型建议：**

> 长期广泛部署的历史基线（已 EOL，建议全面升级至 4.x/5.0）。

## 滚动升级步骤
1. 升级前先在集群各节点执行 `nodetool repair` 与 `nodetool snapshot`。
2. 逐节点升级二进制并重启，观察 `nodetool describecluster` 中的 Schema Agreement。
3. 全部节点升级后，执行 `nodetool upgradesstables` 将旧版本 SSTable 重写为新格式。
