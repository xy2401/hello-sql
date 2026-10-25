---
title: 容器内命令
aside: false
pageClass: docker-commands-page
---

# 容器内命令

按安装目录、发行包文件表和镜像阶段差异查看命令归属；完整文件清单包含非可执行文件、目录、权限、大小和哈希。[命令示例与结果](./docker-command-ops)。

<DockerCommands data-url="/docker-data/mongodb/manifest.json" mode="catalog" />

镜像基线为 Ubuntu 26.04 LTS / linux/amd64，产品层为 MongoDB 9.0.4、mongosh 2.12.0 和 Database Tools 100.19.1。对比 Ubuntu 与产品镜像的完整文件清单，新增运行库单独记录，不计为 MongoDB 产品命令。

安装配方、采集批次和展示包由 [Hello SQL](https://github.com/xy2401/hello-sql/tree/main/support/capture/mongodb) 维护；公共 Ubuntu 基线和采集脚本来自 Hello Docker。本地 WSL2 使用 Podman + Compose 构建并真实采集，也可手动运行 Actions。页面只读取本站校验后的展示包；采集是否完成及案例是否通过，以面板中的批次状态为准。

[历史 DockerTooling 证据](./DockerTooling) 保留原版本，MongoDB 7/8 的结果不与 9.0.4 混用。
