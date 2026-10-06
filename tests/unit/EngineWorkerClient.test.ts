import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { EngineWorkerClient } from '../../docs/.vitepress/theme/runtime/EngineWorkerClient';

class FakeWorker {
  static instances: FakeWorker[] = [];
  listeners = new Map<string, (event: any) => void>();
  postMessage = vi.fn();
  terminate = vi.fn();
  constructor() { FakeWorker.instances.push(this); }
  addEventListener(type: string, listener: (event: any) => void) { this.listeners.set(type, listener); }
  reply(ok: boolean, data?: unknown) {
    const request = this.postMessage.mock.calls.at(-1)![0];
    this.listeners.get('message')!({ data: { requestId: request.requestId, ok, data, error: ok ? undefined : 'runtime resource failed' } });
  }
}

describe('worker failure disposal and reconnect', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    FakeWorker.instances = [];
    vi.stubGlobal('window', globalThis);
    vi.stubGlobal('Worker', FakeWorker);
  });
  afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); });

  it('disposes a failed initializer immediately without waiting for close', async () => {
    const client = new EngineWorkerClient('sqlite');
    const init = client.init({ persistence: 'memory', workspaceId: 'main' });
    const rejected = expect(init).rejects.toThrow('runtime resource failed');
    const worker = FakeWorker.instances[0];
    worker.reply(false);
    await rejected;
    client.dispose();
    client.dispose();
    await client.close();
    expect(worker.terminate).toHaveBeenCalledTimes(1);
    expect(worker.postMessage).toHaveBeenCalledTimes(1);
    expect(vi.getTimerCount()).toBe(0);
  });

  it('rejects in-flight requests and never restarts a disposed worker', async () => {
    const client = new EngineWorkerClient('sqlite', 20);
    const rejected = expect(client.listSchema()).rejects.toThrow('运行环境已关闭');
    client.dispose();
    await rejected;
    await vi.advanceTimersByTimeAsync(100);
    expect(FakeWorker.instances).toHaveLength(1);
    expect(vi.getTimerCount()).toBe(0);
    await expect(client.listSchema()).rejects.toThrow('请重新连接');
  });

  it('connects with a fresh worker after failure', async () => {
    const failed = new EngineWorkerClient('sqlite');
    const rejected = expect(failed.init({ persistence: 'memory', workspaceId: 'main' })).rejects.toThrow();
    FakeWorker.instances[0].reply(false);
    await rejected;
    failed.dispose();
    const retry = new EngineWorkerClient('sqlite');
    const init = retry.init({ persistence: 'memory', workspaceId: 'main' });
    FakeWorker.instances[1].reply(true, { ready: true });
    expect(await init).toEqual({ ready: true });
    const schema = retry.listSchema();
    FakeWorker.instances[1].reply(true, [{ name: 'lessons' }]);
    expect(await schema).toEqual([{ name: 'lessons' }]);
    retry.dispose();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('cleans the pending timer if postMessage throws', async () => {
    const client = new EngineWorkerClient('sqlite');
    FakeWorker.instances[0].postMessage.mockImplementation(() => { throw new Error('worker unavailable'); });
    await expect(client.listSchema()).rejects.toThrow('worker unavailable');
    expect(vi.getTimerCount()).toBe(0);
    client.dispose();
  });

  it('cancels timeout recovery when the failed connection is disposed', async () => {
    const client = new EngineWorkerClient('sqlite', 20);
    const rejected = expect(client.init({ persistence: 'memory', workspaceId: 'main' })).rejects.toThrow('初始化超过');
    await vi.advanceTimersByTimeAsync(20);
    await rejected;
    client.dispose();
    await vi.advanceTimersByTimeAsync(100);
    expect(FakeWorker.instances).toHaveLength(2);
    expect(FakeWorker.instances[1].terminate).toHaveBeenCalledTimes(1);
    expect(vi.getTimerCount()).toBe(0);
  });
});
