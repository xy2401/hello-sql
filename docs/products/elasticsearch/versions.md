# Elasticsearch 版本演进

> **版本模型**：Elastic Stack 使用语义化大版本；大版本会移除已弃用行为，云 Serverless 还有独立持续更新节奏。

## 版本发布规律与生命周期

- **发布策略**：Elastic Stack 使用语义化大版本；大版本会移除已弃用行为，云 Serverless 还有独立持续更新节奏。
- **官方权威发布说明**：[查看 Elasticsearch 官方 Release Notes ↗](https://www.elastic.co/docs/release-notes)

## 主流版本线与关键特性

### Elasticsearch 9.x

**关键功能与演进：**

- ES|QL、向量与平台能力继续增强
- 9.0 移除多项 8.x 已弃用行为

**工程影响与选型建议：**

> 先清空 deprecation API 告警再迁移。

### Elasticsearch 8.x

**关键功能与演进：**

- 默认安全、向量检索与数据流形成成熟基线
- 索引兼容受创建版本限制

**工程影响与选型建议：**

> 旧索引可能需要 reindex。

### Elasticsearch 7.x

**关键功能与演进：**

- 移除 mapping type 的过渡版本
- 已结束或接近支持边界

**工程影响与选型建议：**

> 迁往 8/9 应规划中间版本与 reindex。

## 生产升级检查清单

跨版本或主版本升级时，建议按顺序核对以下事项：

1. **运行 Upgrade Assistant 与 deprecation API**
2. **快照并验证 restore/reindex**
3. **核对插件、JDK、客户端和索引创建版本**

::: warning 官方依据声明
补丁号、生命周期支持期限（EOL）、预览功能和许可协议会随时间演进。生产环境变更前，请始终以 [Elasticsearch 官方发布说明](https://www.elastic.co/docs/release-notes) 为最终依据，勿仅凭文档标题推断当前最新版本。
:::

## 关联资源

- 🏠 [返回 Elasticsearch 总览](./)
- 📘 [查看核心知识专题](./core-concepts)
- 🐳 [查看 Docker 工具验证证据](./DockerTooling)
