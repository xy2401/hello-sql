# 示例数据（Sample Data）

MongoDB 官方提供 **Atlas Sample Datasets**，包含电影、餐馆、房源、销售等业务场景的文档，可以直接用于学习查询、嵌套字段、数组和聚合管道。这些示例库既可以加载到 Atlas，也可以导入本地 MongoDB。官方的[将示例数据加载到本地部署中](https://www.mongodb.com/zh-cn/docs/manual/sample-data/load-sample-data-local/)教程使用 `sampledata.archive` 归档和 `mongorestore` 完成导入。

## 数据集一览

| 数据库 | 主要集合 | 内容与练习方向 |
| --- | --- | --- |
| `sample_restaurants` | `restaurants`、`neighborhoods` | 餐馆与社区；条件查询、地址子文档、评分数组、地理空间数据 |
| `sample_mflix` | `movies`、`comments`、`theaters`、`users` | 电影、评论与影院；筛选、聚合、关联查询 |
| `sample_airbnb` | `listingsAndReviews` | 房源与评价；嵌套文档、数组、地理位置 |
| `sample_supplies` | `sales` | 办公用品销售；订单项数组、销售统计 |
| `sample_analytics` | `accounts`、`customers`、`transactions` | 模拟金融业务；账户、客户与交易关系 |
| `sample_geospatial` | `shipwrecks` | 沉船位置；地理空间查询 |
| `sample_guides` | `planets` | 行星资料；基本查询与投影 |
| `sample_training` | `companies`、`grades`、`routes`、`trips` 等 | 多种训练场景；过滤、分组、数组操作 |
| `sample_weatherdata` | `data` | 天气观测；时间与嵌套测量值 |

数据集与集合说明见[官方示例数据目录](https://www.mongodb.com/zh-cn/docs/manual/sample-data/)。上表列出主要集合；归档内容可能随官方更新变化，导入后以实际数据库和集合为准。入门可以先用[餐馆数据](https://www.mongodb.com/zh-cn/docs/manual/sample-data/sample-restaurants/)，再阅读 [Mflix 电影数据](https://www.mongodb.com/zh-cn/docs/manual/sample-data/sample-mflix/)和 [Airbnb 房源数据](https://www.mongodb.com/zh-cn/docs/manual/sample-data/sample-airbnb/)的文档结构。

## 用 Compose 一次完成下载与导入

独立的 [hello-docker 仓库](https://github.com/xy2401/hello-docker/tree/codex/hello-docker)在 `compose/mongo-compose/` 提供 Compose 文件和 Bash 导入脚本。获取该仓库的 `codex/hello-docker` 分支后，从 hello-docker 仓库根目录执行：

```bash
cd compose/mongo-compose

# 先启动 MongoDB，挂载脚本并共享 data 目录
docker compose up -d

# 在容器内等待连接、下载归档、导入并查询验证
docker exec -u root hello-docker-mongo bash /workspace/scripts/import-samples.sh
```

脚本使用官方地址 `https://atlas-education.s3.amazonaws.com/sampledata.archive`，将归档保存在宿主机的 `data/sampledata.archive`，容器内对应 `/workspace/data/sampledata.archive`。下载先写临时文件，成功后改名；后续运行复用已下载的非空归档。共享目录已被 Git 忽略。

导入使用 `--nsInclude='sample_*.*'` 选择全部样例库，结束时列出数据库并检查 `sample_restaurants.restaurants`。只执行 `up -d` 会启动服务，下载与导入由上面的 Bash 命令触发。完整文件与说明见 [Mongo Compose 目录](https://github.com/xy2401/hello-docker/tree/codex/hello-docker/compose/mongo-compose)。Podman 使用同一份文件，将命令中的 `docker` 替换为 `podman`，并配置好 Compose provider。

停止服务时执行：

```bash
docker compose down
```

普通停止保留数据库命名卷和宿主机归档，再次 `up -d` 后可继续查询已有数据。

## 导入到已有的本地数据库

如果已有 MongoDB 服务，也可以按官方教程手动导入。在执行命令的主机上准备 `curl`、[MongoDB Database Tools](https://www.mongodb.com/docs/database-tools/installation/)，并用 `mongosh` 查询结果。下面的下载命令适用于 Bash，成功后才把临时文件改为归档文件：

```bash
curl --fail --location --retry 3 \
  https://atlas-education.s3.amazonaws.com/sampledata.archive \
  --output sampledata.archive.part \
  && mv sampledata.archive.part sampledata.archive
```

下载成功后，针对启用了认证的本地服务执行导入；将用户名、认证库和端口替换为自己的配置。下例采用 hello-docker 的 Mongo Compose 演示配置：用户名 `root`、认证库 `admin`，执行时会提示输入密码（演示密码为 `example`）。

```bash
mongorestore --host 127.0.0.1 --port 27017 \
  --username root --authenticationDatabase admin \
  --archive=sampledata.archive --nsInclude='sample_*.*' --stopOnError
```

归档是 BSON 备份归档，使用 `mongorestore --archive`；此文件无需 `--gzip`，也不使用面向 JSON/CSV 的 `mongoimport`。只需要餐馆数据时，将过滤条件改为 `--nsInclude='sample_restaurants.*'`。参数说明见 [`mongorestore` 官方文档](https://www.mongodb.com/docs/database-tools/mongorestore/)。

::: tip 重复导入
导入命令不包含 `--drop`，会保留现有集合。重复导入可能遇到重复键；`--stopOnError` 会停止恢复，错误之前已经写入的文档仍会保留。已有样例库时直接查询即可，无需每次启动都重新导入。
:::

## 查看数据与聚合查询

通过 Compose 启动服务后，进入容器内的交互式 `mongosh`，按提示输入演示密码 `example`：

```bash
docker exec -it hello-docker-mongo mongosh \
  --host 127.0.0.1 --port 27017 \
  --username root --authenticationDatabase admin
```

已有本地 `mongosh` 时，去掉命令前面的 `docker exec -it hello-docker-mongo` 即可。连接后在 **mongosh** 中执行：

```javascript
show dbs
use sample_restaurants
show collections
db.restaurants.countDocuments()
db.restaurants.findOne()

// 查询 Manhattan 的餐馆，只显示需要的字段
db.restaurants.find(
  { borough: 'Manhattan' },
  { _id: 0, name: 1, cuisine: 1, 'address.street': 1 }
).sort({ name: 1 }).limit(5)

// 按行政区统计餐馆数量
db.restaurants.aggregate([
  { $group: { _id: '$borough', count: { $sum: 1 } } },
  { $sort: { count: -1, _id: 1 } }
])
```

`address` 是内嵌文档，`grades` 是评分记录数组；可以继续尝试点路径查询和 `$unwind`，观察文档结构如何影响查询。

## 针对餐馆数据的增删改查

以下语句直接操作导入后的 `sample_restaurants.restaurants` 集合，在 **mongosh** 中执行。MongoDB 使用集合方法和查询文档表达 CRUD；对应关系见[官方 CRUD 教程](https://www.mongodb.com/zh-cn/docs/manual/crud/)。

| 操作 | 方法 | 对应的 SQL 操作 |
| --- | --- | --- |
| 增 | `insertOne()`、`insertMany()` | `INSERT` |
| 查 | `findOne()`、`find()` | `SELECT` |
| 改 | `updateOne()`、`updateMany()` | `UPDATE` |
| 删 | `deleteOne()`、`deleteMany()` | `DELETE` |

先取得集合。后面的各段在同一个 mongosh 会话中按顺序执行：

```javascript
var restaurants = db.getSiblingDB('sample_restaurants').restaurants
```

### 查：筛选、投影、排序与数组

查询官方导入的数据，字段来自[餐馆数据集的文档结构](https://www.mongodb.com/zh-cn/docs/manual/sample-data/sample-restaurants/)：

```javascript
// 查看一条完整文档
restaurants.findOne()

// 查询 Manhattan 的意大利餐馆，返回名称和街道
restaurants.find(
  { borough: 'Manhattan', cuisine: 'Italian' },
  { _id: 0, name: 1, 'address.street': 1 }
).sort({ name: 1, _id: 1 }).limit(5)

// 按内嵌地址字段查询
restaurants.find({ 'address.zipcode': '10001' }).limit(5)

// 至少有一次评分同时满足 A 等级和 score <= 10
restaurants.find({
  grades: { $elemMatch: { grade: 'A', score: { $lte: 10 } } }
}).limit(5)

// 统计符合条件的文档数量
restaurants.countDocuments({ borough: 'Manhattan' })
```

投影中的 `1` 表示保留字段，`_id: 0` 表示隐藏主键。`address.zipcode` 用点路径访问内嵌字段；[`$elemMatch`](https://www.mongodb.com/docs/manual/reference/operator/query/elemmatch/)要求多个条件由同一个数组元素满足。

### 增：单条与批量插入

为本次练习生成唯一的 `practiceBatch` 标记。新增餐馆仍使用原集合的业务字段，后面的修改和删除通过标记或 `_id` 定位这些练习记录。

```javascript
var practiceBatch = new ObjectId().toHexString()
print(practiceBatch)

var created = restaurants.insertOne({
  name: 'Hello MongoDB 餐馆',
  restaurant_id: 'practice-' + practiceBatch + '-1',
  borough: 'Manhattan',
  cuisine: 'Chinese',
  address: {
    building: '100',
    street: 'Demo Street',
    zipcode: '10001',
    coord: [-73.99, 40.75]
  },
  grades: [{ date: new Date(), grade: 'A', score: 8 }],
  practiceBatch: practiceBatch
})
var practiceId = created.insertedId
restaurants.findOne({ _id: practiceId })

// 再批量插入两条最小练习文档
restaurants.insertMany([
  {
    name: 'Hello MongoDB East',
    restaurant_id: 'practice-' + practiceBatch + '-2',
    borough: 'Queens', cuisine: 'Chinese', practiceBatch: practiceBatch
  },
  {
    name: 'Hello MongoDB West',
    restaurant_id: 'practice-' + practiceBatch + '-3',
    borough: 'Queens', cuisine: 'Italian', practiceBatch: practiceBatch
  }
])
restaurants.countDocuments({ practiceBatch: practiceBatch })
```

`insertOne()` 返回新记录的 `insertedId`；完整执行这一段后，本批练习应有 3 条记录。新增文档会写入 MongoDB 服务端，练习标记也会随文档保存。

### 改：更新字段与追加数组元素

```javascript
// 只修改本次单条插入的餐馆
restaurants.updateOne(
  { _id: practiceId, practiceBatch: practiceBatch },
  {
    $set: { name: 'Hello MongoDB 餐馆（已更新）', 'address.street': 'New Demo Street' },
    $push: { grades: { date: new Date(), grade: 'A', score: 6 } }
  }
)
restaurants.findOne({ _id: practiceId })

// 批量更新本批练习记录的备注
restaurants.updateMany(
  { practiceBatch: practiceBatch },
  { $set: { note: '已完成 CRUD 练习' } }
)
restaurants.find({ practiceBatch: practiceBatch })
```

`$set` 修改指定字段，点路径可以只更新地址中的街道；`$push` 在评分数组末尾追加记录。更新结果中的 `matchedCount` 表示匹配数，`modifiedCount` 表示实际修改数；重复写入相同值时，两者可能不同。参见 [`updateOne()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.updateone/)。

### 删：删除单条与清理本批练习

```javascript
// 删除本次单条插入的餐馆
restaurants.deleteOne({ _id: practiceId, practiceBatch: practiceBatch })
restaurants.findOne({ _id: practiceId }) // 删除后返回 null

// 清理本批剩余的两条练习记录
restaurants.deleteMany({ practiceBatch: practiceBatch })
restaurants.countDocuments({ practiceBatch: practiceBatch }) // 完整清理后为 0
```

删除结果的 `deletedCount` 表示实际删除数。这组语句通过本次练习标记限定范围，保留原始样例记录。

如需观察持久化，可以在删除之前记下 `print(practiceBatch)` 输出的值，退出并重新连接 mongosh，再执行：

```javascript
db.getSiblingDB('sample_restaurants').restaurants.find({
  practiceBatch: '替换为刚才输出的标记'
})
```

数据库中的记录会保留，mongosh 的 `practiceBatch`、`practiceId` 等变量则需要在新会话中重新设置。Compose 使用命名卷，普通停止再启动也会保留这些记录。

资料核对日期：2026-10-07。
