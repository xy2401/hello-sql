# 数据库 WASM 成熟度目录

“可以编译成 WASM”不等于“适合在浏览器作为数据库使用”。本站按上游维护、Worker 支持、持久化、包发布和跨浏览器验证分级。

| 项目 | 对应数据库 | 级别 | 持久化 | 本站策略 |
| :--- | :--- | :--- | :--- | :--- |
| SQLite WASM | SQLite | 核心 | OPFS / 内存 | 正式 Live |
| DuckDB-Wasm | DuckDB | 核心 | 内存与文件导入 | 正式 Live |
| PGlite | PostgreSQL | 核心 | IndexedDB / 内存 | 正式 Live |
| `@surrealdb/wasm` | SurrealDB | 核心 | IndexedDB / 内存 | 正式 Live |
| IndexedDB | Browser API | 原生 | 浏览器存储 | 正式 Live，JavaScript API |
| sql.js | SQLite | 社区成熟 | 内存，应用自行保存 | 目录收录，不重复提供内核 |
| wa-sqlite | SQLite | 社区成熟 | 多种 VFS | 目录收录，适合研究 VFS |
| absurd-sql | SQLite | 历史实验 | IndexedDB | 只保留架构参考 |
| MySQL / MariaDB 浏览器移植 | MySQL 系 | 实验 | 不统一 | 不提供伪 Live |
| Redis / Valkey 浏览器移植 | Redis 系 | 实验 | 不统一 | 不提供伪 Live |

## 收录字段

每次升级记录包版本、上游地址、许可证、Worker 模型、持久化方式、最后验证日期和已知限制。只有核心级项目进入自动化浏览器测试。
