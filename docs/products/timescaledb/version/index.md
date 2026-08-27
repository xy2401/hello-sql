# TimescaleDB 版本演进

TimescaleDB 作为 PostgreSQL 扩展独立发版，升级需同时核对 PostgreSQL 宿主与扩展版本兼容矩阵。

## 版本索引

### [TimescaleDB 2.27](./timescaledb-2.27)

- **发布时间：** 2026 年 5 月
- **版本重点：** Hypercore 向量化执行和 bloom filter 能力继续演进，并明确 PostgreSQL 15 退出计划。

### [TimescaleDB 2.16](./timescaledb-2.16)

- **发布时间：** 2024 年 7 月
- **版本重点：** 支持对已启用列存压缩（Compressed Chunks）的数据执行直接 DDL 与原地 UPDATE/DELETE。

### [TimescaleDB 2.13](./timescaledb-2.13)

- **发布时间：** 2023 年 11 月
- **版本重点：** 全面适配 PostgreSQL 16 宿主版本。

### [TimescaleDB 2.0](./timescaledb-2.0)

- **发布时间：** 2020 年 12 月
- **版本重点：** 重构连续聚合 API，支持分布式超表（Distributed Hypertables）。

## 扩展在线升级命令
```sql
-- 在连入数据库的新会话中执行
ALTER EXTENSION timescaledb UPDATE;
```
