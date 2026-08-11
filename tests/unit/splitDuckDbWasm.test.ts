import { describe, expect, it } from 'vitest';
import { DUCKDB_WASM_PART_BYTES, splitBytes } from '../../docs/.vitepress/plugins/splitDuckDbWasm';

describe('DuckDB WASM asset splitting', () => {
  it('keeps production parts at 10 MiB for comfortable hosting headroom', () => {
    expect(DUCKDB_WASM_PART_BYTES).toBe(10 * 1024 * 1024);
  });

  it('splits and reconstructs a binary asset without changing bytes', () => {
    const source = Uint8Array.from({ length: 45 }, (_, index) => index);
    const parts = splitBytes(source, 20);

    expect(parts.map((part) => part.byteLength)).toEqual([20, 20, 5]);
    expect(Uint8Array.from(parts.flatMap((part) => [...part]))).toEqual(source);
  });

  it('rejects invalid part sizes', () => {
    expect(() => splitBytes(new Uint8Array([1]), 0)).toThrow('positive integer');
  });
});
