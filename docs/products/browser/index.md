# Browser Database 概览

> **定位**：运行在浏览器安全沙箱内的原生数据库，以 IndexedDB 的事务对象仓库存储结构化数据，并与 OPFS 等持久化能力共同构成本地数据层。

## 基础属性与架构形态

| 属性维度 | 规格与特性说明 |
| :--- | :--- |
| **数据模型** | NoSQL · 浏览器原生 |
| **查询接口** | IndexedDB JavaScript API；通过 IDBRequest、事务、Object Store 与 Index 访问数据。 |
| **开源许可证** | Web Standard |
| **部署形态** | 浏览器内置，无独立服务器 · Worker 可承载数据库与 OPFS 文件 I/O · 站点数据清理、隐私模式和浏览器兼容性会影响持久化 |

## 模型与查询语言

### 数据表达模型

IndexedDB 使用数据库、对象仓库、记录、主键和二级索引；OPFS 为 SQLite、PGlite 等浏览器数据库提供文件持久化。

### 查询交互方式

IndexedDB JavaScript API；通过 IDBRequest、事务、Object Store 与 Index 访问数据。

## 事务、索引与扩展机制

### 事务与一致性保障

- IndexedDB 提供只读与读写事务
- 事务作用域由对象仓库集合确定
- 事件循环中的异步边界会影响事务存活时间

### 索引与查询优化

- 对象仓库按 keyPath 或显式键组织记录
- IDBIndex 提供派生键查询
- 查询能力围绕键、索引和游标，不支持通用 SQL

### 复制、分片与高可用扩展

- 数据隔离在同源范围内
- 容量受浏览器配额和存储回收策略约束
- 跨设备同步需要应用协议，不能直接复制内部存储

## 适用边界与选型决策

### 适合场景

- ✅ 离线与本地优先 Web 应用
- ✅ 结构化客户端状态和 Blob
- ✅ 浏览器内数据库与 WASM 数据库持久化

### 局限与约束

- ⚠️ 没有统一 SQL 查询接口
- ⚠️ 配额与持久化策略由浏览器控制
- ⚠️ 多设备同步、身份和冲突处理由应用负责

::: tip 架构选型建议
Web 应用需要可靠的本地结构化数据、事务和索引时，应把 Browser Database 作为正式数据库层设计，而不是退化为 localStorage。
:::

## 页面内 Live 实验

当前产品已接入正式 WebAssembly 交互式运行环境。可直接在下方编写并运行指令：

<DatabaseWorkbench engine="indexeddb" title="Browser Database Live" />
