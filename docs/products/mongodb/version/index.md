# MongoDB 版本演进

MongoDB 遵循大版本（Major Version）与特性版本迭代机制。跨大版本升级必须逐级提升 **FCV（FeatureCompatibilityVersion）**。

## 版本索引

### [MongoDB 8.2](./mongodb-8.2)

- **发布时间：** 2025 年 9 月
- **版本重点：** 把 8.1 的增量改进带到 Atlas 与自托管发行版。

### [MongoDB 8.0](./mongodb-8.0)

- **发布时间：** 2024 年 10 月
- **版本重点：** 重构内部并发调度与锁优化，批量插入吞吐量提升高达 32%，聚合查询性能提升高达 56%。

### [MongoDB 7.0](./mongodb-7.0)

- **发布时间：** 2023 年 8 月
- **版本重点：** 正式推出 Queryable Encryption（可搜索加密），支持在密文状态下直接在服务端执行等值匹配查询。

### [MongoDB 6.0](./mongodb-6.0)

- **发布时间：** 2022 年 7 月
- **版本重点：** 时间序列集合（Time Series Collection）重大增强：支持二级索引、复合测量值索引与空间分析。

### [MongoDB 5.0](./mongodb-5.0)

- **发布时间：** 2021 年 7 月
- **版本重点：** 原生引入时间序列集合（Time Series Collections）专用底层存储引擎优化。

### [MongoDB 4.4](./mongodb-4.4)

- **发布时间：** 2020 年 7 月
- **版本重点：** 引入复合隐式索引覆盖与 $unionWith 跨集合管道聚合。

### [MongoDB 4.2](./mongodb-4.2)

- **发布时间：** 2019 年 8 月
- **版本重点：** 正式引入分布式事务（Distributed Multi-Document ACID Transactions），跨分片多文档一致性保障。

### [MongoDB 4.0](./mongodb-4.0)

- **发布时间：** 2018 年 6 月
- **版本重点：** 首次在副本集（Replica Set）内部支持多文档 ACID 事务。

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
