# OpenSearch 版本演进

> **版本模型**：遵循语义化版本，breaking changes 集中在主版本；官方插件通常要求主/次/补丁严格匹配。

## 版本发布规律与生命周期

- **发布策略**：遵循语义化版本，breaking changes 集中在主版本；官方插件通常要求主/次/补丁严格匹配。
- **官方权威发布说明**：[查看 OpenSearch 官方 Release Notes ↗](https://docs.opensearch.org/latest/version-history/)

## 主流版本线与关键特性

### OpenSearch 3.x

**关键功能与演进：**

- 向量、可观测和 Agent 能力快速增强
- JDK、插件和 breaking changes 需核对

**工程影响与选型建议：**

> 升级前建立插件和索引兼容矩阵。

### OpenSearch 2.x

**关键功能与演进：**

- 成熟的搜索与插件基线
- 迁往 3.x 需处理已弃用术语和行为

**工程影响与选型建议：**

> 可通过 rolling、snapshot/restore 或 remote reindex 迁移。

### OpenSearch 1.x

**关键功能与演进：**

- 从 Elasticsearch OSS 分支的早期基线
- 多项限制和 API 已在 2/3 中变化

**工程影响与选型建议：**

> 不应直接跳过中间大版本滚动升级。

## 生产升级检查清单

跨版本或主版本升级时，建议按顺序核对以下事项：

1. **快照并校验恢复**
2. **核对核心、Dashboards、插件和 JDK 版本**
3. **检查 breaking changes 与旧索引兼容**

::: warning 官方依据声明
补丁号、生命周期支持期限（EOL）、预览功能和许可协议会随时间演进。生产环境变更前，请始终以 [OpenSearch 官方发布说明](https://docs.opensearch.org/latest/version-history/) 为最终依据，勿仅凭文档标题推断当前最新版本。
:::
