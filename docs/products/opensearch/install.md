# OpenSearch 安装与切换

OpenSearch 与 OpenSearch Dashboards 分开安装。官方支持 Docker、tarball、RPM、Debian、Windows 和 Ansible；安装方法会决定服务文件与配置位置。

- [OpenSearch 安装总览](https://docs.opensearch.org/latest/install-and-configure/)
- [安装 OpenSearch](https://docs.opensearch.org/latest/install-and-configure/install-opensearch/index/)
- [下载 OpenSearch](https://opensearch.org/downloads.html)

## 推荐方式

开发使用固定 Docker 或 tarball；Linux 服务使用 OpenSearch 官方仓库。2.12 及以后演示安全配置需要安装时提供合规管理员密码。

## 软件包

~~~bash
# 配置 OpenSearch 官方仓库并导入官方 GPG key 后
sudo env OPENSEARCH_INITIAL_ADMIN_PASSWORD='LabOnly-S3cure-2026!' apt install opensearch
sudo env OPENSEARCH_INITIAL_ADMIN_PASSWORD='LabOnly-S3cure-2026!' dnf install opensearch
~~~

Windows 使用官方 ZIP；macOS 可用 tarball 或 Docker。不要把 demo 密码用于共享环境。

## 服务与端口

~~~bash
systemctl status opensearch
curl -k -u admin:'LabOnly-S3cure-2026!' https://localhost:9200
/usr/share/opensearch/bin/opensearch --version
~~~

## 版本切换

插件必须与 OpenSearch 版本兼容。升级前按官方文档检查 rolling/cluster-manager 节点顺序；并行归档使用独立配置、数据和端口。

## Docker

~~~bash
docker run --rm --name opensearch-smoke -e discovery.type=single-node -e DISABLE_SECURITY_PLUGIN=true -p 9200:9200 opensearchproject/opensearch:3.2.0
~~~

## 安装验证

~~~bash
curl -fsS http://127.0.0.1:9200
curl -fsS http://127.0.0.1:9200/_cluster/health
/usr/share/opensearch/bin/opensearch --version
~~~

## 升级、卸载与冲突

升级前创建快照并核对插件矩阵；卸载包不等于删除 data。检查 9200/9600 端口、`OPENSEARCH_PATH_CONF`、JVM 配置和系统 `vm.max_map_count`。

## 官方资料

- [OpenSearch 安装总览](https://docs.opensearch.org/latest/install-and-configure/)
- [安装 OpenSearch](https://docs.opensearch.org/latest/install-and-configure/install-opensearch/index/)
- [下载 OpenSearch](https://opensearch.org/downloads.html)

资料核对日期：2026-08-27。
