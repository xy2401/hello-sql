# MariaDB 10.6 LTS

> **参考官方文档**：[MariaDB 官方发布说明](https://mariadb.com/docs/release-notes/mariadb-community-server-release-notes)  
> 本页依据正式 Release 与现有仓库版本证据，整理 MariaDB 10.6 LTS 的关键变化、兼容边界和升级检查。

## 版本定位

- **发布时间：** 2021 年 7 月
- **维护状态：** 历史版本或兼容基线；实际维护状态以官方页面为准
- **产品线：** MariaDB

## 核心变化

**主要功能与架构演进：**

- 原生内置原子 DDL 改进与兼容 Oracle 语法的 PL/SQL 增强
- 支持针对 JSON 字段的更多快捷操作符

**工程影响与选型建议：**

> 企业异构数据库迁移的重要跳板。

## 兼容与迁移

- 先完成备份、恢复演练和官方升级预检，不跨越未受支持的中间版本。
- 在副本、分片或集群环境按官方顺序滚动升级，并监控复制、延迟和错误日志。
- 同步核对客户端驱动、扩展、认证、配置参数与存储格式；回滚能力必须在升级前验证。

## 版本确认

不要根据安装包名称或容器标签推断实际版本，应在目标环境执行：

```bash
mariadb --version
```

生产记录至少应包含完整版本输出、操作系统或运行时基线、架构，以及所用客户端或驱动版本。

## 官方资料

- [MariaDB 官方发布说明](https://mariadb.com/docs/release-notes/mariadb-community-server-release-notes)

资料核对日期：2026-08-27。
