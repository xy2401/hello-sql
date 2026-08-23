# ClickHouse 版本演进

ClickHouse 采用两套版本线：**LTS（长期支持版，每年发布 2 次，维护 1 年）** 与 **Monthly（月度特性版）**。

## 生产部署建议
- 生产环境优先固定 LTS 版本（如 24.8 LTS / 24.3 LTS）。
- 自 22.x 起全面推行 **ClickHouse Keeper** 替代 ZooKeeper，大幅降低集群元数据同步开销与维护复杂度。
