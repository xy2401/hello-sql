# SQL Server 版本演进

SQL Server 以年份版本交付，配合累积更新（Cumulative Update, CU）持续修复安全与稳定性。

## 核心版本演进与关键里程碑

### SQL Server 2022（2022 年 11 月）

**主要功能与架构演进：**

- 智能查询处理（Intelligent Query Processing, IQP）全面扩展：参数敏感计划优化（PSP 优化）解决参数嗅探痛点
- Query Store 默认针对所有新库开启，支持只读副本查询监控
- 深度集成 Azure Synapse Link 与受管实例灾备

**工程影响与选型建议：**

> 现代化自适应查询优化的巅峰版本。

### SQL Server 2019（2019 年 11 月）

**主要功能与架构演进：**

- 大数据集群（Big Data Clusters）与数据虚拟化（PolyBase 增强）
- 智能查询处理早期特性：自适应联接（Adaptive Joins）与标量 UDF 内联
- 全面支持 UTF-8 字符编码

**工程影响与选型建议：**

> 目前生产极其广泛的稳定基线。

### SQL Server 2017（2017 年 10 月）

**主要功能与架构演进：**

- 首次正式支持在 Linux 操作系统与 Docker 容器环境跨平台运行
- 引入 Python/R 机器学习服务集成
- 引入自适应查询优化器早期雏形

**工程影响与选型建议：**

> 打破 Windows 独占历史，跨入跨平台与容器化时代。

### SQL Server 2016（2016 年 6 月）

**主要功能与架构演进：**

- 引入 Query Store（查询存储区）持久化执行计划历史
- 引入 Temporal Tables（时态表）实现数据版本历史追溯
- Always Encrypted（全程加密）保障客户端密文安全

**工程影响与选型建议：**

> 现代 SQL Server 核心功能奠基版本。

## 升级建议
- 升级实例版本后，建议保持原有 `COMPATIBILITY_LEVEL` 运行并观察 Query Store，确认无计划回归后再提升数据库兼容级别。
