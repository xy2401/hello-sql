# OPFS + SyncAccessHandle 普及

> **参考官方文档**：[Browser Database 官方发布说明](https://www.w3.org/TR/IndexedDB/)  
> 本页依据正式 Release 与现有仓库版本证据，整理 OPFS + SyncAccessHandle 普及 的关键变化、兼容边界和升级检查。

## 版本定位

- **发布时间：** 2023 年 3 月
- **维护状态：** 截至 2026-08-27 的当前重要版本线
- **产品线：** Browser Database

## 核心变化

**主要功能与架构演进：**

- Safari 16.4、Chrome 102+、Firefox 111+ 全量普及 Origin Private File System 与专属 Worker 高速同步句柄
- 使得 SQLite-WASM、PGlite 等关系数据库在浏览器端获得近乎本地 SSD 单机的 I/O 读写性能

**工程影响与选型建议：**

> 开启了本地优先（Local-First）复杂客户端应用的爆发时代。

## 兼容与迁移

- 先完成备份、恢复演练和官方升级预检，不跨越未受支持的中间版本。
- 在副本、分片或集群环境按官方顺序滚动升级，并监控复制、延迟和错误日志。
- 同步核对客户端驱动、扩展、认证、配置参数与存储格式；回滚能力必须在升级前验证。

## 版本确认

不要根据安装包名称或容器标签推断实际版本，应在目标环境执行：

```bash
在浏览器开发者工具中检查 indexedDB 与 navigator.storage
```

生产记录至少应包含完整版本输出、操作系统或运行时基线、架构，以及所用客户端或驱动版本。

## 官方资料

- [Browser Database 官方发布说明](https://www.w3.org/TR/IndexedDB/)

资料核对日期：2026-08-27。
