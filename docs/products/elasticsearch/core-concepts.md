# Elasticsearch 核心知识

> Elasticsearch 是近实时搜索系统。mapping、分析器、Lucene segment、shard 拓扑和生命周期策略决定相关性与集群成本。

## 学习目标

在深入 Elasticsearch 开发与运维前，建议掌握以下能力：

- [x] **能设计 mapping/analyzer**
- [x] **能控制 shard 与 segment**
- [x] **能安全完成大版本 reindex/upgrade**

## 必须建立的核心心智模型

### 01 倒排索引与 Mapping

text 经 analyzer 进入倒排索引，keyword 保留精确值；错误 mapping 很难原地修复。

**关键实践要点：**

- 显式模板
- 控制动态字段爆炸
- 区分 text/keyword

### 02 Shard 与 Segment

每个 shard 是 Lucene 索引，刷新产生 segment，merge 回收删除并重写数据。

**关键实践要点：**

- 避免过多小 shard
- 监控 merge/refresh
- 容量包含副本

### 03 查询与生命周期

Query DSL/ES|QL、聚合、向量和 ILM 共同服务检索与冷热分层。

**关键实践要点：**

- 过滤与评分分离
- 限制深分页
- 用 rollover 管理时序索引

## 工程决策落地指南

| 工程阶段 | 核心决策与行动要点 |
| :--- | :--- |
| **建模前** | 明确读写访问模式、一致性容忍度、数据生命周期与故障预算，再决定表结构、主键类型、分片键与索引策略。 |
| **上线前** | 基于生产规模的数据分布进行并发压测，记录查询计划（Query Plan）、内存/I/O 水位与高可用主从故障切换耗时。 |
| **运行中** | 监控 P95/P99 延迟分位数、连接池水位、长事务/慢查询与存储碎片；所有监控告警均需具备明确的 SOP 处置步骤。 |

## 关联资源

- 🏠 [返回 Elasticsearch 总览](./)
- 📜 [查看版本演进与发布说明](./versions)
- 🐳 [查看 Docker 工具验证证据](./DockerTooling)
