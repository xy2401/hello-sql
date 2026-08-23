# Browser Database 概览

随着 WebAssembly（WASM）与现代 Web API 的演进，浏览器端已具备运行完整独立数据库的能力，成为**本地优先（Local-First）**架构的核心基石。

## 浏览器端数据库生态格局

1. **IndexedDB**：浏览器原生内置的异步键值与对象存储系统。
2. **SQLite-WASM + OPFS**：利用 Origin Private File System 高速私有文件系统实现近原生单机持久化。
3. **PGlite**：把完整的 PostgreSQL 编译为单个轻量 WASM 二进制包，直接在前端支持复杂 SQL、事务与向量计算。
4. **DuckDB-WASM**：前端毫秒级执行百万行数据列式 OLAP 聚合。

## 页面内 Live 实验

<DatabaseWorkbench engine="sqlite" title="浏览器内 SQLite-WASM 实验" />
