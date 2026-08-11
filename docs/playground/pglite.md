---
pageClass: playground-page
aside: false
---

# PGlite / PostgreSQL WASM 实验室

PGlite 是 PostgreSQL 的 WASM 构建。临时模式使用 `memory://`，持久模式使用 `idb://hello-sql-v1-pglite-{workspace}`。

<DatabaseWorkbench engine="pglite" title="PostgreSQL / PGlite 工作台" />

## 与服务端 PostgreSQL 的关系

它适合 SQL 方言学习、前端原型、测试和本地优先应用，但不是多连接服务端集群。复制、高可用、连接池和网络鉴权仍需真实 PostgreSQL 环境。

官方资料：[PGlite](https://pglite.dev/docs/about)、[文件系统](https://pglite.dev/docs/filesystems)。
