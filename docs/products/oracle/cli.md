# Oracle Database 连接与执行

Oracle SQLcl 是当前官方免费命令行客户端，支持 SQL、PL/SQL、脚本和结构化输出；已有环境中的 SQL*Plus 仍可继续使用。本页以 SQLcl 的 `sql` 命令为主。

- [SQLcl 文档](https://docs.oracle.com/en/database/oracle/sql-developer-command-line/)
- [SQLcl 命令参考](https://docs.oracle.com/en/database/oracle/sql-developer-command-line/25.2/sqcug/working-sqlcl.html)
- [Easy Connect 命名](https://docs.oracle.com/en/database/oracle/oracle-database/23/netag/configuring-naming-methods.html)

## 服务与监听器状态

数据库服务名因安装版本和容器数据库配置而异。先检查监听器，再确认可插拔数据库服务：

```bash
lsnrctl status
```

启动数据库属于管理员操作，不应使用普通 `hello` 用户执行；本页假定管理员已经提供可访问的 `FREEPDB1` 服务。

## 连接数据库

```bash
sql hello@//127.0.0.1:1521/FREEPDB1
sql -L hello@//127.0.0.1:1521/FREEPDB1
```

让客户端提示密码，不要把密码写入连接串。SQL*Plus 可使用相同的 Easy Connect 描述符：

```bash
sqlplus hello@//127.0.0.1:1521/FREEPDB1
```

## 检查对象与执行脚本

```sql
show user
SELECT SYS_CONTEXT('USERENV', 'SERVICE_NAME') AS service_name FROM dual;
SELECT table_name FROM user_tables ORDER BY table_name;
DESC hello_items
```

```sql
CREATE TABLE hello_items (
  id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name VARCHAR2(100) NOT NULL
);
INSERT INTO hello_items(name) VALUES ('alpha');
COMMIT;
```

交互会话使用 `@schema.sql` 或 `START schema.sql` 执行文件；从 Shell 非交互执行可重定向标准输入：

```bash
sql -L hello@//127.0.0.1:1521/FREEPDB1 @schema.sql
```

脚本开头可设置 `WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK`，确保错误返回非零状态。

## 输出、事务与退出

SQLcl 可用 `SET SQLFORMAT csv` 后执行查询，再用 `SPOOL items.csv` 与 `SPOOL OFF` 保存结果。

```sql
SET SQLFORMAT csv
UPDATE hello_items SET name = 'updated' WHERE id = 1;
ROLLBACK;
EXIT
```

连接失败时核对监听器、服务名而非 SID、PDB 是否打开、用户是否解锁以及网络 ACL。不要用 SYS 账户完成日常示例。

资料核对日期：2026-08-28。
