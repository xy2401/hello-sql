# IndexedDB 原理与实践

IndexedDB 保存由结构化克隆算法支持的 JavaScript 值。数据库升级通过 `versionchange` 事务创建对象仓库和索引；普通读写必须在显式事务范围内完成。

## 核心对象

- `IDBDatabase`：连接与版本生命周期。
- `IDBTransaction`：原子操作范围，完成后不可复用。
- `IDBObjectStore`：以 keyPath 或显式键保存记录。
- `IDBIndex`：根据派生键访问记录。
- `IDBRequest`：传统事件式异步结果。

## 页面内 Live

::: tip 在线实验环境
可在 [IndexedDB 在线工作台](/playground/indexeddb) 交互式执行 IndexedDB 对象仓库与索引操作。
:::

规范：[Indexed Database API 3.0](https://www.w3.org/TR/IndexedDB/)。
