# PostgreSQL 概览

PostgreSQL（简称 PG）是一款历史悠久、以严谨的事务语义、高级 SQL 标准支持和极其强大的扩展机制（Extensibility）闻名的开源通用对象-关系型数据库管理系统。无论是作为初创团队的单体核心库，还是承载金融交易、地理信息、时序与大模型向量检索（RAG），PostgreSQL 都是现代软件工程中的首选通用数据库基石。

## 架构形态与关键属性

| 属性维度 | 规格与技术实现 |
| :--- | :--- |
| **数据模型** | 关系表为核心，原生支持 JSONB（带二进制索引与包含运算）、GIS 空间几何（PostGIS）、向量嵌入检索（pgvector）、数组与自定义复合类型。 |
| **查询接口** | PostgreSQL SQL 方言；支持高级窗口函数、递归 CTE、`LATERAL` 连接、`RETURNING` 变更返回与复杂类型操作符。 |
| **开源许可证** | PostgreSQL License（极度宽松，类似 MIT/BSD，允许自由修改与闭源商用）。 |
| **部署形态** | 自托管单机 / 流复制高可用集群、主要云厂商托管（RDS/Aurora/Cloud SQL）、PGlite（浏览器 WASM 单文件版）。 |
| **并发与隔离** | 多版本并发控制（MVCC），默认 Read Committed，提供严格的可串行化快照隔离（SSI）；支持绝大多数 DDL 原子事务回滚。 |

## 模型与查询范式

PostgreSQL 的数据建模具备极强的混合能力，可在同一张表中兼顾关系型严谨约束与 NoSQL 灵活文档：

```sql
-- 关系字段与 JSONB、数组、向量与生成的混合建模
CREATE TABLE product_catalog (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    sku VARCHAR(64) NOT NULL UNIQUE,
    title TEXT NOT NULL,
    tags TEXT[] NOT NULL DEFAULT '{}',
    attributes JSONB NOT NULL DEFAULT '{}',
    price_cents INT NOT NULL CHECK (price_cents >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()
);

-- 使用 GIN 索引加速 JSONB 键值检索与数组包含查询
CREATE INDEX idx_catalog_attrs ON product_catalog USING GIN (attributes jsonb_path_ops);
CREATE INDEX idx_catalog_tags ON product_catalog USING GIN (tags);

-- 结合 JSONB 包含操作符 (@>) 与数组重叠 (&&)
SELECT sku, title, attributes->>'brand' AS brand
FROM product_catalog
WHERE attributes @> '{"color": "space_gray"}'
  AND tags && ARRAY['electronics', 'portable']
ORDER BY id DESC
LIMIT 20;
```

## 事务、索引与高可用扩展

- **存储引擎**：基于 Heap 堆表组织数据，数据行（Tuple）追加写入，搭配 WAL（预写式日志）与 Checkpointer 刷盘机制保证 Crash-Safe。
- **专用索引体系**：
  - **B-tree**：默认通用索引，适用于等值与范围查找。
  - **GIN（Generalized Inverted Index）**：倒排索引，适用于包含多元素的字段（JSONB、数组、全文检索）。
  - **GiST / SP-GiST**：通用搜索树，适用于几何空间（PostGIS）、范围（Range Types）与高维临近检索。
  - **BRIN（Block Range Index）**：块范围索引，针对时序或自增 ID 等物理顺序自然递增的海量大表，索引体积通常只有 B-tree 的数千分之一。
- **高可用与复制**：
  - **物理流复制（Streaming Replication）**：主从节点传输 WAL 字节流，支持同步与异步复制。
  - **逻辑复制（Logical Replication）**：基于发布-订阅模型，支持跨大版本数据同步、分表汇聚与异构数据库集成。

## 适用边界与架构选型建议

- **✅ 最适合场景**：
  - 核心交易系统、ERP 与复杂业务模型。
  - 混合型数据应用（既需要关系型强事务，又需要高效存取 JSON、全文检索与向量数据）。
  - 地理信息系统（PostGIS 是行业事实标准）。
- **⚠️ 约束与运维风险**：
  - 更新即生成死元组（Dead Tuple），如果存在长时间未提交的长事务，会阻塞 Autovacuum 回收，引发严重的表和索引膨胀（Table/Index Bloat）。
  - 进程模型（Process-based）：每个客户端连接对应一个独立 OS 进程，并发连接过千时必须配合外部连接池（如 PgBouncer / Odyssey）。
  - 跨节点水平分片（Sharding）非原生开箱即用，超大规模分布式场景需依赖 Citus 扩展或专门的分库分表架构。

::: tip 架构选型建议
当业务数据关系复杂、数据一致性要求高，且希望保留未来扩展 GIS、AI 向量和分析能力的灵活性时，PostgreSQL 是最稳妥的通用默认选择。
:::

::: tip 在线实验环境
可在 [PostgreSQL (PGlite) 在线工作台](/playground/pglite) 直接在浏览器中编写并运行 PostgreSQL SQL 语句。
:::
