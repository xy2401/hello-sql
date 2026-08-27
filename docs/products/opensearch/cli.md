# OpenSearch 连接与执行

OpenSearch 以 REST API 作为主要命令接口，Shell 中通常使用 `curl`。安全插件默认部署常涉及 HTTPS、CA 和用户认证，应按实际集群配置连接。

- [OpenSearch API](https://docs.opensearch.org/latest/api-reference/)
- [文档 API](https://docs.opensearch.org/latest/api-reference/document-apis/index-document/)
- [Bulk API](https://docs.opensearch.org/latest/api-reference/document-apis/bulk/)

## 启动与状态

```bash
sudo systemctl start opensearch
sudo systemctl status opensearch
curl --fail --cacert root-ca.pem -u admin https://localhost:9200/
curl --fail --cacert root-ca.pem -u admin https://localhost:9200/_cluster/health
```

使用交互密码提示或安全凭据文件。示例中的 `admin` 只代表本地管理员入口，日常查询应创建最小权限账户。

## 索引与文档

```bash
curl --fail --cacert root-ca.pem -u admin \
  -H 'Content-Type: application/json' \
  -X PUT https://localhost:9200/hello-items \
  --data-binary @mapping.json

curl --fail --cacert root-ca.pem -u admin \
  -H 'Content-Type: application/json' \
  -X PUT https://localhost:9200/hello-items/_doc/1 \
  --data '{"name":"alpha","score":30}'
```

## 搜索与查看状态

```bash
curl --fail --cacert root-ca.pem -u admin \
  'https://localhost:9200/_cat/indices/hello-*?v'

curl --fail --cacert root-ca.pem -u admin \
  -H 'Content-Type: application/json' \
  -X POST https://localhost:9200/hello-items/_search \
  --data-binary @query.json
```

把 Query DSL 放在文件中比把大量 JSON 塞进一行命令更容易审查，也避免不同 Shell 的引号差异。

## 批量执行与排错

```bash
curl --fail --cacert root-ca.pem -u admin \
  -H 'Content-Type: application/x-ndjson' \
  -X POST https://localhost:9200/_bulk \
  --data-binary @items.ndjson
```

NDJSON 最后一行必须有换行；收到 HTTP 200 后仍要检查 `errors` 和单项响应。OpenSearch 不提供跨文档 ACID 事务，备份和恢复使用 Snapshot API。

遇到 401/403 时区分认证和角色授权；连接失败则检查 9200、TLS 证书、节点发现和安全插件配置。不要在不可信网络上用 `-k` 跳过校验。

资料核对日期：2026-08-28。
