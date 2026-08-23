# MySQL 概览

MySQL 是全球应用最广泛的开源关系型数据库系统之一。自 8.0 系列以来，MySQL 在查询优化器、事务引擎以及高可用复制方面经历了现代化重构。

## 核心定位与架构特性

- **数据模型**：关系型表格存储，InnoDB 为默认且事实标准的事务型存储引擎。
- **存储架构**：InnoDB 采用聚簇索引（Clustered Index）组织数据，数据行直接物理存储于主键 B+ 树的叶子节点上；二级索引叶子节点仅存储主键值，避免数据行移动时的双重更新。
- **事务与并发**：InnoDB 支持符合 ACID 的事务，默认隔离级别为 Repeatable Read（可重复读），通过 Next-Key Locks（记录锁与间隙锁的组合）在当前读下避免幻读。
- **高可用与扩展**：基于 Binary Log（Binlog）的异步/半同步复制，支持 GTID（全局事务标识符）以及基于 Paxos 协议的 Group Replication（MGR）。

## 关键技术指标与边界

| 维度 | MySQL / InnoDB 技术特性 |
| :--- | :--- |
| **持久化保障** | Redo Log（重做日志）保证崩溃恢复持久性；Undo Log（回滚日志）提供事务回滚与 MVCC 快照读；Doublewrite Buffer（双写缓冲区）防止页断裂（Partial Page Write）。 |
| **查询优化器** | 支持基于代价的优化器（CBO）、直方图统计、Hash Join、通用表表达式（CTE）与窗口函数。 |
| **字符集与编码** | MySQL 8.0 默认字符集为 `utf8mb4`（字符序 `utf8mb4_0900_ai_ci`），彻底解决了历史 `utf8`（实为 3 字节 utf8mb3）无法存储 Emoji 和罕见字的缺陷。 |
| **运维关注点** | 避免无主键建表（否则 InnoDB 会自动创建隐式 6 字节 RowID，且存在全局锁竞争）；长事务会堆积 Undo Log 导致 `ibdata1` 膨胀并拖慢性能。 |
