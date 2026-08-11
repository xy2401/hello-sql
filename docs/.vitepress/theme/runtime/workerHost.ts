import type { WorkerRequest, WorkerResponse } from './types';

type Handler = (payload: any) => Promise<unknown> | unknown;

export function exposeWorker(handlers: Record<string, Handler>) {
  const workerScope = self as unknown as {
    addEventListener(type: 'message', listener: (event: MessageEvent<WorkerRequest>) => void): void;
    postMessage(message: WorkerResponse): void;
  };
  workerScope.addEventListener('message', async (event: MessageEvent<WorkerRequest>) => {
    const request = event.data;
    const response: WorkerResponse = { requestId: request.requestId, ok: true };
    try {
      const handler = handlers[request.type];
      if (!handler) throw new Error(`不支持的 Worker 操作：${request.type}`);
      response.data = await handler(request.payload);
    } catch (error) {
      response.ok = false;
      response.error = error instanceof Error ? error.message : String(error);
    }
    workerScope.postMessage(response);
  });
}

export function normalizeRows(rows: unknown[], maxRows = 1000) {
  const normalized = rows.slice(0, maxRows).map((row) => {
    if (row && typeof row === 'object') {
      return Object.fromEntries(Object.entries(row).map(([key, value]) => [key, serializable(value)]));
    }
    return { value: serializable(row) };
  });
  const columns = normalized.length > 0
    ? Object.keys(normalized[0]).map((name) => ({ name }))
    : [];
  return { columns, rows: normalized, truncated: rows.length > maxRows };
}

function serializable(value: unknown): unknown {
  if (typeof value === 'bigint') return value.toString();
  if (value instanceof Uint8Array) return `[Uint8Array ${value.byteLength} bytes]`;
  if (value instanceof Date) return value.toISOString();
  if (value && typeof value === 'object') {
    try { return JSON.parse(JSON.stringify(value)); } catch { return String(value); }
  }
  return value;
}
