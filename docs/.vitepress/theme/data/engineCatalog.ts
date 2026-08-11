import type { EngineId, EngineMetadata } from '../runtime/types';

export const engineCatalog: Record<EngineId, EngineMetadata> = {
  sqlite: {
    id: 'sqlite',
    label: 'SQLite WASM',
    runtime: 'SQLite 3 · WebAssembly · OPFS SAH Pool',
    editorLanguage: 'sql',
    description: '最适合学习标准 SQL、事务、索引与单文件嵌入式数据库。',
    status: 'stable',
    capabilities: {
      persistence: true,
      persistenceLabel: 'OPFS',
      importFormats: ['.db', '.sqlite', '.sqlite3'],
      exportFormats: ['.sqlite3'],
      explain: true,
      transactions: true,
      schema: true,
    },
  },
  duckdb: {
    id: 'duckdb',
    label: 'DuckDB-Wasm',
    runtime: 'DuckDB · WebAssembly · Single Thread',
    editorLanguage: 'sql',
    description: '面向浏览器内分析，擅长列式计算以及 CSV、JSON、Parquet 数据。',
    status: 'stable',
    capabilities: {
      persistence: false,
      persistenceLabel: '内存工作区',
      importFormats: ['.csv', '.json', '.parquet'],
      exportFormats: ['.csv', '.json'],
      explain: true,
      transactions: true,
      schema: true,
    },
  },
  pglite: {
    id: 'pglite',
    label: 'PGlite',
    runtime: 'PostgreSQL · WebAssembly · IndexedDB',
    editorLanguage: 'sql',
    description: '在浏览器运行真正的 PostgreSQL 语义，适合验证方言与扩展。',
    status: 'stable',
    capabilities: {
      persistence: true,
      persistenceLabel: 'IndexedDB',
      importFormats: ['.csv'],
      exportFormats: ['PostgreSQL data dir'],
      explain: true,
      transactions: true,
      schema: true,
    },
  },
  surrealdb: {
    id: 'surrealdb',
    label: 'SurrealDB WASM',
    runtime: 'SurrealDB · WebAssembly · IndexedDB',
    editorLanguage: 'surrealql',
    description: '使用 SurrealQL 探索文档、图关系与多模型数据。',
    status: 'stable',
    capabilities: {
      persistence: true,
      persistenceLabel: 'IndexedDB',
      importFormats: [],
      exportFormats: [],
      explain: false,
      transactions: true,
      schema: true,
    },
  },
  indexeddb: {
    id: 'indexeddb',
    label: 'IndexedDB',
    runtime: 'Browser Native · JavaScript · Worker',
    editorLanguage: 'javascript',
    description: '直接学习对象仓库、索引、事务、请求和游标，不伪装成 SQL。',
    status: 'stable',
    capabilities: {
      persistence: true,
      persistenceLabel: '浏览器原生存储',
      importFormats: ['.json'],
      exportFormats: ['.json'],
      explain: false,
      transactions: true,
      schema: true,
    },
  },
};

export const defaultSources: Record<EngineId, string> = {
  sqlite: `SELECT c.title AS course,
       COUNT(DISTINCT e.user_id) AS students,
       COUNT(DISTINCT cl.lesson_id) AS lessons,
       ROUND(AVG(CASE WHEN lp.completed = 1 THEN 100.0 ELSE 0 END), 1) AS completion_rate
FROM courses AS c
LEFT JOIN enrollments AS e ON e.course_id = c.id
LEFT JOIN course_lessons AS cl ON cl.course_id = c.id
LEFT JOIN lesson_progress AS lp
  ON lp.user_id = e.user_id AND lp.lesson_id = cl.lesson_id
WHERE c.published = 1
GROUP BY c.id, c.title
ORDER BY students DESC, c.title;`,
  duckdb: `SELECT c.title AS course,
       COUNT(DISTINCT e.user_id) AS active_students,
       COUNT(DISTINCT cl.lesson_id) AS lesson_count,
       ROUND(AVG(COALESCE(lp.last_position, 0)), 1) AS average_progress
FROM courses AS c
LEFT JOIN enrollments AS e ON e.course_id = c.id
LEFT JOIN course_lessons AS cl ON cl.course_id = c.id
LEFT JOIN lesson_progress AS lp
  ON lp.user_id = e.user_id AND lp.lesson_id = cl.lesson_id
WHERE c.published
GROUP BY c.id, c.title
ORDER BY active_students DESC, average_progress DESC;`,
  pglite: `WITH engagement AS (
  SELECT u.name AS learner, c.title AS course,
         COUNT(*) FILTER (WHERE lp.completed) AS completed_lessons,
         ROUND(AVG(lp.last_position), 1) AS average_progress
  FROM enrollments e
  JOIN users u ON u.id = e.user_id
  JOIN courses c ON c.id = e.course_id
  LEFT JOIN course_lessons cl ON cl.course_id = c.id
  LEFT JOIN lesson_progress lp ON lp.user_id = u.id AND lp.lesson_id = cl.lesson_id
  GROUP BY u.id, u.name, c.id, c.title
)
SELECT *, DENSE_RANK() OVER (ORDER BY average_progress DESC NULLS LAST) AS engagement_rank
FROM engagement
ORDER BY engagement_rank, learner;`,
  surrealdb: `SELECT title, category, score
FROM lesson
ORDER BY score DESC;`,
  indexeddb: `const [users, courses, enrollments] = await Promise.all([
  helpers.getAll('users'),
  helpers.getAll('courses'),
  helpers.getAll('enrollments'),
]);

return enrollments.map(item => ({
  learner: users.find(user => user.id === item.userId)?.name,
  course: courses.find(course => course.id === item.courseId)?.title,
  status: item.status,
  enrolledAt: item.enrolledAt,
}));`,
};

export const engineOrder: EngineId[] = ['sqlite', 'duckdb', 'pglite', 'surrealdb', 'indexeddb'];
