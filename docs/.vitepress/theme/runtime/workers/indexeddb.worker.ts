import { exposeWorker, normalizeRows } from '../workerHost';
import type { EngineInitOptions, EngineStatus } from '../types';

let db: IDBDatabase;
let options: EngineInitOptions;
let status: EngineStatus;
let databaseName = '';

async function initialize(next: EngineInitOptions) {
  options = next;
  db?.close();
  databaseName = options.persistence === 'browser'
    ? `hello-sql:v1:indexeddb:${safeWorkspace(options.workspaceId)}`
    : `hello-sql:v1:indexeddb:temporary`;
  if (options.persistence === 'memory') await deleteDatabase(databaseName);
  db = await openDatabase(databaseName);
  await seed();
  status = { persistence: options.persistence, persistenceAvailable: true };
  return status;
}

async function openDatabase(name: string) {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(name, 2);
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains('books')) {
        const books = database.createObjectStore('books', { keyPath: 'isbn' });
        books.createIndex('by_author', 'author');
        books.createIndex('by_rating', 'rating');
      }
      if (!database.objectStoreNames.contains('users')) {
        const users = database.createObjectStore('users', { keyPath: 'id' });
        users.createIndex('by_role', 'role');
        users.createIndex('by_email', 'email', { unique: true });
      }
      if (!database.objectStoreNames.contains('courses')) {
        const courses = database.createObjectStore('courses', { keyPath: 'id' });
        courses.createIndex('by_instructor', 'instructorId');
        courses.createIndex('by_published', 'published');
      }
      if (!database.objectStoreNames.contains('lessons')) {
        const lessons = database.createObjectStore('lessons', { keyPath: 'id' });
        lessons.createIndex('by_course', 'courseId');
        lessons.createIndex('by_category', 'category');
      }
      if (!database.objectStoreNames.contains('enrollments')) {
        const enrollments = database.createObjectStore('enrollments', { keyPath: ['userId', 'courseId'] });
        enrollments.createIndex('by_course_status', ['courseId', 'status']);
        enrollments.createIndex('by_user', 'userId');
      }
      if (!database.objectStoreNames.contains('progress')) {
        const progress = database.createObjectStore('progress', { keyPath: ['userId', 'lessonId'] });
        progress.createIndex('by_lesson', 'lessonId');
        progress.createIndex('by_completed', 'completed');
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    request.onblocked = () => reject(new Error('数据库被其他标签页占用'));
  });
}

async function seed() {
  const stores = ['books', 'users', 'courses', 'lessons', 'enrollments', 'progress'];
  const emptyStores = new Set((await Promise.all(stores.map(async (name) => [name, (await getAll(name)).length] as const))).filter(([, count]) => count === 0).map(([name]) => name));
  if (!emptyStores.size) return;
  const tx = db.transaction([...emptyStores], 'readwrite');
  if (emptyStores.has('books')) for (const book of [
    { isbn: '978-1', title: 'SQL Fundamentals', author: 'Ada', rating: 4.8 },
    { isbn: '978-2', title: 'Database Internals', author: 'Lin', rating: 4.9 },
    { isbn: '978-3', title: 'Local-first Web', author: 'Grace', rating: 4.6 },
    { isbn: '978-4', title: 'Query Optimization', author: 'Ada', rating: 4.7 },
  ]) tx.objectStore('books').put(book);
  if (emptyStores.has('users')) for (const user of [
    { id: 1, name: '林晓', email: 'lin@example.test', role: 'instructor' },
    { id: 2, name: 'Ada', email: 'ada@example.test', role: 'instructor' },
    { id: 3, name: '小陈', email: 'chen@example.test', role: 'student' },
    { id: 4, name: 'Grace', email: 'grace@example.test', role: 'student' },
    { id: 5, name: '王宁', email: 'wang@example.test', role: 'student' },
  ]) tx.objectStore('users').put(user);
  if (emptyStores.has('courses')) for (const course of [
    { id: 1, instructorId: 1, title: 'SQL 从入门到进阶', level: 'beginner', published: true },
    { id: 2, instructorId: 2, title: '数据库性能实战', level: 'advanced', published: true },
    { id: 3, instructorId: 1, title: '事务与并发控制', level: 'advanced', published: true },
    { id: 4, instructorId: 2, title: '数据建模工作坊', level: 'intermediate', published: false },
  ]) tx.objectStore('courses').put(course);
  if (emptyStores.has('lessons')) for (const lesson of [
    { id: 1, courseId: 1, title: 'SELECT 与过滤', category: 'SQL 基础', score: 88 },
    { id: 2, courseId: 1, title: 'JOIN 与关系', category: 'SQL 基础', score: 94 },
    { id: 3, courseId: 1, title: '窗口函数', category: '分析查询', score: 97 },
    { id: 4, courseId: 2, title: '索引与执行计划', category: '性能', score: 91 },
    { id: 5, courseId: 3, title: '事务隔离', category: '一致性', score: 96 },
  ]) tx.objectStore('lessons').put(lesson);
  if (emptyStores.has('enrollments')) for (const enrollment of [
    { userId: 3, courseId: 1, status: 'active', enrolledAt: '2026-03-01' },
    { userId: 3, courseId: 2, status: 'active', enrolledAt: '2026-03-05' },
    { userId: 4, courseId: 1, status: 'completed', enrolledAt: '2026-03-02' },
    { userId: 5, courseId: 3, status: 'active', enrolledAt: '2026-03-11' },
  ]) tx.objectStore('enrollments').put(enrollment);
  if (emptyStores.has('progress')) for (const item of [
    { userId: 3, lessonId: 1, completed: true, lastPosition: 100 },
    { userId: 3, lessonId: 2, completed: false, lastPosition: 54 },
    { userId: 4, lessonId: 1, completed: true, lastPosition: 100 },
    { userId: 4, lessonId: 2, completed: true, lastPosition: 100 },
    { userId: 5, lessonId: 5, completed: false, lastPosition: 35 },
  ]) tx.objectStore('progress').put(item);
  await transactionDone(tx);
}

async function execute(payload: { source: string; maxRows: number }) {
  const logs: string[] = [];
  const started = performance.now();
  const helpers = { getAll, getByIndex, put, remove, count: (storeName = 'books') => requestResult(db.transaction(storeName).objectStore(storeName).count()) };
  const consoleProxy = { log: (...values: unknown[]) => logs.push(values.map(format).join(' ')) };
  const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
  const fn = new AsyncFunction('db', 'helpers', 'console', `'use strict';\n${payload.source}`);
  const value = await fn(db, helpers, consoleProxy);
  const rows = Array.isArray(value) ? value : value === undefined ? [] : [value];
  const normalized = normalizeRows(rows, payload.maxRows);
  return [{
    ...normalized,
    elapsedMs: performance.now() - started,
    message: logs.length ? logs.join('\n') : rows.length ? `${rows.length} 行结果` : '脚本执行成功',
  }];
}

async function getAll(storeName = 'books') {
  return requestResult<any[]>(db.transaction(storeName).objectStore(storeName).getAll());
}
async function getByIndex(indexName: string, value: IDBValidKey) {
  return requestResult<any[]>(db.transaction('books').objectStore('books').index(indexName).getAll(value));
}
async function put(value: unknown, storeName = 'books') {
  const tx = db.transaction(storeName, 'readwrite');
  await requestResult(tx.objectStore(storeName).put(value));
  await transactionDone(tx);
}
async function remove(key: IDBValidKey, storeName = 'books') {
  const tx = db.transaction(storeName, 'readwrite');
  await requestResult(tx.objectStore(storeName).delete(key));
  await transactionDone(tx);
}

function schema() {
  return [...db.objectStoreNames].map((name) => {
    const store = db.transaction(name).objectStore(name);
    return {
      name,
      type: 'store' as const,
      detail: `keyPath: ${String(store.keyPath)}`,
      children: [...store.indexNames].map((indexName) => {
        const index = store.index(indexName);
        return { name: indexName, type: 'index' as const, detail: `keyPath: ${String(index.keyPath)}` };
      }),
    };
  });
}

async function reset() {
  db.close();
  await deleteDatabase(databaseName);
  db = await openDatabase(databaseName);
  await seed();
  return status;
}

async function importJson(payload: { bytes: ArrayBuffer }) {
  const records = JSON.parse(new TextDecoder().decode(payload.bytes));
  const imports = Array.isArray(records) ? { books: records } : records;
  if (!imports || typeof imports !== 'object') throw new Error('IndexedDB 导入文件必须是 JSON 数组或按对象仓库分组的对象');
  const storeNames = Object.keys(imports).filter((name) => db.objectStoreNames.contains(name) && Array.isArray(imports[name]));
  if (!storeNames.length) throw new Error('导入文件没有匹配当前数据库的对象仓库');
  const tx = db.transaction(storeNames, 'readwrite');
  for (const storeName of storeNames) for (const record of imports[storeName]) tx.objectStore(storeName).put(record);
  await transactionDone(tx);
  return { message: `已向 ${storeNames.length} 个对象仓库导入数据` };
}

async function exportJson() {
  const data = Object.fromEntries(await Promise.all([...db.objectStoreNames].map(async (name) => [name, await getAll(name)])));
  const bytes = new TextEncoder().encode(JSON.stringify(data, null, 2));
  return { bytes: bytes.buffer, type: 'application/json' };
}

function requestResult<T>(request: IDBRequest<T>) {
  return new Promise<T>((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
function transactionDone(transaction: IDBTransaction) {
  return new Promise<void>((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
    transaction.onabort = () => reject(transaction.error || new Error('事务已回滚'));
  });
}
function deleteDatabase(name: string) {
  return new Promise<void>((resolve, reject) => {
    const request = indexedDB.deleteDatabase(name);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
    request.onblocked = () => reject(new Error('请关闭其他正在使用该工作区的标签页'));
  });
}
function safeWorkspace(value: string) { return value.replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 48) || 'main'; }
function format(value: unknown) { try { return typeof value === 'string' ? value : JSON.stringify(value); } catch { return String(value); } }

exposeWorker({
  init: initialize,
  execute,
  schema,
  reset,
  import: importJson,
  export: exportJson,
  close: () => db?.close(),
});
