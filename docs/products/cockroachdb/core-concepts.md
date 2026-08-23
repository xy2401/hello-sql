# CockroachDB 核心知识

## 核心机制

- **Serializable 事务重试机制**：由于默认使用最高隔离级别，高并发竞争同一行时可能发生写冲突（Write Skew），客户端驱动需实现重试逻辑。
