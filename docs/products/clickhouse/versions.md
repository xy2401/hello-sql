# ClickHouse 版本演进

ClickHouse 采用日历版本号，每年发布 2 个 **LTS（长期支持版，维护 1 年）** 以及按月的 Feature 版本。

## 核心版本演进与关键里程碑

### ClickHouse 24.8 LTS（2024 年 8 月）

**主要功能与架构演进：**

- 正式稳定支持 ClickHouse Keeper 生产特性，彻底移除对 Apache ZooKeeper 的依赖
- 向量搜索（Vector Search）索引实验特性增强
- 大幅提升针对稀疏列（Sparse Columns）与 Variant 动态类型的压缩比与扫描性能

**工程影响与选型建议：**

> 当前生产大规模集群推荐的 LTS 基线。

### ClickHouse 24.3 LTS（2024 年 3 月）

**主要功能与架构演进：**

- 全新的查询分析器（Analyzer）进入默认启用阶段，支持更复杂的子查询与 CTE 优化
- 引入针对 S3/对象存储 Lakehouse 格式（Iceberg, Delta Lake, Hudi）的只读直查

**工程影响与选型建议：**

> 查询优化器现代化的里程碑版本。

### ClickHouse 23.8 LTS（2023 年 8 月）

**主要功能与架构演进：**

- 引入高效的倒排索引（Inverted Index）加速大规模文本模糊与全文检索
- 内存资源管控（Memory Limits）与并发队列调度优化

**工程影响与选型建议：**

> 全文日志分析场景性能大幅跃升。

### ClickHouse 22.8 LTS（2022 年 8 月）

**主要功能与架构演进：**

- 正式引入 ClickHouse Keeper 作为 Raft 一致性元数据引擎替代 ZooKeeper
- 支持 JSON Object 类型原生列式存储与投影索引（Projection Index）

**工程影响与选型建议：**

> 集群架构去 Java 依赖、纯 C++ 化的关键分水岭。

## 生产集群滚动升级检查
- **ZooKeeper 到 Keeper 迁移**：使用 `clickhouse-keeper-converter` 工具在不停机状态下转换元数据快照。
