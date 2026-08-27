# InfluxDB 版本演进

InfluxDB 经历了从 1.x -> 2.x -> 3.x 三代截然不同的架构重构，代际之间通常作为数据迁移工程推进。

## 版本索引

### [InfluxDB 3 Core 3.11](./influxdb-3.11)

- **发布时间：** 2026 年
- **版本重点：** 改进 Processing Engine Trigger 可靠性、优雅关闭与存储引擎吞吐。

### [InfluxDB 3.0 (IOx)](./influxdb-3.0)

- **发布时间：** 2023 年 4 月
- **版本重点：** 全新基于 Rust 开发的 Apache Arrow、DataFusion 与 Parquet 存储执行内核。

### [InfluxDB 2.0](./influxdb-2.0)

- **发布时间：** 2020 年 11 月
- **版本重点：** 引入 Flux 函数式脚本查询语言与统一的 Bucket/Token 权限模型。

### [InfluxDB 1.8](./influxdb-1.8)

- **发布时间：** 2020 年 4 月
- **版本重点：** 1.x 系列成熟稳定版，以 InfluxQL 与 Database/Retention Policy 为核心。

## 代际迁移建议
- 1.x/2.x 迁往 3.0 需重新评估查询语句（由 InfluxQL/Flux 转换为标准 SQL），并使用专用的迁移同步工具。
