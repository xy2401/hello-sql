import { Surreal, createRemoteEngines } from 'surrealdb';
import { createWasmEngines } from '@surrealdb/wasm';
import { exposeWorker, normalizeRows } from '../workerHost';
import type { EngineInitOptions, EngineStatus } from '../types';

let db: Surreal;
let options: EngineInitOptions;
let status: EngineStatus;

const seedStatements = [
  "UPSERT person:lin CONTENT { name: '林晓', email: 'lin@example.test', role: 'instructor' };",
  "UPSERT person:ada CONTENT { name: 'Ada', email: 'ada@example.test', role: 'instructor' };",
  "UPSERT person:chen CONTENT { name: '小陈', email: 'chen@example.test', role: 'student' };",
  "UPSERT person:grace CONTENT { name: 'Grace', email: 'grace@example.test', role: 'student' };",
  "UPSERT person:wang CONTENT { name: '王宁', email: 'wang@example.test', role: 'student' };",
  "UPSERT course:sql CONTENT { title: 'SQL 从入门到进阶', level: 'beginner', instructor: person:lin, published: true };",
  "UPSERT course:performance CONTENT { title: '数据库性能实战', level: 'advanced', instructor: person:ada, published: true };",
  "UPSERT course:transaction CONTENT { title: '事务与并发控制', level: 'advanced', instructor: person:lin, published: true };",
  "UPSERT course:modeling CONTENT { title: '数据建模工作坊', level: 'intermediate', instructor: person:ada, published: false };",
  "UPSERT lesson:select CONTENT { title: 'SELECT 与过滤', category: 'SQL 基础', score: 88, course: course:sql, position: 1 };",
  "UPSERT lesson:aggregate CONTENT { title: '聚合与分组', category: 'SQL 基础', score: 89, course: course:sql, position: 2 };",
  "UPSERT lesson:join CONTENT { title: 'JOIN 与关系', category: 'SQL 基础', score: 94, course: course:sql, position: 3 };",
  "UPSERT lesson:cte CONTENT { title: 'CTE 与递归查询', category: '进阶 SQL', score: 93, course: course:sql, position: 4 };",
  "UPSERT lesson:index CONTENT { title: '索引与执行计划', category: '性能', score: 91, course: course:performance, position: 1 };",
  "UPSERT lesson:plan CONTENT { title: '查询计划诊断', category: '性能', score: 92, course: course:performance, position: 2 };",
  "UPSERT lesson:transaction CONTENT { title: '事务隔离', category: '一致性', score: 96, course: course:transaction, position: 1 };",
  "UPSERT lesson:mvcc CONTENT { title: 'MVCC 原理', category: '一致性', score: 95, course: course:transaction, position: 2 };",
  "UPSERT lesson:model CONTENT { title: '约束与数据建模', category: '数据建模', score: 90, course: course:modeling, position: 1 };",
  "UPSERT lesson:window CONTENT { title: '窗口函数', category: '分析查询', score: 97, course: course:sql, position: 5 };",
  "UPSERT enrollment:chen_sql CONTENT { student: person:chen, course: course:sql, status: 'active', enrolled_at: '2026-03-01' };",
  "UPSERT enrollment:grace_sql CONTENT { student: person:grace, course: course:sql, status: 'completed', enrolled_at: '2026-03-02' };",
  "UPSERT enrollment:wang_transaction CONTENT { student: person:wang, course: course:transaction, status: 'active', enrolled_at: '2026-03-11' };",
  "UPSERT progress:chen_select CONTENT { student: person:chen, lesson: lesson:select, completed: true, last_position: 100 };",
  "UPSERT progress:chen_join CONTENT { student: person:chen, lesson: lesson:join, completed: false, last_position: 54 };",
  "UPSERT progress:grace_join CONTENT { student: person:grace, lesson: lesson:join, completed: true, last_position: 100 };",
];

async function initialize(next: EngineInitOptions) {
  options = next;
  await db?.close();
  let persistenceAvailable = false;
  let warning: string | undefined;
  try {
    const endpoint = options.persistence === 'browser'
      ? `indxdb://hello_sql_v1_surreal_${safeWorkspace(options.workspaceId)}`
      : 'mem://';
    await openAndSeed(endpoint);
    persistenceAvailable = options.persistence === 'browser';
  } catch (error) {
    warning = `SurrealDB IndexedDB 引擎不可用，已降级到内存模式：${messageOf(error)}`;
    await db.close();
    await openAndSeed('mem://');
  }
  status = { persistence: persistenceAvailable ? 'browser' : 'memory', persistenceAvailable, warning };
  return status;
}

async function openAndSeed(endpoint: string) {
  db = new Surreal({ engines: { ...createRemoteEngines(), ...createWasmEngines() } });
  await db.connect(endpoint);
  await db.use({ namespace: 'hello_sql', database: 'learn' });
  const info = await db.query('INFO FOR DB;');
  if (!JSON.stringify(info).includes('enrollment')) await seed();
}

async function execute(payload: { source: string; maxRows: number }) {
  const started = performance.now();
  const response = await db.query(payload.source) as any;
  const resultSets = Array.isArray(response) ? response : [response];
  return resultSets.map((result: any) => {
    const rows = unwrapRows(result);
    const normalized = normalizeRows(rows, payload.maxRows);
    return { ...normalized, elapsedMs: performance.now() - started, message: rows.length ? `${rows.length} 行结果` : '语句执行成功' };
  });
}

async function schema() {
  const response = await db.query('INFO FOR DB;') as any;
  const rows = unwrapRows(Array.isArray(response) ? response[0] : response);
  const info = rows[0] || response?.[0]?.result || response?.result || {};
  const tables = (info as any).tables || {};
  return Object.keys(tables).map((name) => ({ name, type: 'table' as const, detail: String(tables[name]) }));
}

async function reset() {
  for (const table of ['progress', 'enrollment', 'lesson', 'course', 'person']) {
    try { await db.query(`DELETE ${table};`); } catch { /* table is created by the seed below */ }
  }
  await seed();
  return status;
}

async function seed() {
  for (const statement of seedStatements) await db.query(statement);
}

function unwrapRows(result: any): unknown[] {
  if (Array.isArray(result)) return result;
  if (Array.isArray(result?.result)) return result.result;
  return result == null ? [] : [result];
}
function safeWorkspace(value: string) { return value.replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 48) || 'main'; }
function messageOf(error: unknown) { return error instanceof Error ? error.message : String(error); }

exposeWorker({
  init: initialize,
  execute,
  schema,
  reset,
  close: () => db?.close(),
});
