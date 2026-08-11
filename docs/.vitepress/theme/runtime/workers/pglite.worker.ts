import { PGlite } from '@electric-sql/pglite';
import { exposeWorker, normalizeRows } from '../workerHost';
import type { EngineInitOptions, EngineStatus } from '../types';

let db: PGlite;
let options: EngineInitOptions;
let status: EngineStatus;

const schemaSql = `
CREATE TABLE IF NOT EXISTS lessons (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  score NUMERIC(5,2) NOT NULL CHECK(score BETWEEN 0 AND 100)
);
CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE, role TEXT NOT NULL, created_at DATE NOT NULL);
CREATE TABLE IF NOT EXISTS courses (id INTEGER PRIMARY KEY, instructor_id INTEGER NOT NULL REFERENCES users(id), title TEXT NOT NULL, level TEXT NOT NULL, published BOOLEAN NOT NULL DEFAULT false);
CREATE TABLE IF NOT EXISTS course_lessons (course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE, lesson_id INTEGER NOT NULL REFERENCES lessons(id) ON DELETE CASCADE, position INTEGER NOT NULL, PRIMARY KEY(course_id, lesson_id));
CREATE TABLE IF NOT EXISTS enrollments (user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE, course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE, enrolled_at DATE NOT NULL, status TEXT NOT NULL, PRIMARY KEY(user_id, course_id));
CREATE TABLE IF NOT EXISTS lesson_progress (user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE, lesson_id INTEGER NOT NULL REFERENCES lessons(id) ON DELETE CASCADE, completed BOOLEAN NOT NULL DEFAULT false, last_position INTEGER NOT NULL DEFAULT 0, updated_at TIMESTAMPTZ NOT NULL, PRIMARY KEY(user_id, lesson_id));
CREATE INDEX IF NOT EXISTS idx_lessons_category ON lessons(category);
CREATE INDEX IF NOT EXISTS idx_courses_instructor ON courses(instructor_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course_status ON enrollments(course_id, status);
CREATE INDEX IF NOT EXISTS idx_progress_lesson_completed ON lesson_progress(lesson_id, completed);`;

const seedSql = `
INSERT INTO users(id, name, email, role, created_at) VALUES
  (1,'林晓','lin@example.test','instructor','2026-01-08'),(2,'Ada','ada@example.test','instructor','2026-01-10'),
  (3,'小陈','chen@example.test','student','2026-02-01'),(4,'Grace','grace@example.test','student','2026-02-03'),(5,'王宁','wang@example.test','student','2026-02-12')
ON CONFLICT DO NOTHING;
INSERT INTO lessons(title, category, score) VALUES
  ('SELECT 与过滤', 'SQL 基础', 88),
  ('JOIN 与关系', 'SQL 基础', 94),
  ('窗口函数', '分析查询', 97),
  ('索引与执行计划', '性能', 91),
  ('事务隔离', '一致性', 96),
  ('CTE 与递归查询', '进阶 SQL', 93),
  ('约束与数据建模', '数据建模', 90),
  ('聚合与分组', 'SQL 基础', 89),
  ('MVCC 原理', '一致性', 95),
  ('查询计划诊断', '性能', 92);
INSERT INTO courses(id, instructor_id, title, level, published) VALUES
  (1,1,'SQL 从入门到进阶','beginner',true),(2,2,'数据库性能实战','advanced',true),
  (3,1,'事务与并发控制','advanced',true),(4,2,'数据建模工作坊','intermediate',false)
ON CONFLICT DO NOTHING;
INSERT INTO course_lessons(course_id, lesson_id, position) VALUES
  (1,1,1),(1,2,2),(2,4,1),(2,3,2),(3,5,1),(4,2,1) ON CONFLICT DO NOTHING;
INSERT INTO enrollments(user_id, course_id, enrolled_at, status) VALUES
  (3,1,'2026-03-01','active'),(3,2,'2026-03-05','active'),(4,1,'2026-03-02','completed'),
  (4,3,'2026-03-08','active'),(5,1,'2026-03-10','paused'),(5,3,'2026-03-11','active') ON CONFLICT DO NOTHING;
INSERT INTO lesson_progress(user_id, lesson_id, completed, last_position, updated_at) VALUES
  (3,1,true,100,'2026-03-12T08:00:00Z'),(3,2,false,54,'2026-03-14T08:00:00Z'),
  (4,1,true,100,'2026-03-04T08:00:00Z'),(4,2,true,100,'2026-03-06T08:00:00Z'),
  (5,1,true,100,'2026-03-13T08:00:00Z') ON CONFLICT DO NOTHING;`;

async function initialize(next: EngineInitOptions) {
  options = next;
  await db?.close();
  let warning: string | undefined;
  let persistenceAvailable = false;
  const workspace = safeWorkspace(options.workspaceId);
  try {
    db = await PGlite.create(options.persistence === 'browser' ? `idb://hello-sql-v1-pglite-${workspace}` : 'memory://');
    persistenceAvailable = options.persistence === 'browser';
  } catch (error) {
    warning = `IndexedDB 文件系统不可用，已降级到内存模式：${messageOf(error)}`;
    db = await PGlite.create('memory://');
  }
  await db.exec(schemaSql);
  const hasLessons = await db.query<{ exists: boolean }>('SELECT EXISTS (SELECT 1 FROM lessons) AS exists');
  if (hasLessons.rows[0]?.exists) {
    await db.exec(seedSql.replace(/INSERT INTO lessons[\s\S]*?;\nINSERT INTO courses/, 'INSERT INTO courses'));
  } else {
    await db.exec(seedSql);
  }
  status = { persistence: persistenceAvailable ? 'browser' : 'memory', persistenceAvailable, warning };
  return status;
}

async function execute(payload: { source: string; maxRows: number }) {
  const started = performance.now();
  const results = await db.exec(payload.source);
  return results.map((result) => {
    const normalized = normalizeRows(result.rows || [], payload.maxRows);
    return {
      ...normalized,
      affectedRows: result.affectedRows,
      elapsedMs: performance.now() - started,
      message: result.rows?.length ? `${result.rows.length} 行结果` : '语句执行成功',
    };
  });
}

async function schema() {
  const result = await db.query<{ table_name: string; column_name: string; data_type: string }>(`
    SELECT table_name, column_name, data_type
    FROM information_schema.columns
    WHERE table_schema='public'
    ORDER BY table_name, ordinal_position`);
  const groups = new Map<string, typeof result.rows>();
  for (const row of result.rows) groups.set(row.table_name, [...(groups.get(row.table_name) || []), row]);
  return [...groups.entries()].map(([name, columns]) => ({
    name,
    type: 'table' as const,
    children: columns.map((column) => ({ name: column.column_name, type: 'column' as const, detail: column.data_type })),
  }));
}

async function reset() {
  await db.exec('TRUNCATE lesson_progress, enrollments, course_lessons, courses, users, lessons RESTART IDENTITY CASCADE');
  await db.exec(seedSql);
  return status;
}

async function importFile(payload: { name: string; bytes: ArrayBuffer }) {
  await db.copyToFS(`/tmp/${safeWorkspace(payload.name)}`, new Uint8Array(payload.bytes));
  return { message: `文件已复制到 PGlite /tmp/${safeWorkspace(payload.name)}` };
}

function safeWorkspace(value: string) {
  return value.replace(/[^a-zA-Z0-9_.-]/g, '-').slice(0, 56) || 'main';
}
function messageOf(error: unknown) { return error instanceof Error ? error.message : String(error); }

exposeWorker({
  init: initialize,
  execute,
  schema,
  reset,
  import: importFile,
  export: async () => {
    const blob = await db.dumpDataDir();
    const bytes = await blob.arrayBuffer();
    return { bytes, type: 'application/gzip' };
  },
  close: () => db?.close(),
});
