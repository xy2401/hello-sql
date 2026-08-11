import sqlite3InitModule from '@sqlite.org/sqlite-wasm';
import { exposeWorker, normalizeRows } from '../workerHost';
import type { EngineInitOptions, EngineStatus, ExecutionResult } from '../types';

let sqlite3: any;
let db: any;
let poolUtil: any;
let options: EngineInitOptions;
let status: EngineStatus;

const schemaSql = `
PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS lessons (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  score REAL NOT NULL CHECK(score BETWEEN 0 AND 100)
);
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK(role IN ('student', 'instructor')),
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS courses (
  id INTEGER PRIMARY KEY,
  instructor_id INTEGER NOT NULL REFERENCES users(id),
  title TEXT NOT NULL,
  level TEXT NOT NULL,
  published INTEGER NOT NULL DEFAULT 0 CHECK(published IN (0, 1))
);
CREATE TABLE IF NOT EXISTS course_lessons (
  course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  lesson_id INTEGER NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  position INTEGER NOT NULL,
  PRIMARY KEY(course_id, lesson_id)
);
CREATE TABLE IF NOT EXISTS enrollments (
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  enrolled_at TEXT NOT NULL,
  status TEXT NOT NULL CHECK(status IN ('active', 'completed', 'paused')),
  PRIMARY KEY(user_id, course_id)
);
CREATE TABLE IF NOT EXISTS lesson_progress (
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lesson_id INTEGER NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  completed INTEGER NOT NULL DEFAULT 0 CHECK(completed IN (0, 1)),
  last_position INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL,
  PRIMARY KEY(user_id, lesson_id)
);
CREATE INDEX IF NOT EXISTS idx_lessons_category ON lessons(category);
CREATE INDEX IF NOT EXISTS idx_courses_instructor ON courses(instructor_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course_status ON enrollments(course_id, status);
CREATE INDEX IF NOT EXISTS idx_progress_lesson_completed ON lesson_progress(lesson_id, completed);`;

const seedSql = `
INSERT OR IGNORE INTO users(id, name, email, role, created_at) VALUES
  (1, '林晓', 'lin@example.test', 'instructor', '2026-01-08'),
  (2, 'Ada', 'ada@example.test', 'instructor', '2026-01-10'),
  (3, '小陈', 'chen@example.test', 'student', '2026-02-01'),
  (4, 'Grace', 'grace@example.test', 'student', '2026-02-03'),
  (5, '王宁', 'wang@example.test', 'student', '2026-02-12');
INSERT OR IGNORE INTO lessons(id, title, category, score) VALUES
  (1, 'SELECT 与过滤', 'SQL 基础', 88), (2, 'JOIN 与关系', 'SQL 基础', 94),
  (3, '窗口函数', '分析查询', 97), (4, '索引与执行计划', '性能', 91),
  (5, '事务隔离', '一致性', 96), (6, 'CTE 与递归查询', '进阶 SQL', 93),
  (7, '约束与数据建模', '数据建模', 90), (8, '聚合与分组', 'SQL 基础', 89),
  (9, 'MVCC 原理', '一致性', 95), (10, '查询计划诊断', '性能', 92);
INSERT OR IGNORE INTO courses(id, instructor_id, title, level, published) VALUES
  (1, 1, 'SQL 从入门到进阶', 'beginner', 1), (2, 2, '数据库性能实战', 'advanced', 1),
  (3, 1, '事务与并发控制', 'advanced', 1), (4, 2, '数据建模工作坊', 'intermediate', 0);
INSERT OR IGNORE INTO course_lessons(course_id, lesson_id, position) VALUES
  (1,1,1),(1,8,2),(1,2,3),(1,6,4),(2,4,1),(2,10,2),(3,5,1),(3,9,2),(4,7,1);
INSERT OR IGNORE INTO enrollments(user_id, course_id, enrolled_at, status) VALUES
  (3,1,'2026-03-01','active'),(3,2,'2026-03-05','active'),(4,1,'2026-03-02','completed'),
  (4,3,'2026-03-08','active'),(5,1,'2026-03-10','paused'),(5,3,'2026-03-11','active');
INSERT OR IGNORE INTO lesson_progress(user_id, lesson_id, completed, last_position, updated_at) VALUES
  (3,1,1,100,'2026-03-12'),(3,8,1,100,'2026-03-13'),(3,2,0,54,'2026-03-14'),
  (4,1,1,100,'2026-03-04'),(4,8,1,100,'2026-03-05'),(4,2,1,100,'2026-03-06'),
  (5,1,1,100,'2026-03-13'),(5,8,0,35,'2026-03-14');`;

async function initialize(next: EngineInitOptions): Promise<EngineStatus> {
  options = next;
  sqlite3 ||= await sqlite3InitModule({ print: () => undefined, printErr: () => undefined });
  db?.close();
  let warning: string | undefined;
  let persistenceAvailable = false;

  if (options.persistence === 'browser') {
    try {
      poolUtil ||= await sqlite3.installOpfsSAHPoolVfs({
        directory: '/hello-sql-v1-sqlite',
        name: 'hello-sql-opfs-sahpool',
        initialCapacity: 8,
      });
      db = new poolUtil.OpfsSAHPoolDb(`/${safeWorkspace(options.workspaceId)}.sqlite3`, 'c');
      persistenceAvailable = true;
    } catch (error) {
      warning = `OPFS 不可用，已降级到内存模式：${messageOf(error)}`;
      db = new sqlite3.oo1.DB(':memory:', 'ct');
    }
  } else {
    db = new sqlite3.oo1.DB(':memory:', 'ct');
  }

  db.exec(schemaSql);
  db.exec(seedSql);
  status = { persistence: persistenceAvailable ? 'browser' : 'memory', persistenceAvailable, warning };
  return status;
}

function execute(payload: { source: string; maxRows: number }): ExecutionResult[] {
  const started = performance.now();
  const rows: Record<string, unknown>[] = [];
  db.exec({ sql: payload.source, rowMode: 'object', resultRows: rows });
  const normalized = normalizeRows(rows, payload.maxRows);
  return [{
    ...normalized,
    affectedRows: db.changes(true),
    elapsedMs: performance.now() - started,
    message: rows.length ? `${rows.length} 行结果` : '语句执行成功',
  }];
}

function schema() {
  const tables = db.selectObjects(`SELECT name, sql FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name`);
  return tables.map((table: any) => ({
    name: String(table.name),
    type: 'table' as const,
    detail: String(table.sql || ''),
    children: db.selectObjects(`PRAGMA table_info(${quoteIdentifier(String(table.name))})`).map((column: any) => ({
      name: String(column.name),
      type: 'column' as const,
      detail: `${column.type || 'ANY'}${column.pk ? ' · PRIMARY KEY' : ''}${column.notnull ? ' · NOT NULL' : ''}`,
    })),
  }));
}

async function reset() {
  db.exec('DELETE FROM lesson_progress; DELETE FROM enrollments; DELETE FROM course_lessons; DELETE FROM courses; DELETE FROM users; DELETE FROM lessons;');
  db.exec(seedSql);
  return status;
}

async function importDatabase(payload: { bytes: ArrayBuffer }) {
  if (!poolUtil || status.persistence !== 'browser') throw new Error('SQLite 文件导入需要先开启 OPFS 本地工作区');
  const filename = `/${safeWorkspace(options.workspaceId)}.sqlite3`;
  db.close();
  await poolUtil.importDb(filename, new Uint8Array(payload.bytes));
  db = new poolUtil.OpfsSAHPoolDb(filename, 'c');
  return { message: 'SQLite 数据库导入完成' };
}

function exportDatabase() {
  const bytes = sqlite3.capi.sqlite3_js_db_export(db.pointer);
  return { bytes: bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength), type: 'application/vnd.sqlite3' };
}

function safeWorkspace(value: string) {
  return value.replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 48) || 'main';
}

function quoteIdentifier(value: string) {
  return `"${value.replaceAll('"', '""')}"`;
}

function messageOf(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

exposeWorker({
  init: initialize,
  execute,
  schema,
  reset,
  import: importDatabase,
  export: exportDatabase,
  close: () => { db?.close(); db = undefined; },
});
