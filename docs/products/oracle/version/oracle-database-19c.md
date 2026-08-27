# Oracle Database 19c

> **参考官方文档**：[Oracle AI Database 官方发布说明](https://docs.oracle.com/en/database/oracle/oracle-database/26/nfcoa/)  
> 本页依据正式 Release 与现有仓库版本证据，整理 Oracle Database 19c 的关键变化、兼容边界和升级检查。

## 版本定位

- **发布时间：** 2019 年 4 月
- **维护状态：** 历史版本或兼容基线；实际维护状态以官方页面为准
- **产品线：** Oracle AI Database

## 核心变化

**主要功能与架构演进：**

- 当前企业最主要的长期支持版（Long Term Release），享有长效维护周期
- 支持自动索引（Automatic Indexing，机器学习自动创建/测试/删除索引）
- Active Data Guard 支持重定向 DML 到主库执行

**工程影响与选型建议：**

> 全球绝大多数金融与核心生产系统的基石版本。

## 兼容与迁移

- 先完成备份、恢复演练和官方升级预检，不跨越未受支持的中间版本。
- 在副本、分片或集群环境按官方顺序滚动升级，并监控复制、延迟和错误日志。
- 同步核对客户端驱动、扩展、认证、配置参数与存储格式；回滚能力必须在升级前验证。

## 版本确认

不要根据安装包名称或容器标签推断实际版本，应在目标环境执行：

```sql
SELECT banner_full FROM v$version;
```

生产记录至少应包含完整版本输出、操作系统或运行时基线、架构，以及所用客户端或驱动版本。

## 官方资料

- [Oracle AI Database 官方发布说明](https://docs.oracle.com/en/database/oracle/oracle-database/26/nfcoa/)

资料核对日期：2026-08-27。
