# MySQL 总览

MySQL 是全球部署最广泛的开源关系型数据库系统之一。在现代互联网、电商、内容管理系统（CMS）及金融外围业务中扮演着核心角色。以 InnoDB 存储引擎为支柱，MySQL 提供了高吞吐的行级事务支持与成熟的读写分离生态。

## 架构形态与关键属性

| 属性维度 | 规格与技术实现 |
| :--- | :--- |
| **数据模型** | 关系型表格；InnoDB 为默认且事实标准的事务型存储引擎。 |
| **查询接口** | MySQL SQL 方言；支持标准 SQL 语法、窗口函数、公用表表达式（CTE）与 JSON 函数。 |
| **开源许可证** | GPLv2 / 商业双重许可。 |
| **部署形态** | 单机自托管、主从复制架构（异步/半同步）、InnoDB Cluster（基于 MGR 的 Group Replication）、主流云厂商托管服务。 |
| **事务与隔离** | InnoDB 支持 ACID；默认隔离级别为 Repeatable Read（通过 MVCC 与 Next-Key Lock 解决当前读下的幻读）。 |

## 模型与查询范式

```sql
-- 创建遵循 InnoDB 最佳实践的业务表
CREATE TABLE order_records (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    order_no VARCHAR(64) NOT NULL,
    order_status TINYINT NOT NULL DEFAULT 0,
    metadata JSON NULL,
    total_amount DECIMAL(12, 2) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_order_no (order_no),
    KEY idx_user_status_created (user_id, order_status, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 覆盖索引（Covering Index）高效查询，避免回表 I/O
SELECT id, user_id, order_status, created_at
FROM order_records
WHERE user_id = 10086 AND order_status = 1
ORDER BY created_at DESC
LIMIT 10;
```

## 事务、索引与高可用扩展

- **InnoDB 聚簇索引存储**：主键 B+ 树的叶子节点直接存储整行数据；二级索引叶子节点仅存储索引列与主键值，发生查询时需通过主键值“回表”读取其余字段。
- **Crash-Safe 事务机制**：
  - **Redo Log（重做日志）**：物理日志，保证崩溃恢复的持久性（WAL）。
  - **Undo Log（回滚日志）**：逻辑日志，支持事务回滚并提供 MVCC 快照读视图。
  - **Doublewrite Buffer（双写缓冲）**：防止操作系统页与数据库页（16KB）写入不一致时的“页断裂”损坏。
- **高可用复制拓扑**：基于 Binary Log（Binlog）的异步复制、半同步复制（Semi-Sync Replication）与基于 Paxos 协议的 Group Replication（MGR）。

## 适用边界与架构选型建议

- **✅ 最适合场景**：
  - 经典 Web 业务、电商订单、用户中心与高频 OLTP 读写。
  - 团队已具备成熟的 MySQL 运维体系与云上托管设施。
- **⚠️ 约束与运维风险**：
  - 必须显式声明单调递增的主键，避免随机 UUID 导致 InnoDB B+ 树频繁页分裂与空间碎片。
  - 大表 DDL 曾是传统痛点（虽 8.0 引入 Instant DDL，但仍需规范使用 `gh-ost` 或 `pt-online-schema-change`）。
  - 复杂分析型 SQL（多表哈希聚合、复杂子查询）优化器能力不如专用分析型数据库。
