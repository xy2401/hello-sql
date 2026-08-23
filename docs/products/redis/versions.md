# Redis 版本演进与分叉

## 历史里程碑与协议分歧

- **Redis 7.0**：引入 Multi-Part AOF 解决 AOF rewrite 内存暴涨；支持 Functions 与 Sharded Pub/Sub。
- **协议变更事件**：自 Redis 7.4 起，官方宣布调整开源许可证为双重非 OSI 认可协议（RSALv2 / SSPLv1）。
- **开源生态演进**：Linux 基金会与各大云厂商联合建立了 **Valkey** 分支，继续保持纯正 BSD 开源治理。
