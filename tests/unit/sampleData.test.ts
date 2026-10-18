import { describe, expect, it } from 'vitest';
import { formatSampleCell, parseSampleDataset, sampleResultTable } from '../../docs/.vitepress/theme/data/sampleData';

function dataset(language = 'sql', result: unknown = []) {
  return {
    schemaVersion: 1, id: 'example', title: '示例', description: '查询与结果', language,
    source: { label: 'fixture', url: '', recordedAt: '', engine: 'fixture' },
    examples: [{ id: 'query', title: '查询', category: '查询', query: 'SELECT 1;', notes: [], status: 'passed', result }],
  };
}

describe('portable query snapshots', () => {
  it('accepts SQL and JavaScript without requiring MongoDB fields', () => {
    expect(parseSampleDataset(dataset()).language).toBe('sql');
    expect(parseSampleDataset(dataset('javascript', null)).examples[0].result).toBeNull();
    expect(() => parseSampleDataset(dataset('python'))).toThrow(/查询语言/);
  });

  it('distinguishes null and zero results from missing or skipped outputs', () => {
    expect(parseSampleDataset(dataset('sql', 0)).examples[0].result).toBe(0);
    const missing = dataset();
    delete (missing.examples[0] as { result?: unknown }).result;
    expect(() => parseSampleDataset(missing)).toThrow(/缺少结果/);
    const skipped = dataset();
    skipped.examples[0].status = 'skipped';
    expect(() => parseSampleDataset(skipped)).toThrow(/成功结果/);
    delete (skipped.examples[0] as { result?: unknown }).result;
    expect(parseSampleDataset(skipped).examples[0].status).toBe('skipped');
  });

  it('rejects duplicate case IDs before selection becomes ambiguous', () => {
    const value = dataset();
    value.examples.push({ ...value.examples[0] });
    expect(() => parseSampleDataset(value)).toThrow(/重复/);
  });

  it('rejects executable source links from a loaded snapshot', () => {
    const value = dataset();
    value.source.url = 'javascript:alert(1)';
    expect(() => parseSampleDataset(value)).toThrow(/HTTP/);
  });
});

describe('JSON table projection', () => {
  it('shows counters, index names, null and empty arrays without inventing rows', () => {
    expect(sampleResultTable(21349).rows).toEqual([[21349]]);
    expect(sampleResultTable('title_text').rows).toEqual([['title_text']]);
    expect(sampleResultTable(null).rows).toEqual([[null]]);
    expect(sampleResultTable([])).toEqual({ columns: [], rows: [] });
    expect(sampleResultTable({}).rows).toEqual([[{}]]);
  });

  it('unions document fields while preserving nested Extended JSON and absent fields', () => {
    const id = { $oid: '573a1390f29313caabcd446f' };
    const table = sampleResultTable([{ _id: id, title: '电影', genres: ['Drama'] }, { year: 2000 }]);
    expect(table.columns.map(column => column.label)).toEqual(['_id', 'title', 'genres', 'year']);
    expect(table.rows).toEqual([[id, '电影', ['Drama'], undefined], [undefined, undefined, undefined, 2000]]);
    expect(formatSampleCell(id)).toBe('{"$oid":"573a1390f29313caabcd446f"}');
    expect(formatSampleCell(undefined)).toBe('—');
    expect(formatSampleCell(null)).toBe('null');
  });

  it('keeps mixed scalar/document arrays and a real field named value distinct', () => {
    const table = sampleResultTable([{ value: 0 }, false, '', null]);
    expect(table.columns.map(column => column.id)).toEqual(['field:value', 'value']);
    expect(table.rows).toEqual([[0, undefined], [undefined, false], [undefined, ''], [undefined, null]]);
    expect(formatSampleCell('')).toBe('""');
    expect(formatSampleCell(false)).toBe('false');
  });
});
