# Apache CouchDB 概览

Apache CouchDB 是一款以高容错、分布式、离线同步协议为核心特色的文档型 NoSQL 数据库系统，采用 Erlang 开发。

## 核心特性

- **纯 HTTP/JSON REST API**：所有数据库交互（增删改查、设计文档、视图）均通过标准 HTTP 请求完成。
- **多版本并发与追加存储**：底层 B-tree 采用 Append-Only 方式写入，数据永不就地覆写，崩溃安全性极佳。
- **双向主主同步协议（CouchDB Replication Protocol）**：支持在不可靠网络环境下实现多端断网编辑与重连后自动版本合并。
