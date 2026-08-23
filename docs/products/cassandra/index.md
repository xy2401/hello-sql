# Apache Cassandra 概览

Apache Cassandra 是一款去中心化、高可用、高可扩展的分布式宽列（Wide-Column）NoSQL 数据库系统，专为海量写入密集型负载设计。

## 核心架构特性

- **无主对称架构（Masterless / P2P）**：基于一致性哈希环（Consistent Hashing Ring）分布数据，无单点故障（SPOF）。
- **LSM-Tree 存储结构**：写操作追加到 CommitLog 并写入内存 Memtable，后台刷入不可变 SSTable，写入极快。
- **可调一致性（Tunable Consistency）**：读写可自由指定 `ONE`, `QUORUM`, `ALL`，当满足 $R + W > N$ 时达成强一致读。
