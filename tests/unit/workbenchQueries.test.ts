import { describe, expect, it } from 'vitest';
import { buildObjectPreviewSource, quoteSqlIdentifier, quoteStringLiteral } from '../../docs/.vitepress/theme/runtime/workbenchQueries';

describe('workbench object query templates', () => {
  it('quotes SQL identifiers for SQLite, DuckDB and PGlite', () => {
    expect(quoteSqlIdentifier('order details')).toBe('"order details"');
    expect(quoteSqlIdentifier('a"b')).toBe('"a""b"');
    for (const engine of ['sqlite', 'duckdb', 'pglite'] as const) {
      expect(buildObjectPreviewSource(engine, 'order details')).toBe('SELECT *\nFROM "order details"\nLIMIT 100;');
    }
  });

  it('uses a SurrealDB table value instead of interpolating an identifier', () => {
    expect(quoteStringLiteral("team's\\archive")).toBe("'team\\'s\\\\archive'");
    expect(buildObjectPreviewSource('surrealdb', 'lesson')).toContain("type::table('lesson')");
  });

  it('quotes IndexedDB store names as JavaScript strings', () => {
    const source = buildObjectPreviewSource('indexeddb', 'books\"archive');
    expect(source).toContain('helpers.getAll("books\\\"archive")');
    expect(source).toContain('slice(0, 100)');
  });

  it('bounds preview sizes', () => {
    expect(buildObjectPreviewSource('sqlite', 'lessons', 5000)).toContain('LIMIT 1000');
    expect(buildObjectPreviewSource('sqlite', 'lessons', 0)).toContain('LIMIT 100');
  });
});
