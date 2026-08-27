# Browser Database 版本演进

浏览器端数据库随 W3C Web 标准演进，能力基线由宿主浏览器内核版本决定。

## 版本索引

### [OPFS + SyncAccessHandle 普及](./opfs-syncaccesshandle)

- **发布时间：** 2023 年 3 月
- **版本重点：** Safari 16.4、Chrome 102+、Firefox 111+ 全量普及 Origin Private File System 与专属 Worker 高速同步句柄。

### [IndexedDB 3.0 规范草案](./indexeddb-3.0)

- **发布时间：** 2021 年起持续演进
- **版本重点：** 进一步收紧事务生命周期与 Promise/Async 协作边界。

### [IndexedDB 2.0 W3C 推荐标准](./indexeddb-2.0-w3c)

- **发布时间：** 2018 年 1 月
- **版本重点：** 引入二进制数据支持（ArrayBuffer 键与值）、getAll() 批量查询优化。

## 前端数据库架构建议
- 关键持久化业务推荐采用 **Worker + OPFS + SQLite-WASM / PGlite**，并通过 Web Locks API 协调多标签页并发。
