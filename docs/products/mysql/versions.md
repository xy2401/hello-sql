# MySQL 版本演进

自 MySQL 8.0 之后，Oracle 调整了发布策略，从 8.4 开始划分为 **LTS（长期支持版，通常维护 5 年）** 与 **Innovation（创新版，按季度迭代新特性）** 双轨模式。

## 主流版本线

### MySQL 8.4 LTS
- **定位**：当前生产系统推荐的长期支持版本。
- **关键变更**：
  - 移除了旧版 `mysql_native_password` 默认认证插件（全面推行 `caching_sha2_password`）。
  - 废弃并清理了部分历史系统变量与参数，优化了主从复制默认安全策略。

### MySQL 8.0（当前广泛部署版本）
- **里程碑变更**：
  - **原生数据字典**：彻底废弃基于 `.frm` 文件的元数据存储，DDL 支持原子事务回滚。
  - **高级 SQL 支持**：引入窗口函数（Window Functions）、公用表表达式（CTE）、倒序索引（Descending Index）。
  - **默认字符集升级**：全面切换为 `utf8mb4`。

---

## 生产升级检查实战

从 MySQL 5.7 或 8.0 升级至 8.4 LTS 时，必须执行严格的预检流程：

```bash
# 1. 使用 MySQL Shell 运行官方升级检查工具
mysqlsh root@127.0.0.1:3306 -- util check-for-server-upgrade --target-version=8.4.0

# 检查重点：
# 1) 是否存在已移除的关键字或函数
# 2) 是否存在 schema 中与系统保留字冲突的列名
# 3) 认证插件兼容性与客户端驱动连接测试
```
