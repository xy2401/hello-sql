# Valkey 总览

Valkey 是由 Linux 基金会主导，AWS、Google Cloud、Oracle、爱立信等各大科技公司联合成立的高性能开源内存键值存储项目。它采用极其宽松友好的 **BSD-3-Clause** 开源协议，是 Redis 7.2 开源代码库的正统开源演进分支。

## 核心技术定位

- **100% 协议与客户端兼容**：完全支持 RESP2/RESP3 通信协议，无缝复用既有 Redis 驱动（Jedis, go-redis, redis-py, ioredis）与运维工具。
- **多线程架构深入重构**：Valkey 8.0 针对现代多核多 Socket 服务器硬件进行了深层次的多线程 I/O 与集群元数据同步优化。
