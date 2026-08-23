---
layout: home

hero:
  name: "Hello SQL"
  text: "SQL、NoSQL、浏览器数据库与 WASM 交互学习平台"
  tagline: "24 款主流数据库统一语义骨架、版本演进矩阵与浏览器内可运行实验"
  actions:
    - theme: brand
      text: 🗄️ 探索数据库产品库
      link: /products/
    - theme: alt
      text: 📊 横向能力对比矩阵
      link: /matrix/
    - theme: alt
      text: ⚡ WASM 实验室在线体验
      link: /playground/

features:
  - icon: 🏗️
    title: 统一语义骨架
    details: 所有数据库按相同的十一个公共维度讲解：定位与家族、核心实体、查询能力、事务与一致性、索引与搜索、JSON 支持、扩展复制分片、高可用部署、安全权限模型、连接串与驱动生态。
  - icon: 🧪
    title: 浏览器内可运行实验
    details: SQLite WASM、DuckDB-Wasm、PGlite、SurrealDB、IndexedDB 等直接在前端浏览器运行，所见即所得，无需本地环境配置。
  - icon: 📚
    title: 24 款数据库扁平化目录
    details: 移除 sql/analytical/nosql 分类嵌套，所有数据库平铺在 /products/ 下，通过元数据标签灵活筛选和对比。
---

## 典型产品推荐

前 5 个为高频使用场景的代表性数据库，其余 19 款可在导航栏「更多」下拉中查看所有完整列表。

| 数据库 | 类型 | 核心优势 | 快速上手 |
| :--- | :--- | :--- | --- |
| [PostgreSQL](/products/postgresql/) | SQL 关系型 | 功能最全面、ACID 标准实现、扩展丰富 | [快速开始](/products/postgresql/) → |
| [MySQL](/products/mysql/) | SQL 关系型 | Web 应用事实标准、性能优秀、生态成熟 | [快速开始](//products/mysql/) → |
| [DuckDB](/products/duckdb/) | 分析型 | MPP 列式存储、嵌入式分析、SQL 兼容性高 | [快速开始](/products/duckdb/) → |
| [MongoDB](/products/mongodb/) | NoSQL 文档 | JSON 文档模型、横向扩展能力强 | [快速开始](/products/mongodb/) → |
| [Redis](/products/redis/) | NoSQL KV | 内存高性能、支持多种数据结构、持久化 | [快速开始](/products/redis/) → |

<div class="grid-container" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; margin-top: 24px;">

<a href="/products/" style="text-decoration: none;">
  <div style="background: var(--vp-c-bg-soft); border: 1px solid var(--vp-c-divider); padding: 20px; border-radius: 12px; height: 100%; transition: all 0.3s ease;">
    <h3 style="margin: 0 0 8px 0; color: var(--vp-c-brand-1);">🗂️ 查看所有 24 款数据库</h3>
    <p style="margin: 0; font-size: 0.875rem; color: var(--vp-c-text-2);">包括 PostgreSQL、MySQL、SQLite、Oracle、ClickHouse、TiDB、CockroachDB、Snowflake、BigQuery、MongoDB、CouchDB、Valkey、DynamoDB、Cassandra、ScyllaDB、Elasticsearch、OpenSearch、Neo4j、InfluxDB、TimescaleDB</p>
  </div>
</a>

<a href="/browser/" style="text-decoration: none;">
  <div style="background: var(--vp-c-bg-soft); border: 1px solid var(--vp-c-divider); padding: 20px; border-radius: 12px; height: 100%; transition: all 0.3s ease;">
    <h3 style="margin: 0 0 8px 0; color: var(--vp-c-brand-1);">🌐 浏览器数据层</h3>
    <p style="margin: 0; font-size: 0.875rem; color: var(--vp-c-text-2);">IndexedDB 原理、OPFS 存储配额、离线优先架构与本地同步机制</p>
  </div>
</a>

<a href="/playground/" style="text-decoration: none;">
  <div style="background: var(--vp-c-bg-soft); border: 1px solid var(--vp-c-divider); padding: 20px; border-radius: 12px; height: 100%; transition: all 0.3s ease;">
    <h3 style="margin: 0 0 8px 0; color: var(--vp-c-brand-1);">⚡ WASM 数据库实验室</h3>
    <p style="margin: 0; font-size: 0.875rem; color: var(--vp-c-text-2);">SQLite、DuckDB、PGlite、SurrealDB、IndexedDB 在线编辑器实时试写</p>
  </div>
</a>

</div>
