# PostgreSQL 安装与切换

PostgreSQL 分为服务端、`psql` 客户端和图形管理工具。生产主机优先使用 PostgreSQL Global Development Group（PGDG）官方仓库；发行版自带包通常更保守。

- [PostgreSQL 下载](https://www.postgresql.org/download/)
- [Linux 下载](https://www.postgresql.org/download/linux/)
- [Windows 下载](https://www.postgresql.org/download/windows/)
- [版本策略](https://www.postgresql.org/support/versioning/)

## 推荐方式

Linux 选择 PGDG 对应发行版仓库，Windows/macOS 使用官方页面列出的安装器；只需远程连接时只装客户端。升级主版本前必须备份并选择 `pg_upgrade` 或逻辑迁移方案。

## 服务端与客户端

~~~bash
sudo apt install postgresql-18 postgresql-client-18   # 配置 PGDG 官方仓库后
sudo dnf install postgresql18-server postgresql18   # 配置 PGDG 官方仓库后
brew install postgresql@18                         # Homebrew 社区维护
~~~

Windows 使用 PostgreSQL 下载页链接的 EDB 安装器。包名随发行版与仓库版本变化，不混用 Debian 和 RPM 仓库指令。

## 服务与端口

~~~bash
systemctl status postgresql
psql --version
pg_isready -h 127.0.0.1 -p 5432
~~~

## 版本切换

客户端可并行安装并以 `/usr/lib/postgresql/18/bin/psql` 等绝对路径调用。服务端主版本不是 PATH 切换问题：每个数据目录属于特定主版本，必须按官方升级文档迁移，不能直接让新二进制打开旧数据目录。

## Docker

~~~bash
docker run --rm --name pg-smoke -e POSTGRES_PASSWORD=localtest -p 5432:5432 postgres:18-alpine
~~~

## 安装验证

~~~bash
psql --version
pg_config --version
pg_isready -h 127.0.0.1 -p 5432
~~~

## 升级、卸载与冲突

包管理器负责补丁升级和卸载，但通常保留数据目录。先用 `pg_lsclusters` 或服务配置确认实例；检查 PATH 中的客户端版本、5432 端口占用和 `PGHOST`/`PGPORT` 环境变量。

## 官方资料

- [PostgreSQL 下载](https://www.postgresql.org/download/)
- [Linux 下载](https://www.postgresql.org/download/linux/)
- [Windows 下载](https://www.postgresql.org/download/windows/)
- [版本策略](https://www.postgresql.org/support/versioning/)

资料核对日期：2026-08-27。
