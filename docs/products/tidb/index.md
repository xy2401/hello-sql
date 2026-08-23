# TiDB 概览

TiDB 是一款开源分布式关系型 NewSQL 数据库，具备强一致性、高可用、水平弹性伸缩与 HTAP（混合事务与分析处理）一体化能力。

## 核心架构分层

- **TiDB Server**：无状态计算节点，解析 SQL、生成并优化分布式执行计划，对外暴露 MySQL 5.7/8.0 兼容协议。
- **TiKV**：分布式事务型 Key-Value 存储层，采用 Multi-Raft 维护分片（Region）数据一致性，数据存储于 RocksDB。
- **PD（Placement Driver）**：集群大脑，负责分配全局单调递增的 TSO 事务时间戳与 Region 调度。
- **TiFlash**：异步复制的列式存储引擎，支撑复杂分析型 SQL 的实时下推计算。
