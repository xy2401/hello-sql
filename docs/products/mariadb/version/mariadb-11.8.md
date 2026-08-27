# MariaDB 11.8 LTS

> **参考官方文档**：[MariaDB 官方发布说明](https://mariadb.com/docs/release-notes/mariadb-community-server-release-notes)  
> 本页依据正式 Release 与现有仓库版本证据，整理 MariaDB 11.8 LTS 的关键变化、兼容边界和升级检查。

## 版本定位

- **发布时间：** 2025 年 6 月
- **维护状态：** 截至 2026-08-27 的当前重要版本线
- **产品线：** MariaDB

## 核心变化

- 成为新的长期维护系列
- 汇总 11.5–11.7 滚动版本中的查询、复制、备份和可观测性改进
- 继续扩大与 MySQL 8.x 的语法及系统行为差异

## 兼容与迁移

- 从 10.11 或 11.4 LTS 升级时需执行官方升级检查，重新验证 Galera、复制和客户端驱动，不应按 MySQL 兼容版本直接推断。

## 版本确认

不要根据安装包名称或容器标签推断实际版本，应在目标环境执行：

```bash
mariadb --version
```

生产记录至少应包含完整版本输出、操作系统或运行时基线、架构，以及所用客户端或驱动版本。

## 官方资料

- [MariaDB 官方发布说明](https://mariadb.com/docs/release-notes/mariadb-community-server-release-notes)

资料核对日期：2026-08-27。
