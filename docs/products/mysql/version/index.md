# MySQL 版本演进

MySQL 从 8.4 开始进入 LTS（长期支持版，维护 5 年）与 Innovation（按季度更新）双轨交付模式。

## 版本索引

### [MySQL 9.x Innovation](./mysql-9.x-innovation)

- **发布时间：** 2024–2026 年
- **版本重点：** 9.x 延续 Innovation 发布轨道，持续交付优化器、复制、安全与 SQL 能力。

### [MySQL 8.4 LTS](./mysql-8.4)

- **发布时间：** 2024 年 4 月
- **版本重点：** 首个现代化 LTS 长期支持版本，提供 5 年官方支持。

### [MySQL 8.0](./mysql-8.0)

- **发布时间：** 2018 年 4 月
- **版本重点：** 原生数据字典（Data Dictionary）：彻底废弃 .frm 文件，DDL 具备事务原子性。

### [MySQL 5.7](./mysql-5.7)

- **发布时间：** 2015 年 10 月
- **版本重点：** 原生支持 JSON 数据类型与生成列（Generated Columns）。

### [MySQL 5.6](./mysql-5.6)

- **发布时间：** 2013 年 2 月
- **版本重点：** 引入全局事务标识符（GTID）简化主从复制拓扑切换。

## 升级兼容性预检命令

```bash
# 使用 MySQL Shell 检查目标版本不兼容项
mysqlsh root@127.0.0.1:3306 -- util check-for-server-upgrade --target-version=8.4.0
```
