# SQLite 连接与执行

`sqlite3` 直接打开一个数据库文件，没有独立服务端、账户或监听端口。数据库文件不存在时会在首次写入时创建，因此先确认当前目录和目标路径。

- [SQLite CLI](https://sqlite.org/cli.html)
- [CLI 输入与输出](https://sqlite.org/cli.html#querying_the_database_schema)
- [事务语法](https://sqlite.org/lang_transaction.html)

## 打开数据库

```bash
sqlite3 hello.db
sqlite3 -readonly hello.db
sqlite3 -cmd '.headers on' -cmd '.mode box' hello.db
```

点命令由客户端处理，不以分号结尾：

```text
.databases
.tables
.schema hello_items
.dbinfo
```

## 执行语句与脚本

```sql
CREATE TABLE IF NOT EXISTS hello_items (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL
);
INSERT INTO hello_items(name) VALUES ('alpha'), ('beta');
SELECT * FROM hello_items ORDER BY id;
```

```bash
sqlite3 hello.db 'SELECT sqlite_version();'
sqlite3 -bail hello.db < schema.sql
sqlite3 hello.db '.read schema.sql'
```

`-bail` 会在首个错误后停止，避免后续语句继续修改文件。

## 导入与导出

```text
.mode csv
.import --skip 1 items.csv hello_items
.headers on
.once items.out.csv
SELECT * FROM hello_items ORDER BY id;
.output stdout
```

完整导出可使用 `.dump`，只导出结构可使用 `.schema`。重定向前先确认目标路径，避免覆盖已有文件。

## 事务与退出

```sql
BEGIN IMMEDIATE;
UPDATE hello_items SET name = 'updated' WHERE id = 1;
ROLLBACK;
```

使用 `.quit` 或 `.exit` 离开。出现 `database is locked` 时应查找仍持有事务的进程，并设置合理的 `.timeout 5000`；不要通过删除 `-wal` 或 `-shm` 文件解除锁。文件权限错误则同时检查数据库文件和所在目录的写权限。

资料核对日期：2026-08-28。
