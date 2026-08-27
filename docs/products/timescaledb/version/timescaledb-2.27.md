# TimescaleDB 2.27

> **参考官方文档**：[TimescaleDB 2.27 Release](https://github.com/timescale/timescaledb/releases/tag/2.27.0)

## 版本定位

- **发布时间：** 2026 年 5 月
- **维护状态：** 截至 2026-08-27 的当前重要功能版本线
- **平台基线：** PostgreSQL 扩展；具体 PostgreSQL 支持范围以发布资产和 Release Notes 为准

## 核心变化

- Hypercore 向量化执行可在列式参数上直接计算 PostgreSQL 函数，继续降低行式转换开销。
- 引入或调整列存 sparse/composite bloom filter 相关能力和元数据。
- 2.27 系列包含升级阻断检查与信息泄漏、重压缩等修复，生产环境应采用当前补丁版本。

## 不兼容与迁移

- 升级前用 `psql -X` 连接，避免 `.psqlrc` 意外加载旧扩展版本。
- 受特定 bloom filter 索引问题影响的数据库会阻止升级，需要按官方说明先删除或修复索引。
- 2.26 生成的 composite bloom filter 元数据不能被 2.27 自动复用，需按发布说明转换。
- PostgreSQL 15 支持进入退出阶段，规划升级到 PostgreSQL 16 或更高版本。

## 版本确认

```sql
SELECT extversion
FROM pg_extension
WHERE extname = 'timescaledb';
```

## 官方资料

- [TimescaleDB Releases](https://github.com/timescale/timescaledb/releases)
- [Timescale Release Notes](https://docs.timescale.com/about/latest/release-notes/)

资料核对日期：2026-08-27。
