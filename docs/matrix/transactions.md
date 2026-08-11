# 事务与一致性矩阵

| 产品 | 事务范围 | 默认/典型隔离 | 并发基础 | 分布式一致性 |
| :--- | :--- | :--- | :--- | :--- |
| PostgreSQL | 多表事务 | Read Committed | MVCC | 复制通常异步；可配置同步 |
| MySQL/InnoDB | 多表事务 | Repeatable Read | MVCC + next-key locks | 复制模式可选 |
| SQLite | 单文件事务 | Serializable 语义 | 单写者 | 不内建复制 |
| CockroachDB | 跨 Range 事务 | Serializable | MVCC + Raft | 强一致 |
| TiDB | 分布式事务 | Snapshot Isolation / RC | MVCC + Percolator | Raft 强一致存储 |
| MongoDB | 单文档原子，多文档事务 | Snapshot 能力 | WiredTiger MVCC | Replica Set 多数派语义 |
| Cassandra | 单分区原子批次 | 可调一致性 | LSM + quorum | 最终/可调一致性 |
| Redis/Valkey | 命令原子、MULTI/EXEC | 非关系隔离模型 | 单线程命令执行为主 | 复制与故障切换窗口 |

## 验收事务设计

- 明确断电、超时、客户端重试和主节点切换时的结果。
- 为幂等写入设计业务键。
- 不把“请求成功返回”直接等同于“跨区域永久提交”。
- 使用并发测试复现丢失更新、写偏差和死锁。
