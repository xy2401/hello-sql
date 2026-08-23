# Oracle Database 概览

Oracle Database 是大型金融、电信及核心 ERP 业务系统的工业级关系数据库基石。

## 核心企业级架构

- **表空间与数据文件（Tablespace & Datafiles）**：物理存储与逻辑逻辑对象深度解耦。
- **Undo 与 Redo**：Undo 表空间用于保障读一致性与回滚（避免经典 `ORA-01555: snapshot too old` 需合理配置 Undo Retention）。
- **Real Application Clusters (RAC)**：共享存储与 Cache Fusion 技术支撑的高可用多活架构。
