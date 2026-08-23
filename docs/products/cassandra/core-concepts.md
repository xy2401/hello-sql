# Cassandra 核心知识

## 核心心智模型与禁忌

### 1. 按查询建表（Query-driven Modeling）

Cassandra 不支持 JOIN。必须先明确客户端查询条件，再围绕 Partition Key（分区键）与 Clustering Key（排序键）设计主键。

### 2. Tombstone（墓碑标记）陷阱

删除操作不会立即擦除磁盘，而是写入一条带时间戳的 Tombstone。大量删除后执行范围扫描会导致读超时并耗尽节点内存。
