# CouchDB 核心知识

- **MVCC 与文档版本号 (`_rev`)**：更新文档必须携带最新 `_rev`，若版本过时则返回 `409 Conflict`。
