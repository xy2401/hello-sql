# SQLite 概览

SQLite 是一款极轻量、自包含、无独立服务器进程、零配置的嵌入式 SQL 数据库引擎，广泛运行于移动端设备、浏览器（WASM）、桌面客户端以及 Edge 边缘计算节点。

## 核心特性

- **进程内运行**：直接链接到宿主应用程序进程中，没有进程间通信（IPC）与网络协议开销，读性能极高。
- **单文件存储**：整个数据库（Schema、索引、数据）完整存储在一个跨平台的普通磁盘文件中。
- **类型亲和性（Type Affinity）与严格模式**：历史上采用动态类型，现代版本引入 `STRICT` 表支持显式类型校验。

## 页面内 Live 实验

当前页面已集成 SQLite WebAssembly 引擎，可直接在下方测试 SQL：

<DatabaseWorkbench engine="sqlite" title="SQLite Live" />
