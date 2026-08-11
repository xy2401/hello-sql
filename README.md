# Hello SQL

Hello SQL 是一个纯静态、浏览器优先的数据库学习与工程选型站点，覆盖主流 SQL、NoSQL、IndexedDB 以及 SQLite、DuckDB、PostgreSQL、SurrealDB 的 WebAssembly 实验环境。

## 本地开发

```bash
npm install
npm run docs:dev
```

完整检查：

```bash
npm run check
```

站点部署在独立域名的根路径 `/`。

Cloudflare Pages 可使用 VitePress 预设（`npx vitepress build`，输出目录 `.vitepress/dist`）。构建会把超过 Pages 25 MiB 单文件限制的 DuckDB WASM 拆分为同域静态分片，运行时在数据库 Worker 内合并，不依赖第三方 CDN。

## Live 运行边界

- 所有数据库代码只在浏览器本地 Worker 中执行。
- 默认工作区为临时数据，持久化需要用户主动开启。
- 不连接远程数据库，也不收集或保存数据库凭证。
- SQLite 使用 OPFS，PGlite 与 SurrealDB 使用 IndexedDB；不支持时会降级到内存模式。

Released under the MIT License.
