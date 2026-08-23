# PostgreSQL 核心知识

学习 PostgreSQL 的关键不仅在于掌握复杂的 SQL 语法，更在于深入理解其存储引擎、MVCC 机制、查询优化器以及高可用复制链路的内部工作原理。

## 核心心智模型

### 1. MVCC 与 Tuple 版本生命周期

PostgreSQL 的多版本并发控制（MVCC）采用**堆表追加旧版本（Heap-based MVCC）**设计：

- **更新即插入**：执行 `UPDATE` 时，PostgreSQL 不会就地覆写原有行，而是将原 Tuple 标记为已过期（设置 `xmax`），并在堆页面中插入一条带有新 `xmin` 的新 Tuple。
- **事务可见性判断**：每个事务根据当前快照的活跃事务列表，结合 Tuple 头部的 `xmin`（创建事务 ID）和 `xmax`（删除/更新事务 ID）判断行版本是否可见。
- **Vacuum 回收与表膨胀（Bloat）**：
  - 当旧 Tuple 不再对任何活跃事务可见时，成为死元组（Dead Tuple）。
  - `VACUUM` 扫描堆页清理死元组，并将可用空间记录在空闲空间映射表（FSM）中供后续插入复用，但默认不会收缩操作系统磁盘文件。
  - **长事务的致命危害**：若存在运行数小时的慢查询或未提交事务，会阻止其后所有 Dead Tuples 的回收，导致表和索引剧烈膨胀。

```sql
-- 观察表中的死元组数量与膨胀情况
SELECT relname, n_live_tup, n_dead_tup,
       round(100.0 * n_dead_tup / nullif(n_live_tup + n_dead_tup, 0), 2) AS dead_tuple_pct,
       last_autovacuum, last_autoanalyze
FROM pg_stat_user_tables
ORDER BY n_dead_tup DESC;
```

---

### 2. 查询规划器与专用索引体系

PostgreSQL 拥有基于代价估算（Cost-based Optimizer）的高级查询优化器：

- **统计信息收集**：`ANALYZE` 采样收集列的数据分布柱状图（Histogram）、高频值（Most Common Values）和去重计数（n_distinct）。
- **执行计划解读**：
  - 使用 `EXPLAIN (ANALYZE, BUFFERS)` 观察真实执行耗时、扫描算法（Seq Scan, Index Scan, Bitmap Index Scan）以及共享内存缓冲区击中率（Shared Hit Blocks）。
- **多维度索引选择**：
  - **B-tree**：适合等值查询与范围比较（`=`, `<`, `>`, `BETWEEN`）。
  - **GIN（Generalized Inverted Index）**：适合包含多元素的列（JSONB 键值查询、数组元素包含 `@>`、全文检索）。
  - **BRIN（Block Range Index）**：针对自然按时间递增的大表，每个块范围仅记录最小值和最大值，索引占用极小（仅为 B-tree 的数千分之一）。

---

### 3. WAL 日志、流复制与主从一致性

预写式日志（Write-Ahead Logging）是 PostgreSQL 事务持久性与高可用复制的核心基石：

- **WAL 写入机制**：事务提交前只需将 WAL 日志顺序刷盘（`fsync`），数据页可在后台由 Checkpointer 批量异步刷入磁盘。
- **物理流复制（Streaming Replication）**：
  - Primary 节点通过 WAL Sender 进程将 WAL 字节流实时推送到 Standby 节点的 WAL Receiver。
  - 支持配置 `synchronous_commit`（`off`, `local`, `on`, `remote_apply`），在吞吐性能与 RPO 之间权衡。
- **复制槽（Replication Slots）**：
  - 确保 Primary 不会提前删除从节点尚未消费的 WAL 日志。
  - **运维陷阱**：若从节点宕机且复制槽未及时处理，Primary 的 WAL 日志会在 `pg_wal` 目录持续堆积，最终导致磁盘写满挂起。
