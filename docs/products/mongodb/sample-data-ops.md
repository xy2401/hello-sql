---
title: 示例数据操作
aside: false
pageClass: sample-data-ops-page
---

# 示例数据操作

查看 Docker 已采集的 MFlix 查询与结果。下载、导入与采集方法见[示例数据](./sample-data)。

<SampleDataWorkbench dataset-url="/sample-data/mongodb.json" />

## 数据与运行范围

本组包含 22 个 JavaScript / mongosh 表达式，涵盖查询、新增、修改、删除、索引与聚合。2026-10-07 使用 MongoDB 7.0.43、mongosh 2.12.0 采集了 20 份结果；MongoDB Search 和向量搜索的两项额外环境未启用，页面保留跳过状态。

普通写入在临时练习库中准备和验证，采集后清理。ObjectId、日期和嵌套文档使用原始 Extended JSON 展示；表格按返回字段组织，JSON 视图保留完整结构。

样例语句、结果与来源记录见 [Hello Docker 的 mongo-samples](https://github.com/xy2401/hello-docker/tree/main/compose/mongo-samples)。原始样例来自 MongoDB MFlix 应用，许可及采集信息可在工作台底部查看。
