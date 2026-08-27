# TiDB 安装与切换

TiDB 是由 TiDB、PD、TiKV 等组件组成的分布式系统。TiUP 是官方组件管理器；`tiup playground` 仅用于本地体验，不是生产部署。

- [TiDB 快速开始](https://docs.pingcap.com/tidb/stable/quick-start-with-tidb/)
- [TiUP 概览](https://docs.pingcap.com/tidb/stable/tiup-overview/)
- [生产部署](https://docs.pingcap.com/tidb/stable/production-deployment-using-tiup/)

## 推荐方式

Linux/macOS 开发机用 TiUP 启动明确 TiDB 版本；生产使用 TiUP Cluster 按拓扑部署。Windows 原生不作为官方本地集群路径，使用 WSL/容器或远程集群。

## TiUP

~~~bash
curl --proto '=https' --tlsv1.2 -sSf https://tiup-mirrors.pingcap.com/install.sh | sh
source "$HOME/.bash_profile"
tiup list tidb
tiup playground v8.5.0
~~~

安装脚本来自 PingCAP 官方镜像；执行前审阅。Playground 默认还会启动 PD/TiKV 等组件。

## 组件与端口

~~~bash
tiup --version
tiup playground display
mysql -h 127.0.0.1 -P 4000 -u root -e "SELECT tidb_version();"
~~~

## 版本切换

TiUP 通过命令参数选择组件版本，如 `tiup playground v8.5.0`。生产集群用 `tiup cluster upgrade` 按官方流程升级；不要手工替换单个组件二进制。

## Docker

~~~bash
docker run --rm --name tidb-smoke -p 4000:4000 pingcap/tidb:v8.5.0
~~~

## 安装验证

~~~bash
tiup --version
mysql -h 127.0.0.1 -P 4000 -u root -e "SELECT tidb_version();"
~~~

## 升级、卸载与冲突

TiUP 用 `tiup update --self` 与例如 `tiup update tidb` 的明确组件命令更新工具缓存，生产集群另走 cluster upgrade。卸载前检查 `~/.tiup`、数据目录和 4000/2379/20160 等端口。

## 官方资料

- [TiDB 快速开始](https://docs.pingcap.com/tidb/stable/quick-start-with-tidb/)
- [TiUP 概览](https://docs.pingcap.com/tidb/stable/tiup-overview/)
- [生产部署](https://docs.pingcap.com/tidb/stable/production-deployment-using-tiup/)

资料核对日期：2026-08-27。
