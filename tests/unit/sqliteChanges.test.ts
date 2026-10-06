import { DatabaseSync } from 'node:sqlite';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { measureSqliteChanges } from '../../docs/.vitepress/theme/runtime/sqliteChanges';

describe('SQLite execution changes', () => {
  let db: DatabaseSync;
  beforeEach(() => {
    db = new DatabaseSync(':memory:');
    db.exec('CREATE TABLE items(id INTEGER PRIMARY KEY, value TEXT); INSERT INTO items VALUES(1,\'seed\'),(2,\'seed\');');
  });
  afterEach(() => db.close());
  function execute(sql: string) {
    return measureSqliteChanges({ changes: () => Number(db.prepare('SELECT total_changes() AS n').get()!.n) }, () => db.exec(sql));
  }
  it('SELECT excludes all seed and previous writes', () => {
    expect(execute("INSERT INTO items VALUES(3,'new')")).toBe(1);
    expect(execute('SELECT * FROM items')).toBe(0);
  });
  it('counts each INSERT, UPDATE and DELETE independently', () => {
    expect(execute("INSERT INTO items VALUES(3,'new')")).toBe(1);
    expect(execute("UPDATE items SET value='updated' WHERE id <= 2")).toBe(2);
    expect(execute('DELETE FROM items WHERE id=3')).toBe(1);
  });
  it('sums writes across multiple statements', () => {
    expect(execute("INSERT INTO items VALUES(3,'new'); UPDATE items SET value='changed'; SELECT * FROM items;")).toBe(4);
  });
  it('DDL and a write matching no rows return zero', () => {
    expect(execute('CREATE INDEX item_value ON items(value); DELETE FROM items WHERE id=999')).toBe(0);
  });
  it('propagates errors and leaves the next query independent', () => {
    expect(() => execute("INSERT INTO items VALUES(1,'duplicate')")).toThrow();
    expect(execute('SELECT * FROM items')).toBe(0);
  });
  it('reports attempted writes even when the same batch rolls them back', () => {
    expect(execute("BEGIN; INSERT INTO items VALUES(3,'rolled back'); ROLLBACK;")).toBe(1);
    expect(db.prepare('SELECT count(*) AS n FROM items').get()!.n).toBe(2);
  });
});
