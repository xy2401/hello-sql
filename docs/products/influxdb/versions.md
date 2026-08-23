# InfluxDB 版本演进

> **版本模型**：1.x、2.x 与 3.x 是架构代际而非普通原地升级；3 Core 与 Enterprise 也有能力差异。

## 版本发布规律与生命周期

- **发布策略**：1.x、2.x 与 3.x 是架构代际而非普通原地升级；3 Core 与 Enterprise 也有能力差异。
- **官方权威发布说明**：[查看 InfluxDB 官方 Release Notes ↗](https://docs.influxdata.com/influxdb3/core/release-notes/)

## 主流版本线与关键特性

### InfluxDB 3 Core

**关键功能与演进：**

- Parquet/对象存储与 SQL 查询成为核心
- 配置和资源默认值仍在快速演进

**工程影响与选型建议：**

> 新部署适合评估，但要仔细阅读 breaking changes。

### InfluxDB 2.x

**关键功能与演进：**

- Flux、bucket/token 与统一 API
- 迁往 3.x 需重新评估查询和任务

**工程影响与选型建议：**

> 保留 Flux/Task 清单并验证替代方案。

### InfluxDB 1.x

**关键功能与演进：**

- InfluxQL、database/retention policy 模型
- 与新代际身份和 API 不同

**工程影响与选型建议：**

> 迁移通常是数据与查询重构项目。

## 生产升级检查清单

跨版本或主版本升级时，建议按顺序核对以下事项：

1. **盘点 InfluxQL/Flux/SQL 与 API 使用**
2. **导出样本数据验证精度、类型和聚合**
3. **演练认证、保留、备份和回退**

::: warning 官方依据声明
补丁号、生命周期支持期限（EOL）、预览功能和许可协议会随时间演进。生产环境变更前，请始终以 [InfluxDB 官方发布说明](https://docs.influxdata.com/influxdb3/core/release-notes/) 为最终依据，勿仅凭文档标题推断当前最新版本。
:::
