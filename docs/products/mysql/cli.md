# MySQL 连接与执行

日常 SQL 操作使用经典 `mysql` 客户端；`mysqlsh` 是支持 SQL、JavaScript、Python 模式以及 InnoDB Cluster 管理的 MySQL Shell，两者不要混为同一个程序。

- [mysql 客户端](https://dev.mysql.com/doc/refman/8.4/en/mysql.html)
- [MySQL Shell](https://dev.mysql.com/doc/mysql-shell/8.4/en/)
- [批处理模式](https://dev.mysql.com/doc/refman/8.4/en/batch-mode.html)

## 启动与状态

```bash
sudo systemctl start mysql
sudo systemctl status mysql
mysqladmin -h 127.0.0.1 -P 3306 -u hello -p ping
```

## 连接与查看环境

```bash
mysql -h 127.0.0.1 -P 3306 -u hello -p hello
mysqlsh --sql --host 127.0.0.1 --port 3306 --user hello --database hello
```

密码使用交互提示、登录路径或受控的凭据存储，不要写进命令历史。进入客户端后可检查当前会话：

```sql
status
SELECT VERSION(), DATABASE(), CURRENT_USER();
SHOW DATABASES;
SHOW TABLES;
DESCRIBE hello_items;
```

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
mysql -h 127.0.0.1 -u hello -p hello -e 'SELECT VERSION();'
mysql -h 127.0.0.1 -u hello -p hello < schema.sql
```

交互会话中使用 `source schema.sql`。脚本依赖当前目录，自动化时优先使用绝对路径并检查退出码。

## 导入、导出与事务

```sql
LOAD DATA LOCAL INFILE 'items.csv'
INTO TABLE hello_items
FIELDS TERMINATED BY ','
IGNORE 1 LINES (name);

START TRANSACTION;
UPDATE hello_items SET name = 'updated' WHERE id = 1;
ROLLBACK;
```

`LOAD DATA LOCAL` 需要客户端和服务器都允许该能力。结构与数据导出通常交给 `mysqldump`：

```bash
mysqldump -h 127.0.0.1 -u hello -p --databases hello > hello.sql
```

输入 `quit` 或 `\q` 退出。连接问题优先核对 TCP 与 Unix Socket 的差别、3306 端口、认证插件、TLS 要求和用户允许的来源主机。

资料核对日期：2026-08-28。
