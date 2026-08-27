# Apache CouchDB 3.5

> **参考官方文档**：[Apache CouchDB 3.5 Release Notes](https://docs.couchdb.org/en/stable/whatsnew/3.5.html)

## 版本定位

- **发布时间：** 2025 年
- **维护状态：** 截至 2026-08-27 的当前 3.x 重要版本线
- **运行基线：** 以官方 Release Notes 列出的 Erlang/OTP 与操作系统组合为准

## 核心变化

- 汇总 3.5 系列的数据库、复制、集群管理、安全和查询改进。
- 延续 CouchDB 3.x 的分片集群与 HTTP/JSON API 模型，升级重点仍是节点间版本和 Erlang/OTP 兼容。
- 新增或调整的配置项应通过实际集群配置核对，不能直接沿用旧节点默认值。

## 不兼容与迁移

- 先阅读 3.5 Release Notes 中的升级说明和已知问题，再逐节点滚动升级。
- 升级前备份数据与配置，确认 `_users`、`_replicator`、设计文档和安全对象可恢复。
- 混合版本期间观察分片、复制任务和集群成员状态；完成后再清理旧运行时与旧配置。

## 版本确认

```bash
curl -s http://127.0.0.1:5984/
curl -s http://127.0.0.1:5984/_membership
```

## 官方资料

- [CouchDB 3.5 Release Notes](https://docs.couchdb.org/en/stable/whatsnew/3.5.html)
- [CouchDB 官方文档](https://docs.couchdb.org/en/stable/)

资料核对日期：2026-08-27。
