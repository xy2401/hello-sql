# Neo4j 版本演进

> **版本模型**：5.26 之后采用年份.月份版本线并保留 LTS；Cypher 版本可与服务器版本分开选择。

## 版本发布规律与生命周期

- **发布策略**：5.26 之后采用年份.月份版本线并保留 LTS；Cypher 版本可与服务器版本分开选择。
- **官方权威发布说明**：[查看 Neo4j 官方 Release Notes ↗](https://neo4j.com/docs/operations-manual/current/changes-2025-2026/)

## 主流版本线与关键特性

### Neo4j 2025–2026

**关键功能与演进：**

- 按月发布服务器能力
- Cypher 25 与配置默认值逐步变化

**工程影响与选型建议：**

> 固定 db.query.default_language 并跟踪月度 breaking changes。

### Neo4j 5.26 LTS

**关键功能与演进：**

- 5.x 长期支持基线
- 是迁往年份版本线的重要比较点

**工程影响与选型建议：**

> 长期生产可围绕 LTS 规划。

### Neo4j 5.x

**关键功能与演进：**

- 多数据库、集群与 Cypher 能力持续演进
- 配置名和过程存在弃用

**工程影响与选型建议：**

> 先运行配置迁移和 deprecation 检查。

## 生产升级检查清单

跨版本或主版本升级时，建议按顺序核对以下事项：

1. **运行 migrate-configuration 和兼容检查**
2. **备份并验证 restore/cluster seed**
3. **回归 Cypher 版本、过程、插件与驱动**

::: warning 官方依据声明
补丁号、生命周期支持期限（EOL）、预览功能和许可协议会随时间演进。生产环境变更前，请始终以 [Neo4j 官方发布说明](https://neo4j.com/docs/operations-manual/current/changes-2025-2026/) 为最终依据，勿仅凭文档标题推断当前最新版本。
:::
