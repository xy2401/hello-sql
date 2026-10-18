# Hello SQL

> **数据库概念、SQL 方言与工程选型大典 (Database Concept Explorer & Selection Matrix)**

`hello-sql` 是一个浏览器优先、纯静态的数据库学习与工程选型项目，属于 `hello-*` 系列开源学习矩阵（已落地 `hello-lang`、`hello-sql`、`hello-mq`，`hello-shell`）。用统一语义骨架讲解各类数据库，用浏览器内可运行的 WASM 实验验证关键结论，用横向矩阵说明能力边界与选型依据。

## 核心特色

- **三类产品，22 个数据库**：SQL（MySQL、PostgreSQL、Oracle、SQL Server、MariaDB、SQLite）、分析型（DuckDB、ClickHouse、TiDB、CockroachDB）、NoSQL 与浏览器数据库（MongoDB、Redis、Elasticsearch、Cassandra、Neo4j、Browser Database 等 12 个）。只收录可自托管、嵌入式或浏览器本地运行的产品。
- **4 种 WASM 浏览器实验**：SQLite、PostgreSQL（PGlite）、DuckDB、SurrealDB 直接在浏览器 Worker 中运行，无需安装、无需后端。
- **6 大横向选型矩阵**（`docs/matrix/`）：SQL 方言、事务、索引与 JSON、连接串、扩展与分片、浏览器 WASM 能力对比。
- **纯静态无后端**：文档站由 VitePress 构建，所有实验代码只在浏览器本地执行。

## 目录结构

```text
hello-sql/
├── docs/                   # VitePress 文档站（唯一文档入口）
│   ├── index.md            # 首页与 SQL 基础
│   ├── products/           # 22 款数据库产品
│   ├── playground/         # 浏览器内交互实验（SQLite / PGlite / DuckDB / SurrealDB）
│   ├── matrix/             # 6 大横向选型矩阵
│   ├── reference/          # 浏览器数据层与实践参考
│   └── public/             # 静态资源（含 WASM 分片）
├── scripts/                # check-content.js 内容静态检查
├── tests/                  # unit（vitest）+ e2e（playwright）测试
├── vitest.config.ts        # 单测配置
├── playwright.config.ts    # e2e 配置
└── tsconfig.json
```

## 快速开始

```bash
npm install
npm run docs:dev      # 本地打开文档站
npm run check         # 内容检查 + typecheck + vitest + docs:build
```

## 部署

站点部署在独立域名的根路径 `/`。

Cloudflare Pages 使用自定义构建命令 `npx vitepress build docs`，输出目录 `docs/.vitepress/dist`。构建会把超过 Pages 25 MiB 单文件限制的 DuckDB WASM 拆分为同域静态分片，运行时在数据库 Worker 内合并，不依赖第三方 CDN。

## Live 运行边界

- 所有数据库代码只在浏览器本地 Worker 中执行。
- 默认工作区为临时数据，持久化需要用户主动开启。
- 不连接远程数据库，也不收集或保存数据库凭证。
- SQLite 使用 OPFS，PGlite 与 SurrealDB 使用 IndexedDB；不支持时会降级到内存模式。

## 示例查询与结果组件

[MongoDB 示例数据操作](docs/products/mongodb/sample-data-ops.md)使用 `SampleDataWorkbench` 展示 Docker 准备的 MFlix 查询和真实采集结果。SQL 项目内保存一份独立快照，构建和页面加载都不读取相邻仓库。

在 hello-sql 仓库根目录手动刷新数据，参数指向已准备好的案例目录：

```powershell
npm run sync:mongodb-samples -- D:/path/to/hello-docker/compose/mongo-samples
```

导入脚本核对输入、已有结果、运行脚本与来源哈希，生成 `docs/public/sample-data/mongodb.json` 并保留 Apache-2.0 许可。历史采集记录不被修改；跳过的案例保留状态，不生成结果。

组件入口是 `docs/.vitepress/theme/components/SampleDataWorkbench.vue`，通过 `dataset-url` 传入本站 JSON 地址。其他数据库可按 `docs/.vitepress/theme/data/sampleData.ts` 的 `SampleDataset` 协议提供数据：

- `language` 配置为 `javascript` 或 `sql`，分别选择对应语法高亮。
- `examples` 为每项提供 `id`、`title`、`category`、`query`、`notes` 和采集 `status`。
- `passed` 项包含 `result`，支持文档、数组、字符串、数字和 `null`；其他状态不包含成功结果。
- `source` 保存来源地址、引擎和采集时间，SQL 及其他适配器可独立生成同一格式。

## 容器命令与完整文件数据

MongoDB 新入口：[容器内命令](docs/products/mongodb/docker-commands.md)、[命令示例与结果](docs/products/mongodb/docker-command-ops.md)。新采集固定 Ubuntu 26.04 / MongoDB 9.0.4，和现有 7/8 版本证据及 MFlix 样例分开。

完整文件清单、安装锁和采集历史归 [Hello Docker](https://github.com/xy2401/hello-docker/blob/codex/hello-docker/docs/support/software-capture.md) 管理。本站只保存导入并校验过的 `docs/public/docker-data/mongodb/` 展示包，构建不读取相邻仓库。初始 `pending` 包只有计划命令及案例，不代表已经运行。

## License

Released under the MIT License.
