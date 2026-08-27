# Elasticsearch 连接与执行

Elasticsearch 的正式外部接口是 REST API。命令行使用 `curl` 发送 HTTP 请求，不虚构专用 SQL 式 Shell；启用安全功能后必须正确处理 HTTPS、证书和账户。

- [REST API](https://www.elastic.co/docs/api/doc/elasticsearch/)
- [索引 API](https://www.elastic.co/docs/api/doc/elasticsearch/operation/operation-indices-create)
- [Bulk API](https://www.elastic.co/docs/api/doc/elasticsearch/operation/operation-bulk)

## 启动与健康检查

```bash
sudo systemctl start elasticsearch
sudo systemctl status elasticsearch
curl --fail --cacert http_ca.crt -u elastic https://localhost:9200/
curl --fail --cacert http_ca.crt -u elastic https://localhost:9200/_cluster/health
```

让 curl 提示密码。不要使用 `-k` 长期绕过证书校验，也不要假设新版本默认提供无认证 HTTP。

## 创建索引与写入

```bash
curl --fail --cacert http_ca.crt -u elastic \
  -H 'Content-Type: application/json' \
  -X PUT https://localhost:9200/hello-items \
  --data-binary @mapping.json

curl --fail --cacert http_ca.crt -u elastic \
  -H 'Content-Type: application/json' \
  -X PUT https://localhost:9200/hello-items/_doc/1 \
  --data '{"name":"alpha","score":30}'
```

## 查询与查看对象

```bash
curl --fail --cacert http_ca.crt -u elastic \
  'https://localhost:9200/_cat/indices/hello-*?v'

curl --fail --cacert http_ca.crt -u elastic \
  -H 'Content-Type: application/json' \
  -X POST https://localhost:9200/hello-items/_search \
  --data-binary @query.json
```

`query.json` 应保存完整 Query DSL，便于审查和版本控制。调试时可加 `?pretty`，程序消费时不要依赖漂亮打印格式。

## 批量导入与故障判断

Bulk 请求体必须是 NDJSON，并以换行结束：

```bash
curl --fail --cacert http_ca.crt -u elastic \
  -H 'Content-Type: application/x-ndjson' \
  -X POST https://localhost:9200/_bulk \
  --data-binary @items.ndjson
```

HTTP 200 只表示 Bulk 请求被处理，还必须检查响应顶层 `errors` 和每个 item 的状态。Elasticsearch 不提供跨文档传统数据库事务；备份应使用 Snapshot API，而不是复制数据目录。

排错时检查 9200、TLS CA、账户角色、集群健康、磁盘水位和索引只读状态。删除索引前必须打印并核对完整索引名。

资料核对日期：2026-08-28。
