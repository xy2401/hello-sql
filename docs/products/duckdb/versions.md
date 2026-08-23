# DuckDB 版本演进

- **DuckDB 1.0.0+（里程碑基线）**：
  - **存储文件格式稳定承诺（Storage Format Stability）**：从 1.0 开始，本地 `.duckdb` 文件的物理格式承诺向前兼容。
  - **社区扩展安全签名机制**：支持安全自动下载与加载 `httpfs`, `spatial`, `postgres_scanner` 等扩展。
