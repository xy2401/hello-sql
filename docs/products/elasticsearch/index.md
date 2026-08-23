# Elasticsearch 概览

Elasticsearch 是基于 Apache Lucene 构建的分布式搜索与实时分析引擎，广泛应用于全文搜索、应用日志聚合（ELK Stack）以及指标时序分析。

## 核心特性

- **倒排索引（Inverted Index）**：将文本分词并建立词项到文档 ID 的映射，实现亚秒级关键词检索。
- **列式 Doc Values**：用于快速字段排序、聚合（Aggregation）与过滤。
- **分片与副本机制**：索引被拆分为多个主分片（Primary Shards）和副本分片（Replica Shards）分布于集群。
