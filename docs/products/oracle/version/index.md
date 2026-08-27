# Oracle Database 版本演进

Oracle 采用长效支持版（Long Term Release）配合每季度的 Release Update（RU）维护。

## 版本索引

### [Oracle AI Database 26ai](./oracle-ai-database-26ai)

- **发布时间：** 2025 年 10 月
- **版本重点：** 成为下一代长期支持版本并取代 23ai 品牌线。

### [Oracle Database 23ai](./oracle-database-23ai)

- **发布时间：** 2024 年 5 月
- **版本重点：** AI Vector Search：原生支持多维向量类型、向量索引与余弦/点积运算。

### [Oracle Database 21c](./oracle-database-21c)

- **发布时间：** 2021 年 8 月
- **版本重点：** 引入原生多属性图数据库引擎与 Blockchain Tables（区块链不可篡改表）。

### [Oracle Database 19c](./oracle-database-19c)

- **发布时间：** 2019 年 4 月
- **版本重点：** 当前企业最主要的长期支持版（Long Term Release），享有长效维护周期。

### [Oracle Database 12c R2](./oracle-database-12c-r2)

- **发布时间：** 2017 年 3 月
- **版本重点：** 全面推广 Multitenant（多租户可插拔数据库 CDB/PDB）架构。

## 升级工具
- 使用官方 **AutoUpgrade** 实用工具运行预检与自动化 PDB 迁移：
  ```bash
  java -jar autoupgrade.jar -config my_upgrade.cfg -mode analyze
  ```
