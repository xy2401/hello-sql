# ScyllaDB 安装与切换

ScyllaDB 服务端面向 64 位 Linux，并对 CPU、内存、磁盘和内核配置有明确要求。macOS/Windows 开发使用 Docker 或云服务，不伪造原生服务器包。

- [ScyllaDB 安装](https://docs.scylladb.com/manual/stable/getting-started/)
- [系统要求](https://docs.scylladb.com/manual/stable/getting-started/system-requirements.html)
- [Docker 运行](https://docs.scylladb.com/manual/stable/getting-started/install-scylla/run-in-docker.html)

## 推荐方式

生产节点使用 ScyllaDB 官方 Web Installer 或对应 Linux 官方仓库，并先核对硬件/OS 支持。低资源开发机采用 Docker shared/developer 配置。

## Linux

从官方安装向导选择具体 ScyllaDB 版本和发行版，执行其生成的仓库配置后安装 `scylla`。Debian 与 RPM 指令、仓库 URL和支持版本不同，不能混用。

## 服务与端口

~~~bash
systemctl status scylla-server
scylla --version
cqlsh 127.0.0.1 9042 -e "SELECT release_version FROM system.local;"
~~~

## 版本切换

集群必须按官方升级路径滚动更新。并行开发实例需要独立 data 目录、CQL 端口和资源配额；不能让不同版本交替打开同一 SSTable 目录。

## Docker

~~~bash
docker run --rm --name scylla-smoke -p 9042:9042 scylladb/scylla:2025.2 --smp 1 --memory 750M --overprovisioned 1
~~~

## 安装验证

~~~bash
scylla --version
nodetool status
cqlsh 127.0.0.1 9042 -e "SELECT release_version FROM system.local;"
~~~

## 升级、卸载与冲突

按官方升级指南和滚动顺序维护，升级前备份 schema/数据并检查驱动兼容。卸载前确认 data path。检查 7000/7001/7199/9042 端口及 CPU pinning。

## 官方资料

- [ScyllaDB 安装](https://docs.scylladb.com/manual/stable/getting-started/)
- [系统要求](https://docs.scylladb.com/manual/stable/getting-started/system-requirements.html)
- [Docker 运行](https://docs.scylladb.com/manual/stable/getting-started/install-scylla/run-in-docker.html)

资料核对日期：2026-08-27。
