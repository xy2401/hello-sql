import { engineCatalog } from '../data/engineCatalog';
import type {
  DatabaseEngineAdapter,
  EngineId,
  EngineInitOptions,
  EngineStatus,
  ExecutionResult,
  SchemaNode,
  WorkerResponse,
} from './types';

type Pending = { resolve: (value: unknown) => void; reject: (reason?: unknown) => void; timer: number };

const workerFactories: Record<EngineId, () => Worker> = {
  sqlite: () => new Worker(new URL('./workers/sqlite.worker.ts', import.meta.url), { type: 'module' }),
  duckdb: () => new Worker(new URL('./workers/duckdb.worker.ts', import.meta.url), { type: 'module' }),
  pglite: () => new Worker(new URL('./workers/pglite.worker.ts', import.meta.url), { type: 'module' }),
  surrealdb: () => new Worker(new URL('./workers/surrealdb.worker.ts', import.meta.url), { type: 'module' }),
  indexeddb: () => new Worker(new URL('./workers/indexeddb.worker.ts', import.meta.url), { type: 'module' }),
};

export class EngineWorkerClient implements DatabaseEngineAdapter {
  readonly metadata;
  private worker: Worker;
  private pending = new Map<string, Pending>();
  private initOptions?: EngineInitOptions;

  constructor(readonly engineId: EngineId, private readonly timeoutMs = 15_000) {
    this.metadata = engineCatalog[engineId];
    this.worker = this.createWorker();
  }

  private createWorker() {
    const worker = workerFactories[this.engineId]();
    worker.addEventListener('message', (event: MessageEvent<WorkerResponse>) => {
      const response = event.data;
      const pending = this.pending.get(response.requestId);
      if (!pending) return;
      window.clearTimeout(pending.timer);
      this.pending.delete(response.requestId);
      if (response.ok) pending.resolve(response.data);
      else pending.reject(new Error(response.error || '数据库 Worker 执行失败'));
    });
    worker.addEventListener('error', (event) => this.rejectAll(new Error(event.message || '数据库 Worker 崩溃')));
    return worker;
  }

  private rejectAll(error: Error) {
    for (const pending of this.pending.values()) {
      window.clearTimeout(pending.timer);
      pending.reject(error);
    }
    this.pending.clear();
  }

  private request<T>(type: string, payload?: unknown, transfer: Transferable[] = []): Promise<T> {
    const requestId = crypto.randomUUID();
    const timeoutMs = this.engineId === 'duckdb' && (type === 'init' || type === 'reset')
      ? 90_000
      : this.timeoutMs;
    return new Promise<T>((resolve, reject) => {
      const timer = window.setTimeout(async () => {
        this.pending.delete(requestId);
        const action = type === 'init' || type === 'reset' ? '初始化' : '执行';
        reject(new Error(`${action}超过 ${timeoutMs / 1000} 秒，运行环境已重启`));
        await this.restart();
      }, timeoutMs);
      this.pending.set(requestId, { resolve: resolve as (value: unknown) => void, reject, timer });
      this.worker.postMessage({ requestId, type, payload }, transfer);
    });
  }

  private async restart() {
    this.worker.terminate();
    this.rejectAll(new Error('运行环境已重启'));
    this.worker = this.createWorker();
    if (this.initOptions) await this.request('init', this.initOptions);
  }

  async init(options: EngineInitOptions) {
    this.initOptions = options;
    return this.request<EngineStatus>('init', options);
  }

  execute(source: string, maxRows = 1000) {
    return this.request<ExecutionResult[]>('execute', { source, maxRows });
  }

  listSchema() {
    return this.request<SchemaNode[]>('schema');
  }

  reset(seedId?: string) {
    return this.request<EngineStatus>('reset', { seedId });
  }

  async importFile(file: File) {
    const bytes = await file.arrayBuffer();
    await this.request('import', { name: file.name, bytes }, [bytes]);
  }

  async exportDatabase() {
    const result = await this.request<{ bytes: ArrayBuffer; type: string }>('export');
    return new Blob([result.bytes], { type: result.type });
  }

  async close() {
    try { await this.request('close'); } finally {
      this.worker.terminate();
      this.rejectAll(new Error('运行环境已关闭'));
    }
  }
}
