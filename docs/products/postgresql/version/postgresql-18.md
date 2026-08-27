# PostgreSQL 18

> **参考官方文档**：[PostgreSQL 官方发布说明](https://www.postgresql.org/docs/18/release-18.html)  
> 本页依据正式 Release 与现有仓库版本证据，整理 PostgreSQL 18 的关键变化、兼容边界和升级检查。

## 版本定位

- **发布时间：** 2025 年 9 月
- **维护状态：** 截至 2026-08-27 的当前重要版本线
- **产品线：** PostgreSQL

## 核心变化

- 引入异步 I/O 子系统，改善顺序扫描、位图扫描和 VACUUM 的存储读取效率
- `pg_upgrade` 保留优化器统计信息，缩短大版本升级后的性能恢复时间
- 加入 B-tree skip scan、`uuidv7()`、虚拟生成列与 OAuth 认证

## 兼容与迁移

- 必须按大版本执行 `pg_upgrade` 或逻辑迁移；升级前检查旧版 `psql` 的 `\copy` 行为、扩展兼容和认证配置。

## 版本确认

不要根据安装包名称或容器标签推断实际版本，应在目标环境执行：

```bash
postgres --version
```

生产记录至少应包含完整版本输出、操作系统或运行时基线、架构，以及所用客户端或驱动版本。

## 官方资料

- [PostgreSQL 官方发布说明](https://www.postgresql.org/docs/18/release-18.html)

资料核对日期：2026-08-27。
