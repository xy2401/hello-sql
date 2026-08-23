# ScyllaDB 概览

ScyllaDB 是采用 C++ 重构的高性能分布式 NoSQL 数据库，完全兼容 Apache Cassandra 与 DynamoDB API。

## 核心优势

- **Seastar 异步单核线程架构（Thread-per-core）**：每个 CPU 核心运行一个独立无锁事件循环，彻底摆脱 Java JVM GC 垃圾回收停顿（Stop-the-World）。
- **极低的 P99 延迟**：相同硬件规格下，吞吐量比 Cassandra 高出数倍，延迟保持在毫秒级。
