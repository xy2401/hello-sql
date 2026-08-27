# SQL Server 版本演进

SQL Server 以年份版本交付，配合累积更新（Cumulative Update, CU）持续修复安全与稳定性。

## 版本索引

### [SQL Server 2025（17.x）](./sql-server-2025)

- **发布时间：** 2025 年
- **版本重点：** 加入向量数据类型、向量函数和向量索引能力。

### [SQL Server 2022](./sql-server-2022)

- **发布时间：** 2022 年 11 月
- **版本重点：** 智能查询处理（Intelligent Query Processing, IQP）全面扩展：参数敏感计划优化（PSP 优化）解决参数嗅探痛点。

### [SQL Server 2019](./sql-server-2019)

- **发布时间：** 2019 年 11 月
- **版本重点：** 大数据集群（Big Data Clusters）与数据虚拟化（PolyBase 增强）。

### [SQL Server 2017](./sql-server-2017)

- **发布时间：** 2017 年 10 月
- **版本重点：** 首次正式支持在 Linux 操作系统与 Docker 容器环境跨平台运行。

### [SQL Server 2016](./sql-server-2016)

- **发布时间：** 2016 年 6 月
- **版本重点：** 引入 Query Store（查询存储区）持久化执行计划历史。

## 升级建议
- 升级实例版本后，建议保持原有 `COMPATIBILITY_LEVEL` 运行并观察 Query Store，确认无计划回归后再提升数据库兼容级别。
