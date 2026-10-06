# DuckDB 总览

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

::: tip 在线实验环境
可在 [DuckDB 在线工作台](/playground/duckdb) 直接在浏览器中执行高速列式分析查询。
:::

## 适用边界

适合嵌入式列式分析；浏览器 WASM 受内存与文件访问能力限制，不能代表服务端大规模工作负载。

## 版本阅读范围

[完整版本目录](./version/)收录本仓库已有专题（如 duckdb-0.10、duckdb-0.9、duckdb-1.0）。这些是教学与兼容性对照入口；运行环境的具体版本以安装页、工作台或采集证据为准。

## 推荐学习路线

[安装与环境](./install) → [核心概念](./core-concepts) → [命令行工具](./cli) → [完整版本目录](./version/)。先完成最小示例，再阅读版本差异。

## 实验入口与范围

[浏览器实验台](/playground/duckdb)可以执行本地示例。 [Docker 验证证据](./DockerTooling)列出本产品已采集结果与缺口；阅读证据不等同于启动服务或证明所有功能已验证。
