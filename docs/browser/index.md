# Browser Database 总览

浏览器数据层不是一个 API：IndexedDB 保存结构化记录，OPFS 提供来源私有文件系统，Cache API 保存请求响应，Storage Manager 管理配额和持久化请求。WASM 数据库通常在这些原语之上实现虚拟文件系统。

| 能力 | 数据模型 | 访问方式 | 适合 |
| :--- | :--- | :--- | :--- |
| IndexedDB | Key + 结构化克隆对象 | 异步事务 API | 应用状态、离线数据、Blob |
| OPFS | 文件与目录 | Worker 同步句柄/异步 API | SQLite、PGlite 等 WASM 文件系统 |
| Cache API | Request / Response | Promise API | 离线网络资源 |
| localStorage | 字符串键值 | 主线程同步 | 极少量简单偏好，不适合数据库 |

下一步：[IndexedDB 原理与实践](./indexeddb)。
