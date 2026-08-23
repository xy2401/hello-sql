# MongoDB 版本演进与 FCV 升级指南

MongoDB 大版本升级采用 **FCV（FeatureCompatibilityVersion，特性兼容性版本）** 进行严格的两阶段控制。

## 核心版本演进与关键里程碑

### MongoDB 8.0（最新稳定版）
- **查询与写入性能飞跃**：优化了内部锁竞争与并发调度，批量插入与聚合查询吞吐提升高达 30%~50%。
- **分片键变更增强**：支持更加平滑地修改或细化已有 Collection 的 Shard Key，降低重构成本。
- **内存优化**：大幅缩减了高并发连接下的空闲内存占用。

### MongoDB 7.0
- **Queryable Encryption（可搜索加密）**：支持在敏感数据字段保持端到端加密状态下，在服务端直接执行等值查询。
- **提升升级与回滚体验**：降低了跨版本升级过程中的降级门槛与兼容校验摩擦。
- **复合分片键细化**：允许直接向已有分片键追加前缀字段。

### MongoDB 6.0
- **时间序列集合（Time Series Collections）重大增强**：支持二级索引、复合测量值索引，大幅提升时序数据过滤性能。
- **空间优化**：重构了聚合管道的内部数据传输格式，减少大型聚合的内存与网络开销。
- **默认废弃旧版 Shell**：彻底移除历史 `mongo` 客户端，全面启用现代化的 `mongosh`。

### MongoDB 5.0
- **原生时间序列集合**：正式引入专用的 Time Series Collection 存储引擎优化。
- **Live Resharding（在线重分片）**：允许在生产业务不停机的情况下，全量迁移并重新分布已有集合的分片数据。
- **窗口操作符**：聚合管道原生支持 `$setWindowFields` 窗口函数。

### MongoDB 4.4 / 4.2
- **分布式事务**：4.2 引入跨分片多文档分布式事务支持。
- **UnionWith 聚合阶段**：支持跨集合合并管道数据。

---

## 生产副本集滚动升级实战步骤

跨大版本升级必须**逐级进行（如 5.0 -> 6.0 -> 7.0 -> 8.0，严禁跨版本跳跃）**，核心升级流程如下：

```javascript
// 步骤 1: 升级前检查当前 FCV 是否与当前二进制版本一致
db.adminCommand({ getParameter: 1, featureCompatibilityVersion: 1 });

// 步骤 2: 依次滚动升级所有 Secondary 节点的 mongod 二进制包并重启
// 步骤 3: 触发 Primary 节点主动降级并升级主节点
rs.stepDown(60); // 主节点降级为 Secondary，集群自动选举新主

// 步骤 4: 所有节点运行新版本二进制且业务稳定运行数天后，显式提升 FCV
db.adminCommand({ setFeatureCompatibilityVersion: "8.0" });
```
