# Apache CouchDB 连接与执行

CouchDB 的正式接口是 HTTP API，没有需要伪装出来的专用数据库 CLI。命令行操作使用 `curl`，请求与响应都是 HTTP 和 JSON。

- [CouchDB API](https://docs.couchdb.org/en/stable/api/index.html)
- [数据库 API](https://docs.couchdb.org/en/stable/api/database/common.html)
- [文档 API](https://docs.couchdb.org/en/stable/api/document/common.html)

## 启动与健康检查

```bash
sudo systemctl start couchdb
sudo systemctl status couchdb
curl --fail --silent --show-error http://127.0.0.1:5984/_up
```

启用认证后使用 `-u hello` 让 curl 提示输入密码，不要把密码写入命令历史：

```bash
curl --fail --silent --show-error -u hello http://127.0.0.1:5984/
```

## 创建数据库与文档

```bash
curl --fail --silent --show-error -u hello \
  -X PUT http://127.0.0.1:5984/hello

curl --fail --silent --show-error -u hello \
  -H 'Content-Type: application/json' \
  -X PUT http://127.0.0.1:5984/hello/item-1 \
  --data '{"name":"alpha","score":30}'
```

读取文档与数据库信息：

```bash
curl --fail --silent --show-error -u hello http://127.0.0.1:5984/hello/item-1
curl --fail --silent --show-error -u hello 'http://127.0.0.1:5984/hello/_all_docs?include_docs=true'
```

## 查询与批量输入

Mango 查询使用 `_find`：

```bash
curl --fail --silent --show-error -u hello \
  -H 'Content-Type: application/json' \
  -X POST http://127.0.0.1:5984/hello/_find \
  --data '{"selector":{"score":{"$gte":20}},"fields":["_id","name","score"]}'
```

批量写入使用 `_bulk_docs`，JSON 正文较长时应放入文件：

```bash
curl --fail --silent --show-error -u hello \
  -H 'Content-Type: application/json' \
  -X POST http://127.0.0.1:5984/hello/_bulk_docs \
  --data-binary @items.json
```

## 并发与排错

CouchDB 以文档 `_rev` 做乐观并发控制，更新和删除必须携带当前修订号；它不提供跨文档传统 SQL 事务。管理或删除请求执行前应先打印 URL 并确认数据库名。

HTTP 401 表示认证失败，403 表示权限不足，409 常见于修订冲突。连接失败时检查 5984、绑定地址、反向代理、TLS 与节点配置。

资料核对日期：2026-08-28。
