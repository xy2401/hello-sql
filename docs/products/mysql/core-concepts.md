# MySQL 核心知识

深入掌握 MySQL 必须透彻理解 InnoDB 的底层物理组织、锁与事务隔离的边界条件，以及主从复制与两阶段提交的协同机制。

## 1. InnoDB 聚簇索引与回表优化

### 聚簇索引 vs 二级索引
- **聚簇索引（Clustered Index）**：每张表必须且仅有一个聚簇索引（默认主键）。叶子节点保存完整的 Data Row。
- **二级索引（Secondary Index）**：叶子节点保存索引列的值以及对应的**主键值（PK Value）**。

```
[二级索引查找: user_id=10] 
   └── 遍历二级索引 B+ 树 -> 定位到叶子节点 -> 获取主键值 ID=500
[回表查询 (Row Lookup)]
   └── 带着 ID=500 遍历主键 B+ 树 -> 定位到物理数据行
```

### 覆盖索引（Covering Index）
如果查询所列出的所有字段（`SELECT` 和 `WHERE` 条件）都已包含在二级索引中，优化器将直接从二级索引返回数据，完全消除回表开销。

---

## 2. 锁机制与 Next-Key Lock 深度解析

InnoDB 在 Repeatable Read 隔离级别下，通过三种行级锁算法防止幻读：

1. **Record Lock（记录锁）**：直接锁定索引上的单条记录。
2. **Gap Lock（间隙锁）**：锁定索引记录之间的开区间 `(A, B)`，禁止其他事务向该区间内插入数据。
3. **Next-Key Lock**：左开右闭区间 `(A, B]`，即间隙锁加上其后的记录锁。

### 为什么无索引更新会引发全表锁死？
执行 `UPDATE t SET status=2 WHERE user_name='alice'` 时：
- 若 `user_name` 字段**没有建立索引**，MySQL 无法使用行锁定位记录，只能走全表扫描。
- 此时 InnoDB 会将**全表所有记录和所有间隙全部加上排他锁**，导致整个表的并发写入瞬间被完全阻塞。

```sql
-- 查看当前阻塞与事务等待
SELECT r.trx_id waiting_trx_id, r.trx_mysql_thread_id waiting_thread,
       r.trx_query waiting_query, b.trx_id blocking_trx_id,
       b.trx_mysql_thread_id blocking_thread, b.trx_query blocking_query
FROM performance_schema.data_lock_waits w
JOIN information_schema.innodb_trx b ON b.trx_id = w.blocking_engine_transaction_id
JOIN information_schema.innodb_trx r ON r.trx_id = w.requesting_engine_transaction_id;
```

---

## 3. 两阶段提交（2PC）与 Crash-Safe 保障

为保证崩溃恢复后 InnoDB 引擎层（Redo Log）与 Server 层（Binlog）的数据绝对一致，MySQL 内部使用 2PC 机制：

1. **Prepare 阶段**：InnoDB 写入事务内容到 Redo Log，并将状态置为 `PREPARE`，执行刷盘。
2. **Write Binlog 阶段**：Server 层将事务事件顺序写入 Binlog 文件并刷盘。
3. **Commit 阶段**：InnoDB 将 Redo Log 状态标记为 `COMMIT`。

- **崩溃恢复判断准则**：
  - 如果在步骤 2 之前崩溃：由于 Binlog 没有记录，重启时直接回滚该事务。
  - 如果在步骤 2 之后崩溃：Binlog 已完整写入，恢复时引擎会根据 Binlog 中记录的 XID 重新提交 Redo Log，保证主从数据一致。
