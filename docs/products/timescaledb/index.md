# TimescaleDB 总览

TimescaleDB 是以 PostgreSQL 插件形式存在的时序与事件数据库，将全功能标准 SQL 与针对时序优化的自动分片（Hypertable）、列式压缩完美融合。

## 适用边界

适合 PostgreSQL 上的时间序列建模与分析；扩展版本、数据库版本和功能许可需分别确认。

## 版本阅读范围

[完整版本目录](./version/)收录本仓库已有专题（如 timescaledb-2.0、timescaledb-2.13、timescaledb-2.16）。这些是教学与兼容性对照入口；运行环境的具体版本以安装页、工作台或采集证据为准。

## 推荐学习路线

[安装与环境](./install) → [核心概念](./core-concepts) → [命令行工具](./cli) → [完整版本目录](./version/)。先完成最小示例，再阅读版本差异。

## 实验入口与范围

本产品没有对应的浏览器执行引擎；[浏览器实验台目录](/playground/)列出本站实际可运行的数据库。 [Docker 验证证据](./DockerTooling)列出本产品已采集结果与缺口；阅读证据不等同于启动服务或证明所有功能已验证。
