# DuckDB 连接与执行

DuckDB CLI 直接打开数据库文件，也可使用内存数据库。它没有常驻服务、用户认证或监听端口，适合在本机对 CSV、Parquet 和数据库文件直接查询。

- [DuckDB CLI](https://duckdb.org/docs/stable/clients/cli/overview)
- [CLI 点命令](https://duckdb.org/docs/stable/clients/cli/dot_commands)
- [数据导入](https://duckdb.org/docs/stable/data/overview)

## 打开数据库

```bash
duckdb hello.duckdb
duckdb :memory:
duckdb -readonly hello.duckdb
```

客户端点命令不需要分号：

```text
.databases
.tables
.schema hello_items
.mode duckbox
```

## 执行查询与脚本

```sql
CREATE TABLE IF NOT EXISTS hello_items (
  id BIGINT PRIMARY KEY,
  name VARCHAR NOT NULL
);
INSERT INTO hello_items VALUES (1, 'alpha'), (2, 'beta');
SELECT * FROM hello_items ORDER BY id;
```

```bash
duckdb hello.duckdb -c 'SELECT version();'
duckdb hello.duckdb < schema.sql
duckdb hello.duckdb '.read schema.sql'
```

命令中的数据库文件路径决定实际读写目标。自动化脚本应使用明确路径，避免在错误目录创建同名新库。

## 直接查询和导入文件

```sql
SELECT * FROM read_csv('items.csv', header = true);
SELECT * FROM read_parquet('items.parquet');

CREATE TABLE imported_items AS
SELECT * FROM read_csv('items.csv', header = true);

COPY imported_items TO 'items.out.parquet' (FORMAT parquet);
COPY imported_items TO 'items.out.csv' (HEADER, DELIMITER ',');
```

## 事务与退出

```sql
BEGIN TRANSACTION;
UPDATE hello_items SET name = 'updated' WHERE id = 1;
ROLLBACK;
```

使用 `.quit` 或 `Ctrl+D` 退出。文件无法打开时检查路径、权限、是否被另一个写进程占用以及扩展是否需要先 `INSTALL`/`LOAD`；离线环境不要假设扩展能自动下载。

资料核对日期：2026-08-28。
