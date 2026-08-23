# MongoDB 版本演进

MongoDB 遵循大版本（Major Version）与特性版本迭代机制。跨大版本升级必须逐级提升 **FCV（FeatureCompatibilityVersion）**。

## 核心版本演进与关键里程碑

### MongoDB 8.0（2024 年 10 月）

**主要功能与架构演进：**

- 重构内部并发调度与锁优化，批量插入吞吐量提升高达 32%，聚合查询性能提升高达 56%
- 分片集群架构优化：支持就地细化分片键（Refine Shard Key），降低数据重新分片的运维代价
- 空闲连接内存占用降低 200MB+，大幅改善海量微服务连接下的节点内存水位

**工程影响与选型建议：**

> 新生产集群的首选基线版本，适合高并发写入与大数据量分片场景。

### MongoDB 7.0（2023 年 8 月）

**主要功能与架构演进：**

- 正式推出 Queryable Encryption（可搜索加密），支持在密文状态下直接在服务端执行等值匹配查询
- 复合分片键前缀自动补充与动态调整能力
- 降低跨版本升级与回滚的 FCV 校验摩擦，支持更加平滑的故障回退

**工程影响与选型建议：**

> 对金融合规与敏感数据端到端加密有严格要求的业务重点推荐。

### MongoDB 6.0（2022 年 7 月）

**主要功能与架构演进：**

- 时间序列集合（Time Series Collection）重大增强：支持二级索引、复合测量值索引与空间分析
- 新增 $lookup 与 $graphLookup 的查询优化器下推加速，嵌套聚合内存开销显著缩减
- 彻底移除历史 legacy `mongo` 客户端，全面启用基于 Node.js 的现代化 `mongosh`

**工程影响与选型建议：**

> 时序与日志业务的成熟稳定版本，注意清理遗留的客户端脚本连接依赖。

### MongoDB 5.0（2021 年 7 月）

**主要功能与架构演进：**

- 原生引入时间序列集合（Time Series Collections）专用底层存储引擎优化
- 引入 Live Resharding（在线实时重分片），支持在不停机、不停止写入的前提下全量重构分片键
- 聚合管道原生支持 `$setWindowFields` 窗口分析函数

**工程影响与选型建议：**

> 分片集群架构运维的重大转折点，摆脱了建表即绑定分片键无法变更的历史包袱。

### MongoDB 4.4（2020 年 7 月）

**主要功能与架构演进：**

- 引入复合隐式索引覆盖与 `$unionWith` 跨集合管道聚合
- Hedging Reads 降低多副本只读请求的 P99 尾延迟
- 支持自定义流式复制（Streaming Replication）提速从节点同步

**工程影响与选型建议：**

> 4.x 系列的终极成熟版本，现已官方 EOL，建议尽快按路径升级。

### MongoDB 4.2（2019 年 8 月）

**主要功能与架构演进：**

- 正式引入分布式事务（Distributed Multi-Document ACID Transactions），跨分片多文档一致性保障
- 字段级加密（Client-Side Field Level Encryption, CSFLE）
- 聚合管道可直接作为 update 操作的更新表达式

**工程影响与选型建议：**

> 开启了 MongoDB 支持跨分片分布式事务的里程碑。

### MongoDB 4.0（2018 年 6 月）

**主要功能与架构演进：**

- 首次在副本集（Replica Set）内部支持多文档 ACID 事务
- 正式完成 WiredTiger 存储引擎对历史 MMAPv1 的全面替代
- 引入零停机类型变更与安全审计日志强化

**工程影响与选型建议：**

> 彻底告别了只能保证单文档原子的历史，奠定了现代多文档事务的基础。

## 生产副本集滚动升级实战步骤

跨大版本升级必须**逐级进行（例如 5.0 -> 6.0 -> 7.0 -> 8.0，严禁跨大版本跳级）**，标准流程如下：

```javascript
// 步骤 1: 升级前检查当前 FCV 是否与当前节点主版本一致
db.adminCommand({ getParameter: 1, featureCompatibilityVersion: 1 });

// 步骤 2: 逐台滚动升级所有 Secondary 节点的 mongod 二进制包，等待数据重同步并变更为 SECONDARY 状态
// 步骤 3: 触发当前 Primary 节点主动降级，并升级原主节点
rs.stepDown(60);

// 步骤 4: 观察业务在全新二进制下稳定运行 24~48 小时，确认无计划回退后，显式提升 FCV 锁定新版本
db.adminCommand({ setFeatureCompatibilityVersion: "8.0" });
```
