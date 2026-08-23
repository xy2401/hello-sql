# TimescaleDB 版本演进

TimescaleDB 作为 PostgreSQL 扩展独立发版，升级需同时核对 PostgreSQL 宿主与扩展版本兼容矩阵。

## 核心版本演进与关键里程碑

### TimescaleDB 2.16（2024 年 7 月）

**主要功能与架构演进：**

- 支持对已启用列存压缩（Compressed Chunks）的数据执行直接 DDL 与原地 UPDATE/DELETE
- 进一步降低连续聚合（Continuous Aggregates）后台刷新开销

**工程影响与选型建议：**

> 极大幅度提升了列式时序历史数据的修改灵活性。

### TimescaleDB 2.13（2023 年 11 月）

**主要功能与架构演进：**

- 全面适配 PostgreSQL 16 宿主版本
- 优化基于时间桶的 SIMD 向量化聚合计算

**工程影响与选型建议：**

> 与新版本 PG 协同的主流生产版本。

### TimescaleDB 2.0（2020 年 12 月）

**主要功能与架构演进：**

- 重构连续聚合 API，支持分布式超表（Distributed Hypertables）
- 引入灵活的数据生命周期管理策略与后台自动化调度作业

**工程影响与选型建议：**

> 2.x 现代化时序扩展的核心基线。

## 扩展在线升级命令
```sql
-- 在连入数据库的新会话中执行
ALTER EXTENSION timescaledb UPDATE;
```
