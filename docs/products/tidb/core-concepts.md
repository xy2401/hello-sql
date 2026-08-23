# TiDB 核心知识

## 核心心智模型

### 1. 分布式事务与 Percolator 算法

TiDB 基于 Google Percolator 模型实现两阶段提交（2PC），利用 PD 颁发的 TSO 实现全局快照隔离（Snapshot Isolation）。

### 2. 热点（Hotspot）与 Region 打散

若使用自增主键（Auto Increment），写入流量会全部落入同一个最新 Region 所在的 TiKV 节点。生产推荐使用 `AUTO_RANDOM` 或打散主键以均摊写入 I/O。
