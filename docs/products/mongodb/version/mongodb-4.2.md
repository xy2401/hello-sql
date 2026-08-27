# MongoDB 4.2

> **参考官方文档**：[MongoDB 官方发布说明](https://www.mongodb.com/docs/manual/release-notes/)  
> 本页依据正式 Release 与现有仓库版本证据，整理 MongoDB 4.2 的关键变化、兼容边界和升级检查。

## 版本定位

- **发布时间：** 2019 年 8 月
- **维护状态：** 历史版本或兼容基线；实际维护状态以官方页面为准
- **产品线：** MongoDB

## 核心变化

**主要功能与架构演进：**

- 正式引入分布式事务（Distributed Multi-Document ACID Transactions），跨分片多文档一致性保障
- 字段级加密（Client-Side Field Level Encryption, CSFLE）
- 聚合管道可直接作为 update 操作的更新表达式

**工程影响与选型建议：**

> 开启了 MongoDB 支持跨分片分布式事务的里程碑。

## 兼容与迁移

- 先完成备份、恢复演练和官方升级预检，不跨越未受支持的中间版本。
- 在副本、分片或集群环境按官方顺序滚动升级，并监控复制、延迟和错误日志。
- 同步核对客户端驱动、扩展、认证、配置参数与存储格式；回滚能力必须在升级前验证。

## 版本确认

不要根据安装包名称或容器标签推断实际版本，应在目标环境执行：

```bash
mongod --version
```

生产记录至少应包含完整版本输出、操作系统或运行时基线、架构，以及所用客户端或驱动版本。

## 官方资料

- [MongoDB 官方发布说明](https://www.mongodb.com/docs/manual/release-notes/)

资料核对日期：2026-08-27。
