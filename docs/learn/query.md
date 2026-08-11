<script setup>
import { queryExample } from '../.vitepress/theme/data/lessonExamples';
</script>

# 查询与过滤

## 查询的逻辑顺序

理解 `FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT` 的逻辑顺序，比背书写顺序更重要。列别名通常不能直接在 `WHERE` 使用，就是因为过滤发生在投影之前。

## NULL 不是普通值

`NULL` 表示未知或缺失。比较需要 `IS NULL`，布尔表达式采用三值逻辑。`NOT IN` 子查询一旦包含 `NULL`，常产生意外结果；存在性判断优先考虑 `EXISTS`。

## 页面内 Live

<DatabaseWorkbench engine="sqlite" title="SELECT、WHERE 与排序" :initial-source="queryExample" />
