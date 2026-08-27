# DuckDB 安装与切换

DuckDB 可以是独立 CLI，也可以嵌入 Python、Java、Node.js 等进程；多数使用场景没有服务端。官方安装页同时提供当前稳定版和 LTS。

- [DuckDB 安装](https://duckdb.org/install/)
- [DuckDB CLI](https://duckdb.org/docs/current/clients/cli/overview)
- [DuckDB 发布页](https://github.com/duckdb/duckdb/releases)

## 推荐方式

CLI 从官方安装页选择稳定版或 LTS 并校验下载；语言绑定在项目依赖中固定。不要混淆 CLI、Wasm 与语言绑定的版本号。

## CLI 与语言绑定

~~~bash
curl https://install.duckdb.org | sh       # Linux / macOS 官方脚本
brew install duckdb                       # Homebrew 社区维护
pip install duckdb==1.5.5
npm install @duckdb/node-api@1.5.5
~~~

Windows 可从官方安装页下载明确版本 CLI ZIP；官方 PowerShell 安装脚本仍标记为 beta 时应先审阅内容。

## 路径

~~~bash
duckdb --version
command -v duckdb
python -c "import duckdb; print(duckdb.__version__)"
~~~

## 版本切换

官方脚本把版本安装到例如 `~/.duckdb/cli/1.5.5/` 的目录，可直接调用版本目录；项目绑定通过依赖锁文件切换。稳定版与 LTS 要明确选择，不用 `latest` 代替版本策略。

## Docker

~~~bash
docker run --rm duckdb/duckdb:1.5.5 duckdb :memory: "select version();"
~~~

## 安装验证

~~~bash
duckdb --version
duckdb :memory: 'select version();'
command -v duckdb
~~~

## 升级、卸载与冲突

CLI 升级保留旧版本目录便于回滚；语言绑定由 pip/npm 等原工具维护。数据库文件跨版本使用前阅读兼容说明，并检查扩展是否来自同一 DuckDB 版本。

## 官方资料

- [DuckDB 安装](https://duckdb.org/install/)
- [DuckDB CLI](https://duckdb.org/docs/current/clients/cli/overview)
- [DuckDB 发布页](https://github.com/duckdb/duckdb/releases)

资料核对日期：2026-08-27。
