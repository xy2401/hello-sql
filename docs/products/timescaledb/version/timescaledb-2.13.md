# TimescaleDB 2.13

> **参考官方文档**：[TimescaleDB 官方发布说明](https://github.com/timescale/timescaledb/releases)  
> 本页依据正式 Release 与现有仓库版本证据，整理 TimescaleDB 2.13 的关键变化、兼容边界和升级检查。

## 版本定位

- **发布时间：** 2023 年 11 月
- **维护状态：** 历史版本或兼容基线；实际维护状态以官方页面为准
- **产品线：** TimescaleDB

## 核心变化

**主要功能与架构演进：**

- 全面适配 PostgreSQL 16 宿主版本
- 优化基于时间桶的 SIMD 向量化聚合计算

**工程影响与选型建议：**

> 与新版本 PG 协同的主流生产版本。

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
