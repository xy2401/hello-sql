---
pageClass: playground-page
aside: false
---

# SQLite WASM 工作台

本页使用 `@sqlite.org/sqlite-wasm` 的 oo1 API。临时模式使用内存数据库；本地模式在 Worker 内启用 `opfs-sahpool`，因此不要求站点设置 COOP/COEP 响应头。

结果栏的“影响行数”按本次执行前后的 SQLite 累计写入数差值计算：SELECT 为 0，多语句写入相加，包含触发器及级联写入；同批次随后回滚的写入也会被计数，因此它不表示最终提交行数。

<DatabaseWorkbench engine="sqlite" title="SQLite + OPFS SQL Workbench" />

## 适合验证

- DDL、约束、事务和索引。
- `EXPLAIN QUERY PLAN` 与组合索引。
- SQLite 数据库文件导入导出。
- OPFS 持久化与单连接边界。

官方资料：[SQLite WASM](https://sqlite.org/wasm/doc/trunk/index.md)、[OPFS 持久化](https://sqlite.org/wasm/doc/tip/persistence.md)。
