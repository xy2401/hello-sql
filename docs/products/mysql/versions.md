# MySQL 版本演进

MySQL 从 8.4 开始进入 LTS（长期支持版，维护 5 年）与 Innovation（按季度更新）双轨交付模式。

## 核心版本演进与关键里程碑

### MySQL 8.4 LTS（2024 年 4 月）

**主要功能与架构演进：**

- 首个现代化 LTS 长期支持版本，提供 5 年官方支持
- 默认彻底废弃历史不安全的 `mysql_native_password`，全面推行 `caching_sha2_password`
- 规范并清理了大量历史已弃用的系统变量与参数

**工程影响与选型建议：**

> 新生产环境首选推荐的长期维护基线。

### MySQL 8.0（2018 年 4 月）

**主要功能与架构演进：**

- 原生数据字典（Data Dictionary）：彻底废弃 `.frm` 文件，DDL 具备事务原子性
- 高级 SQL 特性：窗口函数（Window Functions）、公用表表达式（CTE）、倒序索引
- 默认字符集切换为 `utf8mb4`（`utf8mb4_0900_ai_ci`）
- Instant DDL：秒级在线添加列，无需拷贝全表数据

**工程影响与选型建议：**

> 现代 MySQL 架构的绝对基石，奠定了当代关系型功能基线。

### MySQL 5.7（2015 年 10 月）

**主要功能与架构演进：**

- 原生支持 JSON 数据类型与生成列（Generated Columns）
- 支持基于 GTID 的多源复制与增强半同步复制（Lossless Semi-Sync）
- InnoDB 支持空间数据索引（GIS）与临时表空间优化

**工程影响与选型建议：**

> 一代经典生产版本（已于 2023 年 10 月正式 EOL，建议全面升级至 8.0/8.4）。

### MySQL 5.6（2013 年 2 月）

**主要功能与架构演进：**

- 引入全局事务标识符（GTID）简化主从复制拓扑切换
- InnoDB 支持只读事务与全文索引（Full-text Index）
- 支持 Online DDL（In-place 算法）

**工程影响与选型建议：**

> 奠定了 GTID 复制与在线表结构变更的基础。

## 升级兼容性预检命令

```bash
# 使用 MySQL Shell 检查目标版本不兼容项
mysqlsh root@127.0.0.1:3306 -- util check-for-server-upgrade --target-version=8.4.0
```
