# Elasticsearch 核心知识

- **倒排索引（Inverted Index）** 与 **Doc Values**：前者服务快速全文词项定位，后者提供列式排序与聚合。
- **近实时刷新（Refresh vs Flush）**：默认 1 秒刷新生成新 Lucene Segment，后台自动归并碎片。
