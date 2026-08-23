# MySQL 版本演进与升级指南

MySQL 从 8.4 开始划分为 **LTS（长期支持版，通常维护 5 年）** 与 **Innovation（按季度更新特性的创新版）** 双轨模式。

## 核心版本演进

### MySQL 8.4 LTS
- **定位**：当前生产环境新建集群推荐的长期支持版本。
- **安全与兼容**：
  - 默认彻底废弃了历史不安全的 `mysql_native_password` 插件，全面推行基于 SHA-256 的 `caching_sha2_password`。
  - 统一并规范了大量历史系统变量与参数命名。

### MySQL 8.0（里程碑版本）
- **原生数据字典（Data Dictionary）**：废弃了历史的 `.frm` 元数据文件，DDL 操作具备原子性与事务回滚能力。
- **现代 SQL 特性**：引入窗口函数（Window Functions）、公用表表达式（CTE）、倒序索引与不可见索引（Invisible Indexes）。
- **默认字符集升级**：全面切换为 `utf8mb4`（字符序 `utf8mb4_0900_ai_ci`），彻底解决 3 字节 utf8mb3 缺陷。
- **Instant DDL**：支持秒级在线添加列（无需全表拷贝与锁表）。

### MySQL 5.7（已于 2023 年 EOL）
- 原生支持 JSON 数据类型与生成列。
- 支持多源复制与基于 GTID 的在线故障转移。

---

## 生产升级检查清单与实战步骤

从 MySQL 5.7 / 8.0 升级至 8.4 LTS 前，必须使用官方检查工具：

```bash
# 1. 运行 MySQL Shell 升级检查工具（检查关键字冲突、过时配置、字符集问题）
mysqlsh root@127.0.0.1:3306 -- util check-for-server-upgrade --target-version=8.4.0

# 2. 检查输出中的严重级别（Error 必须修复，Warning 需评估）
# 重点检查：
# - 表名或列名是否使用了新保留字
# - 客户端驱动是否支持 caching_sha2_password 认证
# - sql_mode 中的 ONLY_FULL_GROUP_BY 是否会导致旧查询报错
```
