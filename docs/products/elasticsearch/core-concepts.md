# Elasticsearch 核心知识

## 核心机制

### 1. 近实时搜索（Near Real-Time）

- 写入的数据先进入内存 Buffer，每隔 `refresh_interval`（默认 1s）刷新生成新的不可变 Lucene Segment，数据立即可搜。
- 后台通过 Segment Merge 归并碎片并物理删除已标记废弃的文档。

### 2. 字段类型与分词器

- `text`：经过分词器（Analyzer）拆分，适合全文搜索。
- `keyword`：精确值不分词，适合过滤、聚合与排序。
