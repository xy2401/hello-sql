# MariaDB 连接与执行

MariaDB 当前客户端命令是 `mariadb`，管理探测使用 `mariadb-admin`。部分发行版仍提供 `mysql` 兼容链接，但脚本应优先写真实命令名。

- [mariadb 客户端](https://mariadb.com/docs/server/clients-and-utilities/mariadb-client)
- [mariadb-admin](https://mariadb.com/docs/server/clients-and-utilities/administrative-tools/mariadb-admin)
- [导入数据](https://mariadb.com/docs/server/clients-and-utilities/backup-restore-and-import-clients/mariadb-import)

## 启动与状态

```bash
sudo systemctl start mariadb
sudo systemctl status mariadb
mariadb-admin -h 127.0.0.1 -P 3306 -u hello -p ping
```

## 连接与检查

```bash
mariadb -h 127.0.0.1 -P 3306 -u hello -p hello
```

```sql
status
SELECT VERSION(), DATABASE(), CURRENT_USER();
SHOW TABLES;
SHOW CREATE TABLE hello_items;
```

本地无 `-h` 连接通常使用 Unix Socket；显式写 `127.0.0.1` 才会走 TCP。排查时要先分清两条链路。

## 执行语句与脚本

```sql
CREATE TABLE IF NOT EXISTS hello_items (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL
);
INSERT INTO hello_items(name) VALUES ('alpha'), ('beta');
SELECT * FROM hello_items ORDER BY id;
```

```bash
mariadb -h 127.0.0.1 -u hello -p hello -e 'SELECT VERSION();'
mariadb -h 127.0.0.1 -u hello -p hello < schema.sql
```

交互客户端内可执行 `source schema.sql`，用 `delimiter` 临时改变存储过程定义所需的语句分隔符。

## 导入、导出与事务

```bash
mariadb-dump -h 127.0.0.1 -u hello -p --databases hello > hello.sql
mariadb-import -h 127.0.0.1 -u hello -p --fields-terminated-by=, --ignore-lines=1 hello hello_items.csv
```

```sql
START TRANSACTION;
UPDATE hello_items SET name = 'updated' WHERE id = 1;
ROLLBACK;
```

使用 `quit` 退出。若连接失败，检查服务状态、监听地址、Socket 路径、用户的 `Host` 匹配规则和 TLS 设置，不要把密码直接拼进 `-pPASSWORD`。

资料核对日期：2026-08-28。
