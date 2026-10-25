---
title: 命令示例与结果
aside: false
pageClass: docker-commands-page
---

# 命令示例与结果

按案例查看实际命令、备注与执行记录；每个步骤分别保留 stdout、stderr 和退出码。 [容器内命令与文件清单](./docker-commands)。

<DockerCommands data-url="/docker-data/mongodb/manifest.json" mode="examples" />

案例覆盖版本、连接检查、临时集合增查、导出导入和备份恢复。每个采集批次在新的 MongoDB 9.0.4 容器中启动一次本地服务，全部案例完成或失败后停止服务；临时数据与命令记录保存在同一 `/capture` 挂载中。

[Hello SQL 采集入口](https://github.com/xy2401/hello-sql/tree/main/support/capture/mongodb) 支持本地 WSL2 / Podman + Compose 和手动 Actions。原始命令、输入、stdout、stderr、退出码及断言随本项目批次保存；页面只展示本站数据，不在浏览器内运行 MongoDB。待采集、失败和通过状态由实际记录决定。

Ubuntu 26.04 LTS / linux/amd64 基线与 [历史 DockerTooling 结果](./DockerTooling) 分开保存，历史 MongoDB 7/8 证据继续可用。
