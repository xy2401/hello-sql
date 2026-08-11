<script setup>
import { joinExample } from '../.vitepress/theme/data/lessonExamples';
</script>

# 聚合、JOIN 与子查询

## 先确定结果粒度

每一行代表什么，是写聚合查询前必须回答的问题。`GROUP BY` 决定结果粒度；JOIN 前若两边都不是唯一键，行数可能乘法增长。

## JOIN 不是“查两个表”

- `INNER JOIN` 保留匹配组合。
- `LEFT JOIN` 保留左侧粒度，右侧缺失补 `NULL`。
- 半连接通常用 `EXISTS`，反连接通常用 `NOT EXISTS`。
- 相关子查询是否高效取决于优化器能否改写和索引是否支持。

<DatabaseWorkbench engine="sqlite" title="JOIN 与条件聚合" :initial-source="joinExample" />
