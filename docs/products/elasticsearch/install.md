# Elasticsearch 安装与切换

Elasticsearch 服务端自带受支持的 JDK；不要为了安装它另外替换系统 Java。Elastic 官方提供 tar/zip、DEB、RPM 和自有 Registry 容器。

- [安装 Elasticsearch](https://www.elastic.co/docs/deploy-manage/deploy/self-managed/installing-elasticsearch)
- [本地 Docker 快速开始](https://www.elastic.co/docs/deploy-manage/deploy/self-managed/local-development-installation-quickstart)
- [Elastic 支持矩阵](https://www.elastic.co/support/matrix)

## 推荐方式

Linux 生产主机使用 Elastic 官方签名 DEB/RPM；Windows/macOS 可用归档做开发。Elastic Stack 组件保持同一版本，生产集群不要照搬单节点开发配置。

## 软件包与归档

~~~bash
# 配置 Elastic 官方 APT/RPM 仓库后
sudo apt install elasticsearch
sudo dnf install elasticsearch
# Windows/macOS：从 Elastic 官方下载 ZIP/tar.gz
~~~

首次启动会生成安全配置、证书与凭据；妥善保存终端输出。

## 服务与端口

~~~bash
systemctl status elasticsearch
curl --cacert /etc/elasticsearch/certs/http_ca.crt -u elastic https://localhost:9200
/usr/share/elasticsearch/bin/elasticsearch --version
~~~

## 版本切换

服务端按官方 upgrade assistant/滚动升级或快照恢复流程迁移。归档可以并行，但 data/config/log 目录必须分离；不能通过 PATH 让不同主版本共用 data path。

## Docker

~~~bash
docker run --rm --name es-smoke -e discovery.type=single-node -e xpack.security.enabled=false -p 9200:9200 docker.elastic.co/elasticsearch/elasticsearch:9.1.3
~~~

## 安装验证

~~~bash
curl -fsS http://127.0.0.1:9200
curl -fsS http://127.0.0.1:9200/_cluster/health
/usr/share/elasticsearch/bin/elasticsearch --version
~~~

## 升级、卸载与冲突

所有 Elastic Stack 组件对齐版本后再升级。卸载前创建快照并保存 keystore、证书和配置。检查 9200/9300 端口、JVM options 与 `ES_PATH_CONF`，避免误用外部 JDK。

## 官方资料

- [安装 Elasticsearch](https://www.elastic.co/docs/deploy-manage/deploy/self-managed/installing-elasticsearch)
- [本地 Docker 快速开始](https://www.elastic.co/docs/deploy-manage/deploy/self-managed/local-development-installation-quickstart)
- [Elastic 支持矩阵](https://www.elastic.co/support/matrix)

资料核对日期：2026-08-27。
