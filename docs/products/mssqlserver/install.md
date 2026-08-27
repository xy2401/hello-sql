# SQL Server 安装与切换

SQL Server 数据库引擎、`sqlcmd`、SSMS 与 Azure Data Studio 是独立组件。Windows 安装最完整；Linux 仅支持 Microsoft 文档列出的发行版和版本组合。

- [SQL Server 安装](https://learn.microsoft.com/sql/database-engine/install-windows/install-sql-server-database-engine)
- [Linux 安装](https://learn.microsoft.com/sql/linux/sql-server-linux-setup)
- [sqlcmd 安装](https://learn.microsoft.com/sql/tools/sqlcmd/sqlcmd-download-install)

## 推荐方式

Windows 使用 Microsoft 安装向导选择 Developer/Express/授权版；Linux 必须从 Microsoft 官方仓库按支持矩阵安装。只连接远端服务时单独安装新版 `sqlcmd`。

## Windows 与 Linux

~~~powershell
# Windows：从 Microsoft 官方下载中心取得 SQL Server 安装器
winget install Microsoft.SQLServerManagementStudio
# Linux：配置与发行版匹配的 Microsoft SQL Server 仓库后
sudo apt install mssql-server
sudo /opt/mssql/bin/mssql-conf setup
~~~

不要在未列入支持矩阵的 Arch/macOS 上伪造本机服务端安装；macOS 用容器或远程实例。

## 服务、客户端与端口

~~~bash
systemctl status mssql-server
/opt/mssql/bin/sqlservr --version
sqlcmd -S localhost,1433 -C -Q "SELECT @@VERSION"
~~~

## 版本切换

SQL Server 实例版本通过安装介质和升级流程管理，不由 PATH 切换。并行版本在 Windows 使用命名实例；Linux 通常每主机一个实例。客户端 `sqlcmd` 可独立升级。

## Docker

~~~powershell
docker run --rm --name sqlserver-smoke -e ACCEPT_EULA=Y -e MSSQL_SA_PASSWORD="LocalOnly!2026Sql" -p 1433:1433 mcr.microsoft.com/mssql/server:2022-CU14-ubuntu-22.04
~~~

## 安装验证

~~~powershell
sqlcmd -?
Get-Service *SQL*
Test-NetConnection localhost -Port 1433
~~~

## 升级、卸载与冲突

通过 SQL Server Setup、Windows Update 或 Microsoft Linux 仓库维护。卸载实例前备份用户数据库、证书和密钥。检查命名实例、1433 端口、ODBC Driver 与旧 `sqlcmd` 的 PATH。

## 官方资料

- [SQL Server 安装](https://learn.microsoft.com/sql/database-engine/install-windows/install-sql-server-database-engine)
- [Linux 安装](https://learn.microsoft.com/sql/linux/sql-server-linux-setup)
- [sqlcmd 安装](https://learn.microsoft.com/sql/tools/sqlcmd/sqlcmd-download-install)

资料核对日期：2026-08-27。
