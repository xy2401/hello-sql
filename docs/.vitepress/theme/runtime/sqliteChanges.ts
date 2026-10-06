/** Counts writes performed by this execution, excluding seed data and earlier queries.
 * SQLite includes trigger/cascade writes and writes later rolled back in this counter.
 */
export function measureSqliteChanges(db: { changes(total: boolean): number }, execute: () => void): number {
  const before = db.changes(true);
  execute();
  return db.changes(true) - before;
}
