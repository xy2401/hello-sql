# Valkey 9.1

> **参考官方文档**：[Valkey 官方 Releases](https://github.com/valkey-io/valkey/releases)

## 版本定位

- **发布时间：** 2026 年
- **维护状态：** 截至 2026-08-27 的当前正式功能版本线
- **兼容基线：** RESP 协议、Valkey CLI 与官方支持的模块和客户端

## 核心变化

- 9.1 是 9.x 的正式功能版本线；功能与修复以官方签名 Release 和当前补丁版为准。
- 保持 Valkey 的内存数据结构、复制、集群和持久化模型，同时继续演进性能与运维能力。
- 升级决策需同时核对命令语义、配置默认值、模块 ABI 和客户端兼容性。

## 不兼容与迁移

- 从 Redis 或较旧 Valkey 迁移前，比较配置项、ACL、持久化文件、模块和集群协议差异。
- 在副本上先完成恢复与负载验证，再执行主从切换或集群滚动升级。
- 固定容器与制品版本，避免浮动标签把补丁升级扩大为功能版本升级。

## 版本确认

```bash
valkey-server --version
valkey-cli INFO server
```

## 官方资料

- [Valkey Releases](https://github.com/valkey-io/valkey/releases)
- [Valkey Documentation](https://valkey.io/topics/)

资料核对日期：2026-08-27。
