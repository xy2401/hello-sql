# SQLite 核心知识

## 核心心智模型

### 1. WAL 模式与并发模型

SQLite 支持两种日志模式：
- **Rollback Journal（默认回滚日志）**：写操作会排他锁定整个数据库文件，读写互斥。
- **WAL 模式（Write-Ahead Log）**：
  - 写入操作追加到 `.wal` 文件，读操作直接读取主库文件与 WAL 结合的视图。
  - **实现单写多读（1 个写者与 N 个并发读者完全互不阻塞）**。

```sql
-- 生产环境推荐开启 WAL 模式与合理超时
PRAGMA journal_mode = WAL;
PRAGMA busy_timeout = 5000;
PRAGMA synchronous = NORMAL;
```

### 2. 避免网络文件系统（NFS/SMB）文件锁陷阱

SQLite 严重依赖操作系统底层的 POSIX / Win32 文件锁机制。在 NFS 等网络共享盘上挂载 SQLite 会因文件锁实现不完整导致数据库静默损坏。
