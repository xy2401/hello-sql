# Valkey 安装与切换

Valkey 提供 `valkey-server` 与 `valkey-cli`，部分发行版还提供 Redis 命令兼容软链接。官方文档列出源码、容器、Homebrew 及多种 Linux 软件包。

- [Valkey 安装](https://valkey.io/topics/installation/)
- [Valkey 下载](https://valkey.io/download/)
- [Valkey 管理](https://valkey.io/topics/admin/)

## 推荐方式

优先使用系统仓库已收录的 Valkey 或官方发布源码；macOS 用 Homebrew。Windows 没有官方原生支持，开发使用 WSL 或容器。

## 系统软件包

~~~bash
sudo apt update && sudo apt install valkey
sudo dnf install valkey
sudo pacman -S valkey
brew install valkey
# 需要 Redis 命令兼容软链接时按发行版另装 compat 包
~~~

## 服务与端口

~~~bash
systemctl status valkey
valkey-server --version
valkey-cli -h 127.0.0.1 -p 6379 ping
~~~

## 版本切换

使用版本化前缀或容器端口并行验证。启用 `valkey-redis-compat` 一类包会增加 `redis-*` 软链接；切换时要明确应用调用的是 Valkey 还是 Redis。

## Docker

~~~bash
docker run --rm --name valkey-smoke -p 6379:6379 valkey/valkey:9.0
~~~

## 安装验证

~~~bash
valkey-server --version
valkey-cli --version
valkey-cli -h 127.0.0.1 -p 6379 INFO server
~~~

## 升级、卸载与冲突

由原包管理器升级卸载；源码安装记录前缀。升级前备份 RDB/AOF 并检查模块兼容性。PATH 冲突重点检查 Redis 兼容软链接与 6379 端口。

## 官方资料

- [Valkey 安装](https://valkey.io/topics/installation/)
- [Valkey 下载](https://valkey.io/download/)
- [Valkey 管理](https://valkey.io/topics/admin/)

资料核对日期：2026-08-27。
