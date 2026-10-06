# ScyllaDB 总览

ScyllaDB 是使用 C++ 重构的高性能 NoSQL 数据库，采用 Seastar 框架的 Thread-per-core 异步无锁单核架构，完全兼容 Apache Cassandra CQL 与 DynamoDB API，彻底消除了 JVM GC 停顿。

## 适用边界

适合宽列数据与 CQL 工作负载；Cassandra 兼容性不能替代驱动、配置和负载下的实际验证。

## 版本阅读范围

[完整版本目录](./version/)收录本仓库已有专题（如 scylladb-2026.1、scylladb-2026.2、scylladb-5.0）。这些是教学与兼容性对照入口；运行环境的具体版本以安装页、工作台或采集证据为准。

## 推荐学习路线

[安装与环境](./install) → [核心概念](./core-concepts) → [命令行工具](./cli) → [完整版本目录](./version/)。先完成最小示例，再阅读版本差异。

## 实验入口与范围

本产品没有对应的浏览器执行引擎；[浏览器实验台目录](/playground/)列出本站实际可运行的数据库。 [Docker 验证证据](./DockerTooling)列出本产品已采集结果与缺口；阅读证据不等同于启动服务或证明所有功能已验证。
