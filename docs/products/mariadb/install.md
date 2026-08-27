# MariaDB 安装与切换

MariaDB Server、客户端和备份工具可分开安装。MariaDB 官方仓库能选择特定长期维护版本，发行版仓库则由系统维护者决定版本。

- [MariaDB 安装与升级](https://mariadb.com/docs/server/server-management/install-and-upgrade-mariadb)
- [MariaDB 仓库配置](https://mariadb.org/download/)
- [MariaDB 升级指南](https://mariadb.com/docs/server/server-management/install-and-upgrade-mariadb/upgrading)

## 推荐方式

生产环境按官方仓库设置脚本选择明确大版本线；开发机可用发行版包或 Homebrew。不要把 MySQL 数据目录直接交给 MariaDB 新版本启动。

## 服务端与客户端

~~~bash
# 配置 MariaDB 官方仓库后
sudo apt install mariadb-server mariadb-client
sudo dnf install MariaDB-server MariaDB-client
# Arch / Homebrew 为社区维护
sudo pacman -S mariadb
brew install mariadb
~~~

Windows 从 MariaDB 官方下载页选择 MSI。首次安装后运行发行版/官方文档规定的初始化和安全配置。

## 服务与端口

~~~bash
systemctl status mariadb
mariadb --version
mariadb-admin ping -h 127.0.0.1 -P 3306
~~~

## 版本切换

仓库配置负责选择 10.11、11.4、11.8 等版本线。服务端升级必须遵循官方 upgrade path，并执行 `mariadb-upgrade`（版本要求适用时）；客户端才适合靠 PATH 切换。

## Docker

~~~bash
docker run --rm --name mariadb-smoke -e MARIADB_ROOT_PASSWORD=localtest -p 3306:3306 mariadb:11.8
~~~

## 安装验证

~~~bash
mariadb --version
mariadbd --version
mariadb-admin -uroot -plocaltest -h127.0.0.1 ping
~~~

## 升级、卸载与冲突

同一包管理器负责升级与卸载。检查 3306 端口、`my.cnf` 搜索顺序和 `type -a mysql mariadb`；兼容命令名可能让 MySQL 与 MariaDB 客户端互相遮蔽。

## 官方资料

- [MariaDB 安装与升级](https://mariadb.com/docs/server/server-management/install-and-upgrade-mariadb)
- [MariaDB 仓库配置](https://mariadb.org/download/)
- [MariaDB 升级指南](https://mariadb.com/docs/server/server-management/install-and-upgrade-mariadb/upgrading)

资料核对日期：2026-08-27。
