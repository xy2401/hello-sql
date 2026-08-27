import fs from 'node:fs'
import path from 'node:path'

const products = ['browser', 'cassandra', 'clickhouse', 'cockroachdb', 'couchdb', 'duckdb', 'elasticsearch', 'influxdb', 'mariadb', 'mongodb', 'mssqlserver', 'mysql', 'neo4j', 'opensearch', 'oracle', 'postgresql', 'redis', 'scylladb', 'sqlite', 'tidb', 'timescaledb', 'valkey']
const officialHosts = {
  browser: 'developer.mozilla.org', cassandra: 'cassandra.apache.org', clickhouse: 'clickhouse.com',
  cockroachdb: 'www.cockroachlabs.com', couchdb: 'docs.couchdb.org', duckdb: 'duckdb.org',
  elasticsearch: 'www.elastic.co', influxdb: 'docs.influxdata.com', mariadb: 'mariadb.com',
  mongodb: 'www.mongodb.com', mssqlserver: 'learn.microsoft.com', mysql: 'dev.mysql.com',
  neo4j: 'neo4j.com', opensearch: 'docs.opensearch.org', oracle: 'docs.oracle.com',
  postgresql: 'www.postgresql.org', redis: 'redis.io', scylladb: 'opensource.docs.scylladb.com',
  sqlite: 'sqlite.org', tidb: 'docs.pingcap.com', timescaledb: 'docs.timescale.com', valkey: 'valkey.io',
}
const requiredCommands = {
  browser: ['indexedDB', 'navigator.storage'], cassandra: ['cqlsh', 'nodetool'],
  clickhouse: ['clickhouse-client'], cockroachdb: ['cockroach sql'], couchdb: ['curl'],
  duckdb: ['duckdb'], elasticsearch: ['curl', '_bulk'], influxdb: ['influxdb3', 'influx'],
  mariadb: ['mariadb'], mongodb: ['mongosh'], mssqlserver: ['sqlcmd'],
  mysql: ['mysql', 'mysqlsh'], neo4j: ['cypher-shell'], opensearch: ['curl', '_bulk'],
  oracle: ['SQLcl', 'sqlplus'], postgresql: ['psql'], redis: ['redis-cli'],
  scylladb: ['cqlsh', 'nodetool'], sqlite: ['sqlite3'], tidb: ['mysql', 'tiup playground'],
  timescaledb: ['psql', 'create_hypertable'], valkey: ['valkey-cli'],
}

const root = process.cwd()
const sidebar = fs.readFileSync(path.join(root, 'docs/.vitepress/config.ts'), 'utf8')
const failures = []
const contents = new Map()

function requireMatch(condition, message) {
  if (!condition) failures.push(message)
}

for (const product of products) {
  const relative = `docs/products/${product}/cli.md`
  const file = path.join(root, relative)
  requireMatch(fs.existsSync(file), `${relative}: 文件不存在`)
  if (!fs.existsSync(file)) continue

  const text = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n')
  contents.set(product, text)
  const title = product === 'browser' ? /^# .+调用与调试$/m : /^# .+连接与执行$/m

  requireMatch(text.length >= 1000, `${relative}: 内容过短，疑似占位页`)
  requireMatch(title.test(text), `${relative}: 标题与产品类型不符`)
  requireMatch(text.includes(`https://${officialHosts[product]}`), `${relative}: 缺少对应上游官方来源`)
  requireMatch(/```(?:bash|sql|text|javascript|cypher)\n/.test(text), `${relative}: 缺少可复制命令代码块`)
  requireMatch(text.includes('资料核对日期：2026-08-28。'), `${relative}: 核对日期不正确`)
  requireMatch(!/(TODO|TBD|待补充|下一步|实验台)/i.test(text), `${relative}: 存在占位或无关引导`)
  requireMatch(!/^<script\b|^<[A-Z][A-Za-z]+\b/m.test(text), `${relative}: 不应嵌入动态组件`)

  for (const command of requiredCommands[product]) {
    requireMatch(text.includes(command), `${relative}: 缺少关键入口 ${command}`)
  }
}

requireMatch(sidebar.includes("{ text: '连接与执行', link: `${link}/cli` }"), '通用数据库侧栏未引用 CLI 页')
requireMatch(sidebar.includes("{ text: '调用与调试', link: '/products/browser/cli' }"), 'Browser Database 侧栏未引用 CLI 页')
requireMatch(new Set(contents.values()).size === contents.size, '存在内容完全相同的 CLI 页')

if (failures.length) {
  console.error(failures.join('\n'))
  process.exit(1)
}

console.log(`CLI docs check passed: ${products.length} SQL products`)
