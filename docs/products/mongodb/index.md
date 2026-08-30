# MongoDB 总览

MongoDB 是一款成熟、高度灵活的通用分布式文档型 NoSQL 数据库系统。它采用类似 JSON 的 **BSON（二进制 JSON）** 格式存储数据，原生支持动态 Schema、多层嵌套文档、多键索引与强大的聚合分析管道（Aggregation Pipeline）。

## 架构形态与关键属性

| 属性维度 | 规格与技术实现 |
| :--- | :--- |
| **数据模型** | 层次化文档模型（Database -> Collection -> Document），支持原生内嵌子文档与数组。 |
| **查询接口** | MongoDB Query Language (MQL)、强大的 Aggregation Pipeline、以及驱动层原生 Builders。 |
| **开源许可证** | SSPL（Server Side Public License，自托管需注意服务提供商商业限制）。 |
| **部署形态** | 单实例、副本集（Replica Set，自动选主容灾）、分片集群（Sharded Cluster，水平自动路由扩容）。 |
| **事务与一致性** | 单文档操作天然原子；支持多文档 ACID 分布式事务；通过 Read/Write Concern 灵活调整一致性级别。 |

## 模型与查询范式

MongoDB 的文档模型允许在单个文档中内嵌相关联的多项数据，从而消除关系型数据库中的高代价 JOIN 操作：

```javascript
// 插入带有嵌套地址与订单项数组的复杂文档
db.orders.insertOne({
    order_no: "ORD-2026-9901",
    customer: {
        user_id: 1001,
        name: "Alice",
        tier: "VIP"
    },
    items: [
        { sku: "SKU-A1", qty: 2, price: 99.5 },
        { sku: "SKU-B2", qty: 1, price: 199.0 }
    ],
    status: "PAID",
    created_at: new Date()
});

// 使用 Aggregation Pipeline 进行按用户维度的汇总统计
db.orders.aggregate([
    { $match: { status: "PAID" } },
    { $unwind: "$items" },
    { $group: {
        _id: "$customer.user_id",
        customer_name: { $first: "$customer.name" },
        total_spent: { $sum: { $multiply: ["$items.qty", "$items.price"] } },
        item_count: { $sum: "$items.qty" }
    }},
    { $sort: { total_spent: -1 } }
]);
```

## 事务、索引与高可用扩展

- **WiredTiger 存储引擎**：基于 B-Tree 与 LSM 混合架构，提供行级并发控制、Snappy/Zstd 压缩以及可控的内存缓存（WiredTiger Cache）。
- **多维度索引**：
  - **复合索引（Compound Index）**：遵循 **ESR 原则（Equality -> Sort -> Range）**。
  - **多键索引（Multikey Index）**：自动为数组内的每个元素创建索引项。
  - **通配符索引（Wildcard Index）** 与 **TTL 索引**（自动过期清理历史文档）。
- **高可用与水平扩展**：
  - **副本集（Replica Set）**：基于 Raft 变种协议实现主从自动选举（Primary-Secondary-Arbiter），Oplog 保证增量复制。
  - **分片集群（Sharding）**：通过 `mongos` 路由、Config Server 元数据以及分片键（Shard Key）实现 TB/PB 级数据的无缝水平拆分。

## 适用边界与架构选型建议

- **✅ 最适合场景**：
  - 内容管理、商品详情、动态表单等数据结构多变且迭代频繁的业务。
  - 物联网（IoT）设备上报与事件日志记录。
  - 读写吞吐极高、需要快速通过副本集与分片实现水平扩展的场景。
- **⚠️ 约束与运维风险**：
  - **文档最大限制 16MB**：严禁设计无界数组（Unbounded Array），避免文档不断膨胀触发重写碎片。
  - 缺乏强制的外键约束，跨 Collection 的完整性需在应用层保障。
