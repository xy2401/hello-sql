# Elasticsearch 9.0

> **参考官方文档**：[Elasticsearch 官方发布说明](https://www.elastic.co/docs/release-notes/elasticsearch)  
> 本页依据正式 Release 与现有仓库版本证据，整理 Elasticsearch 9.0 的关键变化、兼容边界和升级检查。

## 版本定位

- **发布时间：** 2025 年
- **维护状态：** 截至 2026-08-27 的当前重要版本线
- **产品线：** Elasticsearch

## 核心变化

- 加入面向多向量后排序的 `rank_vectors` 字段
- 扩展 ES|QL 查询与 LOOKUP JOIN 能力
- 使用 Entitlements 取代 Java SecurityManager，并更新随附 JDK 基线

## 兼容与迁移

- 只能从受支持的 8.x 最后版本升级；必须先处理弃用日志、插件、索引兼容、SecurityManager 假设和已移除 API。

## 版本确认

不要根据安装包名称或容器标签推断实际版本，应在目标环境执行：

```bash
curl -s http://127.0.0.1:9200/
```

生产记录至少应包含完整版本输出、操作系统或运行时基线、架构，以及所用客户端或驱动版本。

## 官方资料

- [Elasticsearch 官方发布说明](https://www.elastic.co/docs/release-notes/elasticsearch)

资料核对日期：2026-08-27。
