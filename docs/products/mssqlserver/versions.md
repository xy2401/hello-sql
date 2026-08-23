# Microsoft SQL Server 版本演进

> **版本模型**：SQL Server 以大版本加累计更新（CU）交付；生产通常固定大版本并持续应用经过验证的 CU。

## 版本发布规律与生命周期

- **发布策略**：SQL Server 以大版本加累计更新（CU）交付；生产通常固定大版本并持续应用经过验证的 CU。
- **官方权威发布说明**：[查看 Microsoft SQL Server 官方 Release Notes ↗](https://learn.microsoft.com/en-us/sql/sql-server/sql-server-2025-release-notes)

## 主流版本线与关键特性

### SQL Server 2025 (17.x)

**关键功能与演进：**

- 引入向量数据与 AI/开发体验增强
- 存在需要单独核对的 breaking changes 与预览功能

**工程影响与选型建议：**

> 升级前区分 GA 与 PREVIEW_FEATURES。

### SQL Server 2022 (16.x)

**关键功能与演进：**

- Query Store、Azure 集成和分析能力增强
- 兼容级别可用于分阶段启用优化器行为

**工程影响与选型建议：**

> 升级二进制后不要立即提高数据库兼容级别。

### SQL Server 2019 (15.x)

**关键功能与演进：**

- 智能查询处理和大数据能力构成重要基线
- 旧驱动与 TLS 配置需检查

**工程影响与选型建议：**

> 迁移时同步评估操作系统、驱动和许可。

## 生产升级检查清单

跨版本或主版本升级时，建议按顺序核对以下事项：

1. **运行 Data Migration Assistant/升级检查**
2. **备份并验证还原与 AG 切换**
3. **分阶段提升 compatibility level 并观察 Query Store**

::: warning 官方依据声明
补丁号、生命周期支持期限（EOL）、预览功能和许可协议会随时间演进。生产环境变更前，请始终以 [Microsoft SQL Server 官方发布说明](https://learn.microsoft.com/en-us/sql/sql-server/sql-server-2025-release-notes) 为最终依据，勿仅凭文档标题推断当前最新版本。
:::
