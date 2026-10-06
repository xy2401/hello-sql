# Browser Database 总览

随着 WebAssembly（WASM）与现代 Web API 的演进，浏览器端已具备运行完整独立数据库的能力，成为**本地优先（Local-First）**架构的核心基石。

## 浏览器端数据库生态格局

1. **IndexedDB**：浏览器原生内置的异步键值与对象存储系统。
2. **SQLite-WASM + OPFS**：利用 Origin Private File System 高速私有文件系统实现近原生单机持久化。
3. **PGlite**：把完整的 PostgreSQL 编译为单个轻量 WASM 二进制包，直接在前端支持复杂 SQL、事务与向量计算。
4. **DuckDB-WASM**：前端毫秒级执行百万行数据列式 OLAP 聚合。

::: tip 在线实验环境
可在 [WASM 数据库实验台](/playground/) 体验 SQLite-WASM、DuckDB-WASM、PGlite 等浏览器数据库的实际运行。
:::

## 适用边界

适合浏览器本地数据与离线学习；持久化受同源、配额和浏览器能力限制，页面实验不提供服务端集群。

## 版本阅读范围

[完整版本目录](./version/)收录本仓库已有专题（如 indexeddb-2.0-w3c、indexeddb-3.0、opfs-syncaccesshandle）。这些是教学与兼容性对照入口；运行环境的具体版本以安装页、工作台或采集证据为准。

## 推荐学习路线

[安装与环境](./install) → [核心概念](./core-concepts) → [命令行工具](./cli) → [完整版本目录](./version/)。先完成最小示例，再阅读版本差异。

## 实验入口与范围

[浏览器实验台](/playground/indexeddb)可以执行本地示例。 [Docker 验证证据](./DockerTooling)列出本产品已采集结果与缺口；阅读证据不等同于启动服务或证明所有功能已验证。
