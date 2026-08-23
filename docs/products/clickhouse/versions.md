# ClickHouse 版本演进

> **版本模型**：采用日历式快速发布节奏；云服务和自托管版本交付节奏不同，升级应重点检查行为变化。

## 版本发布规律与生命周期

- **发布策略**：采用日历式快速发布节奏；云服务和自托管版本交付节奏不同，升级应重点检查行为变化。
- **官方权威发布说明**：[查看 ClickHouse 官方 Release Notes ↗](https://github.com/ClickHouse/ClickHouse/blob/master/CHANGELOG.md)

## 主流版本线与关键特性

### ClickHouse 26.x

**关键功能与演进：**

- SQL、Lakehouse、向量与可观测能力持续演进
- 按月版本可能包含默认行为调整

**工程影响与选型建议：**

> 核心集群应固定经过压测的版本而非自动追新。

### ClickHouse 25.x

**关键功能与演进：**

- 查询优化器与存储能力形成新基线
- 旧设置和实验特性可能被替换

**工程影响与选型建议：**

> 升级前导出 settings 与 system 表基线。

### ClickHouse 24.x 及更早

**关键功能与演进：**

- MergeTree 基础语义稳定
- 跨大版本升级需要分段验证

**工程影响与选型建议：**

> 重点检查数据格式、Keeper 和客户端兼容。

## 生产升级检查清单

跨版本或主版本升级时，建议按顺序核对以下事项：

1. **在副本上先做滚动升级演练**
2. **核对默认 settings、函数与数据格式变化**
3. **对典型查询比较读取行数、内存和延迟**

::: warning 官方依据声明
补丁号、生命周期支持期限（EOL）、预览功能和许可协议会随时间演进。生产环境变更前，请始终以 [ClickHouse 官方发布说明](https://github.com/ClickHouse/ClickHouse/blob/master/CHANGELOG.md) 为最终依据，勿仅凭文档标题推断当前最新版本。
:::

## 关联资源

- 🏠 [返回 ClickHouse 总览](./)
- 📘 [查看核心知识专题](./core-concepts)
- 🐳 [查看 Docker 工具验证证据](./DockerTooling)
