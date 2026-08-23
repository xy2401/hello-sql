# Oracle Database 版本演进

Oracle 采用长效支持版（Long Term Release）配合每季度的 Release Update（RU）维护。

## 核心版本演进与关键里程碑

### Oracle Database 23ai（2024 年 5 月）

**主要功能与架构演进：**

- AI Vector Search：原生支持多维向量类型、向量索引与余弦/点积运算
- JSON-Relational Duality：支持以 JSON 视图方式透明读写底层关系表，兼顾关系严谨与文档敏捷
- 无需 `FROM dual` 即可执行 `SELECT 1;` 简单表达式

**工程影响与选型建议：**

> 全面拥抱人工智能与开发者体验的新一代代际版本。

### Oracle Database 21c（2021 年 8 月）

**主要功能与架构演进：**

- 引入原生多属性图数据库引擎与 Blockchain Tables（区块链不可篡改表）
- 执行引擎深度优化 JavaScript 存储过程

**工程影响与选型建议：**

> 创新特性的集中探索版本。

### Oracle Database 19c（2019 年 4 月）

**主要功能与架构演进：**

- 当前企业最主要的长期支持版（Long Term Release），享有长效维护周期
- 支持自动索引（Automatic Indexing，机器学习自动创建/测试/删除索引）
- Active Data Guard 支持重定向 DML 到主库执行

**工程影响与选型建议：**

> 全球绝大多数金融与核心生产系统的基石版本。

### Oracle Database 12c R2（2017 年 3 月）

**主要功能与架构演进：**

- 全面推广 Multitenant（多租户可插拔数据库 CDB/PDB）架构
- InMemory 列式缓存与 Sharding 分片技术

**工程影响与选型建议：**

> 多租户与内存分析的奠基版本。

## 升级工具
- 使用官方 **AutoUpgrade** 实用工具运行预检与自动化 PDB 迁移：
  ```bash
  java -jar autoupgrade.jar -config my_upgrade.cfg -mode analyze
  ```
