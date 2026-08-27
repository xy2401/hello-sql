# ClickHouse 版本演进

ClickHouse 采用日历版本号，每年发布 2 个 **LTS（长期支持版，维护 1 年）** 以及按月的 Feature 版本。

## 版本索引

### [ClickHouse 26.3 LTS](./clickhouse-26.3)

- **发布时间：** 2026 年 4 月
- **版本重点：** 异步插入默认启用并统一物化视图去重。

### [ClickHouse 24.8 LTS](./clickhouse-24.8)

- **发布时间：** 2024 年 8 月
- **版本重点：** 正式稳定支持 ClickHouse Keeper 生产特性，彻底移除对 Apache ZooKeeper 的依赖。

### [ClickHouse 24.3 LTS](./clickhouse-24.3)

- **发布时间：** 2024 年 3 月
- **版本重点：** 全新的查询分析器（Analyzer）进入默认启用阶段，支持更复杂的子查询与 CTE 优化。

### [ClickHouse 23.8 LTS](./clickhouse-23.8)

- **发布时间：** 2023 年 8 月
- **版本重点：** 引入高效的倒排索引（Inverted Index）加速大规模文本模糊与全文检索。

### [ClickHouse 22.8 LTS](./clickhouse-22.8)

- **发布时间：** 2022 年 8 月
- **版本重点：** 正式引入 ClickHouse Keeper 作为 Raft 一致性元数据引擎替代 ZooKeeper。

## 生产集群滚动升级检查
- **ZooKeeper 到 Keeper 迁移**：使用 `clickhouse-keeper-converter` 工具在不停机状态下转换元数据快照。
