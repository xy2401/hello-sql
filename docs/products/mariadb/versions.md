# MariaDB 版本演进

MariaDB 维护长期支持（LTS，如 10.11 LTS、11.4 LTS、11.8 LTS）与滚动发布系列。

## 生产注意事项

- **不要将 MariaDB 与 MySQL 混用配置**：GTID 格式、系统权限表、以及部分 JSON 函数实现均已分化。
- **升级路径**：
  ```bash
  # 升级二进制包后必须运行系统升级脚本
  mariadb-upgrade -u root -p
  ```
