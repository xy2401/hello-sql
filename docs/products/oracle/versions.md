# Oracle Database 版本演进

> **版本模型**：长期支持版本配合季度 Release Update（RU）维护；版本标签与云服务命名可能不同。

## 版本发布规律与生命周期

- **发布策略**：长期支持版本配合季度 Release Update（RU）维护；版本标签与云服务命名可能不同。
- **官方权威发布说明**：[查看 Oracle Database 官方 Release Notes ↗](https://docs.oracle.com/en/database/oracle/oracle-database/26/nfcoa/all-nfg.html)

## 主流版本线与关键特性

### Oracle AI Database 26ai

**关键功能与演进：**

- AI Vector Search、JSON Relational Duality 和 SQL/PLSQL 能力增强
- 部分功能受 COMPATIBLE、平台和许可约束

**工程影响与选型建议：**

> 按实际部署形态核对功能，不要只依据产品名称。

### Oracle Database 23ai

**关键功能与演进：**

- 面向开发者的数据类型、JSON 与向量能力形成新基线
- 与 26ai 存在命名和 RU 映射关系

**工程影响与选型建议：**

> 升级文档需同时核对版本号、RU 与云服务标签。

### Oracle Database 19c

**关键功能与演进：**

- 长期存在的企业生产基线
- 迁往新代际涉及多租户和已弃用能力

**工程影响与选型建议：**

> 先清理 desupported/deprecated feature 再升级。

## 生产升级检查清单

跨版本或主版本升级时，建议按顺序核对以下事项：

1. **运行 AutoUpgrade precheck**
2. **核对 COMPATIBLE、字符集、时区文件和选件许可**
3. **演练 RMAN、Data Guard 与应用回退**

::: warning 官方依据声明
补丁号、生命周期支持期限（EOL）、预览功能和许可协议会随时间演进。生产环境变更前，请始终以 [Oracle Database 官方发布说明](https://docs.oracle.com/en/database/oracle/oracle-database/26/nfcoa/all-nfg.html) 为最终依据，勿仅凭文档标题推断当前最新版本。
:::

## 关联资源

- 🏠 [返回 Oracle Database 总览](./)
- 📘 [查看核心知识专题](./core-concepts)
- 🐳 [查看 Docker 工具验证证据](./DockerTooling)
