# CockroachDB 概览

CockroachDB 是一款面向云原生环境设计的分布式 SQL 数据库，兼容 PostgreSQL 协议，以极强的弹性容灾、多活容灾和默认严格 Serializable（可串行化）隔离级别见长。

## 核心特性

- **对称架构**：所有节点对等，任何节点均可作为协调者接受客户端连接并执行 SQL。
- **Multi-Raft Range 分布**：数据按 64MB~512MB 划分为有序 Range，自动通过 Raft 在多节点间复制。
- **HLC（混合逻辑时钟）**：结合物理时钟与逻辑计数器协调分布式因果一致性。
