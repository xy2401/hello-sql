# Redis 总览

Redis 是一款基于内存、具备微秒级响应性能的极速键值（Key-Value）存储系统，常用于高并发缓存加速、分布式会话（Session）、分布式锁、实时排行榜与消息流处理。

## 架构形态与关键属性

| 属性维度 | 规格与技术实现 |
| :--- | :--- |
| **数据模型** | 丰富的键值与数据结构：String, Hash, List, Set, Sorted Set (ZSet), Bitmap, HyperLogLog, Geospatial, Stream。 |
| **通信协议** | RESP（REdis Serialization Protocol，文本/二进制混合协议）。 |
| **开源许可证** | Redis 7.4+ 为 RSALv2 / SSPLv1（双重非 OSI 许可）；开源生态衍生出了由 Linux 基金会主导的 Valkey。 |
| **部署形态** | 单实例、主从复制（Replication）、哨兵高可用集群（Redis Sentinel）、去中心化分片集群（Redis Cluster，16384 个哈希槽）。 |
| **持久化方式** | RDB 快照（全量内存镜像持久化）与 AOF 日志（追加写命令，7.0+ 采用 Multi-Part AOF）。 |

## 核心数据结构与实战范式

```bash
# 1. String: 分布式锁原子获取 (带超时保护)
SET lock:order_9901 "client_uuid_123" EX 30 NX

# 2. ZSet: 实时排行榜 (带积分变动)
ZADD leaderboard 1500 "user_alice" 2100 "user_bob" 1850 "user_charlie"
# 获取排名前 3 的用户及其积分
ZREVRANGE leaderboard 0 2 WITHSCORES

# 3. Hash: 用户对象缓存
HSET user:1001 name "Alice" role "admin" login_count 1
HINCRBY user:1001 login_count 1
```

## 适用边界与架构选型建议

- **✅ 最适合场景**：
  - 热点数据缓存、高频鉴权令牌与会话存储。
  - 分布式锁（配合 Lua 脚本实现安全释放）。
  - 实时计数器、排行榜与轻量级消息队列（Stream / PubSub）。
- **⚠️ 约束与运维风险**：
  - **内存容量代价高昂**：必须合理配置 `maxmemory` 与淘汰策略（Eviction Policy）。
  - **单线程命令阻塞**：执行 $O(N)$ 命令（如对超大集合执行 `HGETALL`, `KEYS *`, `SMEMBERS`）会导致事件循环停顿，全站请求超时。

## 版本阅读范围

[完整版本目录](./version/)收录本仓库已有专题（如 redis-5.0、redis-6.0、redis-6.2）。这些是教学与兼容性对照入口；运行环境的具体版本以安装页、工作台或采集证据为准。

## 推荐学习路线

[安装与环境](./install) → [核心概念](./core-concepts) → [命令行工具](./cli) → [完整版本目录](./version/)。先完成最小示例，再阅读版本差异。

## 实验入口与范围

本产品没有对应的浏览器执行引擎；[浏览器实验台目录](/playground/)列出本站实际可运行的数据库。 [Docker 验证证据](./DockerTooling)列出本产品已采集结果与缺口；阅读证据不等同于启动服务或证明所有功能已验证。
