# MySQL 9.x Innovation

> **参考官方文档**：[MySQL 官方发布说明](https://dev.mysql.com/doc/relnotes/mysql/9.7/en/)  
> 本页依据正式 Release 与现有仓库版本证据，整理 MySQL 9.x Innovation 的关键变化、兼容边界和升级检查。

## 版本定位

- **发布时间：** 2024–2026 年
- **维护状态：** 截至 2026-08-27 的当前重要版本线
- **产品线：** MySQL

## 核心变化

- 9.x 延续 Innovation 发布轨道，持续交付优化器、复制、安全与 SQL 能力
- 9.0 清理 8.x 已弃用功能，后续 9.1–9.7 按季度累计功能
- LTS 与 Innovation 的支持周期、升级节奏和风险模型不同

## 兼容与迁移

- 生产系统应先决定采用 LTS 还是 Innovation 轨道；跨版本前运行 MySQL Shell Upgrade Checker 并核对已删除变量、认证插件与复制拓扑。

## 版本确认

不要根据安装包名称或容器标签推断实际版本，应在目标环境执行：

```bash
mysql --version
```

生产记录至少应包含完整版本输出、操作系统或运行时基线、架构，以及所用客户端或驱动版本。

## 官方资料

- [MySQL 官方发布说明](https://dev.mysql.com/doc/relnotes/mysql/9.7/en/)

资料核对日期：2026-08-27。
