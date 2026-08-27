# InfluxDB 连接与执行

InfluxDB 1.x、2.x 与 3.x 的命令行模型不同：1.x 使用 `influx` 交互 Shell，2.x 使用面向组织和 bucket 的 `influx` CLI，3 Core 使用 `influxdb3`。先确认服务端主版本，再选择命令。

- [InfluxDB 3 Core CLI](https://docs.influxdata.com/influxdb3/core/reference/cli/)
- [InfluxDB 2 CLI](https://docs.influxdata.com/influxdb/v2/reference/cli/influx/)
- [InfluxDB 1 Shell](https://docs.influxdata.com/influxdb/v1/tools/shell/)

## InfluxDB 3 Core

本地服务的启动参数应来自部署配置；运行后先检查服务，再创建数据库、写入 line protocol 和执行 SQL：

```bash
influxdb3 create database hello --host http://127.0.0.1:8181 --token "$INFLUXDB3_AUTH_TOKEN"
printf 'hello_items,id=1 name="alpha",score=30i\n' | \
  influxdb3 write --database hello --host http://127.0.0.1:8181 --token "$INFLUXDB3_AUTH_TOKEN"
influxdb3 query --database hello --host http://127.0.0.1:8181 \
  --token "$INFLUXDB3_AUTH_TOKEN" 'SELECT * FROM hello_items'
```

令牌通过受保护的环境变量或密钥系统提供，不写入文档、历史和仓库。

## InfluxDB 2.x

2.x CLI 使用 profile 保存主机、组织和 token 引用：

```bash
influx ping --host http://127.0.0.1:8086
influx config create --config-name hello-local \
  --host-url http://127.0.0.1:8086 --org hello --token "$INFLUX_TOKEN" --active
influx bucket list
influx write --bucket hello --file items.lp
influx query 'from(bucket: "hello") |> range(start: -1h)'
```

`influx config` 文件包含敏感上下文，应限制文件权限。

## InfluxDB 1.x

```bash
influx -host 127.0.0.1 -port 8086
```

```sql
SHOW DATABASES
CREATE DATABASE hello
USE hello
SHOW MEASUREMENTS
SELECT * FROM hello_items LIMIT 10
```

1.x 的 HTTP 写入和查询默认走 8086。三个世代的数据模型、查询语言和认证方式不同，不能仅替换命令名完成迁移，也没有跨序列的传统 SQL 事务。

连接失败时核对实际产品线、HTTP 端口、组织/bucket/database、token 权限和时间范围；查询无结果首先检查时间戳精度与 `range`。

资料核对日期：2026-08-28。
