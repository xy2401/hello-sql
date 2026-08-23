#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const products = [
  'postgresql', 'mysql', 'mariadb', 'sqlite', 'sql-server', 'oracle',
  'duckdb', 'clickhouse', 'tidb', 'cockroachdb', 'mongodb', 'couchdb',
  'redis', 'valkey', 'cassandra', 'scylladb', 'elasticsearch', 'opensearch',
  'neo4j', 'influxdb', 'timescaledb', 'browser',
]
const unsupported = new Set(['browser'])

for (const id of products) {
  const directory = path.join(root, 'demos', id, 'docker')
  fs.mkdirSync(directory, { recursive: true })
  const status = unsupported.has(id) ? 'unsupported' : 'documented'
  for (const kind of ['inventory', 'session', 'assert']) {
    const file = path.join(directory, `${kind}.out.txt`)
    if (fs.existsSync(file)) continue
    const reason = unsupported.has(id)
      ? 'Docker 不适用于浏览器存储上下文。'
      : '镜像锁与真实查询会话尚待手动 Docker 工作流采集。'
    const body = kind === 'assert' ? `RESULT: not executed — ${reason}` : `${status.toUpperCase()}: ${id} — ${reason}`
    fs.writeFileSync(file, `---\nstatus: ${status}\ncapturedAt: null\ndockerImage: "${unsupported.has(id) ? 'not-applicable' : 'unresolved'}"\nexitCode: -1\n---\n${body}\n`)
  }
}

console.log(`Initialized ${products.length} SQL Docker evidence directories`)
