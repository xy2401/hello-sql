#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const envFile = path.join(root, '.env.versions')
const capturedAt = new Date().toISOString()

const products = {
  postgresql: ['POSTGRESQL_TAG', 'POSTGRESQL_IMAGE'],
  mysql: ['MYSQL_TAG', 'MYSQL_IMAGE'],
  mariadb: ['MARIADB_TAG', 'MARIADB_IMAGE'],
  'sql-server': ['SQLSERVER_TAG', 'SQLSERVER_IMAGE'],
  clickhouse: ['CLICKHOUSE_TAG', 'CLICKHOUSE_IMAGE'],
  tidb: ['TIDB_TAG', 'TIDB_IMAGE'],
  cockroachdb: ['COCKROACHDB_TAG', 'COCKROACHDB_IMAGE'],
  mongodb: ['MONGODB_TAG', 'MONGODB_IMAGE'],
  couchdb: ['COUCHDB_TAG', 'COUCHDB_IMAGE'],
  redis: ['REDIS_TAG', 'REDIS_IMAGE'],
  valkey: ['VALKEY_TAG', 'VALKEY_IMAGE'],
  dynamodb: ['DYNAMODB_LOCAL_TAG', 'DYNAMODB_LOCAL_IMAGE'],
  cassandra: ['CASSANDRA_TAG', 'CASSANDRA_IMAGE'],
  scylladb: ['SCYLLADB_TAG', 'SCYLLADB_IMAGE'],
  elasticsearch: ['ELASTICSEARCH_TAG', 'ELASTICSEARCH_IMAGE'],
  opensearch: ['OPENSEARCH_TAG', 'OPENSEARCH_IMAGE'],
  neo4j: ['NEO4J_TAG', 'NEO4J_IMAGE'],
  influxdb: ['INFLUXDB_TAG', 'INFLUXDB_IMAGE'],
  timescaledb: ['TIMESCALEDB_TAG', 'TIMESCALEDB_IMAGE'],
  bigquery: ['GCLOUD_CLI_TAG', 'GCLOUD_CLI_IMAGE'],
}

const explicitExceptions = {
  sqlite: '嵌入式 CLI 自建镜像需要同时锁定 SQLite 源码校验和，未完成前不以 apt 浮动包冒充固定版本。',
  oracle: '官方镜像入口可能需要登录或接受许可；无凭证 Actions 不改用社区镜像。',
  duckdb: '嵌入式 CLI 自建镜像需要同时锁定 DuckDB 发布包校验和，未完成前保持 documented。',
  snowflake: '只展示官方 CLI 命令；没有云账号时不执行查询。',
  browser: '浏览器数据库依赖浏览器存储上下文，不适用 Docker。',
}

const auxiliaryImages = {
  CURL_CLIENT: ['CURL_CLIENT_TAG', 'CURL_CLIENT_IMAGE'],
  AWS_CLI: ['AWS_CLI_TAG', 'AWS_CLI_IMAGE'],
  MYSQL_CLIENT: ['MYSQL_CLIENT_TAG', 'MYSQL_CLIENT_IMAGE'],
}

const liveSessions = new Set([
  'postgresql', 'mysql', 'mariadb', 'sql-server', 'clickhouse', 'tidb', 'cockroachdb', 'mongodb', 'couchdb',
  'redis', 'valkey', 'dynamodb', 'cassandra', 'scylladb', 'elasticsearch', 'opensearch', 'neo4j',
  'influxdb', 'timescaledb',
])

function command(command, args, options = {}) {
  return spawnSync(command, args, {
    cwd: root,
    encoding: 'utf8',
    timeout: options.timeout ?? 120_000,
    maxBuffer: 32 * 1024 * 1024,
    ...options,
  })
}

function parseEnv(text) {
  const values = {}
  for (const line of text.split(/\r?\n/)) {
    if (!/^[A-Z][A-Z0-9_]*=/.test(line)) continue
    const split = line.indexOf('=')
    values[line.slice(0, split)] = line.slice(split + 1)
  }
  return values
}

function updateEnv(text, key, value) {
  const line = `${key}=${value}`
  const matcher = new RegExp(`^${key}=.*$`, 'm')
  return matcher.test(text) ? text.replace(matcher, line) : `${text.trimEnd()}\n${line}\n`
}

function frontmatter(status, image, exitCode) {
  return `---\nstatus: ${status}\ncapturedAt: ${capturedAt}\ndockerImage: ${JSON.stringify(image)}\nexitCode: ${exitCode}\n---\n`
}

function writeEvidence(product, kind, status, image, exitCode, body) {
  const directory = path.join(root, 'demos', product, 'docker')
  fs.mkdirSync(directory, { recursive: true })
  fs.writeFileSync(path.join(directory, `${kind}.out.txt`), `${frontmatter(status, image, exitCode)}${body.trimEnd()}\n`)
}

function writeDocumented(product, reason, image = 'not-applicable') {
  writeEvidence(product, 'inventory', product === 'browser' ? 'unsupported' : 'documented', image, -1, `DOCUMENTED: ${reason}`)
  writeEvidence(product, 'session', product === 'browser' ? 'unsupported' : 'documented', image, -1, `DOCUMENTED: ${reason}`)
  writeEvidence(product, 'assert', product === 'browser' ? 'unsupported' : 'documented', image, -1, `RESULT: not executed — ${reason}`)
}

function hasVerifiedEvidence(product) {
  const file = path.join(root, 'demos', product, 'docker', 'assert.out.txt')
  return fs.existsSync(file) && /^status:\s*verified$/m.test(fs.readFileSync(file, 'utf8'))
}

function recordFailure(product, reason, image) {
  if (hasVerifiedEvidence(product)) {
    console.error(`[preserved] ${product}: latest verified snapshots kept after collection failure: ${reason}`)
    return
  }
  writeDocumented(product, reason, image)
}

function resolveDigest(tag) {
  const pull = command('docker', ['pull', tag], { timeout: 600_000 })
  if (pull.status !== 0) throw new Error((pull.stderr || pull.stdout || `docker pull exited ${pull.status}`).trim())
  const inspect = command('docker', ['image', 'inspect', tag, '--format', '{{json .RepoDigests}}'])
  if (inspect.status !== 0) throw new Error((inspect.stderr || inspect.stdout).trim())
  const digests = JSON.parse(inspect.stdout.trim())
  const reference = digests.find((item) => item.includes('@sha256:'))
  if (!reference) throw new Error('image inspect did not return a repo digest')
  const digest = reference.slice(reference.indexOf('@'))
  return `${tag}${digest}`
}

const inventoryScript = String.raw`
set -eu
echo "PATH=$PATH"
if [ -r /etc/os-release ]; then cat /etc/os-release; fi
echo "toolRoots=PATH plus known vendor directories"
roots="$PATH:/opt/mssql-tools18/bin:/opt/mssql-tools/bin:/opt/java/openjdk/bin:/usr/share/elasticsearch/bin:/usr/share/opensearch/bin:/var/lib/neo4j/bin"
oldIFS="$IFS"; IFS=:
for root in $roots; do
  [ -d "$root" ] || continue
  find "$root" -maxdepth 1 -type f -perm -111 -print 2>/dev/null || true
done
IFS="$oldIFS"
`.trim()

function collectPartialInventory(product, image) {
  const inspect = command('docker', ['image', 'inspect', image, '--format', 'id={{.Id}}\nos={{.Os}}\narchitecture={{.Architecture}}\nsizeBytes={{.Size}}'])
  const tools = command('docker', ['run', '--rm', '--entrypoint', 'sh', image, '-lc', inventoryScript], { timeout: 180_000 })
  const hasShell = tools.status === 0
  const status = 'partial'
  const inventory = [
    `$ docker image inspect ${image}`,
    inspect.stdout.trim(),
    '',
    `$ docker run --rm --entrypoint sh ${image} -lc '<PATH and vendor executable inventory>'`,
    hasShell ? tools.stdout.trim() : `image shell unavailable: ${(tools.stderr || tools.stdout).trim()}`,
  ].join('\n')
  writeEvidence(product, 'inventory', status, image, hasShell ? 0 : (tools.status ?? 1), inventory)
  writeEvidence(product, 'session', status, image, 0, `$ docker image inspect ${image} --format '{{.Id}} {{.Os}}/{{.Architecture}} {{.Size}}'\n${inspect.stdout.trim()}\n\nQuery session: not executed because this product has no enabled demos/${product}/docker/run.sh yet.`)
  writeEvidence(product, 'assert', status, image, 0, `PASS image digest resolved\nPASS image metadata captured\n${hasShell ? 'PASS' : 'PARTIAL'} PATH/vendor executable inventory\nPARTIAL core database session not enabled\nRESULT: partial`)
}

function collectBigQueryCli(image) {
  const version = command('docker', ['run', '--rm', '--entrypoint', 'sh', image, '-lc', 'set -eu; bq version; gcloud version; bq help | sed -n "1,60p"'], { timeout: 180_000 })
  collectPartialInventory('bigquery', image)
  if (version.status !== 0) throw new Error((version.stderr || version.stdout || 'bq CLI probe failed').trim())
  writeEvidence('bigquery', 'session', 'partial', image, 0, `$ docker run --rm --entrypoint sh ${image} -lc 'bq version; gcloud version; bq help'\n${version.stdout.trim()}\n\nDOCUMENTED: bq query 未执行；CI 不注入 Google Cloud 凭证。`)
  writeEvidence('bigquery', 'assert', 'partial', image, 0, 'PASS official bq CLI version\nPASS official gcloud CLI version\nPASS bq help\nDOCUMENTED authenticated query not executed\nRESULT: partial')
}

const docker = command('docker', ['info'], { stdio: 'ignore', timeout: 30_000 })
if (docker.status !== 0) {
  console.error('Docker daemon 不可用；未写入任何证据快照。')
  process.exit(1)
}

let envText = fs.readFileSync(envFile, 'utf8')
const env = parseEnv(envText)
let resolved = 0
let verified = 0
let partial = 0
let failed = 0

for (const [label, [tagKey, imageKey]] of Object.entries(auxiliaryImages)) {
  const seed = env[tagKey]
  if (!seed || /(^|:)latest$|edge|nightly/i.test(seed)) {
    console.error(`[documented] auxiliary ${label}: ${tagKey} missing or floating`)
    continue
  }
  try {
    const image = resolveDigest(seed)
    env[imageKey] = image
    envText = updateEnv(envText, imageKey, image)
    console.log(`[pinned] auxiliary ${label}: ${image}`)
  } catch (error) {
    console.error(`[documented] auxiliary ${label}: ${error.message}`)
  }
}

for (const [product, [tagKey, imageKey]] of Object.entries(products)) {
  const seed = env[tagKey]
  if (!seed || /(^|:)latest$|edge|nightly/i.test(seed)) {
    recordFailure(product, `${tagKey} 缺失或不是允许的明确版本。`, seed || 'unresolved')
    failed++
    continue
  }
  try {
    const image = resolveDigest(seed)
    env[imageKey] = image
    envText = updateEnv(envText, imageKey, image)
    resolved++
    const runner = path.join(root, 'demos', product, 'docker', 'run.sh')
    if (product === 'bigquery') {
      collectBigQueryCli(image)
      partial++
    } else if (liveSessions.has(product)) {
      fs.writeFileSync(envFile, envText)
      const result = command(process.execPath, [path.join(root, 'scripts/run-database-session.js'), product], {
        stdio: 'inherit', timeout: 1_200_000,
        env: { ...process.env, HELLO_SQL_IMAGE: image, HELLO_SQL_CAPTURED_AT: capturedAt },
      })
      if (result.status !== 0) throw new Error(`database session exited ${result.status}`)
      verified++
    } else if (fs.existsSync(runner)) {
      const result = command('bash', [runner], {
        stdio: 'inherit', timeout: 900_000,
        env: { ...process.env, HELLO_SQL_IMAGE: image, HELLO_SQL_CAPTURED_AT: capturedAt },
      })
      if (result.status !== 0) throw new Error(`run.sh exited ${result.status}`)
      verified++
    } else {
      collectPartialInventory(product, image)
      partial++
    }
  } catch (error) {
    recordFailure(product, `${tagKey} 拉取或采集失败：${error.message}`, seed)
    console.error(`[documented] ${product}: ${error.message}`)
    failed++
  }
}

for (const [product, reason] of Object.entries(explicitExceptions)) writeDocumented(product, reason)
fs.writeFileSync(envFile, envText)
console.log(`SQL Docker catalog: 25 products; ${resolved} digest(s) resolved, ${verified} verified session(s), ${partial} partial inventories, ${failed} pull/collection failure(s), ${Object.keys(explicitExceptions).length} explicit exception(s).`)
if (failed > 0) {
  console.error(`SQL Docker collection failed: ${failed} runnable product(s) could not be collected. See the product logs above; documented exceptions are not counted as failures.`)
  process.exitCode = 1
}
