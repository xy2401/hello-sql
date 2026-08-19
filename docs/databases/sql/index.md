# 关系型数据库

关系数据库共同使用表、键、约束、事务和 SQL，但它们在类型系统、隔离级别、索引、复制和扩展方式上并不相同。

<DatabaseCatalogGrid category="sql" />

## 选型起点

- 不确定时先评估 PostgreSQL。
- 数据属于单设备或单应用实例时评估 SQLite。
- 既有 MySQL、Microsoft 或 Oracle 资产往往比抽象功能表更能决定选择。
- 需要水平扩展或列式分析时进入[分析与分布式 SQL](../analytical/)轨道。
