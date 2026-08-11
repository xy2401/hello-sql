---
pageClass: playground-page
aside: false
---

# IndexedDB Live

IndexedDB 不是 SQL 数据库。本页编辑器运行 JavaScript，提供 `helpers.getAll`、`getByIndex`、`put`、`remove` 和 `count`，底层仍是真实对象仓库、索引与事务。

<DatabaseWorkbench engine="indexeddb" title="IndexedDB JavaScript 工作台" />

默认数据库包含 `books` 对象仓库，以及 `by_author`、`by_rating` 两个索引。返回数组会显示为结果表，`console.log` 会进入消息区域。
