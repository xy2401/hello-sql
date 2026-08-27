# SQL Server 连接与执行

`sqlcmd` 是 SQL Server 的官方命令行客户端。现代版本提供 Go 实现，参数与传统 ODBC 版本大体兼容，但加密默认值可能不同，应先确认本机使用的是哪一版。

- [sqlcmd 工具](https://learn.microsoft.com/sql/tools/sqlcmd/sqlcmd-utility)
- [使用 sqlcmd](https://learn.microsoft.com/sql/tools/sqlcmd/sqlcmd-use-utility)
- [bcp 工具](https://learn.microsoft.com/sql/tools/bcp-utility)

## 启动与状态

Linux 安装可用服务管理器检查实例；Windows 使用 SQL Server Configuration Manager 或服务管理器：

```bash
sudo systemctl start mssql-server
sudo systemctl status mssql-server
```

## 连接实例

```bash
sqlcmd -S tcp:127.0.0.1,1433 -U hello -d hello
sqlcmd -S localhost -E -d hello
```

`-E` 使用 Windows 集成认证，`-U` 使用 SQL 登录。不要在命令行用 `-P` 明文传密码；让客户端提示输入或使用安全的凭据机制。自签名的本地环境可按实际安全策略使用证书信任选项，生产环境应配置可验证证书。

## 执行查询与脚本

`GO` 是 `sqlcmd` 的批处理分隔符，不是 T-SQL 语句：

```sql
SELECT @@VERSION, DB_NAME(), SUSER_SNAME();
GO
CREATE TABLE dbo.hello_items (
  id bigint IDENTITY PRIMARY KEY,
  name nvarchar(100) NOT NULL
);
GO
```

```bash
sqlcmd -S tcp:127.0.0.1,1433 -U hello -d hello -Q "SELECT COUNT(*) FROM dbo.hello_items"
sqlcmd -S tcp:127.0.0.1,1433 -U hello -d hello -b -i schema.sql -o schema.out.txt
```

`-b` 让 SQL 错误影响退出码，适合脚本和 CI。交互会话可用 `:r other.sql` 载入文件。

## 导入、导出与事务

```bash
bcp hello.dbo.hello_items out items.tsv -S 127.0.0.1,1433 -U hello -c
bcp hello.dbo.hello_items in items.tsv -S 127.0.0.1,1433 -U hello -c
```

```sql
BEGIN TRANSACTION;
UPDATE dbo.hello_items SET name = N'updated' WHERE id = 1;
ROLLBACK TRANSACTION;
GO
```

输入 `QUIT` 退出。排错时检查实例名、TCP 是否启用、1433 端口、防火墙、数据库默认值、认证模式和证书错误。

资料核对日期：2026-08-28。
