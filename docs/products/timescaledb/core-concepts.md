# TimescaleDB 核心知识

## 基础语法范例

```sql
-- 创建普通表并转换为超表
CREATE TABLE metrics (
    recorded_at TIMESTAMPTZ NOT NULL,
    device_id INT NOT NULL,
    cpu_usage DOUBLE PRECISION
);

SELECT create_hypertable('metrics', 'recorded_at');
```
