# PostgreSQL 版本演进

PostgreSQL 社区每年秋季发布一个主版本（Major Version），受支持版本享有 5 年官方安全与缺陷修复周期。

## 核心版本演进与关键里程碑

### PostgreSQL 17（2024 年 9 月）

**主要功能与架构演进：**

- VACUUM 内存管理全面重构，清理死元组内存开销降低高达 20 倍，大幅减轻生产大表维护颠簸
- 逻辑复制故障转移控制（Replication Slots Failover），支持主备平滑切换不丢逻辑复制槽
- 引入标准 SQL/JSON 的 `JSON_TABLE` 函数，将 JSON 数组展开为行

**工程影响与选型建议：**

> 当前新建生产系统的官方推荐稳定基线。

### PostgreSQL 16（2023 年 9 月）

**主要功能与架构演进：**

- 支持直接从只读物理 Standby 节点建立逻辑复制槽并解码数据
- 新增 `pg_stat_io` 系统视图，提供按后端、I/O 目标划分的细粒度读写指标
- 引入 SIMD 硬件向量化指令加速多列比较与 `IN` 子查询

**工程影响与选型建议：**

> 目前生产广泛使用的成熟稳定版本。

### PostgreSQL 15（2022 年 10 月）

**主要功能与架构演进：**

- 引入 SQL 标准 `MERGE` 语句支持原子插入/更新/删除
- 安全收紧：移除 `public` schema 上的默认公共写权限
- 支持 LZ4 与 Zstandard 算法压缩 WAL 日志与备份

**工程影响与选型建议：**

> 企业数据仓库与 ETL 同步场景的重要基线。

### PostgreSQL 14（2021 年 9 月）

**主要功能与架构演进：**

- 大幅优化超高并发活跃连接（千级以上）下的锁竞争与上下文开销
- 原生支持 JSONB 下标语法（如 record["data"]["id"]）
- B-tree 索引自适应去重，显著降低重复键索引体积

**工程影响与选型建议：**

> 高并发连接与 JSON 密集型业务的里程碑版本。

### PostgreSQL 13（2020 年 9 月）

**主要功能与架构演进：**

- B-tree 索引重复项物理去重（B-tree Deduplication）
- 增量排序（Incremental Sort）加速带排序的连接查询
- 支持并行 Vacuum 清理索引

**工程影响与选型建议：**

> 大规模索引空间节省与查询加速。

### PostgreSQL 12（2019 年 10 月）

**主要功能与架构演进：**

- 分区表查询与路由性能质的飞跃（支持数千分区高效裁剪）
- 引入 SQL/JSON 路径语言（jsonpath）与表达式
- 彻底重构恢复配置：合并 `recovery.conf` 到 `postgresql.conf`

**工程影响与选型建议：**

> 现代化分区表与 JSON 查询的关键奠基版本。

## 生产升级实战命令

```bash
# 1. 运行升级预检
/usr/lib/postgresql/17/bin/pg_upgrade \
  --old-datadir=/var/lib/postgresql/16/main \
  --new-datadir=/var/lib/postgresql/17/main \
  --old-bindir=/usr/lib/postgresql/16/bin \
  --new-bindir=/usr/lib/postgresql/17/bin \
  --check

# 2. 硬链接秒级升级
/usr/lib/postgresql/17/bin/pg_upgrade \
  --old-datadir=/var/lib/postgresql/16/main \
  --new-datadir=/var/lib/postgresql/17/main \
  --old-bindir=/usr/lib/postgresql/16/bin \
  --new-bindir=/usr/lib/postgresql/17/bin \
  --link
```
