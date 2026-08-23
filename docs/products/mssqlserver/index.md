# Microsoft SQL Server 概览

> **定位**：与 .NET、Azure 和 Microsoft BI 生态深度集成的企业级关系数据库。

## 基础属性与架构形态

| 属性维度 | 规格与特性说明 |
| :--- | :--- |
| **数据模型** | 关系型 · 企业 OLTP/BI |
| **查询接口** | T-SQL；TOP、APPLY、MERGE、存储过程和系统函数具有明显方言特征。 |
| **开源许可证** | Commercial / Developer |
| **部署形态** | Windows/Linux 自托管 · Azure SQL 多种托管形态 · 没有浏览器 WASM 版本 |

## 模型与查询语言

### 数据表达模型

关系表为核心，支持 JSON、XML、图表、列存储和内存优化表。

### 查询交互方式

T-SQL；TOP、APPLY、MERGE、存储过程和系统函数具有明显方言特征。

## 事务、索引与扩展机制

### 事务与一致性保障

- ACID、锁与行版本并存
- Read Committed 默认，可开启快照隔离
- Always On 面向高可用

### 索引与查询优化

- 聚集/非聚集 B-tree
- 列存储、全文、空间与内存优化索引
- Query Store 辅助计划回归分析

### 复制、分片与高可用扩展

- Always On 可用性组
- 分区、读副本与 Azure 弹性能力
- 水平分片通常在应用或云层实现

## 适用边界与选型决策

### 适合场景

- ✅ .NET 与 Microsoft 数据平台
- ✅ 企业 ERP、报表和混合事务分析
- ✅ 需要成熟商业支持的组织

### 局限与约束

- ⚠️ 许可与版本功能边界复杂
- ⚠️ 跨平台生态仍以 Microsoft 工具为中心
- ⚠️ 云产品之间兼容能力需逐项确认

::: tip 架构选型建议
组织已经采用 .NET、Azure、Power BI 或需要 Microsoft 商业支持时具有明显协同优势。
:::
