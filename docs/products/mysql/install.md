# MySQL 安装与切换

MySQL Community Server、`mysql` 客户端、MySQL Shell 与 Workbench 是不同组件。官方提供 Windows/macOS 安装包以及 APT/Yum/SLES 软件仓库。

- [MySQL 下载](https://dev.mysql.com/downloads/)
- [MySQL 8.4 安装](https://dev.mysql.com/doc/refman/8.4/en/installing.html)
- [MySQL 发布轨道](https://dev.mysql.com/doc/refman/8.4/en/mysql-releases.html)

## 推荐方式

生产和长期学习环境优先选择 8.4 LTS 轨道，并用 Oracle 官方仓库或安装器。只连接远端实例时安装客户端即可，不必启动本地服务。

## 平台安装

~~~bash
# 配置 MySQL 官方 APT 仓库后
sudo apt install mysql-community-server mysql-community-client
# 配置 MySQL 官方 Yum 仓库并启用 mysql-8.4-lts-community 后
sudo dnf install mysql-community-server
# macOS 官方 DMG 或 Homebrew 社区包
brew install mysql@8.4
~~~

Windows 使用 MySQL Installer 或官方 ZIP；安装时记录 root 认证方式与 Windows 服务名。

## 服务与端口

~~~bash
systemctl status mysqld || systemctl status mysql
mysql --version
mysqladmin --host=127.0.0.1 --port=3306 ping
~~~

## 版本切换

官方仓库通过仓库配置选择 LTS 或 Innovation 轨道。服务端跨主版本需运行升级检查并备份；客户端可以绝对路径并行。不要用 `alternatives` 切换服务端后继续复用未经升级的数据目录。

## Docker

~~~bash
docker run --rm --name mysql-smoke -e MYSQL_ROOT_PASSWORD=localtest -p 3306:3306 mysql:8.4
~~~

## 安装验证

~~~bash
mysql --version
mysqladmin --version
mysqladmin -uroot -plocaltest -h127.0.0.1 ping
~~~

## 升级、卸载与冲突

用原仓库升级并阅读官方升级章节。卸载软件包通常不删除数据；手工清理前先备份。PATH 冲突常见于 MariaDB 客户端、MySQL Shell 和多个 `mysql` 可执行文件。

## 官方资料

- [MySQL 下载](https://dev.mysql.com/downloads/)
- [MySQL 8.4 安装](https://dev.mysql.com/doc/refman/8.4/en/installing.html)
- [MySQL 发布轨道](https://dev.mysql.com/doc/refman/8.4/en/mysql-releases.html)

资料核对日期：2026-08-27。
