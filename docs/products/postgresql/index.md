# PostgreSQL 概览

PostgreSQL（简称 PG）是一款历史悠久、以严谨的事务语义、高级 SQL 特性支持和强大的扩展能力（Extensibility）闻名的开源通用对象-关系型数据库系统。

## 核心定位与架构特性

- **数据模型**：以标准关系表为核心，原生深度支持 JSONB（带二进制索引与包含运算）、GIS 空间几何（PostGIS）、向量嵌入检索（pgvector）、时序（TimescaleDB）以及自定义复合与枚举类型。
- **查询能力**：全面支持 SQL:2023 标准的大量子集，包含高级窗口函数、递归公共表表达式（CTE）、`LATERAL` 连接、`RETURNING` 子句以及丰富的数据类型操作符。
- **事务与并发控制**：基于多版本并发控制（MVCC）实现无锁读写互不阻塞，支持从 Read Committed 到 Serializable（基于 SSI，可串行化快照隔离）的严格事务隔离，绝大多数 DDL 语句均可包裹在事务中实现原子回滚。
- **扩展生态系统**：采用 C 语言扩展 ABI 与插件系统，允许开发者在无需修改内核代码的情况下，扩展数据类型、索引访问方法（Index Access Method）、自定义聚合函数以及外部数据包装器（FDW）。

## 关键技术指标与边界

| 维度 | PostgreSQL 技术特性与实现 |
| :--- | :--- |
| **存储引擎** | 基于 Heap 堆表存储，数据行（Tuple）追加写入，搭配 WAL（预写式日志）与 Checkpoint 机制保证崩溃恢复。 |
| **索引体系** | 原生提供 B-tree（默认）、GIN（倒排索引，用于 JSONB/全文检索）、GiST（通用搜索树，用于空间/区间）、BRIN（块范围索引，用于海量有序数据）、SP-GiST 与 Hash。 |
| **复制拓扑** | 支持基于 WAL 的物理流复制（同步/异步）、逻辑复制（基于发布-订阅模式，支持跨版本/子集同步）。 |
| **适用场景** | 核心业务交易（OLTP）、复杂数据关系建模、地理信息系统（GIS）、多租户 SaaS 系统以及 GenAI 向量检索。 |
| **运维关注点** | 堆表更新产生旧版本行，需合理配置 Autovacuum 避免表膨胀；连接模型为每个连接 fork 一个独立进程，高并发场景需依赖连接池（如 PgBouncer / Odyssey）。 |

## 页面内 Live 实验

当前环境已内置基于 WebAssembly 的 PGlite 运行时，可直接在浏览器中执行 PostgreSQL SQL 命令：

<DatabaseWorkbench engine="pglite" title="PostgreSQL Live" />
