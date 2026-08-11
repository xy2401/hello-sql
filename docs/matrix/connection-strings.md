---
title: 数据库连接串与驱动对比
description: 对比 24 个数据库的 URI、JDBC、HTTP、SDK 参数、端口、TLS 与命名空间
---

# 数据库连接串与驱动对比

连接串不只是“地址加密码”。它同时表达协议、拓扑入口、目标命名空间、身份认证、TLS 校验和会话行为。相似的字符串可能使用完全不同的网络协议；有些云数据库和宽列数据库则根本没有跨语言通用 URI。

::: warning 示例不含真实凭证
下面的 `USER`、主机名、项目名和数据库名都是占位符。生产环境应通过环境变量、Secret Manager、工作负载身份或驱动属性传入凭证，不要把密码提交到仓库，也不要让它出现在日志、异常或进程参数中。
:::

<ConnectionStringMatrix />

## 一条连接串通常包含什么

```text
scheme://identity@host:port/namespace?transport_and_session_options
```

| 部分 | 回答的问题 | 常见陷阱 |
| :--- | :--- | :--- |
| Scheme / 子协议 | 使用哪个驱动和网络协议？ | `jdbc:` 之后还有产品子协议；`https://` 不等于 SQL 协议 |
| Host / Seed list | 首次连接到哪里？ | 集群通常需要 DNS SRV、seed hosts 或驱动拓扑发现，而不是永久固定单节点 |
| Port | 服务监听在哪里？ | 云服务、TLS 代理、HTTP 与 Native 协议可能使用不同端口 |
| Namespace | 初始 database、schema、keyspace、dataset 或逻辑 DB 是什么？ | 相同的 URL 路径在不同产品里含义不同 |
| Options | 如何处理 TLS、超时、路由和会话？ | 参数名属于具体驱动，不能跨驱动照搬 |

## 六个容易忽略的知识点

### 1. URI、JDBC URL 与 DSN 不是同一种标准

PostgreSQL URI 常被多种语言复用；JDBC URL 只对特定 Java 驱动有意义；ODBC DSN 可能只是本机配置文件里的名字。复制连接串前先确认目标语言、驱动名称和主版本。

### 2. 特殊字符必须正确编码

用户名、密码、database 或查询参数中的 `@`、`:`、`/`、`?`、`#`、`&` 和空格可能改变 URI 结构。需要按驱动文档进行 percent-encoding；不要用手工字符串拼接代替驱动的配置对象。

### 3. “启用 TLS”不等于“验证了服务器身份”

生产配置应验证 CA 和主机名。`trustServerCertificate=true`、`sslmode=require` 或跳过 hostname verification 可能只加密流量，却没有防止连接到错误服务器。

### 4. 连接池参数通常不属于数据库连接串

最大连接数、连接寿命、空闲回收、健康检查和泄漏检测通常由 HikariCP、应用框架或驱动池配置。把连接池配置和服务端会话参数混在一条 URL 中，会让迁移和排障更困难。

### 5. 云服务优先使用短期身份

BigQuery、DynamoDB、Snowflake 等更适合使用 ADC、IAM、OAuth、密钥对或工作负载身份。一个能永久使用的用户名密码连接串通常意味着密钥轮换和最小权限做得不够好。

### 6. 可连接不代表语义兼容

TiDB 能使用 MySQL 驱动、CockroachDB 和 TimescaleDB 能使用 PostgreSQL 驱动，但 SQL、事务重试、系统表、扩展和参数仍有产品差异。协议兼容只解决“如何建立会话”，不保证应用行为完全一致。

## 建议的配置分层

```text
非敏感地址：DB_HOST / DB_PORT / DB_NAME / DB_OPTIONS
身份与密钥：Secret Manager / Workload Identity / 短期 Token
驱动行为：连接超时、TLS CA、application name
连接池行为：最大连接、生命周期、空闲回收、健康检查
```

这样既便于轮换凭证，也能把网络问题、认证问题、驱动问题和连接池问题分开排查。
