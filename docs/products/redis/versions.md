# Redis 版本演进

> **版本模型**：Redis 7.4+ 的开源版本和模块采用新的发布/许可体系；服务器、Stack 和模块版本需分别核对。

## 版本发布规律与生命周期

- **发布策略**：Redis 7.4+ 的开源版本和模块采用新的发布/许可体系；服务器、Stack 和模块版本需分别核对。
- **官方权威发布说明**：[查看 Redis 官方 Release Notes ↗](https://redis.io/docs/latest/operate/oss_and_stack/stack-with-enterprise/release-notes/)

## 主流版本线与关键特性

### Redis 8.x

**关键功能与演进：**

- 模块能力逐步整合到统一发行线
- 许可、命令和客户端支持需按具体版本确认

**工程影响与选型建议：**

> 升级决策必须同时包含技术与许可评审。

### Redis 7.4

**关键功能与演进：**

- Hash field TTL 等数据结构能力增强
- Stack 模块组合与移除项需要检查

**工程影响与选型建议：**

> 回归过期语义、RDB/AOF 和模块索引。

### Redis 7.2

**关键功能与演进：**

- 稳定的 ACL、Functions 与 Cluster 基线
- 较新客户端可能默认使用新协议能力

**工程影响与选型建议：**

> 维护协议和客户端兼容矩阵。

## 生产升级检查清单

跨版本或主版本升级时，建议按顺序核对以下事项：

1. **扫描大 key、过期分布和模块依赖**
2. **在副本上验证 RDB/AOF 加载**
3. **演练 Sentinel/Cluster 故障切换与客户端重连**

::: warning 官方依据声明
补丁号、生命周期支持期限（EOL）、预览功能和许可协议会随时间演进。生产环境变更前，请始终以 [Redis 官方发布说明](https://redis.io/docs/latest/operate/oss_and_stack/stack-with-enterprise/release-notes/) 为最终依据，勿仅凭文档标题推断当前最新版本。
:::

## 关联资源

- 🏠 [返回 Redis 总览](./)
- 📘 [查看核心知识专题](./core-concepts)
- 🐳 [查看 Docker 工具验证证据](./DockerTooling)
