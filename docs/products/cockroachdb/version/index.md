# CockroachDB 版本演进

CockroachDB 采用年份与季度版本号（如 v24.1, v23.2），区分 Regular/LTS 维护周期。

## 版本索引

### [CockroachDB v26.1](./cockroachdb-v26.1)

- **发布时间：** 2026 年 2 月
- **版本重点：** 加强企业身份、安全与合规集成，是截至核对日的当前重要版本线。

### [CockroachDB v24.1](./cockroachdb-v24.1)

- **发布时间：** 2024 年 5 月
- **版本重点：** 分布式 SQL 引擎针对复杂 JOIN 与窗口函数进行物理执行流水线优化。

### [CockroachDB v23.2](./cockroachdb-v23.2)

- **发布时间：** 2023 年 11 月
- **版本重点：** 引入物理存储空间自动重平衡（Auto-Rebalancing）限流控制，避免突发 I/O 挤占核心事务。

### [CockroachDB v22.2](./cockroachdb-v22.2)

- **发布时间：** 2022 年 11 月
- **版本重点：** 重构底层存储引擎为 Pebble（基于 Go 开发的 LSM-Tree，全面替代 C++ RocksDB）。

## 升级路径
- 必须严格遵循相邻版本升级路径（例如从 v22.2 -> v23.1 -> v23.2 -> v24.1），不可跳跃升级。
