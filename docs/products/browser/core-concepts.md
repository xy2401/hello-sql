# Browser Database 核心知识

- **OPFS 与 Worker 隔离**：同步文件句柄仅允许在 Web Worker 中调用，主线程通过 RPC 异步通信。
- **Local-First 数据同步模式**：本地离线即时读写，后台通过 CRDTs 或版本向量与云端平滑双向同步。
