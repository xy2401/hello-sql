# Apache Cassandra 连接与执行

`cqlsh` 是 Cassandra 的 CQL 交互终端，`nodetool` 用于节点和集群状态管理。CQL 语法类似 SQL，但数据建模、批处理和一致性语义不同。

- [cqlsh](https://cassandra.apache.org/doc/latest/cassandra/managing/tools/cqlsh.html)
- [CQL 参考](https://cassandra.apache.org/doc/latest/cassandra/developing/cql/index.html)
- [nodetool](https://cassandra.apache.org/doc/latest/cassandra/managing/tools/nodetool/nodetool.html)

## 启动与节点状态

```bash
sudo systemctl start cassandra
sudo systemctl status cassandra
nodetool status
```

节点显示 `UN` 才表示 Up/Normal。服务进程存在不等于节点已经加入 ring 并可承载查询。

## 连接与检查

```bash
cqlsh 127.0.0.1 9042 -u hello
```

让客户端提示密码，启用 TLS 时通过 `cqlshrc` 配置证书。进入终端后：

```sql
SHOW VERSION;
DESCRIBE CLUSTER;
DESCRIBE KEYSPACES;
CONSISTENCY;
```

## 创建与查询数据

本地单节点实验可使用 `SimpleStrategy`；生产多数据中心应使用 `NetworkTopologyStrategy`：

```sql
CREATE KEYSPACE IF NOT EXISTS hello
WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1};
USE hello;

CREATE TABLE IF NOT EXISTS hello_items (
  bucket text,
  id bigint,
  name text,
  PRIMARY KEY (bucket, id)
);
INSERT INTO hello_items(bucket, id, name) VALUES ('demo', 1, 'alpha');
SELECT * FROM hello_items WHERE bucket = 'demo';
```

```bash
cqlsh 127.0.0.1 9042 -u hello -e 'DESCRIBE KEYSPACE hello'
cqlsh 127.0.0.1 9042 -u hello -f schema.cql
```

## CSV 与批处理

```sql
COPY hello.hello_items (bucket, id, name)
FROM 'items.csv' WITH HEADER = TRUE;

COPY hello.hello_items TO 'items.out.csv' WITH HEADER = TRUE;
```

`BEGIN BATCH` 用于协调同一分区等相关写入，不是任意多语句事务，也不应拿来提升大批量导入速度。大规模加载应使用专门工具。

使用 `EXIT` 退出。排错时检查 9042、节点状态、认证、数据中心、复制因子和所选一致性级别。

资料核对日期：2026-08-28。
