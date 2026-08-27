# ClickHouse 22.8 LTS

> **参考官方文档**：[ClickHouse 官方发布说明](https://clickhouse.com/docs/whats-new/changelog/)  
> 本页依据正式 Release 与现有仓库版本证据，整理 ClickHouse 22.8 LTS 的关键变化、兼容边界和升级检查。

## 版本定位

- **发布时间：** 2022 年 8 月
- **维护状态：** 历史版本或兼容基线；实际维护状态以官方页面为准
- **产品线：** ClickHouse

## 核心变化

**主要功能与架构演进：**

- 正式引入 ClickHouse Keeper 作为 Raft 一致性元数据引擎替代 ZooKeeper
- 支持 JSON Object 类型原生列式存储与投影索引（Projection Index）

**工程影响与选型建议：**

> 集群架构去 Java 依赖、纯 C++ 化的关键分水岭。

## 兼容与迁移

- 先完成备份、恢复演练和官方升级预检，不跨越未受支持的中间版本。
- 在副本、分片或集群环境按官方顺序滚动升级，并监控复制、延迟和错误日志。
- 同步核对客户端驱动、扩展、认证、配置参数与存储格式；回滚能力必须在升级前验证。

## 版本确认

不要根据安装包名称或容器标签推断实际版本，应在目标环境执行：

```bash
clickhouse-server --version
```

生产记录至少应包含完整版本输出、操作系统或运行时基线、架构，以及所用客户端或驱动版本。

## 官方资料

- [ClickHouse 官方发布说明](https://clickhouse.com/docs/whats-new/changelog/)

资料核对日期：2026-08-27。
