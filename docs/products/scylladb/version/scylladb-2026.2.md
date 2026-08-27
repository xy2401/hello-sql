# ScyllaDB 2026.2

> **参考官方文档**：[ScyllaDB 2026.2 Manual](https://docs.scylladb.com/manual/stable/)

## 版本定位

- **发布时间：** 2026 年 6 月
- **维护状态：** 截至 2026-08-27 的当前受支持 Feature Release
- **版本模型：** 年度 Feature Release；长期支持部署可选择 2026.1 LTS

## 核心变化

- 延续 tablets、Raft 和 shard-per-core 架构的功能迭代。
- Feature Release 面向需要最新能力的集群，维护周期短于 LTS。
- 官方升级文档提供从 2026.1 到 2026.2 的明确路径，不能按旧 5.x/6.x 习惯推断升级步骤。

## 不兼容与迁移

- 从 2026.1 进入 2026.2 前先完成最新补丁升级和集群健康检查。
- 滚动升级期间避免并行执行拓扑或 schema 大变更，并观察节点间版本混用状态。
- 若长期维护优先于新功能，继续留在受支持的 2026.1 LTS，并跟进安全与修复补丁。

## 版本确认

```bash
scylla --version
nodetool describecluster
```

## 官方资料

- [ScyllaDB 2026.2 Manual](https://docs.scylladb.com/manual/stable/)
- [ScyllaDB Version Support](https://docs.scylladb.com/stable/versioning/version-support.html)
- [ScyllaDB Upgrade Guide](https://docs.scylladb.com/manual/stable/upgrade/index.html)

资料核对日期：2026-08-27。
