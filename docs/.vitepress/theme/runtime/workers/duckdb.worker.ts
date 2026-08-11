import * as duckdb from '@duckdb/duckdb-wasm';
import duckdbMvpWasm from '@duckdb/duckdb-wasm/dist/duckdb-mvp.wasm?url';
import duckdbEhWasm from '@duckdb/duckdb-wasm/dist/duckdb-eh.wasm?url';
import duckdbMvpWorker from '@duckdb/duckdb-wasm/dist/duckdb-browser-mvp.worker.js?url';
import duckdbEhWorker from '@duckdb/duckdb-wasm/dist/duckdb-browser-eh.worker.js?url';
import { exposeWorker, normalizeRows } from '../workerHost';

let database: duckdb.AsyncDuckDB;
let connection: duckdb.AsyncDuckDBConnection;
let nestedWorker: Worker;

type SplitWasmManifest = { partCount: number; byteLength: number };

async function materializeDuckDbModule(moduleUrl: string) {
  if (!import.meta.env.PROD) return { url: moduleUrl, revoke: () => {} };

  const manifestResponse = await fetch(`${moduleUrl}.parts.json`);
  if (manifestResponse.status === 404) return { url: moduleUrl, revoke: () => {} };
  if (!manifestResponse.ok) throw new Error(`DuckDB WASM 分片清单加载失败：HTTP ${manifestResponse.status}`);

  const manifest = await manifestResponse.json() as SplitWasmManifest;
  if (!Number.isInteger(manifest.partCount) || manifest.partCount < 1 || manifest.byteLength < 1) {
    throw new Error('DuckDB WASM 分片清单无效');
  }

  const parts = await Promise.all(Array.from({ length: manifest.partCount }, async (_, index) => {
    const response = await fetch(`${moduleUrl}.part${index}`);
    if (!response.ok) throw new Error(`DuckDB WASM 分片 ${index + 1}/${manifest.partCount} 加载失败：HTTP ${response.status}`);
    return response.arrayBuffer();
  }));
  const actualLength = parts.reduce((total, part) => total + part.byteLength, 0);
  if (actualLength !== manifest.byteLength) throw new Error('DuckDB WASM 分片长度校验失败');

  const url = URL.createObjectURL(new Blob(parts, { type: 'application/wasm' }));
  return { url, revoke: () => URL.revokeObjectURL(url) };
}

const seedSql = `
CREATE OR REPLACE TABLE lessons AS
SELECT * FROM (VALUES
  (1, 'SELECT 与过滤', 'SQL 基础', 88.0),
  (2, 'JOIN 与关系', 'SQL 基础', 94.0),
  (3, '窗口函数', '分析查询', 97.0),
  (4, '索引与执行计划', '性能', 91.0),
  (5, '事务隔离', '一致性', 96.0),
  (6, 'CTE 与递归查询', '进阶 SQL', 93.0),
  (7, '约束与数据建模', '数据建模', 90.0),
  (8, '聚合与分组', 'SQL 基础', 89.0),
  (9, 'MVCC 原理', '一致性', 95.0),
  (10, '查询计划诊断', '性能', 92.0)
) AS lessons(id, title, category, score);
CREATE OR REPLACE TABLE users AS SELECT * FROM (VALUES
  (1, '林晓', 'instructor'), (2, 'Ada', 'instructor'), (3, '小陈', 'student'),
  (4, 'Grace', 'student'), (5, '王宁', 'student')
) AS users(id, name, role);
CREATE OR REPLACE TABLE courses AS SELECT * FROM (VALUES
  (1, 1, 'SQL 从入门到进阶', 'beginner', true),
  (2, 2, '数据库性能实战', 'advanced', true),
  (3, 1, '事务与并发控制', 'advanced', true),
  (4, 2, '数据建模工作坊', 'intermediate', false)
) AS courses(id, instructor_id, title, level, published);
CREATE OR REPLACE TABLE course_lessons AS SELECT * FROM (VALUES
  (1,1,1),(1,8,2),(1,2,3),(1,6,4),(2,4,1),(2,10,2),(3,5,1),(3,9,2),(4,7,1)
) AS course_lessons(course_id, lesson_id, position);
CREATE OR REPLACE TABLE enrollments AS SELECT * FROM (VALUES
  (3,1,DATE '2026-03-01','active'),(3,2,DATE '2026-03-05','active'),
  (4,1,DATE '2026-03-02','completed'),(4,3,DATE '2026-03-08','active'),
  (5,1,DATE '2026-03-10','paused'),(5,3,DATE '2026-03-11','active')
) AS enrollments(user_id, course_id, enrolled_at, status);
CREATE OR REPLACE TABLE lesson_progress AS SELECT * FROM (VALUES
  (3,1,true,100),(3,8,true,100),(3,2,false,54),(4,1,true,100),
  (4,8,true,100),(4,2,true,100),(5,1,true,100),(5,8,false,35)
) AS lesson_progress(user_id, lesson_id, completed, last_position);`;

async function initialize() {
  await close();
  const bundles: duckdb.DuckDBBundles = {
    mvp: { mainModule: duckdbMvpWasm, mainWorker: duckdbMvpWorker },
    eh: { mainModule: duckdbEhWasm, mainWorker: duckdbEhWorker },
  };
  const bundle = await duckdb.selectBundle(bundles);
  nestedWorker = new Worker(bundle.mainWorker!);
  database = new duckdb.AsyncDuckDB(new duckdb.VoidLogger(), nestedWorker);
  const moduleAsset = await materializeDuckDbModule(bundle.mainModule);
  try {
    await database.instantiate(moduleAsset.url, bundle.pthreadWorker);
  } finally {
    moduleAsset.revoke();
  }
  connection = await database.connect();
  await connection.query(seedSql);
  return {
    persistence: 'memory',
    persistenceAvailable: false,
    warning: 'DuckDB-Wasm 在 GitHub Pages 兼容档使用单线程内存工作区；可导入本地数据文件。',
  };
}

async function execute(payload: { source: string; maxRows: number }) {
  const started = performance.now();
  const table = await connection.query(payload.source);
  const allRows = table.toArray().map((row: any) => typeof row.toJSON === 'function' ? row.toJSON() : row);
  const normalized = normalizeRows(allRows, payload.maxRows);
  return [{ ...normalized, elapsedMs: performance.now() - started, message: `${allRows.length} 行结果` }];
}

async function schema() {
  const table = await connection.query(`
    SELECT table_name, column_name, data_type
    FROM information_schema.columns
    WHERE table_schema = 'main'
    ORDER BY table_name, ordinal_position`);
  const rows = table.toArray().map((row: any) => row.toJSON());
  const groups = new Map<string, any[]>();
  for (const row of rows) {
    const key = String(row.table_name);
    groups.set(key, [...(groups.get(key) || []), row]);
  }
  return [...groups.entries()].map(([name, columns]) => ({
    name,
    type: 'table' as const,
    children: columns.map((column) => ({ name: String(column.column_name), type: 'column' as const, detail: String(column.data_type) })),
  }));
}

async function importFile(payload: { name: string; bytes: ArrayBuffer }) {
  await database.registerFileBuffer(payload.name, new Uint8Array(payload.bytes));
  return { message: `已注册 ${payload.name}，可使用 read_csv_auto、read_json_auto 或 read_parquet 查询` };
}

async function close() {
  try { await connection?.close(); } catch { /* already closed */ }
  try { await database?.terminate(); } catch { /* already closed */ }
  nestedWorker?.terminate();
}

exposeWorker({
  init: initialize,
  execute,
  schema,
  reset: initialize,
  import: importFile,
  close,
});
