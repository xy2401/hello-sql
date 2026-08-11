# SQL 方言与查询能力

| 能力 | PostgreSQL | MySQL | SQLite | SQL Server | Oracle | DuckDB |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| CTE / 递归 CTE | 完整 | 支持 | 支持 | 支持 | 支持 | 支持 |
| 窗口函数 | 丰富 | 支持 | 支持 | 丰富 | 丰富 | 分析优先 |
| FULL OUTER JOIN | 支持 | 不直接支持 | 支持 | 支持 | 支持 | 支持 |
| UPSERT | `ON CONFLICT` | `ON DUPLICATE KEY` | `ON CONFLICT` | `MERGE` | `MERGE` | `ON CONFLICT` |
| 返回写入行 | `RETURNING` | 能力有限 | `RETURNING` | `OUTPUT` | `RETURNING INTO` | `RETURNING` |
| JSON | JSON/JSONB | JSON | JSON 函数 | JSON 函数 | 原生 JSON | JSON / 嵌套类型 |
| 过程语言 | PL/pgSQL + 扩展 | Stored Program | 无服务端过程 | T-SQL | PL/SQL | 不以过程语言为目标 |

迁移时必须针对真实 Schema 和查询回归测试。协议兼容、语法兼容和行为兼容是三件不同的事。
