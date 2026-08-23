# CockroachDB 核心知识

> CockroachDB 默认提供分布式 Serializable 事务。核心学习点是 Range/Raft、leaseholder、事务重试和多区域 locality。

## 学习目标

在深入 CockroachDB 开发与运维前，建议掌握以下能力：

- [x] **能解释 Range 与副本**
- [x] **能正确处理序列化重试**
- [x] **能设计多区域表局部性**

## 必须建立的核心心智模型

### 01 Range 与 Raft

键空间自动切为 Range，每个 Range 通过 Raft 复制；leaseholder 通常服务一致性读。

**关键实践要点：**

- 关注热点 Range
- 理解 rebalancing
- 容量按副本数计算

### 02 Serializable 与重试

并发冲突可能返回可重试错误，应用和驱动需要正确的事务重试循环。

**关键实践要点：**

- 事务保持短小
- 使用稳定幂等逻辑
- 监控 contention events

### 03 多区域局部性

REGIONAL BY ROW/TABLE 与 GLOBAL 表在延迟、存活和一致性之间做不同取舍。

**关键实践要点：**

- 先定义 survival goal
- 让数据靠近写入者
- 量化跨区域提交延迟

## 工程决策落地指南

| 工程阶段 | 核心决策与行动要点 |
| :--- | :--- |
| **建模前** | 明确读写访问模式、一致性容忍度、数据生命周期与故障预算，再决定表结构、主键类型、分片键与索引策略。 |
| **上线前** | 基于生产规模的数据分布进行并发压测，记录查询计划（Query Plan）、内存/I/O 水位与高可用主从故障切换耗时。 |
| **运行中** | 监控 P95/P99 延迟分位数、连接池水位、长事务/慢查询与存储碎片；所有监控告警均需具备明确的 SOP 处置步骤。 |

## 关联资源

- 🏠 [返回 CockroachDB 总览](./)
- 📜 [查看版本演进与发布说明](./versions)
- 🐳 [查看 Docker 工具验证证据](./DockerTooling)
