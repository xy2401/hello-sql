# PostgreSQL 概览

> **定位**：以标准兼容、可扩展性和严谨事务语义见长的通用关系数据库。既能承担核心业务，也能通过扩展覆盖 GIS、向量、时序与全文检索。

## 基础属性与架构形态

| 属性维度 | 规格与特性说明 |
| :--- | :--- |
| **数据模型** | 关系型 · 通用 OLTP |
| **查询接口** | PostgreSQL SQL；窗口函数、CTE、LATERAL、RETURNING 与丰富类型运算符是常用优势。 |
| **开源许可证** | PostgreSQL License |
| **部署形态** | 自托管单机或高可用集群 · 主要云厂商托管服务 · PGlite 可在浏览器运行 PostgreSQL WASM 子集 |

## 模型与查询语言

### 数据表达模型

关系表为核心，同时原生支持 JSONB、数组、Range、复合类型与自定义类型。

### 查询交互方式

PostgreSQL SQL；窗口函数、CTE、LATERAL、RETURNING 与丰富类型运算符是常用优势。

## 事务、索引与扩展机制

### 事务与一致性保障

- 完整 ACID 与 MVCC
- Read Committed 默认隔离，可选 Repeatable Read / Serializable
- DDL 绝大多数可参与事务

### 索引与查询优化

- B-tree、Hash、GiST、SP-GiST、GIN、BRIN
- 表达式索引、部分索引、覆盖索引
- JSONB 与全文检索可使用 GIN

### 复制、分片与高可用扩展

- 流复制与逻辑复制
- 读副本、分区表和外部数据包装器
- 原生分片能力有限，通常借助 Citus 等扩展

## 适用边界与选型决策

### 适合场景

- ✅ 交易系统与复杂业务模型
- ✅ 需要复杂 SQL、JSON 与扩展的应用
- ✅ GIS、RAG 元数据与多租户 SaaS

### 局限与约束

- ⚠️ 水平分片不是内建默认路径
- ⚠️ 高写入规模需要认真设计 vacuum、索引与连接池
- ⚠️ 版本升级和扩展兼容需要运维规划

::: tip 架构选型建议
当业务数据关系复杂、事务正确性优先，并且希望保留扩展空间时，PostgreSQL 通常是最稳妥的默认选择。
:::

## 页面内 Live 实验

当前产品已接入正式 WebAssembly 交互式运行环境。可直接在下方编写并运行指令：

<DatabaseWorkbench engine="pglite" title="PostgreSQL Live" />
