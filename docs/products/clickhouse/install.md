# ClickHouse 安装与切换

ClickHouse 提供 server、client 和单文件 local 模式。官方支持 Debian/RPM/TGZ 包及容器；正式支持的平台以 ClickHouse 安装文档为准。

- [ClickHouse 安装](https://clickhouse.com/docs/en/getting-started/install/)
- [ClickHouse 支持平台](https://clickhouse.com/support/platforms)
- [ClickHouse 包仓库](https://packages.clickhouse.com/)

## 推荐方式

Linux 服务端使用 ClickHouse 官方仓库；macOS/Windows 的本地分析可使用 `clickhouse local` 单文件制品或容器。客户端和服务端可以独立安装。

## 安装渠道

~~~bash
# 配置 ClickHouse 官方仓库后
sudo apt install clickhouse-server clickhouse-client
sudo dnf install clickhouse-server clickhouse-client
# 官方单文件安装器
curl https://clickhouse.com/ | sh
~~~

执行远程脚本前先在浏览器审阅并根据官方页面选择固定发布制品；生产安装优先签名软件包。

## 服务与端口

~~~bash
systemctl status clickhouse-server
clickhouse-client --query "SELECT version()"
clickhouse-local --query "SELECT version()"
~~~

## 版本切换

APT/RPM 通过仓库和明确包版本选择 release/LTS 线。服务端降级或跨兼容边界前检查数据格式与迁移说明；单文件 CLI 可放在版本化目录并用绝对路径比较。

## Docker

~~~bash
docker run --rm --name clickhouse-smoke -p 8123:8123 -p 9000:9000 clickhouse/clickhouse-server:25.8
~~~

## 安装验证

~~~bash
clickhouse-client --version
clickhouse-client --query "SELECT version()"
curl -fsS http://127.0.0.1:8123/ping
~~~

## 升级、卸载与冲突

使用官方仓库升级并阅读兼容说明。卸载前备份数据与用户配置；检查 8123/9000 端口、`/etc/clickhouse-*` 和 PATH 中旧单文件版本。

## 官方资料

- [ClickHouse 安装](https://clickhouse.com/docs/en/getting-started/install/)
- [ClickHouse 支持平台](https://clickhouse.com/support/platforms)
- [ClickHouse 包仓库](https://packages.clickhouse.com/)

资料核对日期：2026-08-27。
