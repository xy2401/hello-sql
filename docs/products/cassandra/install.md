# Apache Cassandra 安装与切换

Cassandra 服务端、`cqlsh` 与应用驱动依赖不同组件。官方支持 Docker、二进制 tarball、APT/RPM；Cassandra 5.0 还需要受支持的 Java 与 Python（用于 cqlsh）。

- [Cassandra 安装](https://cassandra.apache.org/doc/stable/cassandra/installing/installing.html)
- [Cassandra 下载](https://cassandra.apache.org/_/download.html)
- [升级文档](https://cassandra.apache.org/doc/stable/cassandra/managing/operating/upgrade.html)

## 推荐方式

本地验证使用固定 Docker 镜像；长期节点使用官方 APT/RPM 或校验过的 tarball，并先核对 Java 版本。不要用单节点开发参数推导生产拓扑。

## 包与依赖

~~~bash
java -version
python3 --version
# 配置 Apache Cassandra 官方仓库后
sudo apt install cassandra
sudo dnf install cassandra
~~~

官方文档列出 Java 11/17 与 cqlsh 的 Python 范围；以目标 Cassandra 版本页为准。Windows/macOS 开发优先容器。

## 服务与端口

~~~bash
systemctl status cassandra
nodetool version
cqlsh 127.0.0.1 9042 -e "SELECT release_version FROM system.local;"
~~~

## 版本切换

集群按官方滚动升级路径逐节点更新，不能靠 PATH 在一个数据目录上任意切换。tarball 可并行保存，但每个实例必须使用独立配置、日志和数据目录。

## Docker

~~~bash
docker run --rm --name cassandra-smoke -p 9042:9042 cassandra:5.0
~~~

## 安装验证

~~~bash
nodetool version
nodetool status
cqlsh 127.0.0.1 9042 -e "SELECT release_version FROM system.local;"
~~~

## 升级、卸载与冲突

升级前运行兼容检查、备份 schema 与快照，并遵循滚动升级顺序。卸载软件包不等于删除数据。检查 7000/7001/7199/9042 端口和 `CASSANDRA_HOME`。

## 官方资料

- [Cassandra 安装](https://cassandra.apache.org/doc/stable/cassandra/installing/installing.html)
- [Cassandra 下载](https://cassandra.apache.org/_/download.html)
- [升级文档](https://cassandra.apache.org/doc/stable/cassandra/managing/operating/upgrade.html)

资料核对日期：2026-08-27。
