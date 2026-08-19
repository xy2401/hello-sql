---
pageClass: playground-page
aside: false
---

# WASM 数据库工作台

五个运行环境都在浏览器本地 Dedicated Worker 中初始化。切换引擎会关闭旧 Worker；SQL 只在点击“运行”或按 `Ctrl/⌘ + Enter` 时执行。

<DatabaseWorkbench allow-engine-switch />

## 运行边界

- 默认工作区每次加载干净样例；打开“本地持久工作区”后才写入 OPFS 或 IndexedDB。
- SQLite、PGlite 与 IndexedDB 支持导出数据库或数据；DuckDB 支持注册本地 CSV、JSON、Parquet 文件。
- 结果最多展示 1,000 行；超时会终止 Worker，避免卡住文档页面。
- 所有资产随站点构建，不从运行时 CDN 下载，也不连接远程数据库。
