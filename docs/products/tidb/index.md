# TiDB 总览

TiDB 是一款开源分布式关系型 NewSQL 数据库，具备强一致性分布式事务、在线水平弹性伸缩、金融级高可用以及 HTAP（混合事务与分析处理）一体化能力，高度兼容 MySQL 5.7/8.0 协议。

## 核心架构分层

- **TiDB Server**：无状态 SQL 计算层，负责 SQL 解析、编译与分布式执行计划生成。
- **TiKV**：分布式事务 Key-Value 存储层，数据按 Region（默认 96MB）自动切分并基于 Multi-Raft 复制。
- **PD（Placement Driver）**：元数据大脑与调度中心，颁发全局单调递增的 TSO 事务时间戳。
- **TiFlash**：列式存储副本，实时接收 TiKV Raft 异步复制日志，支撑实时复杂分析计算。
