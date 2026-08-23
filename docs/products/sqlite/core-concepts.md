# SQLite 核心知识

## 核心心智模型

- **WAL 模式（Write-Ahead Log）**：启用 `PRAGMA journal_mode = WAL;`，实现 1 个写者与 N 个并发读者互不阻塞。
- **禁止在网络文件系统（NFS/SMB）上挂载**：因锁机制实现不完整会导致数据库静默损坏。
