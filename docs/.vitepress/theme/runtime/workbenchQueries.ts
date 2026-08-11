import type { EngineId, SchemaNode } from './types';

const SQL_ENGINES: EngineId[] = ['sqlite', 'duckdb', 'pglite'];

export function quoteSqlIdentifier(value: string) {
  return `"${value.replaceAll('"', '""')}"`;
}

export function quoteStringLiteral(value: string) {
  return `'${value.replaceAll('\\', '\\\\').replaceAll("'", "\\'")}'`;
}

export function isQueryableObject(node: SchemaNode) {
  return node.type === 'table' || node.type === 'store';
}

export function buildObjectPreviewSource(engine: EngineId, objectName: string, limit = 100) {
  const safeLimit = Math.max(1, Math.min(1000, Math.trunc(limit) || 100));
  if (SQL_ENGINES.includes(engine)) {
    return `SELECT *\nFROM ${quoteSqlIdentifier(objectName)}\nLIMIT ${safeLimit};`;
  }
  if (engine === 'surrealdb') {
    return `SELECT *\nFROM type::table(${quoteStringLiteral(objectName)})\nLIMIT ${safeLimit};`;
  }
  return `const records = await helpers.getAll(${JSON.stringify(objectName)});\nreturn records.slice(0, ${safeLimit});`;
}
