# MongoDB 安装与切换

MongoDB Community Server、`mongosh` 和 Compass 分开发布。Linux 应使用 MongoDB 官方仓库，Windows/macOS 使用官方安装包或受说明的包管理渠道。

- [MongoDB Community 安装](https://www.mongodb.com/docs/manual/administration/install-community/)
- [MongoDB 下载中心](https://www.mongodb.com/try/download/community)
- [mongosh 安装](https://www.mongodb.com/docs/mongodb-shell/install/)

## 推荐方式

服务端选择 Community 的受支持大版本并使用官方仓库；只连接远端实例时单独安装 mongosh。不要把发行版自带的同名旧包视为 MongoDB 官方包。

## 服务端与客户端

~~~bash
# 配置 MongoDB 官方仓库后
sudo apt install mongodb-org
sudo dnf install mongodb-org
brew tap mongodb/brew
brew install mongodb-community@8.0
~~~

Windows 从官方下载中心使用 MSI；Compass 是 GUI，不替代服务端和 mongosh。

## 服务与端口

~~~bash
systemctl status mongod
mongod --version
mongosh --host 127.0.0.1 --port 27017 --eval "db.version()"
~~~

## 版本切换

Homebrew 可用 versioned formula，Linux 通过官方仓库版本线和明确包版本管理。服务端跨大版本必须按兼容升级路径逐级迁移；mongosh 可独立升级。

## Docker

~~~bash
docker run --rm --name mongo-smoke -p 27017:27017 mongo:8.0
~~~

## 安装验证

~~~bash
mongod --version
mongosh --version
mongosh --host 127.0.0.1 --port 27017 --eval "db.version()"
~~~

## 升级、卸载与冲突

用 MongoDB 官方仓库升级；卸载包通常不清数据。检查 27017 端口、`mongod.conf`、data path，以及旧 `mongo` shell 与新 `mongosh` 的命令差异。

## 官方资料

- [MongoDB Community 安装](https://www.mongodb.com/docs/manual/administration/install-community/)
- [MongoDB 下载中心](https://www.mongodb.com/try/download/community)
- [mongosh 安装](https://www.mongodb.com/docs/mongodb-shell/install/)

资料核对日期：2026-08-27。
