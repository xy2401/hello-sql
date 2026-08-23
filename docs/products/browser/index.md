# Browser Database 概览

随着 WebAssembly（WASM）与现代 Web API 的演进，浏览器已不仅是前端渲染终端，更具备运行完整独立数据库的能力，成为**本地优先（Local-First）**架构的核心基石。

## 浏览器端数据库生态格局

1. **IndexedDB**：浏览器原生内置的异步键值与对象存储系统。
2. **SQLite-WASM + OPFS**：将 SQLite 编译为 WASM，利用 Origin Private File System（私有文件系统）的高速 SyncAccessHandle 实现近乎原生单机性能的本地持久化。
3. **PGlite**：把完整的 PostgreSQL 内核精简编译为单个 3MB WASM 二进制包，在浏览器端支持复杂 SQL、事务与向量运算。
4. **DuckDB-WASM**：浏览器端执行数百万行数据即时 OLAP 分析与 Parquet 处理。

## 页面内 Live 实验

<DatabaseWorkbench engine="sqlite" title="浏览器内 SQLite-WASM 实验" />
