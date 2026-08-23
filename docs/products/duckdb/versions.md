# DuckDB 版本演进

## 版本里程碑

- **DuckDB 1.0.0+（正式稳定基线）**：
  - **存储文件格式稳定（Storage Format Stability）**：从 1.0 开始，本地 `.duckdb` 单文件存储格式承诺向前兼容。
  - **社区扩展签名验证**：保障动态下载 extension（如 `httpfs`, `spatial`, `postgres_scanner`）的安全性。
