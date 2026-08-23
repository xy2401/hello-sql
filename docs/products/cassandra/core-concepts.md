# Cassandra 核心知识

## 核心心智模型

- **按查询反向建表（Query-driven Modeling）**：不支持 JOIN，主键必须根据 Partition Key（分区定位）与 Clustering Key（排序）严格规划。
- **Tombstone 墓碑陷阱**：删除写入墓碑标记，大量删除会导致范围扫描严重超时。
