# MongoDB 核心知识

## 核心心智模型

### 1. 索引与复合索引最左前缀

- 嵌套字段与数组索引：支持对文档内部字段 `"user.address.city"` 或数组元素建立多键索引（Multikey Index）。
- 复合索引必须遵守 ESR 原则（Equality -> Sort -> Range）。

### 2. 聚合管道（Aggregation Pipeline）优化

管道由多个 Stage 组成（如 `$match` -> `$group` -> `$project` -> `$sort`）。务必将 `$match` 放在首位以便优化器利用索引尽早过滤数据。
