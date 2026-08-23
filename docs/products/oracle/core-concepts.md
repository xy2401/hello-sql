# Oracle 核心知识

- **Undo 机制与一致性读**：长查询因 Undo 被覆写会触发经典的 `ORA-01555: snapshot too old`，需合理规划 Undo Tablespace。
