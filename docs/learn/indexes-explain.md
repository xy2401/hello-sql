<script setup>
import { explainExample } from '../.vitepress/theme/data/lessonExamples';
</script>

# 索引与执行计划

索引是额外维护的数据结构，用写入、存储和缓存换取特定访问路径。组合索引的列顺序应服务过滤、连接和排序，而不是按字段“重要程度”排列。

## 不靠猜测优化

1. 用真实参数和数据分布获取执行计划。
2. 区分估算行数与实际行数。
3. 检查扫描、连接算法、排序和临时结果。
4. 修改索引或 SQL 后重新测量整体工作负载。

<DatabaseWorkbench engine="sqlite" title="索引与 EXPLAIN QUERY PLAN" :initial-source="explainExample" />
