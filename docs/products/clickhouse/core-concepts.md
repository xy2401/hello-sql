# ClickHouse 核心知识

## 1. MergeTree 核心建表与排序键设计

```sql
CREATE TABLE user_events (
    event_date Date,
    tenant_id UInt32,
    user_id UInt64,
    event_type LowCardinality(String),
    cost Float64,
    payload String
) ENGINE = MergeTree()
PARTITION BY toYYYYMM(event_date)
ORDER BY (tenant_id, event_type, user_id, event_date);
```

- **ORDER BY 决定物理存储排序**：查询过滤条件如果能命中 `ORDER BY` 的前缀列，ClickHouse 即可通过稀疏索引跳过 99% 以上无关数据块。
- **小批量写入禁忌**：单条插入会产生海量零碎 Parts，引发 `Too many parts` 崩溃。单次写入必须批量提交（建议批次 1000 ~ 100000 行）。
