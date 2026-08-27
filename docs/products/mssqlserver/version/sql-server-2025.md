# SQL Server 2025（17.x）

> **参考官方文档**：[SQL Server 官方发布说明](https://learn.microsoft.com/sql/sql-server/what-s-new-in-sql-server-2025)  
> 本页依据正式 Release 与现有仓库版本证据，整理 SQL Server 2025（17.x） 的关键变化、兼容边界和升级检查。

## 版本定位

- **发布时间：** 2025 年
- **维护状态：** 截至 2026-08-27 的当前重要版本线
- **产品线：** SQL Server

## 核心变化

- 加入向量数据类型、向量函数和向量索引能力
- 扩展变更事件流、查询智能处理、安全和 Microsoft Fabric 集成
- 更新数据库引擎、开发工具与 AI 工作负载支持

## 兼容与迁移

- 升级时重点检查 OLE DB Driver 19 的加密默认值、链接服务器、复制、日志传送与全文检索等官方破坏性变更。

## 版本确认

不要根据安装包名称或容器标签推断实际版本，应在目标环境执行：

```sql
SELECT @@VERSION;
```

生产记录至少应包含完整版本输出、操作系统或运行时基线、架构，以及所用客户端或驱动版本。

## 官方资料

- [SQL Server 官方发布说明](https://learn.microsoft.com/sql/sql-server/what-s-new-in-sql-server-2025)

资料核对日期：2026-08-27。
