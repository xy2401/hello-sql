# Apache Cassandra 核心知识

> Cassandra 要按查询反向设计表。分区键、聚簇顺序、一致性级别、压缩和 tombstone 是性能与可靠性的共同基础。

## 学习目标

在深入 Apache Cassandra 开发与运维前，建议掌握以下能力：

- [x] **能设计有界分区**
- [x] **能计算一致性条件**
- [x] **能治理 compaction 与 tombstone**

## 必须建立的核心心智模型

### 01 查询驱动建模

每张表服务明确查询，分区键定位节点，聚簇列定义分区内排序。

**关键实践要点：**

- 避免跨分区扫描
- 限制分区大小
- 为每个访问模式建表

### 02 一致性与修复

副本数 N、读写一致性 R/W 决定可用性与一致性；repair 修复副本差异。

**关键实践要点：**

- 记录 consistency level
- 规划增量 repair
- 处理 hinted handoff 边界

### 03 LSM、压缩与 Tombstone

写入先到 memtable/WAL，再形成 SSTable；删除产生 tombstone，压缩负责合并。

**关键实践要点：**

- 按工作负载选 UCS/STCS/LCS
- 避免 tombstone storm
- 监控 pending compaction

## 工程决策落地指南

| 工程阶段 | 核心决策与行动要点 |
| :--- | :--- |
| **建模前** | 明确读写访问模式、一致性容忍度、数据生命周期与故障预算，再决定表结构、主键类型、分片键与索引策略。 |
| **上线前** | 基于生产规模的数据分布进行并发压测，记录查询计划（Query Plan）、内存/I/O 水位与高可用主从故障切换耗时。 |
| **运行中** | 监控 P95/P99 延迟分位数、连接池水位、长事务/慢查询与存储碎片；所有监控告警均需具备明确的 SOP 处置步骤。 |

## 关联资源

- 🏠 [返回 Apache Cassandra 总览](./)
- 📜 [查看版本演进与发布说明](./versions)
- 🐳 [查看 Docker 工具验证证据](./DockerTooling)
