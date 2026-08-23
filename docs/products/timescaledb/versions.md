# TimescaleDB 版本演进

> **版本模型**：TimescaleDB 2.x 作为 PostgreSQL 扩展独立发布；升级还必须满足宿主 PostgreSQL 版本兼容。

## 版本发布规律与生命周期

- **发布策略**：TimescaleDB 2.x 作为 PostgreSQL 扩展独立发布；升级还必须满足宿主 PostgreSQL 版本兼容。
- **官方权威发布说明**：[查看 TimescaleDB 官方 Release Notes ↗](https://docs.timescale.com/about/latest/release-notes/)

## 主流版本线与关键特性

### TimescaleDB 当前 2.x

**关键功能与演进：**

- 列式、连续聚合和云能力持续演进
- 文档与许可边界需按具体版本核对

**工程影响与选型建议：**

> 固定扩展版本并维护 PostgreSQL 兼容矩阵。

### TimescaleDB 较早 2.x

**关键功能与演进：**

- 分布式、压缩 API 和策略行为曾多次演进
- 部分能力可能弃用或迁移

**工程影响与选型建议：**

> 逐版阅读 release notes，不跨过要求的中间版本。

### TimescaleDB 1.x

**关键功能与演进：**

- 早期 hypertable/continuous aggregate 基线
- 迁往 2.x 涉及 API 与策略变化

**工程影响与选型建议：**

> 先在副本完成扩展升级和作业验证。

## 生产升级检查清单

跨版本或主版本升级时，建议按顺序核对以下事项：

1. **核对 PostgreSQL 与 TimescaleDB 兼容矩阵**
2. **新会话首先执行 ALTER EXTENSION UPDATE**
3. **验证 jobs、连续聚合、压缩和备份恢复**

::: warning 官方依据声明
补丁号、生命周期支持期限（EOL）、预览功能和许可协议会随时间演进。生产环境变更前，请始终以 [TimescaleDB 官方发布说明](https://docs.timescale.com/about/latest/release-notes/) 为最终依据，勿仅凭文档标题推断当前最新版本。
:::
