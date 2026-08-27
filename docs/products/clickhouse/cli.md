# ClickHouse 连接与执行

`clickhouse-client` 是连接 ClickHouse Server 的原生命令行客户端。它支持交互查询、批处理、多种数据格式和参数化查询；示例只面向本地测试实例。

- [clickhouse-client](https://clickhouse.com/docs/interfaces/cli)
- [命令行参数](https://clickhouse.com/docs/operations/utilities/clickhouse-local)
- [输入输出格式](https://clickhouse.com/docs/interfaces/formats)

## 启动与检查

```bash
sudo systemctl start clickhouse-server
sudo systemctl status clickhouse-server
clickhouse-client --host 127.0.0.1 --port 9000 --query 'SELECT version()'
```

默认原生协议端口是 9000，HTTP 通常是 8123；不要把两者的客户端和端口混用。

## 连接与查看对象

```bash
clickhouse-client --host 127.0.0.1 --port 9000 --user hello --database hello --password
```

```sql
SELECT hostName(), version(), currentDatabase();
SHOW DATABASES;
SHOW TABLES;
DESCRIBE TABLE hello_items;
SHOW CREATE TABLE hello_items;
```

## 执行查询与脚本

```sql
CREATE TABLE IF NOT EXISTS hello_items
(
  id UInt64,
  name String
)
ENGINE = MergeTree
ORDER BY id;

INSERT INTO hello_items VALUES (1, 'alpha'), (2, 'beta');
SELECT * FROM hello_items ORDER BY id;
```

```bash
clickhouse-client --database hello --query 'SELECT count() FROM hello_items'
clickhouse-client --database hello --multiquery < schema.sql
```

多语句文件必须显式使用 `--multiquery`。自动化中同时检查退出码和服务器返回的异常文本。

## 导入与导出

```bash
clickhouse-client --database hello \
  --query 'INSERT INTO hello_items FORMAT CSVWithNames' < items.csv

clickhouse-client --database hello \
  --query 'SELECT * FROM hello_items ORDER BY id FORMAT CSVWithNames' > items.out.csv
```

ClickHouse 的事务能力与传统 OLTP 数据库不同，不要把多条普通 DDL/DML 默认理解为一个跨语句 ACID 事务。使用 `exit`、`quit` 或 `Ctrl+D` 离开；连接异常时检查原生协议端口、用户配置、TLS 端口和集群节点地址。

资料核对日期：2026-08-28。
