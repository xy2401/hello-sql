# TimescaleDB 安装与切换

TimescaleDB 是 PostgreSQL 扩展，不是独立协议服务。必须同时匹配 PostgreSQL 主版本、TimescaleDB 扩展版本和可选 Toolkit。

- [TimescaleDB 安装](https://docs.timescale.com/self-hosted/latest/install/)
- [TimescaleDB Toolkit](https://docs.timescale.com/self-hosted/latest/tooling/install-toolkit/)
- [升级 TimescaleDB](https://docs.timescale.com/self-hosted/latest/upgrades/)

## 推荐方式

开发使用官方预构建容器；Linux/macOS 本机安装按官方页面选择与 PostgreSQL 主版本匹配的软件包。Windows 原生支持受限时使用容器，不伪造扩展包。

## 扩展安装

~~~bash
# 配置 Timescale 官方仓库，且已安装匹配 PostgreSQL 后
sudo apt install timescaledb-2-postgresql-17
sudo dnf install timescaledb-2-postgresql-17
brew tap timescale/tap
brew install timescaledb
~~~

安装后运行 `timescaledb-tune` 或手工配置 `shared_preload_libraries`，再在目标数据库创建扩展。

## 启用与确认

~~~sql
CREATE EXTENSION IF NOT EXISTS timescaledb;
SELECT extversion FROM pg_extension WHERE extname = 'timescaledb';
~~~

## 版本切换

扩展升级在每个数据库执行 `ALTER EXTENSION timescaledb UPDATE`，并遵循官方兼容矩阵。PostgreSQL 主版本升级是另一条迁移流程，不能只切换 PATH。

## Docker

~~~bash
docker run --rm --name timescale-smoke -e POSTGRES_PASSWORD=localtest -p 5432:5432 timescale/timescaledb:2.21.0-pg17
~~~

## 安装验证

~~~bash
psql -h 127.0.0.1 -U postgres -c "SELECT extversion FROM pg_extension WHERE extname = 'timescaledb';"
pg_config --version
~~~

## 升级、卸载与冲突

先升级扩展再按支持矩阵升级 PostgreSQL，或遵循官方指定顺序。卸载软件包前确认数据库不再依赖扩展文件。检查 `shared_preload_libraries`、5432 端口和多个 PostgreSQL 安装。

## 官方资料

- [TimescaleDB 安装](https://docs.timescale.com/self-hosted/latest/install/)
- [TimescaleDB Toolkit](https://docs.timescale.com/self-hosted/latest/tooling/install-toolkit/)
- [升级 TimescaleDB](https://docs.timescale.com/self-hosted/latest/upgrades/)

资料核对日期：2026-08-27。
