import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

// Manual import only: the SQL site's build never reads a sibling repository.
const project = fileURLToPath(new URL('../', import.meta.url));
const args = process.argv.slice(2);
if (args.length !== 1) throw new Error('Usage: node scripts/sync-mongodb-samples.mjs <mongo-samples-directory>');
const sourceRoot = fs.realpathSync(path.resolve(args[0]));
function sourceFile(relative) {
  if (typeof relative !== 'string' || path.isAbsolute(relative)) throw new Error(`Invalid source path: ${relative}`);
  const file = fs.realpathSync(path.resolve(sourceRoot, relative));
  if (!file.toLowerCase().startsWith((sourceRoot + path.sep).toLowerCase()) || !fs.statSync(file).isFile()) throw new Error(`Source path escapes dataset: ${relative}`);
  return file;
}
const read = relative => fs.readFileSync(sourceFile(relative), 'utf8');
const json = relative => JSON.parse(read(relative));
const hash = relative => crypto.createHash('sha256').update(fs.readFileSync(sourceFile(relative))).digest('hex');
const meta = json('meta.json');
const summary = json(meta.summary);
const provenance = json(meta.sourceManifest);
const notes = JSON.parse(fs.readFileSync(path.join(project, 'scripts/sample-data/mongodb-notes.json'), 'utf8'));
if (meta.runtime !== 'mongosh' || meta.outputFormat !== 'mongodb-extended-json' || summary.status !== 'completed') throw new Error('Expected completed MongoDB snapshots.');
if (meta.files.length !== summary.cases.length) throw new Error('Manifest and recorded case counts differ.');
for (const [file, expected] of Object.entries(summary.runtimeSha256)) {
  if (hash(file) !== expected) throw new Error(`Runtime changed since recording: ${file}`);
}
if (hash(meta.runScript) !== summary.runnerSha256 || hash(meta.sourceManifest) !== summary.provenance.sha256) throw new Error('Runner or provenance no longer matches recording.');
const ids = new Set();
const examples = meta.files.map(item => {
  if (ids.has(item.id)) throw new Error(`Duplicate case: ${item.id}`);
  ids.add(item.id);
  const record = summary.cases.find(value => value.id === item.id);
  if (!record || record.input !== path.basename(item.input) || !notes[item.id]) throw new Error(`Missing recording or notes: ${item.id}`);
  if (hash(item.input) !== record.inputSha256) throw new Error(`Input hash mismatch: ${item.id}`);
  const example = {
    id: item.id, title: item.title, ...notes[item.id], query: read(item.input),
    status: record.status, operation: item.operation,
    namespace: item.database === 'temporary' ? '临时练习库' : item.database,
    inputSha256: record.inputSha256,
  };
  if (record.status === 'passed') {
    if (record.output !== path.basename(item.output) || hash(item.output) !== record.outputSha256) throw new Error(`Output hash mismatch: ${item.id}`);
    example.result = json(item.output);
    example.outputSha256 = record.outputSha256;
  } else {
    example.reason = record.reason || record.error?.message || '本次采集未生成成功结果。';
  }
  return example;
});
const bundle = {
  schemaVersion: 1, id: meta.id, title: 'MFlix 示例数据操作', language: 'javascript',
  description: '电影与评论样例的查询、新增、修改、删除、聚合和索引操作。',
  defaultExampleId: '01-list-movies',
  source: {
    label: 'Hello Docker · MongoDB MFlix',
    url: 'https://github.com/xy2401/hello-docker/tree/codex/hello-docker/compose/mongo-samples',
    recordedAt: summary.generatedAt, engine: `MongoDB ${summary.database.version} · mongosh ${summary.cases[0].mongoshVersion}`,
    runId: summary.runId, repository: provenance.repository, commit: provenance.commit,
    license: provenance.license, licenseUrl: '/sample-data/mongodb.LICENSE',
    manifestSha256: hash('meta.json'), recordedManifestSha256: summary.metaSha256,
    note: '案例清单已更名；历史记录保留原清单哈希。所有输入、已有结果和运行脚本均已按原始记录核对。',
  },
  examples,
};
const output = path.join(project, 'docs/public/sample-data');
fs.mkdirSync(output, { recursive: true });
fs.writeFileSync(path.join(output, 'mongodb.json'), JSON.stringify(bundle, null, 2) + '\n');
fs.copyFileSync(sourceFile(meta.licenseFile), path.join(output, 'mongodb.LICENSE'));
console.log(JSON.stringify({ examples: examples.length, results: examples.filter(item => item.status === 'passed').length, skipped: examples.filter(item => item.status === 'skipped').length, output: 'docs/public/sample-data/mongodb.json' }));
