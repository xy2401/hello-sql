# DuckDB 核心知识

## 1. 向量化执行引擎（Vectorized Query Execution）

与传统行式引擎逐行处理的 Volcano 迭代器模型不同，DuckDB 采用基于批处理的向量化流水线：
- **DataChunk 传递**：算子之间传递固定大小的内存块（DataChunk），每个列向量紧密排列。
- **SIMD 加速**：利用现代 CPU 的 AVX2/AVX-512/NEON 指令集对整批数据同时执行比较与运算，大幅减少函数调用开销。

## 2. 超内存外存计算（Out-of-Core Processing）

当查询的数据量远超机器物理内存时，DuckDB 会自动将中间计算状态（如哈希聚合表、排序临时数据）溢出到本地临时目录，避免 OOM 奔溃。
