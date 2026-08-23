# MySQL 核心知识

深入理解 MySQL 的核心在于吃透 InnoDB 存储引擎的底层物理存储结构、锁与隔离级别的微观交互，以及 Binlog 复制链路。

## 核心心智模型

### 1. InnoDB 聚簇索引与回表机制

- **聚簇索引与二级索引**：
  - **主键索引**：叶子节点包含完整的整行数据（Row Data）。
  - **二级索引（Secondary Index）**：叶子节点仅保存索引列的值以及对应的**主键值**。
  - **回表代价**：通过二级索引定位到主键值后，需再走一遍主键 B+ 树才能读取整行字段。
- **覆盖索引（Covering Index）优化**：
  - 若查询所需字段全部包含在二级索引中，优化器将直接从二级索引返回数据，完全消除回表 I/O。
- **页分裂（Page Split）与主键选择**：
  - 推荐使用单调递增的主键（如 Auto Increment ID 或有序 UUID），避免随机写入导致 B+ 树叶子页频繁分裂与碎片化。

---

### 2. Next-Key Lock 与并发事务锁机制

InnoDB 在 Repeatable Read 隔离级别下，通过多粒度锁解决幻读与并发更新冲突：

- **Record Lock（记录锁）**：直接锁定索引记录本身。
- **Gap Lock（间隙锁）**：锁定索引记录之间的开区间，防止其他事务在间隙中插入新数据。
- **Next-Key Lock**：Record Lock + 前面的 Gap Lock 构成的左开右闭区间。
- **锁升级陷阱**：
  - 如果 `UPDATE` 或 `DELETE` 语句的 `WHERE` 条件未能命中索引，MySQL 会对全表所有记录和间隙加锁，导致整个表并发写瘫痪。

```sql
-- 查看当前活跃事务与锁等待情况
SELECT waiting_trx_id, waiting_pid, waiting_query,
       blocking_trx_id, blocking_pid, blocking_query
FROM sys.innodb_lock_waits;
```

---

### 3. 两阶段提交与 Binlog/Redo Log 协同

为保证 Crash-Safe 与主从数据一致，MySQL 内部采用基于 XA 的两阶段提交（2PC）：

1. **Prepare 阶段**：InnoDB 写入 Redo Log 并将其状态置为 `PREPARE`，同时刷盘（受 `innodb_flush_log_at_trx_commit` 控制）。
2. **Write Binlog**：Server 层将事务写入 Binlog 并刷盘（受 `sync_binlog` 控制）。
3. **Commit 阶段**：InnoDB 将 Redo Log 状态标记为 `COMMIT`。
- **崩溃恢复判断**：如果实例在步骤 2 之后崩溃，恢复时由于 Binlog 已完整，引擎会自动重新提交 Redo Log，确保从库与主库一致。
