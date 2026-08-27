# CockroachDB 安装与切换

CockroachDB 单一二进制同时包含服务端、SQL CLI 和工作负载工具。官方提供平台二进制与容器；生产集群必须使用安全模式和受支持的升级路径。

- [CockroachDB 安装](https://www.cockroachlabs.com/docs/stable/install-cockroachdb)
- [本地单节点](https://www.cockroachlabs.com/docs/stable/start-a-local-cluster)
- [升级 CockroachDB](https://www.cockroachlabs.com/docs/stable/upgrade-cockroach-version)

## 推荐方式

开发机使用官方二进制或固定容器；生产环境按官方 on-premises/cloud 指南部署多节点。`--insecure` 只用于回环地址上的临时实验。

## 官方二进制

从安装页选择与 Linux、macOS 或 Windows/WSL 匹配的明确版本归档，校验后把 `cockroach` 放入用户工具目录。Homebrew 包由社区 formula 维护，生产版本仍应对照官方发布页。

## 单节点验证

~~~bash
cockroach start-single-node --insecure --listen-addr=localhost:26257 --http-addr=localhost:8080 --store=type=mem,size=1GiB
cockroach sql --insecure --host=localhost:26257 -e "SELECT version();"
~~~

## 版本切换

二进制可版本化存放并由绝对路径选择，但集群升级必须遵循逐节点和 preserve downgrade option 流程。不能让旧二进制任意打开已完成版本升级的 store。

## Docker

~~~bash
docker run --rm --name crdb-smoke -p 26257:26257 -p 8080:8080 cockroachdb/cockroach:v25.2.0 start-single-node --insecure
~~~

## 安装验证

~~~bash
cockroach version
cockroach sql --insecure --host=localhost:26257 -e "SELECT version();"
~~~

## 升级、卸载与冲突

按官方支持窗口升级并备份。卸载二进制不会删除 `cockroach-data`；清理前确认 store。检查 26257/8080 端口、证书目录和 PATH 中多个 `cockroach`。

## 官方资料

- [CockroachDB 安装](https://www.cockroachlabs.com/docs/stable/install-cockroachdb)
- [本地单节点](https://www.cockroachlabs.com/docs/stable/start-a-local-cluster)
- [升级 CockroachDB](https://www.cockroachlabs.com/docs/stable/upgrade-cockroach-version)

资料核对日期：2026-08-27。
