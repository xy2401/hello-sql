# MongoDB 核心知识

深入掌握 MongoDB 必须透彻理解文档设计的边界划分、WiredTiger 引擎的读写机制、索引的 ESR 黄金法则，以及分布式分片的数据均衡原理。

## 1. 文档建模：嵌入（Embedding） vs 引用（Referencing）

### 嵌入模型的黄金准则
- **1 对 1 或 1 对有限多（1:N）**：如用户及其收货地址、订单及其商品项快照。
- **数据经常需要一起读取**：单次磁盘 I/O 即可读出全部关联数据，性能最高。
- **数据需要原子更新**：MongoDB 在单文档级别提供原子性更新（如 `$set`, `$push`, `$inc`）。

### 必须使用引用的反模式场景
- **无界增长（Unbounded Growth）**：如一条博客文章下的评论（可能达到数十万条），若直接嵌入数组会导致文档突破 16MB 限制并触发严重的磁盘碎片。
- **高频独立修改**：如果内嵌对象需要频繁独立读写且与父对象生命周期不同，应拆分为独立 Collection 并通过 ID 引用。

---

## 2. 索引设计：复合索引的 ESR 原则

复合索引的列顺序直接决定了查询优化器是否能同时利用索引进行过滤与排序：

1. **E（Equality，等值匹配）**：将精确匹配字段放在最前面（如 `status: "PAID"`）。
2. **S（Sort，排序字段）**：将排序字段紧随其后（如 `created_at: -1`），避免昂贵的内存排序（In-Memory Sort）。
3. **R（Range，范围查询）**：将范围匹配字段放在最后（如 `age: { $gte: 18 }`）。

```javascript
// 针对查询: db.users.find({ country: "CN", age: { $gte: 20 } }).sort({ score: -1 })
// 最佳索引构建 (E -> S -> R):
db.users.createIndex({ country: 1, score: -1, age: 1 });
```

---

## 3. WiredTiger 引擎与写关注（Write Concern）

### 写入流转机制
写入操作首先进入 WiredTiger 的内存缓存并写入 **Journal 日志（WAL）**：
- **Checkpoint（检查点）**：默认每 60 秒或日志量达到 2GB 时触发一次，将脏页同步刷盘到数据文件。

### 一致性控制参数
- **Write Concern**：
  - `w: 1`：Primary 节点写入内存/Journal 后即向客户端返回成功（默认）。
  - `w: "majority"`：必须等到副本集中大多数节点（Majority）确认写入后才返回，杜绝主节点宕机时的“写入丢失（Rollback）”。
- **Read Concern**：
  - `"local"`：直接从当前节点内存读取最新数据。
  - `"majority"`：只读取已经被大多数节点确认提交的数据，杜绝脏读。
