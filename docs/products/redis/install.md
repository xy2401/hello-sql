# Redis 安装与切换

Redis Open Source 包含服务端与 `redis-cli`；Redis Insight 是独立 GUI。官方 Linux 仓库、macOS cask 和容器的支持范围应以 Redis 安装页为准。

- [Redis Open Source 安装](https://redis.io/docs/latest/operate/oss_and_stack/install/install-stack/)
- [Redis 下载](https://redis.io/downloads/)
- [Redis 管理](https://redis.io/docs/latest/operate/oss_and_stack/management/)

## 推荐方式

Linux 使用 Redis 官方仓库，macOS 用官方文档指定的 Homebrew tap/cask，Windows 开发使用 Docker/WSL。生产实例必须配置认证、绑定地址和持久化，不能照搬无密码烟雾测试。

## 平台安装

~~~bash
# 配置 Redis 官方 APT/RPM 仓库后
sudo apt install redis
sudo yum install redis
brew tap redis/redis
brew install --cask redis
~~~

Windows 没有官方原生 Redis Server 包；官方文档建议 Docker，合作伙伴兼容产品不能等同于 Redis 本体。

## 服务与端口

~~~bash
systemctl status redis-server || systemctl status redis
redis-server --version
redis-cli -h 127.0.0.1 -p 6379 ping
~~~

## 版本切换

服务端主版本切换需要检查 RDB/AOF、模块和复制兼容性。可用不同目录/端口并行验证；`redis-cli` 可独立升级，但其版本不代表服务器版本。

## Docker

~~~bash
docker run --rm --name redis-smoke -p 6379:6379 redis:8.2
~~~

## 安装验证

~~~bash
redis-server --version
redis-cli --version
redis-cli -h 127.0.0.1 -p 6379 INFO server
~~~

## 升级、卸载与冲突

用原仓库升级，升级前备份持久化文件并审阅兼容说明。卸载包可能保留数据。检查 6379 端口、配置加载路径、systemd 服务名，以及 Valkey 兼容命令软链接。

## 官方资料

- [Redis Open Source 安装](https://redis.io/docs/latest/operate/oss_and_stack/install/install-stack/)
- [Redis 下载](https://redis.io/downloads/)
- [Redis 管理](https://redis.io/docs/latest/operate/oss_and_stack/management/)

资料核对日期：2026-08-27。
