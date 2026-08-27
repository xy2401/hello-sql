# Apache CouchDB 安装与切换

CouchDB 服务端通过 HTTP API 工作，Fauxton 随服务端提供。Apache 官方提供 Debian/RPM convenience package、Windows/macOS 包和容器。

- [CouchDB 安装总览](https://docs.couchdb.org/en/stable/install/index.html)
- [Unix 安装](https://docs.couchdb.org/en/stable/install/unix.html)
- [Docker 安装](https://docs.couchdb.org/en/stable/install/docker.html)

## 推荐方式

Linux 使用 Apache CouchDB 官方仓库，Windows/macOS 使用项目安装包。CouchDB 3.x 首次启动前必须设置管理员；不要把无管理员配置暴露到网络。

## 平台安装

~~~bash
# 配置 Apache CouchDB 官方仓库后
sudo apt install couchdb
sudo dnf install couchdb
# macOS
brew install couchdb
~~~

Windows 使用官方二进制安装器。Debian 安装会询问单节点/集群、监听地址和管理员信息。

## 服务与端口

~~~bash
systemctl status couchdb
curl -fsS http://127.0.0.1:5984/
curl -fsS http://127.0.0.1:5984/_up
~~~

## 版本切换

服务端版本由包或安装目录选择；升级前阅读官方 upgrade notes。并行实例需要独立 5984 端口、配置与 data 目录，不通过 PATH 指向同一数据目录切换。

## Docker

~~~bash
docker run --rm --name couchdb-smoke -e COUCHDB_USER=admin -e COUCHDB_PASSWORD=localtest -p 5984:5984 couchdb:3.5
~~~

## 安装验证

~~~bash
curl -fsS http://127.0.0.1:5984/
curl -fsS http://127.0.0.1:5984/_up
systemctl status couchdb
~~~

## 升级、卸载与冲突

原包管理器负责升级卸载，数据和配置通常保留。跨大版本先备份并按文档迁移；检查 5984 端口、`local.ini` 覆盖和 Erlang 依赖。

## 官方资料

- [CouchDB 安装总览](https://docs.couchdb.org/en/stable/install/index.html)
- [Unix 安装](https://docs.couchdb.org/en/stable/install/unix.html)
- [Docker 安装](https://docs.couchdb.org/en/stable/install/docker.html)

资料核对日期：2026-08-27。
