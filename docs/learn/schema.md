<script setup>
import { schemaExample } from '../.vitepress/theme/data/lessonExamples';
</script>

# DDL、约束与数据建模

Schema 不只是存储布局，也是数据契约。`NOT NULL`、`CHECK`、`UNIQUE`、外键和正确的数据类型，应尽量在数据库边界表达。

## 建模原则

1. 先确定实体身份和业务唯一性，再决定代理主键。
2. 把必须始终成立的不变量写成约束。
3. 规范化减少更新异常；反规范化必须由可测的读取收益驱动。
4. JSON 适合边界字段，不应成为逃避关系建模的默认容器。

<DatabaseWorkbench engine="sqlite" title="DDL、约束与唯一性" :initial-source="schemaExample" />
