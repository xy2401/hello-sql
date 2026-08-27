# Redis 8.0

> **参考官方文档**：[Redis 官方发布说明](https://redis.io/docs/latest/operate/oss_and_stack/stack-with-enterprise/release-notes/redisce/redisos-8.0-release-notes/)  
> 本页依据正式 Release 与现有仓库版本证据，整理 Redis 8.0 的关键变化、兼容边界和升级检查。

## 版本定位

- **发布时间：** 2025 年 5 月
- **维护状态：** 截至 2026-08-27 的当前重要版本线
- **产品线：** Redis

## 核心变化

- Redis Search、JSON、Time Series 与概率数据结构进入统一发行包
- 加入新的 I/O 线程实现、复制改进和 Hash 命令
- 采用 RSALv2、SSPLv1 或 AGPLv3 三选一许可

## 兼容与迁移

- 从 Redis Stack 或带模块的旧版本升级时应核对模块合并、ACL 分类、配置文件和许可；先验证持久化文件及复制升级路径。

## 版本确认

不要根据安装包名称或容器标签推断实际版本，应在目标环境执行：

```bash
redis-server --version
```

生产记录至少应包含完整版本输出、操作系统或运行时基线、架构，以及所用客户端或驱动版本。

## 官方资料

- [Redis 官方发布说明](https://redis.io/docs/latest/operate/oss_and_stack/stack-with-enterprise/release-notes/redisce/redisos-8.0-release-notes/)

资料核对日期：2026-08-27。
