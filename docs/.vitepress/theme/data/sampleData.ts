export type SampleLanguage = 'javascript' | 'sql';
export type JsonValue = null | boolean | number | string | JsonValue[] | { [key: string]: JsonValue };
export type SampleStatus = 'passed' | 'skipped' | 'failed' | 'not-run';

export interface SampleOperation {
  id: string;
  title: string;
  category: string;
  query: string;
  notes: string[];
  status: SampleStatus;
  operation?: string;
  namespace?: string;
  reason?: string;
  result?: JsonValue;
  inputSha256?: string;
  outputSha256?: string;
}

export interface SampleDataset {
  schemaVersion: 1;
  id: string;
  title: string;
  description: string;
  language: SampleLanguage;
  defaultExampleId?: string;
  source: {
    label: string;
    url: string;
    recordedAt: string;
    engine: string;
    runId?: string;
    repository?: string;
    commit?: string;
    license?: string;
    licenseUrl?: string;
    manifestSha256?: string;
    recordedManifestSha256?: string;
    note?: string;
  };
  examples: SampleOperation[];
}

function object(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/** Validate a portable snapshot before rendering; a missing result is different from null. */
export function parseSampleDataset(value: unknown): SampleDataset {
  if (!object(value) || value.schemaVersion !== 1 || !['javascript', 'sql'].includes(String(value.language))) {
    throw new Error('不支持的示例数据格式或查询语言。');
  }
  for (const key of ['id', 'title', 'description']) {
    if (typeof value[key] !== 'string' || !value[key]) throw new Error(`示例数据缺少 ${key}。`);
  }
  const source = value.source;
  if (!object(source) || !['label', 'url', 'recordedAt', 'engine'].every(key => typeof source[key] === 'string')) {
    throw new Error('示例数据缺少采集来源。');
  }
  for (const key of ['url', 'repository']) {
    if (source[key] && (typeof source[key] !== 'string' || !/^https?:\/\//i.test(source[key] as string))) throw new Error('采集来源必须使用 HTTP(S) 地址。');
  }
  if (source.licenseUrl && (typeof source.licenseUrl !== 'string' || !/^(?:https?:\/\/|\/(?!\/))/i.test(source.licenseUrl as string))) throw new Error('许可地址无效。');
  if (!Array.isArray(value.examples) || !value.examples.length) throw new Error('示例数据没有操作案例。');
  const ids = new Set<string>();
  for (const item of value.examples) {
    if (!object(item) || !['id', 'title', 'category', 'query'].every(key => typeof item[key] === 'string' && item[key])) {
      throw new Error('操作案例缺少名称、分类或查询语句。');
    }
    const id = item.id as string;
    if (ids.has(id)) throw new Error(`操作案例 ID 重复：${id}`);
    ids.add(id);
    if (!Array.isArray(item.notes) || !item.notes.every(note => typeof note === 'string')) throw new Error(`操作备注无效：${id}`);
    if (!['passed', 'skipped', 'failed', 'not-run'].includes(String(item.status))) throw new Error(`采集状态无效：${id}`);
    if (item.status === 'passed' && !Object.hasOwn(item, 'result')) throw new Error(`已采集操作缺少结果：${id}`);
    if (item.status !== 'passed' && Object.hasOwn(item, 'result')) throw new Error(`未通过的操作不能展示成功结果：${id}`);
  }
  if (value.defaultExampleId !== undefined && !ids.has(String(value.defaultExampleId))) throw new Error('默认操作案例不存在。');
  return value as unknown as SampleDataset;
}

export interface SampleTable {
  columns: Array<{ id: string; label: string }>;
  rows: Array<Array<JsonValue | undefined>>;
}

/** Preserve scalars, heterogeneous rows and nested JSON without flattening or coercion. */
export function sampleResultTable(result: JsonValue): SampleTable {
  const values = Array.isArray(result) ? result : [result];
  if (!values.length) return { columns: [], rows: [] };
  const fields = [...new Set(values.flatMap(value => object(value) ? Object.keys(value) : []))];
  const hasValues = !fields.length || values.some(value => !object(value));
  const columns = [
    ...fields.map(key => ({ id: `field:${key}`, label: key || '(空字段)' })),
    ...(hasValues ? [{ id: 'value', label: '值' }] : []),
  ];
  return {
    columns,
    rows: values.map(value => [
      ...fields.map(key => object(value) && Object.hasOwn(value, key) ? value[key] as JsonValue : undefined),
      ...(hasValues ? [!fields.length || !object(value) ? value : undefined] : []),
    ]),
  };
}

export function formatSampleCell(value: JsonValue | undefined): string {
  if (value === undefined) return '—';
  if (typeof value === 'string') return value === '' ? '""' : value;
  return JSON.stringify(value);
}

export const sampleStatusLabels: Record<SampleStatus, string> = {
  passed: '已采集', skipped: '已跳过', failed: '采集失败', 'not-run': '未执行',
};
