export type EngineId = 'sqlite' | 'duckdb' | 'pglite' | 'surrealdb' | 'indexeddb';
export type PersistenceMode = 'memory' | 'browser';
export type EditorLanguage = 'sql' | 'javascript' | 'surrealql';
export type ResultTab = 'result' | 'history' | 'capabilities';

export interface EngineCapabilities {
  persistence: boolean;
  persistenceLabel: string;
  importFormats: string[];
  exportFormats: string[];
  explain: boolean;
  transactions: boolean;
  schema: boolean;
}

export interface EngineMetadata {
  id: EngineId;
  label: string;
  runtime: string;
  editorLanguage: EditorLanguage;
  description: string;
  status: 'stable' | 'preview';
  capabilities: EngineCapabilities;
}

export interface EngineInitOptions {
  persistence: PersistenceMode;
  workspaceId: string;
  seedId?: string;
}

export interface QueryColumn {
  name: string;
  type?: string;
}

export interface ExecutionResult {
  columns: QueryColumn[];
  rows: Record<string, unknown>[];
  affectedRows?: number;
  message?: string;
  elapsedMs: number;
  truncated?: boolean;
}

export interface SchemaNode {
  name: string;
  type: 'database' | 'table' | 'store' | 'index' | 'column';
  detail?: string;
  children?: SchemaNode[];
}

export interface EngineStatus {
  persistence: PersistenceMode;
  persistenceAvailable: boolean;
  warning?: string;
}

export interface DatabaseEngineAdapter {
  readonly metadata: EngineMetadata;
  init(options: EngineInitOptions): Promise<EngineStatus>;
  execute(source: string, maxRows?: number): Promise<ExecutionResult[]>;
  listSchema(): Promise<SchemaNode[]>;
  reset(seedId?: string): Promise<EngineStatus>;
  importFile?(file: File): Promise<void>;
  exportDatabase?(): Promise<Blob>;
  close(): Promise<void>;
}

export type WorkerRequestType = 'init' | 'execute' | 'schema' | 'reset' | 'import' | 'export' | 'close';

export interface WorkerRequest {
  requestId: string;
  type: WorkerRequestType;
  payload?: unknown;
}

export interface WorkerResponse {
  requestId: string;
  ok: boolean;
  data?: unknown;
  error?: string;
}
