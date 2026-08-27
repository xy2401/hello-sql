# ScyllaDB 2026.1 LTS

> **参考官方文档**：[ScyllaDB Version Support](https://docs.scylladb.com/stable/versioning/version-support.html)

## 版本定位

- **发布时间：** 2026 年 3 月
- **维护状态：** LTS；官方支持策略列出的当前长期支持版本
- **版本模型：** 2026.1 起以年度序列标识 LTS 与 Feature Release

## 核心变化

- 作为 2026 年 LTS 基线，承接 tablets、Raft schema 与分片架构的稳定演进。
- LTS 线适合重视维护窗口和长期补丁支持的生产集群。
- 官方建议始终升级到当前版本线的最新补丁版，而不是长期停留在首个 `.0` 构建。

## 不兼容与迁移

- 先升级到当前源版本的最新补丁，再按官方支持的相邻路径进入 2026.1。
- 逐节点滚动升级，持续检查 schema agreement、raft 状态、tablets 迁移和客户端错误率。
- 驱动、Operator、Manager 与监控组件必须核对 2026.1 兼容性。

## 版本确认

```bash
scylla --version
nodetool status
```

## 官方资料

- [ScyllaDB Version Support](https://docs.scylladb.com/stable/versioning/version-support.html)
- [ScyllaDB Upgrade Guide](https://docs.scylladb.com/manual/stable/upgrade/index.html)

资料核对日期：2026-08-27。
