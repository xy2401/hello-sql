# SQLite 版本演进

SQLite 采用稳定的 3.x 命名体系，保持极强的文件格式前向与后向兼容性。

## 近期重要特性演进

- **SQLite 3.37+**：引入 `STRICT` 表语法（`CREATE TABLE t (...) STRICT;`），可强制校验字段类型。
- **SQLite 3.38+**：原生内置标准 JSON 运算符（`->` 与 `->>`）。
- **SQLite 3.45+**：重构了 JSONB 内部二进制格式，解析速度大幅提升。
