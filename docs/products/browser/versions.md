# Browser Database 版本演进

浏览器端数据库随 W3C Web 标准演进，能力基线由宿主浏览器内核版本决定。

## 核心版本演进与关键里程碑

### OPFS + SyncAccessHandle 普及（2023 年 3 月）

**主要功能与架构演进：**

- Safari 16.4、Chrome 102+、Firefox 111+ 全量普及 Origin Private File System 与专属 Worker 高速同步句柄
- 使得 SQLite-WASM、PGlite 等关系数据库在浏览器端获得近乎本地 SSD 单机的 I/O 读写性能

**工程影响与选型建议：**

> 开启了本地优先（Local-First）复杂客户端应用的爆发时代。

### IndexedDB 3.0 规范草案（2021 年起持续演进）

**主要功能与架构演进：**

- 进一步收紧事务生命周期与 Promise/Async 协作边界
- 提升批量多键检索与游标遍历效率

**工程影响与选型建议：**

> 现代前端存储基础设施的规范基准。

### IndexedDB 2.0 W3C 推荐标准（2018 年 1 月）

**主要功能与架构演进：**

- 引入二进制数据支持（ArrayBuffer 键与值）、`getAll()` 批量查询优化
- 重命名与索引动态重命名支持

**工程影响与选型建议：**

> 奠定了过去数年浏览器结构化存储的事实标准。

## 前端数据库架构建议
- 关键持久化业务推荐采用 **Worker + OPFS + SQLite-WASM / PGlite**，并通过 Web Locks API 协调多标签页并发。
