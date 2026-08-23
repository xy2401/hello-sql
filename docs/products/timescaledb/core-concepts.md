# TimescaleDB 核心知识

> TimescaleDB 是 PostgreSQL 扩展。核心价值来自 hypertable/chunk、连续聚合和列式压缩，同时继承 PostgreSQL 的事务与运维责任。

## 学习目标

在深入 TimescaleDB 开发与运维前，建议掌握以下能力：

- [x] **能设计 chunk interval**
- [x] **能使用连续聚合**
- [x] **能协调 PostgreSQL 与扩展升级**

## 必须建立的核心心智模型

### 01 Hypertable 与 Chunk

hypertable 把时间数据路由到 chunk；chunk 太大影响维护，太小增加规划开销。

**关键实践要点：**

- 按活跃数据量定 interval
- 时间条件必须可裁剪
- 管理旧 chunk

### 02 列式压缩/Hypercore

历史 chunk 可转换为更适合分析的列式组织，segment/order 配置决定压缩和查询收益。

**关键实践要点：**

- 按常用过滤 segment
- 按时间排序
- 理解更新限制

### 03 连续聚合

连续聚合增量维护时间桶结果，并通过 refresh policy 控制新鲜度。

**关键实践要点：**

- 设置合理 lag
- 保留原始数据边界
- 监控 refresh job

## 工程决策落地指南

| 工程阶段 | 核心决策与行动要点 |
| :--- | :--- |
| **建模前** | 明确读写访问模式、一致性容忍度、数据生命周期与故障预算，再决定表结构、主键类型、分片键与索引策略。 |
| **上线前** | 基于生产规模的数据分布进行并发压测，记录查询计划（Query Plan）、内存/I/O 水位与高可用主从故障切换耗时。 |
| **运行中** | 监控 P95/P99 延迟分位数、连接池水位、长事务/慢查询与存储碎片；所有监控告警均需具备明确的 SOP 处置步骤。 |

## 关联资源

- 🏠 [返回 TimescaleDB 总览](./)
- 📜 [查看版本演进与发布说明](./versions)
- 🐳 [查看 Docker 工具验证证据](./DockerTooling)
