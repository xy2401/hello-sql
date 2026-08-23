# DuckDB 概览

DuckDB 是一款专为在线分析处理（OLAP）设计的进程内（In-process）列式 SQL 数据库引擎，被广泛誉为“分析领域的 SQLite”。它无需独立守护进程即可直接嵌入在 Python、R、Node.js、C++ 或浏览器环境中使用。

## 架构形态与关键属性

| 属性维度 | 规格与技术实现 |
| :--- | :--- |
| **数据模型** | 列式存储（Columnar Storage），支持关系表、嵌套 Struct、List、Map 与 Array。 |
| **查询引擎** | 向量化执行引擎（Vectorized Execution Engine），以 DataChunk（通常 2048 行）为批次流式传递。 |
| **开源许可证** | MIT License（商业完全自由）。 |
| **运行形态** | 进程内嵌入式运行、单文件存储、WebAssembly（DuckDB-WASM）。 |

## 模型与查询范式

DuckDB 最大的特色是能够零拷贝直读 Parquet、CSV、Arrow 和远程对象存储文件：

```sql
-- 直接查询 S3 或本地的 Parquet 文件并进行列式聚合
SELECT 
    date_trunc('month', sale_time) AS sale_month,
    category,
    count(*) AS total_transactions,
    round(sum(amount), 2) AS total_revenue,
    approx_count_distinct(customer_id) AS unique_customers
FROM 's3://my-lakehouse/sales_2026_*.parquet'
WHERE status = 'COMPLETED'
GROUP BY 1, 2
ORDER BY 1 DESC, total_revenue DESC;
```

## 页面内 Live 实验

<DatabaseWorkbench engine="duckdb" title="DuckDB Live" />
