export const queryExample = `SELECT title, category, score
FROM lessons
WHERE score >= 90
ORDER BY score DESC
LIMIT 10;`;

export const joinExample = `CREATE TABLE IF NOT EXISTS enrollments (
  lesson_id INTEGER,
  learner TEXT,
  completed INTEGER
);
DELETE FROM enrollments;
INSERT INTO enrollments VALUES (1, 'Alice', 1), (2, 'Alice', 1), (3, 'Bob', 0);

SELECT l.category,
       COUNT(e.learner) AS enrollments,
       SUM(CASE WHEN e.completed = 1 THEN 1 ELSE 0 END) AS completed
FROM lessons AS l
LEFT JOIN enrollments AS e ON e.lesson_id = l.id
GROUP BY l.category
ORDER BY enrollments DESC;`;

export const windowExample = `WITH ranked AS (
  SELECT title, category, score,
         DENSE_RANK() OVER (
           PARTITION BY category
           ORDER BY score DESC
         ) AS category_rank
  FROM lessons
)
SELECT * FROM ranked
ORDER BY category, category_rank;`;

export const schemaExample = `CREATE TABLE IF NOT EXISTS learners (
  id INTEGER PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO learners(id, email, display_name)
VALUES (1, 'alice@example.com', 'Alice');

SELECT * FROM learners;`;

export const transactionExample = `BEGIN;
UPDATE lessons SET score = score + 1 WHERE category = 'SQL 基础';
SELECT title, score FROM lessons WHERE category = 'SQL 基础';
ROLLBACK;

SELECT title, score FROM lessons WHERE category = 'SQL 基础';`;

export const explainExample = `CREATE INDEX IF NOT EXISTS idx_lessons_category_score
ON lessons(category, score DESC);

EXPLAIN QUERY PLAN
SELECT title, score
FROM lessons
WHERE category = 'SQL 基础'
ORDER BY score DESC;`;
