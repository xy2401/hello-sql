# OpenSearch 3.0

> **参考官方文档**：[OpenSearch 官方发布说明](https://docs.opensearch.org/latest/version-history/)  
> 本页依据正式 Release 与现有仓库版本证据，整理 OpenSearch 3.0 的关键变化、兼容边界和升级检查。

## 版本定位

- **发布时间：** 2025 年 5 月
- **维护状态：** 截至 2026-08-27 的当前重要版本线
- **产品线：** OpenSearch

## 核心变化

- 升级到 Lucene 10，改善索引和向量搜索
- 加入实验性 gRPC、Kafka/Kinesis 拉取式摄取和 GPU 向量加速
- 为语义搜索、代理和可观测性建立新的 3.x 基线

## 兼容与迁移

- 从 2.x 升级时应检查插件矩阵、Lucene 索引兼容、弃用 API、快照恢复和安全配置。

## 版本确认

不要根据安装包名称或容器标签推断实际版本，应在目标环境执行：

```bash
curl -s http://127.0.0.1:9200/
```

生产记录至少应包含完整版本输出、操作系统或运行时基线、架构，以及所用客户端或驱动版本。

## 官方资料

- [OpenSearch 官方发布说明](https://docs.opensearch.org/latest/version-history/)

资料核对日期：2026-08-27。
