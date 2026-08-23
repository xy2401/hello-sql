# PostgreSQL 核心知识

深入理解 PostgreSQL 的核心在于吃透其堆表存储机制、MVCC 的版本标记与回收原理、基于代价的查询优化器（CBO），以及 WAL 流复制链路。

## 1. 堆表存储与 MVCC（多版本并发控制）

PostgreSQL 采用**堆表追加（Append-only Heap Pages）**设计实现 MVCC：

### Tuple 行头与版本标记
每个数据行（Tuple）头部包含关键的事务标记：
- `t_xmin`：插入该行版本的事务 ID。
- `t_xmax`：删除或更新该行版本的事务 ID（若行仍有效，则通常为 0）。
- `t_ctid`：指向当前行物理位置（块号 + 偏移量）的指针。发生更新时，原行版本的 `ctid` 会指向新插入的行版本。

```
[事务 100 插入] -> Heap Page: Tuple A (xmin=100, xmax=0)
[事务 105 更新] -> Heap Page: Tuple A (xmin=100, xmax=105, ctid->Tuple B)
                              Tuple B (xmin=105, xmax=0,   ctid->自身)
```

### 事务快照与可见性判断
每个事务开始时，PostgreSQL 会捕获一个瞬时快照（Snapshot），记录：
- 当前正在运行但尚未提交的活跃事务列表（Active Transactions）。
- 当前已提交的最大事务 ID。
- 查询根据 Tuple 头部的 `xmin`/`xmax` 与快照比对，决定该行是否对当前查询可见。**读操作无需加锁，写操作不阻塞读操作**。

---

## 2. Vacuum 机制、表膨胀与长事务危害

### 垃圾回收（Vacuum）的运作流程
当被更新或删除的旧 Tuple 不再对任何活跃事务可见时，该行变成**死元组（Dead Tuple）**。
1. **标准 Vacuum**：扫描堆页面，清理 Dead Tuple，将空闲空间更新到空闲空间映射表（Free Space Map, FSM）供后续 `INSERT`/`UPDATE` 复用。但**不会向操作系统释放已占用的磁盘空间**。
2. **Vacuum Full**：重写整张表生成全新的物理文件并释放磁盘空间，执行期间会对整表加排他锁（AccessExclusiveLock），阻塞所有读写。

### 为什么长事务会导致表膨胀（Table Bloat）？
Vacuum 能够回收 Dead Tuple 的前提是：该 Tuple 的 `xmax` 必须小于当前系统中**所有活跃事务的最老事务 ID（Oldest Active XID）**。
- 如果存在一个执行数小时的慢查询或忘记提交的事务，整个数据库的垃圾回收进度都会被“钉住”。
- 在此期间发生的所有表更新，其产生的 Dead Tuples 均无法被回收，导致堆文件与所有索引体积几何级数暴增。

```sql
-- 监控当前阻止垃圾回收的最老活跃长事务
SELECT pid, usename, client_addr, state,
       age(backend_xmin) AS xmin_age,
       now() - xact_start AS xact_duration,
       query
FROM pg_stat_activity
WHERE backend_xmin IS NOT NULL
ORDER BY age(backend_xmin) DESC
LIMIT 10;
```

---

## 3. 基于代价的查询规划器（Cost-based Optimizer）

### 统计信息与执行计划
优化器根据系统表（`pg_statistic` / `pg_stats`）中的统计信息估算不同执行路径的代价（Cost）：
- **Seq Scan（顺序扫描）**：全表扫描，适合读取大比例数据。
- **Index Scan（索引扫描）**：先遍历 B-tree 索引获取物理指针（TID），再去堆表回表读取数据。
- **Bitmap Index Scan（位图索引扫描）**：在内存中构建包含候选物理块的位图，排序后按物理顺序批量读取堆块，减少离散随机 I/O。

```sql
-- 使用 EXPLAIN (ANALYZE, BUFFERS) 查看真实执行细节与缓存命中
EXPLAIN (ANALYZE, BUFFERS, COSTS, VERBOSE)
SELECT c.name, sum(o.total_amount)
FROM customers c
JOIN orders o ON c.id = o.customer_id
WHERE o.created_at >= '2026-01-01'
GROUP BY c.name;
```

---

## 4. WAL 日志与流复制高可用

- **WAL Flush 机制**：事务提交时只需保证对应的 WAL 日志写入磁盘并 `fsync` 成功（由 `synchronous_commit` 控制），数据页在后台由 Checkpointer 批量异步刷盘。
- **物理流复制**：主节点的 WAL Sender 进程将 WAL 日志流持续发送给从节点的 WAL Receiver，从节点实时重放 WAL 实现近实时副本。
- **复制槽（Replication Slot）风险**：复制槽确保主节点不会过早清理从节点尚未消费的 WAL。但如果从节点宕机且复制槽未被及时监控移除，主节点的 `pg_wal` 目录会持续暴增直至耗尽磁盘空间。
