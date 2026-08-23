# DuckDB 核心知识

## 核心心智模型

### 1. 向量化执行引擎（Vectorized Execution）

与传统行式数据库每次迭代一行的 Volcano 模型不同，DuckDB 每次批量传递一个 DataChunk（通常为 2048 个向量值），极大降低了解释器分支预测失败并充分利用现代 CPU 的 SIMD 指令集。

### 2. 直读文件与格式推断

无需建表即可直接查询文件：

```sql
-- 直接查询远程或本地 Parquet 文件
SELECT category, count(*), avg(price)
FROM 'https://example.com/data/sales_*.parquet'
GROUP BY category;
```
