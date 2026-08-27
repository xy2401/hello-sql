# ClickHouse 26.3 LTS

> **参考官方文档**：[ClickHouse 官方发布说明](https://clickhouse.com/blog/clickhouse-release-26-03)  
> 本页依据正式 Release 与现有仓库版本证据，整理 ClickHouse 26.3 LTS 的关键变化、兼容边界和升级检查。

## 版本定位

- **发布时间：** 2026 年 4 月
- **维护状态：** 截至 2026-08-27 的当前重要版本线
- **产品线：** ClickHouse

## 核心变化

- 异步插入默认启用并统一物化视图去重
- 扩展 JOIN 重排、物化 CTE、自然排序和 JSON 类型能力
- 加入实验性 WebAssembly UDF 并改善宽表 TTL 删除内存使用

## 兼容与迁移

- 升级前核对异步插入默认值、MergeTree 设置、客户端协议和实验功能开关；集群按官方兼容跨度滚动升级。

## 版本确认

不要根据安装包名称或容器标签推断实际版本，应在目标环境执行：

```bash
clickhouse-server --version
```

生产记录至少应包含完整版本输出、操作系统或运行时基线、架构，以及所用客户端或驱动版本。

## 官方资料

- [ClickHouse 官方发布说明](https://clickhouse.com/blog/clickhouse-release-26-03)

资料核对日期：2026-08-27。
