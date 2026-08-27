# Neo4j 连接与执行

`cypher-shell` 是 Neo4j 官方命令行客户端，用于执行 Cypher、运行脚本和检查数据库。Bolt 连接默认使用 7687，浏览器管理界面的 7474 端口不能代替 Bolt。

- [Cypher Shell](https://neo4j.com/docs/operations-manual/current/tools/cypher-shell/)
- [Cypher 手册](https://neo4j.com/docs/cypher-manual/current/)
- [LOAD CSV](https://neo4j.com/docs/cypher-manual/current/clauses/load-csv/)

## 启动与状态

```bash
sudo systemctl start neo4j
sudo systemctl status neo4j
cypher-shell -a neo4j://127.0.0.1:7687 -u hello 'RETURN 1;'
```

省略密码参数可让客户端交互提示。不要把密码写进命令历史。

## 连接与查看数据库

```bash
cypher-shell -a neo4j://127.0.0.1:7687 -u hello -d neo4j
```

```cypher
SHOW CURRENT USER;
SHOW DATABASES;
SHOW CONSTRAINTS;
SHOW INDEXES;
CALL dbms.components();
```

`neo4j://` 允许驱动发现路由；明确连接单个节点时也可按部署要求使用 `bolt://`。

## 创建图与查询

```cypher
CREATE CONSTRAINT hello_item_id IF NOT EXISTS
FOR (item:HelloItem) REQUIRE item.id IS UNIQUE;

MERGE (a:HelloItem {id: 1}) SET a.name = 'alpha';
MERGE (b:HelloItem {id: 2}) SET b.name = 'beta';
MERGE (a)-[:NEXT]->(b);

MATCH (item:HelloItem)
RETURN item.id, item.name
ORDER BY item.id;
```

执行脚本和单条命令：

```bash
cypher-shell -a neo4j://127.0.0.1:7687 -u hello -d neo4j -f schema.cypher
cypher-shell -a neo4j://127.0.0.1:7687 -u hello -d neo4j --format plain 'MATCH (n) RETURN count(n);'
```

## CSV 与事务

```cypher
LOAD CSV WITH HEADERS FROM 'file:///items.csv' AS row
MERGE (:HelloItem {id: toInteger(row.id), name: row.name});
```

`file:///` 由服务器读取，并受导入目录配置限制，不是客户端当前目录。交互会话可使用 `:begin`、`:commit`、`:rollback` 控制显式事务。

使用 `:exit` 离开。连接失败时检查 7687、数据库名、TLS 模式、用户角色和服务器 advertised address；批量删除图数据前必须先用相同 `MATCH` 验证范围。

资料核对日期：2026-08-28。
