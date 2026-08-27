# MariaDB 12.0 Rolling

> **参考官方文档**：[MariaDB 官方发布说明](https://mariadb.com/docs/release-notes/mariadb-community-server-release-notes)  
> 本页依据正式 Release 与现有仓库版本证据，整理 MariaDB 12.0 Rolling 的关键变化、兼容边界和升级检查。

## 版本定位

- **发布时间：** 2025 年
- **维护状态：** 历史版本或兼容基线；实际维护状态以官方页面为准
- **产品线：** MariaDB

## 核心变化

- 进入新的滚动发布主线
- 继续移除长期弃用行为并推进优化器和存储引擎演进
- 与 11.8 LTS 形成稳定线和快速功能线的选择

## 兼容与迁移

- 生产采用前应明确滚动版本维护窗口；需要长期稳定基线时优先选择官方 LTS 系列。

## 版本确认

不要根据安装包名称或容器标签推断实际版本，应在目标环境执行：

```bash
mariadb --version
```

生产记录至少应包含完整版本输出、操作系统或运行时基线、架构，以及所用客户端或驱动版本。

## 官方资料

- [MariaDB 官方发布说明](https://mariadb.com/docs/release-notes/mariadb-community-server-release-notes)

资料核对日期：2026-08-27。
