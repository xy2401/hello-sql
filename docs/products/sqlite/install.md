# SQLite 安装与切换

SQLite 是嵌入式库，没有常驻服务。`sqlite3` CLI、应用链接的 SQLite 库以及语言运行时内置版本可能互不相同。

- [SQLite 下载](https://www.sqlite.org/download.html)
- [SQLite 编译](https://www.sqlite.org/howtocompile.html)
- [SQLite 发布历史](https://www.sqlite.org/changes.html)

## 推荐方式

命令行学习使用系统包或官方预编译工具；应用程序应通过其依赖系统固定 SQLite 库版本。不要用替换系统 DLL/动态库的方式升级所有应用。

## CLI 安装

~~~bash
sudo apt install sqlite3
sudo dnf install sqlite
sudo pacman -S sqlite
brew install sqlite
# Windows：从 SQLite 官方下载 sqlite-tools 明确版本 ZIP
~~~

## 库与编译选项

~~~bash
sqlite3 --version
sqlite3 :memory: 'pragma compile_options;'
~~~

系统包由发行版维护；官方 amalgamation 适合嵌入应用，但需要由项目构建系统固定版本与编译选项。

## 版本切换

CLI 可放在版本化目录后用绝对路径切换。应用内库由构建依赖选择，Python 等运行时的 `sqlite3` 模块不一定使用 PATH 上的 CLI；应在各运行时中查询实际库版本。

## Docker

~~~bash
docker run --rm debian:bookworm-slim sh -lc 'apt-get update -qq && apt-get install -y -qq sqlite3 >/dev/null && sqlite3 :memory: "select sqlite_version();"'
~~~

SQLite 无官方常驻服务镜像；容器只用于隔离 CLI 验证。

## 安装验证

~~~bash
sqlite3 --version
sqlite3 :memory: 'select sqlite_version();'
command -v sqlite3
~~~

## 升级、卸载与冲突

系统包由原工具升级卸载；手工工具删除对应文件即可。检查 PATH 与应用链接库，不要把 CLI 版本当成应用实际嵌入版本。数据库文件升级前先备份并检查 WAL/扩展兼容。

## 官方资料

- [SQLite 下载](https://www.sqlite.org/download.html)
- [SQLite 编译](https://www.sqlite.org/howtocompile.html)
- [SQLite 发布历史](https://www.sqlite.org/changes.html)

资料核对日期：2026-08-27。
