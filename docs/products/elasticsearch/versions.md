# Elasticsearch 版本演进

Elasticsearch 采用语义化主版本（Major Version），大版本升级会移除上一代已弃用的 API 与 Mapping 配置。

## 核心版本演进与关键里程碑

### Elasticsearch 8.15（2024 年 8 月）

**主要功能与架构演进：**

- 全面强化 ES|QL（Elasticsearch Query Language）管道查询语言
- 向量量化技术（BBQ 与 HNSW 优化），大幅降低多维向量的 RAM 消耗

**工程影响与选型建议：**

> 结合生成式 AI 与复杂分析的新一代引擎形态。

### Elasticsearch 8.0（2022 年 2 月）

**主要功能与架构演进：**

- 默认启用系统安全与 TLS 加密配置，消除历史裸奔风险
- 原生支持 k-NN 向量索引与 PyTorch 模型部署推断
- 彻底清理所有历史弃用的 Mapping Type 遗留代码

**工程影响与选型建议：**

> 进入 AI 向量搜索与默认安全时代的里程碑。

### Elasticsearch 7.17（2022 年 1 月）

**主要功能与架构演进：**

- 包含 Upgrade Assistant 升级助手与全量 Deprecation 检测 API
- 7.x 系列的终极稳定维护版本，作为迁往 8.x 的必要跳板

**工程影响与选型建议：**

> 7.x 到 8.x 升级的必经基准版本。

### Elasticsearch 7.0（2019 年 4 月）

**主要功能与架构演进：**

- 彻底移除 Mapping Type（一个索引只能拥有单份映射定义）
- 引入真实内存断路器（Real Memory Circuit Breaker）防止 OOM 崩溃
- 切换底层主从集群协调协议为全新的 Raft 变种，大幅提速集群选主

**工程影响与选型建议：**

> 奠定了现代 Elasticsearch 集群架构基石。

### Elasticsearch 6.0（2017 年 11 月）

**主要功能与架构演进：**

- 限制单索引单 Type 并启动 Mapping Type 弃用流程
- 引入 Sequence Numbers 实现基于版本号的快速分片副本恢复

**工程影响与选型建议：**

> 大幅缩短分片损坏或节点重启时的故障恢复时间。

## 升级前预检命令
```bash
# 查看所有已弃用警告，必须清空后方可升级至下一个主版本
GET /_migration/deprecations
```
