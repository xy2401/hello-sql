---
pageClass: playground-page
aside: false
---

# DuckDB-Wasm 实验室

DuckDB-Wasm 使用本地打包的 MVP/EH WASM 与浏览器 Worker。本站兼容 GitHub Pages，不依赖跨源隔离，因此采用单线程 bundle。

<DatabaseWorkbench engine="duckdb" title="DuckDB 浏览器分析工作台" />

## 导入文件

导入后文件按原文件名注册，可执行：

```sql
SELECT * FROM read_csv_auto('orders.csv') LIMIT 20;
SELECT * FROM read_json_auto('events.json') LIMIT 20;
SELECT * FROM read_parquet('metrics.parquet') LIMIT 20;
```

官方资料：[DuckDB-Wasm](https://duckdb.org/docs/stable/clients/wasm/overview)、[查询 API](https://duckdb.org/docs/current/clients/wasm/query)。
