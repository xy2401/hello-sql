# InfluxDB 安装与切换

InfluxDB OSS 服务端 `influxd` 与 `influx` CLI 分别打包和版本化。2.x 与 3.x 产品线的引擎、CLI 和升级路径不同，安装前先确定目标线。

- [InfluxDB OSS v2 安装](https://docs.influxdata.com/influxdb/v2/install/)
- [InfluxDB 3 Core 安装](https://docs.influxdata.com/influxdb3/core/install/)
- [Influx CLI](https://docs.influxdata.com/influxdb/v2/tools/influx-cli/)

## 推荐方式

本仓库 2.x 证据采用 2.7 镜像；新项目先比较 InfluxDB 3 Core 与 2.x 兼容需求。服务端与 CLI 都从 InfluxData 官方下载或仓库获取。

## InfluxDB 2.x

~~~bash
# 配置 InfluxData 官方仓库后
sudo apt install influxdb2
sudo dnf install influxdb2
brew install influxdb@2
~~~

`influx` CLI 可能需要单独安装。Windows 使用官方 ZIP；注意服务端与 CLI 的版本输出不同。

## 服务与端口

~~~bash
systemctl status influxdb
influxd version
influx version
curl -fsS http://127.0.0.1:8086/health
~~~

## 版本切换

2.x 与 3.x 不是 PATH 层面的无损切换；使用独立数据目录和端口，并按官方迁移文档移动数据。CLI 可以版本化放置，但需确认 API 与服务器兼容。

## Docker

~~~bash
docker run --rm --name influx-smoke -p 8086:8086 influxdb:2.7
~~~

## 安装验证

~~~bash
influxd version
influx version
curl -fsS http://127.0.0.1:8086/health
~~~

## 升级、卸载与冲突

用 InfluxData 仓库升级，先导出配置和备份数据。卸载服务包不会必然清除数据。检查 8086 端口、token/profile、`INFLUX_HOST` 与两个产品线的命令冲突。

## 官方资料

- [InfluxDB OSS v2 安装](https://docs.influxdata.com/influxdb/v2/install/)
- [InfluxDB 3 Core 安装](https://docs.influxdata.com/influxdb3/core/install/)
- [Influx CLI](https://docs.influxdata.com/influxdb/v2/tools/influx-cli/)

资料核对日期：2026-08-27。
