# Elasticsearch 版本演进

Elasticsearch 采用语义化主版本（Major Version），大版本升级会移除上一代已弃用的 API 与 Mapping 配置。

## 版本索引

### [Elasticsearch 9.0](./elasticsearch-9.0)

- **发布时间：** 2025 年
- **版本重点：** 加入面向多向量后排序的 rankvectors 字段。

### [Elasticsearch 8.15](./elasticsearch-8.15)

- **发布时间：** 2024 年 8 月
- **版本重点：** 全面强化 ES|QL（Elasticsearch Query Language）管道查询语言。

### [Elasticsearch 8.0](./elasticsearch-8.0)

- **发布时间：** 2022 年 2 月
- **版本重点：** 默认启用系统安全与 TLS 加密配置，消除历史裸奔风险。

### [Elasticsearch 7.17](./elasticsearch-7.17)

- **发布时间：** 2022 年 1 月
- **版本重点：** 包含 Upgrade Assistant 升级助手与全量 Deprecation 检测 API。

### [Elasticsearch 7.0](./elasticsearch-7.0)

- **发布时间：** 2019 年 4 月
- **版本重点：** 彻底移除 Mapping Type（一个索引只能拥有单份映射定义）。

### [Elasticsearch 6.0](./elasticsearch-6.0)

- **发布时间：** 2017 年 11 月
- **版本重点：** 限制单索引单 Type 并启动 Mapping Type 弃用流程。

## 升级前预检命令
```bash
# 查看所有已弃用警告，必须清空后方可升级至下一个主版本
GET /_migration/deprecations
```
