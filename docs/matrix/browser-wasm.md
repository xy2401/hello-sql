# 浏览器与 WASM 能力矩阵

<EngineSupportTable />

| 运行环境 | 默认模式 | 持久模式 | Worker | 主要限制 |
| :--- | :--- | :--- | :--- | :--- |
| SQLite WASM | 内存 DB | OPFS SAH Pool | 外层 Dedicated Worker | 同一 pool 不支持并发实例 |
| DuckDB-Wasm | 内存分析 | 文件重新导入 | 外层 Worker + DuckDB Worker | GitHub Pages 档为单线程 |
| PGlite | `memory://` | `idb://` | Dedicated Worker | 单实例 PostgreSQL，不模拟集群 |
| SurrealDB WASM | `mem://` | `indxdb://` | Dedicated Worker | 与服务端功能边界需验证 |
| IndexedDB | 临时命名库 | 版本化工作区 | Dedicated Worker | 事件式事务生命周期 |

## 静态托管策略

所有 WASM 和 Worker 资源由 Vite 构建到独立域名的根路径 `/` 下。运行时不使用 CDN，不要求远程 API，也不假设 COOP/COEP。浏览器能力不足时回退内存并展示原因，不静默伪造持久化成功。
