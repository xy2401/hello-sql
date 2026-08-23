# Redis 概览

Redis 是一款基于内存的极速键值（Key-Value）存储系统，常用于缓存加速、会话共享、分布式锁、实时排行榜与消息发布订阅。

## 核心特性

- **丰富的高级数据结构**：String, Hash, List, Set, Sorted Set (ZSet), Bitmap, HyperLogLog, Geospatial, Stream。
- **单线程模型 + I/O 多路复用**：核心命令执行依托单线程避免上下文切换和加锁竞争，Redis 6.0 引入多线程处理网络 I/O 读写。
- **持久化方案**：支持 RDB 快照（全量内存 Dump）与 AOF 日志（追加写命令，7.0 采用 Multi-Part AOF）。
