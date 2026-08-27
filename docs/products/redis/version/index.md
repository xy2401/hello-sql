# Redis 版本演进

Redis 采用大版本演进。自 7.4 起官方采用双重商业限制许可证（RSALv2/SSPLv1），同时开源社区由 Linux 基金会主导建立了 Valkey 分支。

## 版本索引

### [Redis 8.10](./redis-8.10)

- **发布时间：** 2026 年 7 月
- **版本重点：** 延续 Redis 8 双月功能发布节奏。

### [Redis 8.0](./redis-8.0)

- **发布时间：** 2025 年 5 月
- **版本重点：** Redis Search、JSON、Time Series 与概率数据结构进入统一发行包。

### [Redis 7.4](./redis-7.4)

- **发布时间：** 2024 年 7 月
- **版本重点：** 引入 Hash 字段级别独立的 TTL（Hash Field Expiry），支持为 Hash 内部单个 key 配置独立过期时间。

### [Redis 7.2](./redis-7.2)

- **发布时间：** 2023 年 8 月
- **版本重点：** 完善 ACL 细粒度权限控制与 Sharded Pub/Sub 分片发布订阅。

### [Redis 7.0](./redis-7.0)

- **发布时间：** 2022 年 4 月
- **版本重点：** Multi-Part AOF：彻底重构 AOF 持久化，消除 AOF 重写期间的内存翻倍暴涨。

### [Redis 6.2](./redis-6.2)

- **发布时间：** 2021 年 2 月
- **版本重点：** 新增一系列针对 Stream、Set、ZSet 的原子操作命令（如 XADD 限制长度、ZRANGE 等）。

### [Redis 6.0](./redis-6.0)

- **发布时间：** 2020 年 5 月
- **版本重点：** 多线程网络 I/O（Threaded I/O）：网络读写支持多线程并行，命令执行仍保持单线程。

### [Redis 5.0](./redis-5.0)

- **发布时间：** 2018 年 10 月
- **版本重点：** 引入全新的 Stream 数据结构，提供类似 Kafka 的持久化、多消费组流式消息能力。

## 升级与数据迁移验证

```bash
# 1. 扫描当前实例大 key 与内存分布
redis-cli --bigkeys

# 2. 验证 RDB 快照向后兼容性，在备节点先行加载演练
redis-cli bgsave
```
