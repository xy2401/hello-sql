# TiDB 连接与执行

TiDB 兼容 MySQL 客户端协议，日常交互通常直接使用 `mysql`。`tiup playground` 适合本机临时学习，不代表生产集群部署方式。

- [连接 TiDB](https://docs.pingcap.com/tidb/stable/connect-to-tidb/)
- [TiUP Playground](https://docs.pingcap.com/tidb/stable/tiup-playground/)
- [MySQL 兼容性](https://docs.pingcap.com/tidb/stable/mysql-compatibility/)

## 启动本地实验集群

```bash
tiup playground
tiup status
```

Playground 默认 SQL 端口通常是 4000，实际端口以启动输出为准。关闭该终端或执行对应清理操作会影响临时集群，不要把重要数据只放在 Playground 中。

## 连接与检查

```bash
mysql --host 127.0.0.1 --port 4000 --user root
```

```sql
SELECT VERSION(), DATABASE(), CURRENT_USER();
SHOW DATABASES;
CREATE DATABASE IF NOT EXISTS hello;
USE hello;
SHOW TABLES;
```

远程 TiDB Cloud 或启用 TLS 的集群必须使用控制台给出的 CA、主机、端口和用户，不要照搬本机无密码连接。

## 执行语句与脚本

```sql
CREATE TABLE IF NOT EXISTS hello_items (
  id BIGINT PRIMARY KEY AUTO_RANDOM,
  name VARCHAR(100) NOT NULL
);
INSERT INTO hello_items(name) VALUES ('alpha'), ('beta');
SELECT * FROM hello_items ORDER BY id;
```

```bash
mysql -h 127.0.0.1 -P 4000 -u root hello -e 'SELECT tidb_version();'
mysql -h 127.0.0.1 -P 4000 -u root hello < schema.sql
```

## 导入、导出与事务

小文件可使用 MySQL 客户端的 `LOAD DATA LOCAL INFILE`；大规模迁移应选择 TiDB Lightning、Dumpling 等官方数据工具，而不是用交互终端硬塞数据。

```sql
BEGIN;
UPDATE hello_items SET name = 'updated' WHERE name = 'alpha';
ROLLBACK;
```

用 `quit` 退出。故障排查应检查 PD/TiKV/TiDB 各组件状态、4000 端口、TLS、MySQL 兼容差异和 SQL mode；能够连接 MySQL 客户端不等于所有 MySQL 行为完全一致。

资料核对日期：2026-08-28。
