# Neo4j 安装与切换

Neo4j Server、Neo4j Desktop、Cypher Shell 和 AuraDB 是不同交付形态。服务端需要官方支持的 JDK；Desktop 适合个人开发，AuraDB 无需本机安装。

- [Neo4j 安装总览](https://neo4j.com/docs/operations-manual/current/installation/)
- [Neo4j 系统要求](https://neo4j.com/docs/operations-manual/current/installation/requirements/)
- [Neo4j 部署中心](https://neo4j.com/deployment-center/)

## 推荐方式

开发机可用 Neo4j Desktop 或固定容器；服务器按官方 Linux/Windows 安装指南与 JDK 要求部署。只需连接远端可单装 Cypher Shell。

## 平台安装

Windows 从 Deployment Center 下载 ZIP/Desktop；Linux 使用官方 DEB/RPM/tarball；macOS 可用 Desktop。不要把 AuraDB 的云连接配置当作本机服务安装。

## 服务与端口

~~~bash
neo4j version
neo4j status
cypher-shell -a neo4j://localhost:7687 "RETURN 1;"
~~~

## 版本切换

服务端升级必须检查 store format、插件和许可证；并行版本使用不同 `NEO4J_HOME`、data 目录与端口。Desktop 项目独立管理 DBMS 版本，系统 PATH 不代表 Desktop 实际版本。

## Docker

~~~bash
docker run --rm --name neo4j-smoke -e NEO4J_AUTH=neo4j/localtest2026 -p 7474:7474 -p 7687:7687 neo4j:2025.08.0-community
~~~

## 安装验证

~~~bash
neo4j version
neo4j status
cypher-shell -a neo4j://localhost:7687 "CALL dbms.components();"
~~~

## 升级、卸载与冲突

升级前备份数据库并核对 APOC/GDS 等插件兼容性。卸载不会自动清除所有 graph data。检查 7474/7687 端口、JDK、`NEO4J_HOME` 与 Desktop 管理目录。

## 官方资料

- [Neo4j 安装总览](https://neo4j.com/docs/operations-manual/current/installation/)
- [Neo4j 系统要求](https://neo4j.com/docs/operations-manual/current/installation/requirements/)
- [Neo4j 部署中心](https://neo4j.com/deployment-center/)

资料核对日期：2026-08-27。
