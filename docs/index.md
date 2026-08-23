---
layout: home

hero:
  name: "🗄️ Hello SQL"
  text: "数据库与数据交互百科全书"
  tagline: "24 款主流数据库 · 浏览器内可运行实验 · WASM 技术矩阵 · 横向选型指南"
  image: /logo.svg
  alt: Hello SQL - 数据库学习平台
  actions:
    - theme: brand
      text: 探索产品库
      link: /products/
    - theme: alt
      text: ⚡ WASM 实验室
      link: /playground/
    - theme: alt
      text: 📊 横向对比矩阵
      link: /matrix/

features:
  - icon: 🏗️
    title: 统一知识骨架
    details: 所有数据库按相同的十一个公共维度讲解：定位与家族、核心实体、查询能力、事务与一致性、索引与搜索、JSON 支持、扩展复制分片、高可用部署、安全权限模型、连接串与驱动生态。
  - icon: 💻
    title: 浏览器内可运行实验
    details: SQLite WASM、DuckDB-Wasm、PGlite、SurrealDB、IndexedDB 等直接在前端浏览器运行，所见即所得，无需本地环境配置。
  - icon: 🌐
    title: 24 款数据库扁平化目录
    details: 移除 sql/analytical/nosql 分类嵌套，所有数据库平铺在 /products/ 下，通过元数据标签灵活筛选和对比。
  - icon: 🔮
    title: 浏览器数据库前沿
    details: IndexedDB 原理与实践、OPFS 存储配额、离线优先架构与本地同步机制——构建下一代 Web 应用的数据层。
---

## 🎯 典型数据库快速入口

前 5 个为高频使用场景的代表性产品，其余 19 款可在导航栏「更多」下拉中查看完整列表。

| 数据库 | 类型 | 核心价值 | 快速开始 |
| :--- | :--- | :--- | --- |
| [PostgreSQL](/products/postgresql/) 🦄 | SQL 关系型 | 功能最全面、ACID 标准实现、扩展丰富 | [查看详情](/products/postgresql/) → |
| [MySQL](/products/mysql/) ❤️ | SQL 关系型 | Web 应用事实标准、性能优秀、生态成熟 | [查看详情](/products/mysql/) → |
| [DuckDB](/products/duckdb/) 🦆 | 分析型 | MPP 列式存储、嵌入式分析、SQL 兼容性强 | [查看详情](/products/duckdb/) → |
| [MongoDB](/products/mongodb/) 🧬 | NoSQL 文档 | JSON 文档模型、横向扩展能力强、开发友好 | [查看详情](/products/mongodb/) → |
| [Redis](/products/redis/) 🚀 | NoSQL KV | 内存高性能、多种数据结构、持久化策略 | [查看详情](/products/redis/) → |

<div class="grid-container" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; margin-top: 24px;">

<a href="/products/" style="text-decoration: none;">
  <div style="background: var(--vp-c-bg-soft); border: 1px solid var(--vp-c-divider); padding: 20px; border-radius: 12px; height: 100%; transition: all 0.3s ease;">
    <h3 style="margin: 0 0 8px 0; color: var(--vp-c-brand-1);">📚 查看所有 24 款数据库</h3>
    <p style="margin: 0; font-size: 0.875rem; color: var(--vp-c-text-2);">包括 Oracle、MariaDB、SQLite、SQL Server、ClickHouse、TiDB、CockroachDB、Snowflake、BigQuery、CouchDB、Valkey、DynamoDB、Cassandra、ScyllaDB、Elasticsearch、OpenSearch、Neo4j、InfluxDB、TimescaleDB</p>
  </div>
</a>

<a href="/playground/" style="text-decoration: none;">
  <div style="background: var(--vp-c-bg-soft); border: 1px solid var(--vp-c-divider); padding: 20px; border-radius: 12px; height: 100%; transition: all 0.3s ease;">
    <h3 style="margin: 0 0 8px 0; color: var(--vp-c-brand-1);">⚡ WASM 数据库实验室</h3>
    <p style="margin: 0; font-size: 0.875rem; color: var(--vp-c-text-2);">SQLite、DuckDB、PGlite、SurrealDB 在线编辑器实时试写 SQL，查看执行计划与结果集</p>
  </div>
</a>

<a href="/browser/" style="text-decoration: none;">
  <div style="background: var(--vp-c-bg-soft); border: 1px solid var(--vp-c-divider); padding: 20px; border-radius: 12px; height: 100%; transition: all 0.3s ease;">
    <h3 style="margin: 0 0 8px 0; color: var(--vp-c-brand-1);">🌐 浏览器数据层专题</h3>
    <p style="margin: 0; font-size: 0.875rem; color: var(--vp-c-text-2);">IndexedDB 原理与实践、OPFS 存储配额、离线优先架构与本地同步机制</p>
  </div>
</a>

</div>

---

## 📊 关键能力横向对比

各数据库在核心功能上的支持方式不同——「关系型」不等于「只能存表格」，「NoSQL」也不等于「没有 ACID」。

| 能力 | PostgreSQL | MySQL | DuckDB | MongoDB | Redis |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **ACID 事务** | ✅ 完整支持 | ✅ 完整支持 (InnoDB) | ❌ 无事务 | ✅ 单文档原子性 | ⚠️ 多命令原子性 (MULTI/EXEC) |
| **JSON 支持** | ✅ jsonb + GIN | ✅ JSON + 全文索引 | ⚠️ 简单解析 | ✅ 原生 BSON | ❌ 需字符串序列化 |
| **行级锁** | ✅ ROW LEVEL SECURITY | ⚠️ 应用层实现 | ❌ 无 | ❌ 无 | ❌ 无 |
| **分区表** | ✅ 声明式分区 | ⚠️ 分区仅用于分区表 | ❌ 无 | ❌ 无 | ❌ 无 |
| **物化视图** | ✅ 原生支持 | ❌ 需外部插件 | ✅ 自动缓存 | ❌ 无 | ❌ 无 |
| **流式复制** | ✅ WAL 流复制 | ✅ Binlog 流复制 | ❌ 不适用 | ✅ Replica Set | ✅ Master-Slave |
| **WASM 版本** | ❌ PGlite 实验 | ❌ 无 | ✅ DuckDB-Wasm | ✅ MongoDB Atlas Wasm | ❌ 无 |

完整选型建议见 [数据库对比矩阵](/matrix/)。

---

## 🧪 WASM 数据库实验室速览

以下数据库可直接在浏览器中运行，无需安装任何软件：

### 1. [SQLite WASM](/playground/sqlite)
- **优势**: 零依赖、单文件、与 Node.js 版 API 一致
- **适用**: 轻量级离线存储、原型验证、教育演示
- **体验**: 直接在浏览器编写 SQL 并查看结果集

### 2. [DuckDB-Wasm](/playground/duckdb)
- **优势**: 列式存储、MPP 架构、分析查询性能卓越
- **适用**: 嵌入式数据分析、大规模 CSV/Parquet 处理
- **体验**: 加载大文件进行聚合分析与 OLAP 查询

### 3. [PGlite](/playground/pglite)
- **优势**: 完整 PostgreSQL 兼容性、支持扩展
- **适用**: 需要复杂 SQL 特性、函数、触发器的场景
- **体验**: 运行 PostgreSQL 专属 SQL 语句、查看执行计划

### 4. [SurrealDB WASM](/playground/surrealdb)
- **优势**: 图数据库 + 文档数据库 + 关系型数据库三合一
- **适用**: 需要关联查询、图遍历、实时订阅的场景
- **体验**: 编写 SurrealQL 查询语言、查看子图关系

适合目标读者：**全栈开发者、前端工程师、数据库初学者、技术爱好者**。

---

## 📚 SQL 基础学习路线

如果你是数据库新手，建议按以下顺序学习：

1. **查询与过滤** (`/learn/query`) —— SELECT、WHERE、ORDER BY
2. **聚合、JOIN 与子查询** (`/learn/joins`) —— GROUP BY、INNER/LEFT JOIN
3. **CTE 与窗口函数** (`/learn/advanced-query`) —— WITH、ROW_NUMBER、RANK
4. **DDL、约束与数据建模** (`/learn/schema`) —— CREATE TABLE、PRIMARY KEY、FOREIGN KEY
5. **事务、锁与并发** (`/learn/transactions`) —— BEGIN、COMMIT、ISOLATION LEVEL
6. **索引与执行计划** (`/learn/indexes-explain`) —— B-Tree、HASH、EXPLAIN ANALYZE

适合目标读者：**希望系统掌握 SQL 语法的开发者**。

---

## 🚀 快速上手

```bash
git clone https://github.com/xy2401/hello-sql.git && cd hello-sql
npm install
npm run docs:dev          # http://localhost:3009
```

环境要求：Node.js ≥ 18，推荐 Chrome/Firefox/Safari 最新版。

可以从 [WASM 数据库实验室](/playground/) 直接开始运行示例。
