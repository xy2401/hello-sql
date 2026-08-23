# Browser Database 核心知识

## 核心架构考量

- **OPFS 与 Web Worker 隔离**：由于高速同步文件句柄（SyncAccessHandle）仅允许在 Worker 线程中调用，前端通常将数据库内核置于 Worker，主线程通过 RPC 交互。
- **Local-First 数据同步模式**：本地离线即时读写，后台通过 CRDTs（冲突解决数据类型）或状态机与云端平滑双向同步。
