# PostgreSQL 连接与执行

`psql` 是 PostgreSQL 随附的交互式终端。以下命令假设本机已有一个名为 `hello` 的数据库和同名普通用户；不要把示例中的建表、导入或删除命令直接用于生产实例。

- [psql 官方文档](https://www.postgresql.org/docs/current/app-psql.html)
- [客户端认证](https://www.postgresql.org/docs/current/client-authentication.html)
- [COPY](https://www.postgresql.org/docs/current/sql-copy.html)

## 启动与状态

服务名取决于安装渠道。先确认服务和端口，再连接：

```bash
sudo systemctl start postgresql
sudo systemctl status postgresql
pg_isready -h 127.0.0.1 -p 5432
```

## 连接数据库

```bash
psql -h 127.0.0.1 -p 5432 -U hello -d hello
psql 'postgresql://hello@127.0.0.1:5432/hello'
```

进入 `psql` 后，反斜杠命令由客户端处理，不要加分号：

```text
\conninfo
\l
\dn
\dt
\d hello_items
```

## 执行语句与脚本

```sql
CREATE TABLE IF NOT EXISTS hello_items (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name text NOT NULL
);
INSERT INTO hello_items(name) VALUES ('alpha'), ('beta');
SELECT * FROM hello_items ORDER BY id;
```

从 Shell 执行单条语句或脚本：

```bash
psql -h 127.0.0.1 -U hello -d hello -c 'SELECT current_database(), current_user;'
psql -h 127.0.0.1 -U hello -d hello -v ON_ERROR_STOP=1 -f schema.sql
```

`ON_ERROR_STOP` 能让脚本遇错时返回非零退出码，适合自动化检查。

## 导入、导出与事务

```text
\copy hello_items(name) FROM 'items.csv' WITH (FORMAT csv, HEADER true)
\copy (SELECT * FROM hello_items ORDER BY id) TO 'items.out.csv' WITH (FORMAT csv, HEADER true)
```

```sql
BEGIN;
UPDATE hello_items SET name = 'updated' WHERE id = 1;
ROLLBACK;
```

使用 `\q` 退出。连接失败时依次检查 `pg_isready`、监听地址、端口、数据库名、用户和 `pg_hba.conf`；不要用关闭认证的方式绕过问题。

资料核对日期：2026-08-28。
