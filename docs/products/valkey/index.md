# Valkey 概览

Valkey 是由 Linux 基金会主持、AWS、Google Cloud、Oracle、爱立信等联合维护的开源高性能内存键值数据库，采用友好的 **BSD-3-Clause** 开源协议，是 Redis 7.2 的官方开源继承与演进分支。

## 核心定位

- **100% 协议与驱动兼容**：直接兼容既有 Redis 客户端、驱动（Jedis, redis-py, go-redis, ioredis）以及 RDB/AOF 数据文件。
- **性能与并发增强**：Valkey 8.0 针对多核心架构重构了线程模型，大幅提升了集群槽位迁移与高并发吞吐。
