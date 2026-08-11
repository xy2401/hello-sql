# 主流关系型数据库

关系数据库共同使用表、键、约束、事务和 SQL，但它们在类型系统、隔离级别、索引、复制和扩展方式上并不相同。

| 数据库 | 主要定位 | 强项 | 浏览器 Live |
| :--- | :--- | :--- | :--- |
| [PostgreSQL](./postgresql/) | 通用 OLTP | 标准 SQL、扩展、复杂类型 | PGlite |
| [MySQL](./mysql/) | Web OLTP | 生态、托管、读扩展 | — |
| [MariaDB](./mariadb/) | MySQL 社区分支 | Galera、多存储引擎 | — |
| [SQLite](./sqlite/) | 嵌入式 | 零配置、单文件、本地优先 | SQLite WASM |
| [SQL Server](./sql-server/) | 企业数据平台 | .NET、Azure、BI | — |
| [Oracle](./oracle/) | 企业关键业务 | RAC、PL/SQL、治理 | — |

## 选型起点

- 不确定时先评估 PostgreSQL。
- 数据属于单设备或单应用实例时评估 SQLite。
- 既有 MySQL、Microsoft 或 Oracle 资产往往比抽象功能表更能决定选择。
- 需要水平扩展或列式分析时进入[分析与分布式 SQL](../analytical/)轨道。
