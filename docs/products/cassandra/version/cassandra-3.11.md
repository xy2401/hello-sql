# Cassandra 3.11

> **参考官方文档**：[Apache Cassandra 官方发布说明](https://cassandra.apache.org/_/download.html)  
> 本页依据正式 Release 与现有仓库版本证据，整理 Cassandra 3.11 的关键变化、兼容边界和升级检查。

## 版本定位

- **发布时间：** 2017 年 6 月
- **维护状态：** 历史版本或兼容基线；实际维护状态以官方页面为准
- **产品线：** Apache Cassandra

## 核心变化

**主要功能与架构演进：**

- 引入 SASI（SSTable-Attached Secondary Index）实验特性与物化视图（Materialized Views）
- 完善 CQL 集合操作与轻量级事务（LWT）

**工程影响与选型建议：**

> 长期广泛部署的历史基线（已 EOL，建议全面升级至 4.x/5.0）。

## 兼容与迁移

- 先完成备份、恢复演练和官方升级预检，不跨越未受支持的中间版本。
- 在副本、分片或集群环境按官方顺序滚动升级，并监控复制、延迟和错误日志。
- 同步核对客户端驱动、扩展、认证、配置参数与存储格式；回滚能力必须在升级前验证。

## 版本确认

不要根据安装包名称或容器标签推断实际版本，应在目标环境执行：

```bash
cassandra -v
```

生产记录至少应包含完整版本输出、操作系统或运行时基线、架构，以及所用客户端或驱动版本。

## 官方资料

- [Apache Cassandra 官方发布说明](https://cassandra.apache.org/_/download.html)

资料核对日期：2026-08-27。
