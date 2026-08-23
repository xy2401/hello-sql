# DuckDB 概览

DuckDB 是一款专为分析型查询（OLAP）设计的进程内（In-process）列式 SQL 数据库引擎，常被称为“分析数据库领域的 SQLite”。

## 核心优势

- **列式存储与向量化执行**：采用按列组织的存储模型和基于向量化（Vectorized / Chunk-based）的流水线执行引擎。
- **无缝集成数据生态**：原生零拷贝直读 Parquet、CSV、JSON 文件以及 Arrow 内存表。
- **超内存外存计算（Out-of-Core Processing）**：当数据量超过机器物理内存时，能平滑利用磁盘临时溢出完成聚合与排序，避免 OOM 崩溃。

## 页面内 Live 实验

当前环境已挂载 DuckDB-WASM，可直接在浏览器中执行高速列式分析查询：

<DatabaseWorkbench engine="duckdb" title="DuckDB Live" />
