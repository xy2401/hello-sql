# Apache CouchDB 版本演进

CouchDB 采用 3.x 稳定分支，以 Erlang/OTP 为底层支撑。

## 版本索引

### [CouchDB 3.5](./couchdb-3.5)

- **发布时间：** 2025 年
- **版本重点：** 当前 3.x 正式版本线，升级需同步核对 Erlang/OTP 与集群节点兼容性。

### [CouchDB 3.3](./couchdb-3.3)

- **发布时间：** 2023 年 3 月
- **版本重点：** 引入基于 Java/Lucene 的 Nouveau 全新搜索引擎，替代旧版 Clouseau。

### [CouchDB 3.0](./couchdb-3.0)

- **发布时间：** 2020 年 2 月
- **版本重点：** 默认强制要求管理员密码与安全绑定网络端口，杜绝未授权访问风险。

### [CouchDB 2.0](./couchdb-2.0)

- **发布时间：** 2016 年 9 月
- **版本重点：** 首次合并 BigCouch 分布式集群分片代码，支持多节点水平扩展。

## 升级核对
- 检查 Erlang/OTP 运行库兼容性，升级后确保所有节点完成 `_replicator` 状态检查。
