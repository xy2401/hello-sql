#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const product = process.argv[2]
const image = process.env.HELLO_SQL_IMAGE
const capturedAt = process.env.HELLO_SQL_CAPTURED_AT || new Date().toISOString()
if (!product || !image?.includes('@sha256:')) throw new Error('usage: run-database-session.js <product> with HELLO_SQL_IMAGE=tag@sha256')

const env = Object.fromEntries(fs.readFileSync(path.join(root, '.env.versions'), 'utf8').split(/\r?\n/).filter((line) => /^[A-Z][A-Z0-9_]*=/.test(line)).map((line) => {
  const index = line.indexOf('=')
  return [line.slice(0, index), line.slice(index + 1)]
}))
const suffix = `${process.pid}`
const network = `hello-sql-${product}-${suffix}`.replace(/[^a-z0-9_.-]/g, '-')
const container = `${network}-server`
const password = 'Hello_sql_2026!'
const session = []

function docker(args, options = {}) {
  const result = spawnSync('docker', args, { cwd: root, encoding: 'utf8', timeout: options.timeout ?? 180_000, maxBuffer: 32 * 1024 * 1024, ...options })
  if (options.allowFailure || result.status === 0) return result
  throw new Error(`docker ${args.join(' ')}\n${(result.stderr || result.stdout || `exit ${result.status}`).trim()}`)
}

function sleep(ms) { Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms) }
function logRun(label, callback) {
  const result = callback()
  session.push(`$ ${label}\n${(result.stdout || '').trim()}${result.stderr?.trim() ? `\n${result.stderr.trim()}` : ''}`.trimEnd())
  return result
}
function inside(script, options = {}) { return docker(['exec', container, 'sh', '-lc', script], options) }
function client(imageRef, script, options = {}) {
  if (!imageRef?.includes('@sha256:')) throw new Error('required client image is not digest pinned')
  return docker(['run', '--rm', '--network', network, '--entrypoint', 'sh', imageRef, '-lc', script], options)
}
function waitUntil(label, callback, attempts = 120) {
  for (let attempt = 1; attempt <= attempts; attempt++) {
    const result = callback()
    if (result.status === 0) {
      session.push(`$ ${label}\n${(result.stdout || '').trim()}`.trimEnd())
      return
    }
    const state = docker(['inspect', '--format', '{{.State.Running}}', container], { allowFailure: true, timeout: 30_000 })
    if (state.status === 0 && state.stdout.trim() !== 'true') {
      const logs = docker(['logs', container], { allowFailure: true, timeout: 30_000 })
      throw new Error(`container exited before readiness: ${label}\n${(logs.stdout || '').trim()}${logs.stderr?.trim() ? `\n${logs.stderr.trim()}` : ''}`)
    }
    if (attempt === attempts) throw new Error(`readiness timeout: ${label}\n${(result.stderr || result.stdout).trim()}`)
    sleep(1_000)
  }
}

const commonSql = `DROP TABLE IF EXISTS hello_items; CREATE TABLE hello_items (id INT PRIMARY KEY, name VARCHAR(20), score INT); INSERT INTO hello_items VALUES (1,'Alice',30),(2,'Bob',20),(3,'Carol',40); SELECT id,name,score FROM hello_items WHERE score >= 30 ORDER BY score DESC;`
const profiles = {
  postgresql: {
    env: ['POSTGRES_PASSWORD=hello'],
    ready: () => inside(`PGPASSWORD=hello psql -U postgres -d postgres -Atqc 'SELECT 1'`, { allowFailure: true }),
    readyLabel: "PGPASSWORD=… psql -U postgres -Atqc 'SELECT 1'",
    run: () => logRun(`psql -U postgres -v ON_ERROR_STOP=1 -c "${commonSql} …"`, () => inside(`psql -U postgres -v ON_ERROR_STOP=1 -c "${commonSql} SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_name='hello_items'; EXPLAIN SELECT * FROM hello_items WHERE score >= 30;"`)),
  },
  mysql: {
    env: ['MYSQL_ROOT_PASSWORD=hello'],
    ready: () => inside(`MYSQL_PWD=hello mysql -uroot --protocol=socket -Nse 'SELECT 1'`, { allowFailure: true }),
    readyLabel: "MYSQL_PWD=… mysql -uroot -Nse 'SELECT 1'",
    run: () => logRun(`mysql -uroot -p… -e "${commonSql} …"`, () => inside(`mysql -uroot -phello -e "CREATE DATABASE IF NOT EXISTS hello; USE hello; ${commonSql} SHOW TABLES; EXPLAIN SELECT * FROM hello_items WHERE score >= 30;"`)),
  },
  mariadb: {
    env: ['MARIADB_ROOT_PASSWORD=hello'],
    ready: () => inside(`MYSQL_PWD=hello mariadb -uroot --protocol=socket -Nse 'SELECT 1'`, { allowFailure: true }),
    readyLabel: "MYSQL_PWD=… mariadb -uroot -Nse 'SELECT 1'",
    run: () => logRun(`mariadb -uroot -p… -e "${commonSql} …"`, () => inside(`mariadb -uroot -phello -e "CREATE DATABASE IF NOT EXISTS hello; USE hello; ${commonSql} SHOW TABLES; EXPLAIN SELECT * FROM hello_items WHERE score >= 30;"`)),
  },
  'sql-server': {
    env: ['ACCEPT_EULA=Y', `MSSQL_SA_PASSWORD=${password}`, 'MSSQL_PID=Developer'],
    ready: () => inside(`SQLCMDPASSWORD='${password}' /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -C -Q 'SELECT 1'`, { allowFailure: true }),
    readyLabel: 'sqlcmd -S localhost -U sa -C -Q "SELECT 1"',
    run: () => logRun('sqlcmd fixed T-SQL session', () => inside(`set -eu; export SQLCMDPASSWORD='${password}'; /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -C -b -Q "IF OBJECT_ID('dbo.hello_items','U') IS NOT NULL DROP TABLE dbo.hello_items; CREATE TABLE dbo.hello_items (id int PRIMARY KEY, name varchar(20), score int); INSERT INTO dbo.hello_items VALUES (1,'Alice',30),(2,'Bob',20),(3,'Carol',40); SELECT id,name,score FROM dbo.hello_items WHERE score >= 30 ORDER BY score DESC; SELECT name FROM sys.tables WHERE name='hello_items';"; printf 'SET SHOWPLAN_TEXT ON\nGO\nSELECT * FROM dbo.hello_items WHERE score >= 30\nGO\n' | /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -C -b`)),
  },
  clickhouse: {
    ready: () => inside('clickhouse-client --query "SELECT 1"', { allowFailure: true }),
    readyLabel: 'clickhouse-client --query "SELECT 1"',
    run: () => logRun('clickhouse-client --multiquery < fixed-session.sql', () => inside(`clickhouse-client --multiquery --query "DROP TABLE IF EXISTS hello_items; CREATE TABLE hello_items (id UInt32, name String, score UInt32) ENGINE=MergeTree ORDER BY id; INSERT INTO hello_items VALUES (1,'Alice',30),(2,'Bob',20),(3,'Carol',40); SELECT id,name,score FROM hello_items WHERE score >= 30 ORDER BY score DESC; SHOW TABLES LIKE 'hello_items'; EXPLAIN SELECT * FROM hello_items WHERE score >= 30;"`)),
  },
  tidb: {
    args: ['--store=unistore', '--path=/tmp/tidb'],
    ready: () => client(env.MYSQL_CLIENT_IMAGE, `mysql -h server -P 4000 -uroot -Nse 'SELECT 1'`, { allowFailure: true }),
    readyLabel: "mysql -h server -P 4000 -uroot -Nse 'SELECT 1'",
    run: () => logRun('mysql -h server -P 4000 -uroot -e fixed-session.sql', () => client(env.MYSQL_CLIENT_IMAGE, `mysql -h server -P 4000 -uroot -e "CREATE DATABASE IF NOT EXISTS hello; USE hello; ${commonSql} SHOW TABLES; EXPLAIN SELECT * FROM hello_items WHERE score >= 30;"`)),
  },
  cockroachdb: {
    args: ['start-single-node', '--insecure', '--listen-addr=0.0.0.0:26257', '--advertise-addr=server:26257', '--http-addr=0.0.0.0:8080'],
    ready: () => inside('cockroach sql --insecure --host localhost:26257 -e "SELECT 1"', { allowFailure: true }),
    readyLabel: 'cockroach sql --insecure --host localhost:26257 -e "SELECT 1"',
    run: () => logRun('cockroach sql --insecure -e fixed-session.sql', () => inside(`cockroach sql --insecure --host localhost:26257 -e "${commonSql} SHOW TABLES; EXPLAIN SELECT * FROM hello_items WHERE score >= 30;"`)),
  },
  mongodb: {
    ready: () => inside(`mongosh --quiet --eval 'db.runCommand({ping:1})'`, { allowFailure: true }),
    readyLabel: "mongosh --quiet --eval 'db.runCommand({ping:1})'",
    run: () => logRun('mongosh --quiet --eval fixed-session.js', () => inside(`mongosh --quiet --eval 'db=db.getSiblingDB("hello"); db.items.drop(); db.items.insertMany([{_id:1,name:"Alice",score:30},{_id:2,name:"Bob",score:20},{_id:3,name:"Carol",score:40}]); printjson(db.items.find({score:{$gte:30}}).sort({score:-1}).toArray()); printjson(db.getCollectionNames()); printjson(db.items.find({score:{$gte:30}}).explain("executionStats").queryPlanner.winningPlan);'`)),
  },
  couchdb: {
    env: ['COUCHDB_USER=hello', 'COUCHDB_PASSWORD=hello'],
    ready: () => client(env.CURL_CLIENT_IMAGE, 'curl -fsS -u hello:hello http://server:5984/', { allowFailure: true }),
    readyLabel: 'curl -fsS -u hello:… http://server:5984/',
    run: () => logRun('curl CouchDB fixed document session', () => client(env.CURL_CLIENT_IMAGE, `set -eu; curl -fsS -u hello:hello -X DELETE http://server:5984/hello >/dev/null || true; curl -fsS -u hello:hello -X PUT http://server:5984/hello; curl -fsS -u hello:hello -H 'Content-Type: application/json' -X POST http://server:5984/hello/_bulk_docs -d '{"docs":[{"_id":"1","name":"Alice","score":30},{"_id":"2","name":"Bob","score":20},{"_id":"3","name":"Carol","score":40}]}'; curl -fsS -u hello:hello -H 'Content-Type: application/json' -X POST http://server:5984/hello/_index -d '{"index":{"fields":["score"]},"name":"score-index","type":"json"}'; curl -fsS -u hello:hello -H 'Content-Type: application/json' -X POST http://server:5984/hello/_find -d '{"selector":{"score":{"$gte":30}},"sort":[{"score":"desc"}]}' ; curl -fsS -u hello:hello 'http://server:5984/hello/_all_docs?include_docs=true'`)),
  },
  redis: {
    ready: () => inside('redis-cli ping', { allowFailure: true }), readyLabel: 'redis-cli ping',
    run: () => logRun('redis-cli fixed Stream session', () => inside(`set -eu; redis-cli DEL hello:items; redis-cli XADD hello:items 1-0 id 1 name Alice score 30; redis-cli XADD hello:items 2-0 id 2 name Bob score 20; redis-cli XADD hello:items 3-0 id 3 name Carol score 40; redis-cli XRANGE hello:items - +; redis-cli XLEN hello:items; redis-cli XINFO STREAM hello:items`)),
  },
  valkey: {
    ready: () => inside('valkey-cli ping', { allowFailure: true }), readyLabel: 'valkey-cli ping',
    run: () => logRun('valkey-cli fixed Stream session', () => inside(`set -eu; valkey-cli DEL hello:items; valkey-cli XADD hello:items 1-0 id 1 name Alice score 30; valkey-cli XADD hello:items 2-0 id 2 name Bob score 20; valkey-cli XADD hello:items 3-0 id 3 name Carol score 40; valkey-cli XRANGE hello:items - +; valkey-cli XLEN hello:items; valkey-cli XINFO STREAM hello:items`)),
  },
  dynamodb: {
    ready: () => client(env.AWS_CLI_IMAGE, 'export AWS_ACCESS_KEY_ID=local AWS_SECRET_ACCESS_KEY=local AWS_DEFAULT_REGION=us-east-1; aws dynamodb list-tables --endpoint-url http://server:8000', { allowFailure: true }),
    readyLabel: 'aws dynamodb list-tables --endpoint-url http://server:8000',
    run: () => logRun('aws dynamodb create/put/scan/list against DynamoDB Local', () => client(env.AWS_CLI_IMAGE, `set -eu; export AWS_ACCESS_KEY_ID=local AWS_SECRET_ACCESS_KEY=local AWS_DEFAULT_REGION=us-east-1; aws dynamodb create-table --endpoint-url http://server:8000 --table-name hello_items --attribute-definitions AttributeName=id,AttributeType=N --key-schema AttributeName=id,KeyType=HASH --billing-mode PAY_PER_REQUEST; aws dynamodb put-item --endpoint-url http://server:8000 --table-name hello_items --item '{"id":{"N":"1"},"name":{"S":"Alice"},"score":{"N":"30"}}'; aws dynamodb put-item --endpoint-url http://server:8000 --table-name hello_items --item '{"id":{"N":"2"},"name":{"S":"Bob"},"score":{"N":"20"}}'; aws dynamodb put-item --endpoint-url http://server:8000 --table-name hello_items --item '{"id":{"N":"3"},"name":{"S":"Carol"},"score":{"N":"40"}}'; aws dynamodb scan --endpoint-url http://server:8000 --table-name hello_items --filter-expression 'score >= :score' --expression-attribute-values '{":score":{"N":"30"}}'; aws dynamodb list-tables --endpoint-url http://server:8000`)),
  },
  cassandra: {
    env: ['MAX_HEAP_SIZE=512M', 'HEAP_NEWSIZE=100M'],
    ready: () => inside('cqlsh -e "DESCRIBE CLUSTER"', { allowFailure: true }), readyLabel: 'cqlsh -e "DESCRIBE CLUSTER"',
    run: () => logRun('cqlsh -e fixed-session.cql', () => inside(`cqlsh -e "CREATE KEYSPACE IF NOT EXISTS hello WITH replication = {'class':'SimpleStrategy','replication_factor':1}; DROP TABLE IF EXISTS hello.items; CREATE TABLE hello.items (id int PRIMARY KEY, name text, score int); INSERT INTO hello.items (id,name,score) VALUES (1,'Alice',30); INSERT INTO hello.items (id,name,score) VALUES (2,'Bob',20); INSERT INTO hello.items (id,name,score) VALUES (3,'Carol',40); SELECT * FROM hello.items; DESCRIBE TABLE hello.items;"`)),
  },
  scylladb: {
    args: ['--smp', '1', '--memory', '750M', '--overprovisioned', '1', '--developer-mode', '1'],
    ready: () => inside('cqlsh -e "DESCRIBE CLUSTER"', { allowFailure: true }), readyLabel: 'cqlsh -e "DESCRIBE CLUSTER"',
    run: () => logRun('cqlsh -e fixed-session.cql', () => inside(`cqlsh -e "CREATE KEYSPACE IF NOT EXISTS hello WITH replication = {'class':'SimpleStrategy','replication_factor':1}; DROP TABLE IF EXISTS hello.items; CREATE TABLE hello.items (id int PRIMARY KEY, name text, score int); INSERT INTO hello.items (id,name,score) VALUES (1,'Alice',30); INSERT INTO hello.items (id,name,score) VALUES (2,'Bob',20); INSERT INTO hello.items (id,name,score) VALUES (3,'Carol',40); SELECT * FROM hello.items; DESCRIBE TABLE hello.items;"`)),
  },
  elasticsearch: {
    env: ['discovery.type=single-node', 'xpack.security.enabled=false', 'ES_JAVA_OPTS=-Xms512m -Xmx512m'],
    ready: () => client(env.CURL_CLIENT_IMAGE, 'curl -fsS http://server:9200/', { allowFailure: true }), readyLabel: 'curl -fsS http://server:9200/',
    run: () => logRun('curl Elasticsearch bulk/search/cat/explain session', () => client(env.CURL_CLIENT_IMAGE, `set -eu; curl -fsS -X DELETE http://server:9200/hello-items >/dev/null || true; curl -fsS -H 'Content-Type: application/x-ndjson' -X POST http://server:9200/hello-items/_bulk --data-binary '{"index":{"_id":"1"}}
{"name":"Alice","score":30}
{"index":{"_id":"2"}}
{"name":"Bob","score":20}
{"index":{"_id":"3"}}
{"name":"Carol","score":40}
'; curl -fsS -H 'Content-Type: application/json' -X POST http://server:9200/hello-items/_refresh; curl -fsS -H 'Content-Type: application/json' -X POST http://server:9200/hello-items/_search -d '{"query":{"range":{"score":{"gte":30}}},"sort":[{"score":"desc"}]}' ; curl -fsS 'http://server:9200/_cat/indices/hello-items?v'; curl -fsS -H 'Content-Type: application/json' -X POST http://server:9200/hello-items/_explain/1 -d '{"query":{"range":{"score":{"gte":30}}}}'`)),
  },
  opensearch: {
    env: ['discovery.type=single-node', 'DISABLE_SECURITY_PLUGIN=true', 'OPENSEARCH_JAVA_OPTS=-Xms512m -Xmx512m'],
    ready: () => client(env.CURL_CLIENT_IMAGE, 'curl -fsS http://server:9200/', { allowFailure: true }), readyLabel: 'curl -fsS http://server:9200/',
    run: () => logRun('curl OpenSearch bulk/search/cat/explain session', () => client(env.CURL_CLIENT_IMAGE, `set -eu; curl -fsS -X DELETE http://server:9200/hello-items >/dev/null || true; curl -fsS -H 'Content-Type: application/x-ndjson' -X POST http://server:9200/hello-items/_bulk --data-binary '{"index":{"_id":"1"}}
{"name":"Alice","score":30}
{"index":{"_id":"2"}}
{"name":"Bob","score":20}
{"index":{"_id":"3"}}
{"name":"Carol","score":40}
'; curl -fsS -H 'Content-Type: application/json' -X POST http://server:9200/hello-items/_refresh; curl -fsS -H 'Content-Type: application/json' -X POST http://server:9200/hello-items/_search -d '{"query":{"range":{"score":{"gte":30}}},"sort":[{"score":"desc"}]}' ; curl -fsS 'http://server:9200/_cat/indices/hello-items?v'; curl -fsS -H 'Content-Type: application/json' -X POST http://server:9200/hello-items/_explain/1 -d '{"query":{"range":{"score":{"gte":30}}}}'`)),
  },
  neo4j: {
    env: [`NEO4J_AUTH=neo4j/${password}`],
    ready: () => inside(`cypher-shell -u neo4j -p '${password}' 'RETURN 1'`, { allowFailure: true }), readyLabel: 'cypher-shell -u neo4j -p … RETURN 1',
    run: () => logRun('cypher-shell fixed Cypher session', () => inside(`cypher-shell -u neo4j -p '${password}' "MATCH (n:HelloItem) DETACH DELETE n; CREATE (:HelloItem {id:1,name:'Alice',score:30}),(:HelloItem {id:2,name:'Bob',score:20}),(:HelloItem {id:3,name:'Carol',score:40}); MATCH (n:HelloItem) WHERE n.score >= 30 RETURN n.id,n.name,n.score ORDER BY n.score DESC; SHOW INDEXES; PROFILE MATCH (n:HelloItem) WHERE n.score >= 30 RETURN n;"`)),
  },
  influxdb: {
    env: ['DOCKER_INFLUXDB_INIT_MODE=setup', 'DOCKER_INFLUXDB_INIT_USERNAME=hello', `DOCKER_INFLUXDB_INIT_PASSWORD=${password}`, 'DOCKER_INFLUXDB_INIT_ORG=hello', 'DOCKER_INFLUXDB_INIT_BUCKET=hello', 'DOCKER_INFLUXDB_INIT_ADMIN_TOKEN=hello-sql-token'],
    ready: () => inside('influx bucket list --host http://localhost:8086 --token hello-sql-token --org hello', { allowFailure: true }), readyLabel: 'influx bucket list --token … --org hello',
    run: () => logRun('influx write/query/bucket list session', () => inside(`set -eu; influx write --host http://localhost:8086 --token hello-sql-token --org hello --bucket hello --precision s 'items,id=1 name="Alice",score=30 1700000001'; influx write --host http://localhost:8086 --token hello-sql-token --org hello --bucket hello --precision s 'items,id=2 name="Bob",score=20 1700000002'; influx write --host http://localhost:8086 --token hello-sql-token --org hello --bucket hello --precision s 'items,id=3 name="Carol",score=40 1700000003'; influx query --host http://localhost:8086 --token hello-sql-token --org hello 'from(bucket:"hello") |> range(start: 2023-01-01T00:00:00Z) |> filter(fn:(r)=>r._measurement=="items" and r._field=="score" and r._value>=30) |> sort(columns:["_value"], desc:true)'; influx bucket list --host http://localhost:8086 --token hello-sql-token --org hello`)),
  },
  timescaledb: {
    env: ['POSTGRES_PASSWORD=hello'],
    ready: () => inside(`PGPASSWORD=hello psql -U postgres -d postgres -Atqc 'SELECT 1'`, { allowFailure: true }), readyLabel: "PGPASSWORD=… psql -U postgres -Atqc 'SELECT 1'",
    run: () => logRun('psql fixed hypertable session', () => inside(`psql -U postgres -v ON_ERROR_STOP=1 -c "CREATE EXTENSION IF NOT EXISTS timescaledb; DROP TABLE IF EXISTS hello_items; CREATE TABLE hello_items (time timestamptz NOT NULL, id int, name text, score int); SELECT create_hypertable('hello_items','time'); INSERT INTO hello_items VALUES ('2025-01-01',1,'Alice',30),('2025-01-02',2,'Bob',20),('2025-01-03',3,'Carol',40); SELECT id,name,score FROM hello_items WHERE score >= 30 ORDER BY score DESC; SELECT hypertable_name FROM timescaledb_information.hypertables WHERE hypertable_name='hello_items'; EXPLAIN SELECT * FROM hello_items WHERE score >= 30;"`)),
  },
}

const profile = profiles[product]
if (!profile) throw new Error(`no live database session profile for ${product}`)

function evidence(kind, status, exitCode, body) {
  const directory = path.join(root, 'demos', product, 'docker')
  fs.mkdirSync(directory, { recursive: true })
  const header = `---\nstatus: ${status}\ncapturedAt: ${capturedAt}\ndockerImage: ${JSON.stringify(image)}\nexitCode: ${exitCode}\n---\n`
  fs.writeFileSync(path.join(directory, `${kind}.out.txt`), `${header}${body.trimEnd()}\n`)
}

let started = false
try {
  docker(['network', 'create', '--internal', network])
  const args = ['run', '-d', '--name', container, '--hostname', 'server', '--network', network]
  for (const variable of profile.env || []) args.push('-e', variable)
  args.push(...(profile.dockerArgs || []))
  args.push(image, ...(profile.args || []))
  docker(args, { timeout: 300_000 })
  started = true
  waitUntil(profile.readyLabel, profile.ready)
  profile.run()

  const metadata = docker(['image', 'inspect', image, '--format', 'id={{.Id}}\nos={{.Os}}\narchitecture={{.Architecture}}\nsizeBytes={{.Size}}'])
  const inventory = inside(`set -eu; echo "PATH=$PATH"; [ ! -r /etc/os-release ] || cat /etc/os-release; roots="$PATH:/opt/mssql-tools18/bin:/opt/mssql-tools/bin:/usr/share/elasticsearch/bin:/usr/share/opensearch/bin:/var/lib/neo4j/bin"; oldIFS="$IFS"; IFS=:; for root in $roots; do [ -d "$root" ] || continue; find "$root" -maxdepth 1 -type f -perm -111 -print 2>/dev/null || true; done; IFS="$oldIFS"`, { allowFailure: true })
  const status = inventory.status === 0 ? 'verified' : 'partial'
  evidence('inventory', status, inventory.status ?? 1, `$ docker image inspect ${image}\n${metadata.stdout.trim()}\n\n$ docker exec ${container} sh -lc '<PATH and vendor executable inventory>'\n${inventory.status === 0 ? inventory.stdout.trim() : `inventory unavailable: ${(inventory.stderr || inventory.stdout).trim()}`}`)
  evidence('session', status, 0, session.join('\n\n'))
  evidence('assert', status, 0, `PASS image tag+digest\nPASS isolated internal Docker network\nPASS readiness check\nPASS fixed three-record write\nPASS native filter/query and structure/status review\n${inventory.status === 0 ? 'PASS' : 'PARTIAL'} PATH/vendor executable inventory\nRESULT: ${status}`)
} finally {
  if (started) docker(['rm', '-f', container], { allowFailure: true, timeout: 60_000 })
  docker(['network', 'rm', network], { allowFailure: true, timeout: 60_000 })
}
