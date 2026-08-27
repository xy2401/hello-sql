# CockroachDB 连接与执行

`cockroach sql` 是 CockroachDB 自带的 SQL 终端。它使用 PostgreSQL 线协议，但服务启动、证书和部分元命令属于 CockroachDB 自己的工具链。

- [cockroach sql](https://www.cockroachlabs.com/docs/stable/cockroach-sql)
- [本地集群启动](https://www.cockroachlabs.com/docs/stable/start-a-local-cluster)
- [导入数据](https://www.cockroachlabs.com/docs/stable/import-into)

## 启动本地节点

仅用于本机练习的单节点可以无证书启动：

```bash
cockroach start-single-node \
  --insecure \
  --listen-addr=127.0.0.1:26257 \
  --http-addr=127.0.0.1:8080 \
  --store=hello-data \
  --background
cockroach node status --insecure --host=127.0.0.1:26257
```

`--insecure` 不得用于跨主机或生产环境；正式集群必须使用证书并按官方拓扑部署。

## 连接和检查

```bash
cockroach sql --insecure --host=127.0.0.1:26257
```

```sql
CREATE DATABASE IF NOT EXISTS hello;
USE hello;
SHOW DATABASES;
SHOW TABLES;
SELECT version();
```

安全集群使用连接 URL 或 `--certs-dir`，不要为了省略证书而退回 insecure 模式。

## 执行语句与脚本

```sql
CREATE TABLE IF NOT EXISTS hello_items (
  id INT8 PRIMARY KEY DEFAULT unique_rowid(),
  name STRING NOT NULL
);
INSERT INTO hello_items(name) VALUES ('alpha'), ('beta');
SELECT * FROM hello_items ORDER BY id;
```

```bash
cockroach sql --insecure --host=127.0.0.1:26257 --database=hello \
  --execute='SELECT count(*) FROM hello_items'
cockroach sql --insecure --host=127.0.0.1:26257 --database=hello < schema.sql
```

## 导入、事务与退出

大文件导入使用 `IMPORT INTO` 并从官方支持的存储位置读取；小规模交互数据可以由 SQL `INSERT` 完成。事务可能因并发冲突返回可重试错误，应用必须遵守客户端库的事务重试规则。

```sql
BEGIN;
UPDATE hello_items SET name = 'updated' WHERE name = 'alpha';
ROLLBACK;
```

使用 `\q` 或 `Ctrl+D` 退出。排错时检查 26257 SQL 端口、证书目录、集群名、节点通告地址和时钟同步；管理界面 8080 不是 SQL 端口。

资料核对日期：2026-08-28。
