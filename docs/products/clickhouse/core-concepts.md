# ClickHouse 核心知识

## 核心心智模型

### 1. MergeTree 核心建表规范

```sql
CREATE TABLE events (
    event_date Date,
    user_id UInt64,
    event_type LowCardinality(String),
    payload String
) ENGINE = MergeTree()
PARTITION BY toYYYYMM(event_date)
ORDER BY (event_type, user_id, event_date);
```

- **ORDER BY 是物理排序键**：决定了数据在磁盘上的实际排列顺序，也是主键索引（稀疏索引）的依据。
- **稀疏索引（Sparse Index）**：默认每隔 8192 行记录一个索引标记（Index Mark），索引全部常驻内存，内存开销极小。
- **小批量写入是大忌**：单条插入会产生大量碎零件（Parts），极易触发 `Too many parts in all data parts in table` 报错。写入应保持每批 1000~100000 行。
