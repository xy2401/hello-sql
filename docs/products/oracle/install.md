# Oracle Database 安装与切换

Oracle Database 安装受平台支持矩阵、版本许可、补丁授权和 Oracle 账户条款约束。数据库服务端与 Instant Client/SQLcl 应分开选择。

- [Oracle Database 26ai Linux 安装指南](https://docs.oracle.com/en/database/oracle/oracle-database/26/ladbi/)
- [Oracle Database 下载](https://www.oracle.com/database/technologies/oracle-database-software-downloads.html)
- [Oracle Instant Client](https://www.oracle.com/database/technologies/instant-client.html)
- [Oracle Container Registry](https://container-registry.oracle.com/)

## 推荐方式

服务端仅在 Oracle 官方支持的操作系统上按安装指南部署；开发者桌面优先连接远端实例或只装 Instant Client/SQLcl。不要把 Oracle Linux/RHEL 的 RPM 指令套到任意 Linux。

## 服务端与客户端

Linux 服务端从 Oracle 官方下载数据库 image，满足内核、软件包、用户与存储前置条件后运行 Oracle Universal Installer。Windows 使用官方安装介质。macOS 没有原生数据库服务端安装，只有受支持的客户端组件。

## 版本与服务确认

~~~bash
sqlplus -V
lsnrctl status
# 登录后
# SELECT banner_full FROM v$version;
~~~

## 版本切换

无法像语言运行时一样切换数据库主版本。Oracle Home 可以并行，客户端通过 `ORACLE_HOME`、PATH 与 `TNS_ADMIN` 选择；数据库升级必须使用官方 AutoUpgrade/DBUA 流程并检查兼容参数。

## Docker

Docker 渠道受限：Oracle Container Registry 需要登录并接受对应镜像许可，本页不提供可匿名复制执行的拉取命令。选择明确 Database Free/Enterprise tag 后，按 Registry 页面给出的环境变量和许可运行。

## 安装验证

~~~bash
sqlplus -V
echo "$ORACLE_HOME"
command -v sqlplus
lsnrctl status
~~~

## 升级、卸载与冲突

使用 OPatch/Release Update 与官方升级工具维护，不通过通用系统包管理器覆盖 Oracle Home。卸载前备份数据库、wallet、listener 与网络配置；PATH 中多个 Oracle Home 是最常见冲突。

## 官方资料

- [Oracle Database 26ai Linux 安装指南](https://docs.oracle.com/en/database/oracle/oracle-database/26/ladbi/)
- [Oracle Database 下载](https://www.oracle.com/database/technologies/oracle-database-software-downloads.html)
- [Oracle Instant Client](https://www.oracle.com/database/technologies/instant-client.html)
- [Oracle Container Registry](https://container-registry.oracle.com/)

资料核对日期：2026-08-27。
