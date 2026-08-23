# TiDB 核心知识

## 核心心智模型

- **分布式事务（Percolator 2PC）**：基于两阶段提交与全局 TSO 实现快照隔离（Snapshot Isolation）。
- **热点打散**：避免单调递增主键导致写入全部倾斜到单个 TiKV 节点，推荐使用 `AUTO_RANDOM` 主键。
