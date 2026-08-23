# Apache Cassandra 版本演进

> **版本模型**：Apache Cassandra 以大版本和补丁线维护；跨大版本升级需逐节点滚动并遵守 SSTable/协议兼容要求。

## 版本发布规律与生命周期

- **发布策略**：Apache Cassandra 以大版本和补丁线维护；跨大版本升级需逐节点滚动并遵守 SSTable/协议兼容要求。
- **官方权威发布说明**：[查看 Apache Cassandra 官方 Release Notes ↗](https://cassandra.apache.org/doc/stable/cassandra/new/)

## 主流版本线与关键特性

### Cassandra 5.0

**关键功能与演进：**

- SAI、Trie memtable/SSTable、向量类型与 Unified Compaction
- 要求 JDK 17 并包含新 guardrail

**工程影响与选型建议：**

> 索引和压缩收益大，但必须先验证硬件与运维工具。

### Cassandra 4.1

**关键功能与演进：**

- 配置、guardrail 和可观测性增强
- 从 4.0 升级相对平滑

**工程影响与选型建议：**

> 适合作为迁往 5.0 前的兼容基线。

### Cassandra 4.0

**关键功能与演进：**

- 一致性、修复和性能的重要成熟基线
- 旧 3.x 迁移需要分阶段

**工程影响与选型建议：**

> 升级前完成 repair 并清理不兼容 SSTable。

## 生产升级检查清单

跨版本或主版本升级时，建议按顺序核对以下事项：

1. **升级前完成 repair 与快照**
2. **逐节点升级并观察 schema agreement**
3. **验证驱动协议、JDK、压缩和 SSTable 工具**

::: warning 官方依据声明
补丁号、生命周期支持期限（EOL）、预览功能和许可协议会随时间演进。生产环境变更前，请始终以 [Apache Cassandra 官方发布说明](https://cassandra.apache.org/doc/stable/cassandra/new/) 为最终依据，勿仅凭文档标题推断当前最新版本。
:::
