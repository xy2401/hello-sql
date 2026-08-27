# Valkey 连接与执行

`valkey-cli` 是 Valkey 随附的命令行客户端，命令协议与 Redis OSS 兼容基础较深，但新脚本应明确使用 Valkey 的二进制名称和官方文档。

- [Valkey CLI](https://valkey.io/topics/cli/)
- [Valkey 命令](https://valkey.io/commands/)
- [Valkey 事务](https://valkey.io/topics/transactions/)

## 启动与检查

```bash
sudo systemctl start valkey
sudo systemctl status valkey
valkey-cli -h 127.0.0.1 -p 6379 PING
```

源码或便携安装也可以显式配置启动 `valkey-server /path/to/valkey.conf`。不要让未认证实例监听公网地址。

## 连接与会话信息

```bash
valkey-cli -h 127.0.0.1 -p 6379 --user hello --askpass
```

```text
HELLO 3
INFO server
ACL WHOAMI
CLIENT INFO
DBSIZE
```

密码应由交互提示或受控凭据注入，不写入仓库、Shell 历史和公开连接串。

## 常用数据操作

```text
SET hello:name alpha
GET hello:name
HSET hello:item:1 name alpha score 30
HGETALL hello:item:1
SADD hello:tags cli database
SMEMBERS hello:tags
```

非交互与安全遍历：

```bash
valkey-cli --raw GET hello:name
valkey-cli --scan --pattern 'hello:*'
valkey-cli --csv HGETALL hello:item:1
```

大实例不要运行 `KEYS *`。Cluster 环境使用 `valkey-cli -c` 跟随 MOVED/ASK 重定向，并确认命令是否支持跨槽操作。

## 管道与事务

```bash
printf 'SET hello:a 1\r\nSET hello:b 2\r\n' | valkey-cli --pipe
```

```text
WATCH hello:counter
MULTI
INCR hello:counter
EXEC
```

`WATCH` 冲突会让 `EXEC` 返回空结果，客户端应决定是否重试。事务不会回滚已执行命令，与 SQL 事务语义不同。

用 `quit` 退出。连接失败时依次检查 6379、绑定地址、protected mode、ACL、TLS 与集群节点；不要通过关闭安全配置解决远程访问问题。

资料核对日期：2026-08-28。
