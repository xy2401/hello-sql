# InfluxDB 3 Core 3.11

> **参考官方文档**：[InfluxDB 3 Core Release Notes](https://docs.influxdata.com/influxdb3/core/release-notes/)

## 版本定位

- **发布时间：** 2026 年
- **维护状态：** 截至 2026-08-27 的当前 3.x 正式版本线
- **存储基线：** Rust、Apache Arrow/DataFusion 与 Parquet 对象存储架构

## 核心变化

- 为异步 Processing Engine Trigger 增加并发上限和有界重试，空 WAL flush 不再触发处理。
- 增加 `--shutdown-timeout`，为连接排空和优雅关闭设置明确上限。
- 禁用状态可跨重启保留，并可用 `--disable-package-management` 阻止运行时修改 Python 包环境。
- 3.11.2 修复快照持久化期间查询漏行等正确性问题，生产部署应采用当前 3.11 补丁版本。

## 不兼容与迁移

- 1.x、2.x 与 3.x 是不同代际，迁移前分别盘点 InfluxQL、Flux、SQL、Token、Bucket 和保留策略。
- 升级存储引擎前备份 catalog 与对象存储数据，并按官方流程验证 Parquet 数据和 compactor 状态。
- 容器部署使用明确版本标签，避免 `latest` 标签切换造成未计划的代际升级。

## 版本确认

```bash
influxdb3 --version
curl -i http://127.0.0.1:8181/health
```

也可从 HTTP 响应的 `x-influxdb-version` 头核对服务端实际版本。

## 官方资料

- [InfluxDB 3 Core Release Notes](https://docs.influxdata.com/influxdb3/core/release-notes/)
- [识别 InfluxDB 3 Core 版本](https://docs.influxdata.com/influxdb3/core/admin/identify-version/)

资料核对日期：2026-08-27。
