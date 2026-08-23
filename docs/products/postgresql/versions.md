# PostgreSQL 版本演进与升级指南

PostgreSQL 社区保持每年发布一个主版本（Major Version）的节奏。每个主版本提供 5 年的官方维护与安全更新支持（EOL）。

## 核心版本演进与关键特性

### PostgreSQL 18（前瞻版本）
- **AIO 异步 I/O 架构**：重构底层 I/O 子系统，大幅优化顺序扫描与预读性能。
- **内存优化**：进一步收紧内部缓存数据结构的内存开销，提升极端并发下的内存效率。

### PostgreSQL 17
- **VACUUM 内存大幅缩减**：重构了 Vacuum 的内部内存数据结构，内存占用降低高达 20 倍，减少大表清理对生产 I/O 的冲击。
- **高可用与逻辑复制**：支持故障转移时同步逻辑复制槽（Logical Replication Slots Failover Control），使逻辑复制架构下的主从切换更加平滑。
- **SQL/JSON 增强**：全面引入标准 `JSON_TABLE`，可将 JSON 数据直接映射为关系虚拟表。

### PostgreSQL 16
- **只读从库逻辑复制**：支持直接从物理 Standby 节点建立逻辑复制槽并解码数据，大幅减轻主库压力。
- **I/O 可观测性**：新增 `pg_stat_io` 系统视图，细粒度观测客户端、后台写入、Vacuum 及临时文件的 I/O 吞吐与延迟。
- **CPU 向量化**：对 `IN` 表达式和多范围扫描引入 SIMD 硬件指令加速。

### PostgreSQL 15
- **引入 SQL 标准 `MERGE` 语句**：支持在一个原子语句中根据条件同时执行 `INSERT`、`UPDATE` 或 `DELETE`。
- **默认权限安全收紧**：移除了 `public` schema 上的默认公共创建权限，提升多租户安全性。

### PostgreSQL 14
- **连接伸缩性优化**：大幅改善了数千活跃并发连接下的锁竞争与上下文开销。
- **JSON 语法糖**：原生支持下标语法（`record['data']['user_id']`）直接访问 JSONB 字段。
- **B-tree 索引去重**：自动合并重复键值，显著压缩非唯一索引体积。

---

## 生产跨版本升级实战指南

PostgreSQL 主版本之间的数据物理文件格式存在差异，升级必须通过工具重构或硬链接。

### 方案一：`pg_upgrade --link` 硬链接秒级升级（最常用）

```bash
# 1. 在目标版本节点执行预检（--check 模式不修改任何数据）
/usr/lib/postgresql/17/bin/pg_upgrade \
  --old-datadir=/var/lib/postgresql/16/main \
  --new-datadir=/var/lib/postgresql/17/main \
  --old-bindir=/usr/lib/postgresql/16/bin \
  --new-bindir=/usr/lib/postgresql/17/bin \
  --check

# 2. 停止旧版本数据库服务
systemctl stop postgresql@16-main

# 3. 正式执行硬链接升级（秒级完成，不占用额外磁盘）
/usr/lib/postgresql/17/bin/pg_upgrade \
  --old-datadir=/var/lib/postgresql/16/main \
  --new-datadir=/var/lib/postgresql/17/main \
  --old-bindir=/usr/lib/postgresql/16/bin \
  --new-bindir=/usr/lib/postgresql/17/bin \
  --link

# 4. 启动新版本服务并立即分阶段重建统计信息
systemctl start postgresql@17-main
/var/lib/postgresql/17/main/vacuumdb --all --analyze-in-stages
```

### 方案二：逻辑复制零停机滚动升级
对于超大规模或无法接受数分钟停机窗口的核心系统：
1. 搭建新版本目标 PG 实例。
2. 配置从旧实例到新实例的逻辑复制（Logical Replication）。
3. 待从库追平数据后，应用层短暂切换写流量至新实例。
