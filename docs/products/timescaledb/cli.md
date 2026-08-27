# TimescaleDB 连接与执行

TimescaleDB 是 PostgreSQL 扩展，连接和脚本执行继续使用 `psql`。CLI 工作流的关键是先确认 PostgreSQL 服务、目标数据库以及 `timescaledb` 扩展是否已经启用。

- [TimescaleDB 自托管文档](https://docs.timescale.com/self-hosted/latest/)
- [创建 hypertable](https://docs.timescale.com/api/latest/hypertable/create_hypertable/)
- [psql](https://www.postgresql.org/docs/current/app-psql.html)

## 启动与检查

```bash
sudo systemctl start postgresql
pg_isready -h 127.0.0.1 -p 5432
psql -h 127.0.0.1 -U hello -d hello -c "SELECT extversion FROM pg_extension WHERE extname = 'timescaledb';"
```

查询无行表示当前数据库尚未启用扩展；安装了扩展文件不等于每个数据库都已执行 `CREATE EXTENSION`。

## 连接与对象查看

```bash
psql -h 127.0.0.1 -p 5432 -U hello -d hello
```

```text
\conninfo
\dx timescaledb
\dt
```

TimescaleDB 信息视图位于 `timescaledb_information` schema，可以查询 hypertable 和 chunk 状态。

## 创建与查询时序数据

```sql
CREATE EXTENSION IF NOT EXISTS timescaledb;

CREATE TABLE metrics (
  time timestamptz NOT NULL,
  device_id text NOT NULL,
  value double precision NOT NULL
);

SELECT create_hypertable('metrics', by_range('time'), if_not_exists => TRUE);
INSERT INTO metrics VALUES (now(), 'demo-1', 12.5);
SELECT * FROM metrics ORDER BY time DESC LIMIT 10;
```

从 Shell 执行脚本时让错误影响退出码：

```bash
psql -h 127.0.0.1 -U hello -d hello -v ON_ERROR_STOP=1 -f metrics.sql
```

## 导入、导出与事务

```text
\copy metrics(time, device_id, value) FROM 'metrics.csv' WITH (FORMAT csv, HEADER true)
\copy (SELECT * FROM metrics ORDER BY time) TO 'metrics.out.csv' WITH (FORMAT csv, HEADER true)
```

普通 DML 遵循 PostgreSQL 事务；但结构变更、压缩、保留策略和连续聚合刷新各有运行约束，执行前应查看对应版本文档。

使用 `\q` 退出。排错时除 PostgreSQL 连接项外，还要检查 `shared_preload_libraries`、扩展版本、后台 worker 和数据库内扩展状态。

资料核对日期：2026-08-28。
