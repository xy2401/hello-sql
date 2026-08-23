# PostgreSQL 版本演进

PostgreSQL 社区保持每年发布一个主版本（Major Version，如 16 -> 17 -> 18）的稳定节奏。每个主版本提供为期 5 年的官方维护支持（EOL）。

## 主流版本线特性解析

### PostgreSQL 18（当前前瞻版）
- **核心演进**：引入更深层次的异步 I/O 子系统（AIO 框架重构），显著优化预读与扫描密集型查询；继续收紧内部数据结构内存开销。
- **工程建议**：适合前瞻性测试与新平台特性预研，生产迁移需等待首个小版本发布并完成插件兼容性测试。

### PostgreSQL 17
- **核心演进**：
  - 内存分配优化：`VACUUM` 内部内存结构重新设计，内存消耗降低高达 20x，大幅减少大表清理对生产的 I/O 扰动。
  - 逻辑复制增强：支持故障转移时逻辑复制槽的同步，使逻辑复制高可用更加平滑。
  - 存储与执行：新增 `JSON_TABLE` 等 SQL/JSON 标准特性；增强了针对 `IN` 子查询的 SIMD 向量化加速。
- **工程建议**：当前新建高并发与大数据量写入业务的首选版本。

### PostgreSQL 16
- **核心演进**：
  - 支持从只读副本节点进行逻辑复制解码。
  - 显著提升了并行聚合、`DISTINCT` 查询与 `RIGHT`/`FULL` 外连接的并行执行效率。
  - 引入了 `pg_stat_io` 视图，提供细粒度的 I/O 读写统计（区分 Heap、WAL、临时文件）。
- **工程建议**：目前生产最广泛采用的成熟稳定基线。

---

## 生产跨版本升级实战指南

PostgreSQL 主版本之间的数据文件格式可能发生变化，不能直接通过替换二进制包启动。推荐采用以下两类升级方式：

### 方案一：使用 `pg_upgrade` 进行近零停机升级（推荐）

`pg_upgrade` 通过直接复用（或硬链接）原有数据文件，可在数秒至数分钟内完成数百 GB 数据的升级：

```bash
# 1. 运行兼容性预检（--check 模式不修改任何数据）
/usr/lib/postgresql/17/bin/pg_upgrade \
  --old-datadir=/var/lib/postgresql/16/main \
  --new-datadir=/var/lib/postgresql/17/main \
  --old-bindir=/usr/lib/postgresql/16/bin \
  --new-bindir=/usr/lib/postgresql/17/bin \
  --check

# 2. 正式升级（--link 模式使用硬链接，避免全量数据拷贝）
/usr/lib/postgresql/17/bin/pg_upgrade \
  --old-datadir=/var/lib/postgresql/16/main \
  --new-datadir=/var/lib/postgresql/17/main \
  --old-bindir=/usr/lib/postgresql/16/bin \
  --new-bindir=/usr/lib/postgresql/17/bin \
  --link

# 3. 升级后立即全量重新收集统计信息
/var/lib/postgresql/17/main/vacuumdb --all --analyze-in-stages
```

### 方案二：逻辑复制跨版本滚动升级

1. 搭建新的目标版本 PG 实例。
2. 建立由旧版本向新版本的发布-订阅逻辑复制（Logical Replication）。
3. 待数据同步追平后，业务短暂停写，将读写流量直接切换至新实例。
4. 适合无法接受单机几分钟停机窗口的超大型核心业务。
