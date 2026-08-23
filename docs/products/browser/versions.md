# Browser Database 版本演进

> **版本模型**：Browser Database 随浏览器和 Web 标准演进，不采用独立服务器版本号；能力基线由 IndexedDB、File System、Storage 标准及目标浏览器版本共同决定。

## 版本发布规律与生命周期

- **发布策略**：Browser Database 随浏览器和 Web 标准演进，不采用独立服务器版本号；能力基线由 IndexedDB、File System、Storage 标准及目标浏览器版本共同决定。
- **官方权威发布说明**：[查看 Browser Database 官方 Release Notes ↗](https://www.w3.org/TR/IndexedDB/)

## 主流版本线与关键特性

### IndexedDB 3.0

**关键功能与演进：**

- 现代 IndexedDB 规范基线
- 覆盖数据库、事务、对象仓库、索引与游标语义

**工程影响与选型建议：**

> 新应用应以 Promise 封装或成熟库改善 API 体验，但不能绕过事务语义。

### OPFS 与 Storage API

**关键功能与演进：**

- 提供来源私有文件系统和配额管理
- 同步访问句柄主要面向 Dedicated Worker

**工程影响与选型建议：**

> WASM 数据库持久化前必须验证浏览器、Worker 和并发限制。

### localStorage 兼容基线

**关键功能与演进：**

- 同步字符串键值 API
- 缺少事务、索引和结构化数据能力

**工程影响与选型建议：**

> 只适合极少量偏好设置，不应作为 Browser Database 的替代。

## 生产升级检查清单

跨版本或主版本升级时，建议按顺序核对以下事项：

1. **在目标浏览器执行升级与事务回归**
2. **验证配额、隐私模式和站点数据清理行为**
3. **演练 Schema 迁移、导入导出和同步冲突**

::: warning 官方依据声明
补丁号、生命周期支持期限（EOL）、预览功能和许可协议会随时间演进。生产环境变更前，请始终以 [Browser Database 官方发布说明](https://www.w3.org/TR/IndexedDB/) 为最终依据，勿仅凭文档标题推断当前最新版本。
:::

## 关联资源

- 🏠 [返回 Browser Database 总览](./)
- 📘 [查看核心知识专题](./core-concepts)
- 🐳 [查看 Docker 工具验证证据](./DockerTooling)
