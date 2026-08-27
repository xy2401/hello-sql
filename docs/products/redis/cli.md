# Redis 连接与执行

`redis-cli` 是 Redis 官方命令行客户端，既可交互操作，也能执行单条命令、管道批量输入和诊断。示例使用 6379 上的本地实例，不要对生产库运行 `FLUSH*` 或无边界扫描。

- [redis-cli](https://redis.io/docs/latest/develop/tools/cli/)
- [命令参考](https://redis.io/docs/latest/commands/)
- [事务](https://redis.io/docs/latest/develop/using-commands/transactions/)

## 启动与状态

```bash
sudo systemctl start redis-server
sudo systemctl status redis-server
redis-cli -h 127.0.0.1 -p 6379 PING
```

部分发行版的服务名是 `redis`。应以安装包实际提供的 unit 为准。

## 连接与认证

```bash
redis-cli -h 127.0.0.1 -p 6379 --user hello --askpass
redis-cli -u 'redis://hello@127.0.0.1:6379/0' --askpass
```

```text
PING
HELLO 3
INFO server
ACL WHOAMI
DBSIZE
```

不要把密码直接写进 URL、`-a` 参数或 `REDISCLI_AUTH` 留在共享环境中。

## 写入、读取与浏览

```text
SET hello:name alpha
GET hello:name
HSET hello:item:1 name alpha score 30
HGETALL hello:item:1
LPUSH hello:queue one two
LRANGE hello:queue 0 -1
```

从 Shell 执行并格式化输出：

```bash
redis-cli -h 127.0.0.1 --raw GET hello:name
redis-cli -h 127.0.0.1 --scan --pattern 'hello:*'
redis-cli -h 127.0.0.1 --csv HGETALL hello:item:1
```

遍历键空间使用 `SCAN` 或 `--scan`，不要在大库上使用阻塞式 `KEYS *`。

## 批量输入与事务

```bash
printf 'SET hello:a 1\r\nSET hello:b 2\r\n' | redis-cli --pipe
```

```text
MULTI
INCR hello:counter
INCR hello:counter
EXEC
```

放弃排队命令使用 `DISCARD`。Redis 事务不提供关系数据库式回滚：命令运行错误不会自动撤销已成功执行的命令。

使用 `quit` 退出。排错时检查监听地址、TLS 端口、ACL 用户、数据库编号和集群重定向；连接 Redis Cluster 时使用 `redis-cli -c` 跟随重定向。

资料核对日期：2026-08-28。
