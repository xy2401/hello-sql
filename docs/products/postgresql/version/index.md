# PostgreSQL 版本演进

PostgreSQL 社区每年秋季发布一个主版本（Major Version），受支持版本享有 5 年官方安全与缺陷修复周期。

## 版本索引

### [PostgreSQL 18](./postgresql-18)

- **发布时间：** 2025 年 9 月
- **版本重点：** 引入异步 I/O 子系统，改善顺序扫描、位图扫描和 VACUUM 的存储读取效率。

### [PostgreSQL 17](./postgresql-17)

- **发布时间：** 2024 年 9 月
- **版本重点：** VACUUM 内存管理全面重构，清理死元组内存开销降低高达 20 倍，大幅减轻生产大表维护颠簸。

### [PostgreSQL 16](./postgresql-16)

- **发布时间：** 2023 年 9 月
- **版本重点：** 支持直接从只读物理 Standby 节点建立逻辑复制槽并解码数据。

### [PostgreSQL 15](./postgresql-15)

- **发布时间：** 2022 年 10 月
- **版本重点：** 引入 SQL 标准 MERGE 语句支持原子插入/更新/删除。

### [PostgreSQL 14](./postgresql-14)

- **发布时间：** 2021 年 9 月
- **版本重点：** 大幅优化超高并发活跃连接（千级以上）下的锁竞争与上下文开销。

### [PostgreSQL 13](./postgresql-13)

- **发布时间：** 2020 年 9 月
- **版本重点：** B-tree 索引重复项物理去重（B-tree Deduplication）。

### [PostgreSQL 12](./postgresql-12)

- **发布时间：** 2019 年 10 月
- **版本重点：** 分区表查询与路由性能质的飞跃（支持数千分区高效裁剪）。

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
