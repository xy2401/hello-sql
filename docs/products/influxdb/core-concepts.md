# InfluxDB 核心知识

## 技术要点

- **高基数控制**：在 InfluxDB 1.x/2.x 中，Tag 的不同取值组合会构成时间线（Series），避免将高离散度 UUID 放入 Tag；InfluxDB 3.0 则利用 Parquet 列式存储大幅放宽了限制。
