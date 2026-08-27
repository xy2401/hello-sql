# ScyllaDB 版本演进

ScyllaDB 采用 C++ Seastar 架构；当前以年度 LTS 和 Feature Release 版本线提供支持。

## 版本索引

### [ScyllaDB 2026.2](./scylladb-2026.2)

- **发布时间：** 2026 年 6 月
- **版本重点：** 截至核对日的当前 Feature Release，适合需要最新能力的集群。

### [ScyllaDB 2026.1 LTS](./scylladb-2026.1)

- **发布时间：** 2026 年 3 月
- **版本重点：** 当前长期支持基线，适合维护周期优先的生产集群。

### [ScyllaDB 6.0](./scylladb-6.0)

- **发布时间：** 2024 年 7 月
- **版本重点：** 引入平板架构（Tablets）动态分片，支持细粒度跨 CPU 核心负载均衡。

### [ScyllaDB 5.4](./scylladb-5.4)

- **发布时间：** 2023 年 11 月
- **版本重点：** 基于 Raft 的强一致表结构变更（Schema Agreement）。

### [ScyllaDB 5.0](./scylladb-5.0)

- **发布时间：** 2022 年 7 月
- **版本重点：** 引入 I/O 调度器自动化调优，消除手工配置磁盘性能参数的繁琐步骤。

## 滚动升级
- 按照官方版本路径逐台替换节点 rpm/deb 包并运行 `scylla-housekeeping`。
