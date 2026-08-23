# CockroachDB 版本演进

> **版本模型**：按 vYY.R.PP 命名，季度发布主版本，并区分 Regular/LTS 与 Innovation 支持窗口。

## 版本发布规律与生命周期

- **发布策略**：按 vYY.R.PP 命名，季度发布主版本，并区分 Regular/LTS 与 Innovation 支持窗口。
- **官方权威发布说明**：[查看 CockroachDB 官方 Release Notes ↗](https://www.cockroachlabs.com/docs/releases)

## 主流版本线与关键特性

### CockroachDB v26.2 Regular

**关键功能与演进：**

- 较长稳定与支持窗口
- 适合生产升级规划

**工程影响与选型建议：**

> 生产优先评估 Regular/LTS 版本。

### CockroachDB v26.1 Innovation

**关键功能与演进：**

- 更快获得新能力
- 支持窗口更短

**工程影响与选型建议：**

> 用于验证新功能，升级节奏要与支持策略匹配。

### CockroachDB v25.4 Regular

**关键功能与演进：**

- 上一代稳定版本线
- 跨代升级必须遵守相邻版本路径

**工程影响与选型建议：**

> 不要跳过官方要求的中间版本。

## 生产升级检查清单

跨版本或主版本升级时，建议按顺序核对以下事项：

1. **检查 deprecation、cluster setting 与 license**
2. **逐节点升级并观察 Range 可用性**
3. **压测事务重试和跨区域延迟**

::: warning 官方依据声明
补丁号、生命周期支持期限（EOL）、预览功能和许可协议会随时间演进。生产环境变更前，请始终以 [CockroachDB 官方发布说明](https://www.cockroachlabs.com/docs/releases) 为最终依据，勿仅凭文档标题推断当前最新版本。
:::

## 关联资源

- 🏠 [返回 CockroachDB 总览](./)
- 📘 [查看核心知识专题](./core-concepts)
- 🐳 [查看 Docker 工具验证证据](./DockerTooling)
