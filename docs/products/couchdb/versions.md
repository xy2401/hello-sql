# Apache CouchDB 版本演进

> **版本模型**：采用 3.x 稳定分支和补丁发布；升级要同时核对 Erlang/OTP、索引实现和集群配置。

## 版本发布规律与生命周期

- **发布策略**：采用 3.x 稳定分支和补丁发布；升级要同时核对 Erlang/OTP、索引实现和集群配置。
- **官方权威发布说明**：[查看 Apache CouchDB 官方 Release Notes ↗](https://docs.couchdb.org/en/stable/whatsnew/index.html)

## 主流版本线与关键特性

### CouchDB 3.5.x

**关键功能与演进：**

- Nouveau 搜索与索引构建持续增强
- 便利二进制的 Erlang 版本会影响安全

**工程影响与选型建议：**

> 升级后检查搜索索引版本与重建策略。

### CouchDB 3.4.x

**关键功能与演进：**

- 3.x 集群与安全能力持续维护
- 配置默认值可能变化

**工程影响与选型建议：**

> 对认证、复制和 compaction 做回归。

### CouchDB 3.0+

**关键功能与演进：**

- 默认文档大小、分片与节点接口有重要变化
- 从 2.x 迁移需阅读专门升级说明

**工程影响与选型建议：**

> 先修正超大文档和旧接口依赖。

## 生产升级检查清单

跨版本或主版本升级时，建议按顺序核对以下事项：

1. **备份配置和系统数据库**
2. **验证复制 checkpoint、冲突与索引重建**
3. **核对 Erlang/OTP、认证和集群节点兼容**

::: warning 官方依据声明
补丁号、生命周期支持期限（EOL）、预览功能和许可协议会随时间演进。生产环境变更前，请始终以 [Apache CouchDB 官方发布说明](https://docs.couchdb.org/en/stable/whatsnew/index.html) 为最终依据，勿仅凭文档标题推断当前最新版本。
:::

## 关联资源

- 🏠 [返回 Apache CouchDB 总览](./)
- 📘 [查看核心知识专题](./core-concepts)
- 🐳 [查看 Docker 工具验证证据](./DockerTooling)
