#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const catalogSource = fs.readFileSync(path.join(root, 'docs/.vitepress/theme/data/dockerCatalog.ts'), 'utf8')
const navigationSource = fs.readFileSync(path.join(root, 'docs/.vitepress/theme/data/databaseNavigation.ts'), 'utf8')
const envSource = fs.readFileSync(path.join(root, '.env.versions'), 'utf8')
const runnerSource = fs.readFileSync(path.join(root, 'scripts/run-database-session.js'), 'utf8')
const collectorSource = fs.readFileSync(path.join(root, 'scripts/collect-docker-catalog.js'), 'utf8')
const failures = []

const databaseBlock = navigationSource.match(/export const allDatabases = \[([\s\S]*?)\] as const/)?.[1] || ''
const expected = [...databaseBlock.matchAll(/\bid:\s*['"]([^'"]+)['"]/g)].map((match) => match[1])
const specBlock = catalogSource.match(/const specs = \{([\s\S]*?)\n\} satisfies Record/)?.[1] || ''

if (expected.length !== 25) failures.push(`databaseNavigation must expose 25 products, got ${expected.length}`)
if (!catalogSource.includes("import { allDatabases } from './databaseNavigation'")) failures.push('Docker catalog must reuse databaseNavigation/allDatabases')
if (!catalogSource.includes('allDatabases.map((product)')) failures.push('Docker catalog must be derived from allDatabases')
if (!catalogSource.includes('satisfies Record<DatabaseBrandId, DockerProductSpec>')) failures.push('Docker specs must be exhaustive for DatabaseBrandId')
for (const declaration of ['DockerImageRef', 'DockerCatalogEntry', 'DockerEvidenceStatus']) {
  if (!catalogSource.includes(`interface ${declaration}`) && !catalogSource.includes(`type ${declaration}`)) failures.push(`missing unified type ${declaration}`)
}

for (const id of expected) {
  const key = id.includes('-') ? `['"]${id}['"]\\s*:` : `\\b${id}\\s*:`
  if (!new RegExp(key).test(specBlock)) failures.push(`Docker specs missing ${id}`)
  for (const kind of ['inventory', 'session', 'assert']) {
    const file = path.join(root, 'demos', id, 'docker', `${kind}.out.txt`)
    if (!fs.existsSync(file)) {
      failures.push(`missing demos/${id}/docker/${kind}.out.txt`)
      continue
    }
    const snapshot = fs.readFileSync(file, 'utf8')
    const status = snapshot.match(/^status:\s*(\w+)/m)?.[1]
    if (!['verified', 'partial', 'documented', 'unsupported'].includes(status)) failures.push(`${id}/${kind} has invalid evidence status`)
    if (status === 'verified') {
      if (!/^dockerImage:\s*["']?.+@sha256:/m.test(snapshot)) failures.push(`${id}/${kind} verified evidence lacks tag+digest`)
      if (!/^exitCode:\s*0$/m.test(snapshot)) failures.push(`${id}/${kind} verified evidence lacks successful exit code`)
      if (/^capturedAt:\s*null$/m.test(snapshot)) failures.push(`${id}/${kind} verified evidence lacks capture time`)
    }
  }
}

for (const line of envSource.split(/\r?\n/)) {
  if (!/^[A-Z][A-Z0-9_]*_TAG=/.test(line)) continue
  const value = line.slice(line.indexOf('=') + 1)
  if (!/:[^:@]+$/.test(value)) failures.push(`version seed must use an explicit tag: ${line}`)
  if (/(^|:)latest$|edge|nightly/i.test(value)) failures.push(`floating tag forbidden: ${line}`)
}

if (!/browser:\s*\{[\s\S]{0,160}mode:\s*'browser'[\s\S]{0,160}status:\s*'unsupported'/.test(catalogSource)) failures.push('Browser Database must remain explicit unsupported Docker exception')
for (const cloud of ['snowflake', 'bigquery']) {
  if (!new RegExp(`${cloud}:\\s*\\{[\\s\\S]{0,160}mode:\\s*'cloud'[\\s\\S]{0,160}status:\\s*'documented'`).test(catalogSource)) failures.push(`${cloud} must remain a documented cloud entry`)
}
if (!fs.existsSync(path.join(root, 'docs/matrix/docker-tools.md'))) failures.push('missing Docker matrix')
for (const command of [
  'psql -h 127.0.0.1 -U postgres',
  'mysql -h 127.0.0.1 -uroot --protocol=tcp',
  'mariadb -h 127.0.0.1 -uroot --protocol=tcp',
  '--listen-addr=127.0.0.1:26257',
  '--advertise-addr=127.0.0.1:26257',
  '/opt/cassandra/bin/cqlsh',
]) {
  if (!runnerSource.includes(command)) failures.push(`database runner missing stable readiness constraint: ${command}`)
}
for (const [name, source] of [['database runner', runnerSource], ['catalog collector', collectorSource]]) {
  if (source.includes("'sh', '-lc'")) failures.push(`${name} must preserve image PATH by using sh -c, not a login shell`)
}

if (failures.length) {
  console.error(failures.join('\n'))
  process.exit(1)
}
console.log('[docker-catalog] 25 database products derived from databaseNavigation; evidence and explicit exceptions validated')
