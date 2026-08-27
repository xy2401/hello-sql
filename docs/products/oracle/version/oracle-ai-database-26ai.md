# Oracle AI Database 26ai

> **参考官方文档**：[Oracle AI Database 官方发布说明](https://docs.oracle.com/en/database/oracle/oracle-database/26/nfcoa/)  
> 本页依据正式 Release 与现有仓库版本证据，整理 Oracle AI Database 26ai 的关键变化、兼容边界和升级检查。

## 版本定位

- **发布时间：** 2025 年 10 月
- **维护状态：** 截至 2026-08-27 的当前重要版本线
- **产品线：** Oracle AI Database

## 核心变化

- 成为下一代长期支持版本并取代 23ai 品牌线
- 扩展 AI Vector Search、JSON Relational Duality 与面向代理的数据能力
- 通过 23.26 Release Update 路径承接既有 23ai 部署

## 兼容与迁移

- 需按具体平台、RU 与许可核对可用特性；从 23ai 进入 26ai 前确认认证矩阵、客户端、备份恢复和 Data Guard。

## 版本确认

不要根据安装包名称或容器标签推断实际版本，应在目标环境执行：

```sql
SELECT banner_full FROM v$version;
```

生产记录至少应包含完整版本输出、操作系统或运行时基线、架构，以及所用客户端或驱动版本。

## 官方资料

- [Oracle AI Database 官方发布说明](https://docs.oracle.com/en/database/oracle/oracle-database/26/nfcoa/)

资料核对日期：2026-08-27。
