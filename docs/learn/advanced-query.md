<script setup>
import { windowExample } from '../.vitepress/theme/data/lessonExamples';
</script>

# CTE 与窗口函数

CTE 给复杂查询命名，但它是否物化取决于数据库和提示。窗口函数不会像 `GROUP BY` 那样折叠行，而是在分区内计算排名、累计、移动平均和前后值。

## 常用窗口维度

`PARTITION BY` 决定分组，`ORDER BY` 决定窗口顺序，Frame 决定当前行看到的范围。默认 Frame 在有重复排序键时可能不是“截至当前物理行”，应显式理解 `ROWS` 与 `RANGE`。

<DatabaseWorkbench engine="sqlite" title="CTE 与窗口排名" :initial-source="windowExample" />
