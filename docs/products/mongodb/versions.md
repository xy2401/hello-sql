# MongoDB 版本演进与 FCV 升级机制

## 版本演进与重大特性

- **MongoDB 7.0+**：增强复合分片键变更、查询分析缓存与时间序列集合性能。
- **MongoDB 6.0**：默认关闭 `mongo` legacy shell，全面推行 `mongosh`；增强分布式事务与 Change Streams。

## 生产副本集升级步骤（以 FCV 为核心）

```javascript
// 1. 跨大版本升级必须逐级提升（例如从 5.0 -> 6.0 -> 7.0，不能跳级）
// 2. 依次滚动升级所有 Secondary 二进制包，最后触发 Primary stepDown 升级主节点
// 3. 观察业务稳定运行后，再提升 FeatureCompatibilityVersion (FCV) 锁定新版本功能
db.adminCommand({ setFeatureCompatibilityVersion: "7.0" })

// 查看当前 FCV 状态
db.adminCommand({ getParameter: 1, featureCompatibilityVersion: 1 })
```
