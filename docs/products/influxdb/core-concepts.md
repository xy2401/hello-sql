# InfluxDB 核心知识

- **时序数据模型**：Measurement + Tag Set（索引键） + Field Set（度量数值） + Timestamp。
- **架构革新**：InfluxDB 3.0 基于 Apache Arrow、DataFusion 与 Parquet 重新构建，彻底解决了旧版本高基数（High Cardinality）爆炸问题。
