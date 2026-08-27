# CockroachDB v26.1

> **参考官方文档**：[CockroachDB v26.1 文档](https://www.cockroachlabs.com/docs/v26.1/) · [版本支持策略](https://www.cockroachlabs.com/docs/releases/release-support-policy)

CockroachDB v26.1 于 2026 年 2 月面向云服务和自托管环境正式提供。本页只记录已发布能力，不包含 Preview 版本。

## 版本定位

- **发布时间：** 2026 年 2 月
- **维护状态：** 截至 2026-08-27 的当前重要版本线
- **运行基线：** CockroachDB Cloud 或官方支持的自托管 Linux 平台

## 核心变化

- 加强企业身份、安全与合规集成，便于把数据库接入既有安全基础设施。
- 延续分布式 SQL、跨地域部署和在线扩缩容模型；升级评估仍需覆盖地域生存目标、范围副本和 SQL 行为。
- 运维侧继续以官方 DB Console、指标与事件信息核对集群健康状态。

## 兼容与迁移

- CockroachDB 不支持任意跨越版本线升级；先按官方支持路径升级到允许的中间版本。
- 升级前执行备份与恢复演练，检查弃用设置、集群设置、SQL 客户端和 ORM 兼容性。
- 滚动升级结束前不要执行不可逆的版本固化操作；保留官方文档要求的回退窗口。

## 版本确认

```bash
cockroach version
cockroach node status --certs-dir=certs --host=localhost:26257
```

## 官方资料

- [CockroachDB v26.1 文档](https://www.cockroachlabs.com/docs/v26.1/)
- [CockroachDB 发布与支持策略](https://www.cockroachlabs.com/docs/releases/)

资料核对日期：2026-08-27。
