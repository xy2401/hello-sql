# MongoDB 连接与执行

`mongosh` 是 MongoDB 当前交互式 Shell，使用 JavaScript 表达查询与管理操作。旧版 `mongo` Shell 已不是新部署的默认选择。

- [mongosh 文档](https://www.mongodb.com/docs/mongodb-shell/)
- [连接 mongosh](https://www.mongodb.com/docs/mongodb-shell/connect/)
- [mongoimport 与 mongoexport](https://www.mongodb.com/docs/database-tools/)

## 启动与状态

```bash
sudo systemctl start mongod
sudo systemctl status mongod
mongosh 'mongodb://127.0.0.1:27017/admin' --eval 'db.runCommand({ ping: 1 })'
```

## 连接数据库

```bash
mongosh 'mongodb://hello@127.0.0.1:27017/hello?authSource=hello' --password
```

让 `mongosh` 提示密码。连接后确认实际目标：

```javascript
db.getName()
db.getMongo()
db.runCommand({ connectionStatus: 1 })
show collections
```

## 写入与查询

```javascript
db.hello_items.insertMany([
  { name: 'alpha', score: 30 },
  { name: 'beta', score: 20 }
])

db.hello_items.find({ score: { $gte: 20 } }).sort({ score: -1 })
db.hello_items.createIndex({ name: 1 })
db.hello_items.getIndexes()
```

脚本文件可以显式传入连接串：

```bash
mongosh 'mongodb://127.0.0.1:27017/hello' --file hello.js
mongosh 'mongodb://127.0.0.1:27017/hello' --quiet --eval 'db.hello_items.countDocuments()'
```

## 导入、导出与事务

```bash
mongoimport --uri 'mongodb://127.0.0.1:27017/hello' --collection hello_items --type csv --headerline --file items.csv
mongoexport --uri 'mongodb://127.0.0.1:27017/hello' --collection hello_items --type json --out items.json
```

多文档事务要求副本集或分片集群，不能假设普通 standalone 支持：

```javascript
const session = db.getMongo().startSession()
session.startTransaction()
session.getDatabase('hello').hello_items.updateOne({ name: 'alpha' }, { $set: { score: 31 } })
session.abortTransaction()
session.endSession()
```

使用 `exit` 退出。连接失败时检查 27017、绑定地址、认证库 `authSource`、副本集名和 TLS 参数。

资料核对日期：2026-08-28。
