# TimescaleDB 2.16

> **参考官方文档**：[TimescaleDB 官方发布说明](https://github.com/timescale/timescaledb/releases)  
> 本页依据正式 Release 与现有仓库版本证据，整理 TimescaleDB 2.16 的关键变化、兼容边界和升级检查。

## 版本定位

- **发布时间：** 2024 年 7 月
- **维护状态：** 截至 2026-08-27 的当前重要版本线
- **产品线：** TimescaleDB

## 核心变化

**主要功能与架构演进：**

- 支持对已启用列存压缩（Compressed Chunks）的数据执行直接 DDL 与原地 UPDATE/DELETE
- 进一步降低连续聚合（Continuous Aggregates）后台刷新开销

**工程影响与选型建议：**

> 极大幅度提升了列式时序历史数据的修改灵活性。

## 兼容与迁移

- 先完成备份、恢复演练和官方升级预检，不跨越未受支持的中间版本。
- 在副本、分片或集群环境按官方顺序滚动升级，并监控复制、延迟和错误日志。
- 同步核对客户端驱动、扩展、认证、配置参数与存储格式；回滚能力必须在升级前验证。

## 版本确认

不要根据安装包名称或容器标签推断实际版本，应在目标环境执行：

```sql
SELECT extversion FROM pg_extension WHERE extname = 'timescaledb';
```

生产记录至少应包含完整版本输出、操作系统或运行时基线、架构，以及所用客户端或驱动版本。

## 官方资料

- [TimescaleDB 官方发布说明](https://github.com/timescale/timescaledb/releases)

资料核对日期：2026-08-27。
