import type { Plugin } from 'vite';

export const CLOUDFLARE_PAGES_MAX_ASSET_BYTES = 25 * 1024 * 1024;
export const DUCKDB_WASM_PART_BYTES = 10 * 1024 * 1024;

function toBytes(source: string | Uint8Array) {
  return typeof source === 'string' ? new TextEncoder().encode(source) : source;
}

export function splitBytes(source: string | Uint8Array, partSize = DUCKDB_WASM_PART_BYTES) {
  if (!Number.isInteger(partSize) || partSize <= 0) throw new Error('partSize must be a positive integer');
  const bytes = toBytes(source);
  const parts: Uint8Array[] = [];
  for (let offset = 0; offset < bytes.byteLength; offset += partSize) {
    parts.push(bytes.slice(offset, Math.min(offset + partSize, bytes.byteLength)));
  }
  return parts;
}

export function splitDuckDbWasm(): Plugin {
  return {
    name: 'hello-sql:split-duckdb-wasm',
    apply: 'build',
    generateBundle(_options, bundle) {
      for (const [fileName, output] of Object.entries(bundle)) {
        if (output.type !== 'asset' || !/duckdb-(?:mvp|eh)-.*\.wasm$/.test(fileName)) continue;
        const bytes = toBytes(output.source);
        if (bytes.byteLength <= CLOUDFLARE_PAGES_MAX_ASSET_BYTES) continue;

        const parts = splitBytes(bytes);
        delete bundle[fileName];
        parts.forEach((source, index) => {
          this.emitFile({ type: 'asset', fileName: `${fileName}.part${index}`, source });
        });
        this.emitFile({
          type: 'asset',
          fileName: `${fileName}.parts.json`,
          source: JSON.stringify({ partCount: parts.length, byteLength: bytes.byteLength }),
        });
      }
    },
  };
}
