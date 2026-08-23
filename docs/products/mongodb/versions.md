# MongoDB 版本演进

> **版本模型**：MongoDB 提供 stable release 与历史长期版本线；大版本升级通常需要逐级提升 featureCompatibilityVersion。

## 版本发布规律与生命周期

- **发布策略**：MongoDB 提供 stable release 与历史长期版本线；大版本升级通常需要逐级提升 featureCompatibilityVersion。
- **官方权威发布说明**：[查看 MongoDB 官方 Release Notes ↗](https://www.mongodb.com/docs/manual/release-notes/)

## 主流版本线与关键特性

### MongoDB 8.3 Stable

**关键功能与演进：**

- 快速稳定版本线持续引入能力
- 驱动与 Atlas 支持需同步核对

**工程影响与选型建议：**

> 采用前确认组织对升级频率的承受能力。

### MongoDB 8.2

**关键功能与演进：**

- 8.x 查询与性能能力继续演进
- 部分行为受 FCV 控制

**工程影响与选型建议：**

> 升级二进制后分阶段提升 FCV。

### MongoDB 8.0

**关键功能与演进：**

- 性能、安全和分片能力形成重要基线
- 从 7.x 升级需检查不兼容项

**工程影响与选型建议：**

> 先处理 deprecation 和索引/查询回归。

## 生产升级检查清单

跨版本或主版本升级时，建议按顺序核对以下事项：

1. **运行 compatibility/deprecation 检查**
2. **逐节点升级 replica set/sharded cluster**
3. **延后 FCV 提升以保留回退窗口**

::: warning 官方依据声明
补丁号、生命周期支持期限（EOL）、预览功能和许可协议会随时间演进。生产环境变更前，请始终以 [MongoDB 官方发布说明](https://www.mongodb.com/docs/manual/release-notes/) 为最终依据，勿仅凭文档标题推断当前最新版本。
:::

## 关联资源

- 🏠 [返回 MongoDB 总览](./)
- 📘 [查看核心知识专题](./core-concepts)
- 🐳 [查看 Docker 工具验证证据](./DockerTooling)
