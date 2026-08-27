# ScyllaDB 连接与执行

ScyllaDB 对外使用 CQL 协议，常见交互工具是 `cqlsh`；节点状态与维护使用 `nodetool`。兼容 Cassandra 协议不代表所有系统表、扩展和运维行为完全相同。

- [ScyllaDB CQL](https://opensource.docs.scylladb.com/stable/cql/index.html)
- [cqlsh](https://opensource.docs.scylladb.com/stable/cql/cqlsh.html)
- [nodetool status](https://opensource.docs.scylladb.com/stable/operating-scylla/nodetool-commands/status.html)

## 启动与状态

```bash
sudo systemctl start scylla-server
sudo systemctl status scylla-server
nodetool status
```

只有节点处于 `UN` 状态且 schema 达成一致后，才应继续执行数据操作。

## 连接 CQL

```bash
cqlsh 127.0.0.1 9042 -u hello
```

```sql
SHOW VERSION;
DESCRIBE CLUSTER;
DESCRIBE KEYSPACES;
CONSISTENCY LOCAL_QUORUM;
```

单节点练习无法满足 `LOCAL_QUORUM` 的多副本假设，应按实际复制因子选择一致性级别；生产环境不要为了让查询通过而随意降级。

## 创建与执行

```sql
CREATE KEYSPACE IF NOT EXISTS hello
WITH replication = {'class': 'NetworkTopologyStrategy', 'replication_factor': 1};
USE hello;

CREATE TABLE hello_items (
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

## 导入、导出与批处理

```sql
COPY hello.hello_items (bucket, id, name)
FROM 'items.csv' WITH HEADER = TRUE;
COPY hello.hello_items TO 'items.out.csv' WITH HEADER = TRUE;
```

`COPY` 适合小规模人工任务；高吞吐导入需要官方支持的 loader 或驱动并发控制。CQL batch 不等于跨分区 ACID 事务，滥用会给 coordinator 带来压力。

输入 `EXIT` 离开。连接异常应检查 shard 节点状态、9042、认证、TLS、snitch/数据中心名称与 schema agreement。

资料核对日期：2026-08-28。
