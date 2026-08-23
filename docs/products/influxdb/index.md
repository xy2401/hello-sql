# InfluxDB 概览

InfluxDB 是专门针对物联网（IoT）、系统监控指标与时序事件设计的高吞吐时序数据库系统（TSDB）。

## 核心概念与演进

- **时序数据模型**：Measurement（度量） + Tag Set（索引标签） + Field Set（非索引数值） + Timestamp。
- **架构重大飞跃**：InfluxDB 3.0 基于 Apache Arrow、DataFusion 与 Parquet 构建了全新的列式时序内核（InfluxDB 3.0 / IOx），彻底解决了历史版本中的高基数（High Cardinality）爆炸痛点。
