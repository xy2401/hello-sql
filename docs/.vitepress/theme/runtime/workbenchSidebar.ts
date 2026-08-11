import { reactive } from 'vue';
import type { EngineId, SchemaNode } from './types';

interface SidebarController {
  selectEngine(id: EngineId): void | Promise<void>;
  selectNode(node: SchemaNode): void;
  refresh(): void | Promise<void>;
}

export const workbenchSidebarState = reactive({
  connected: false,
  allowEngineSwitch: false,
  activeEngine: 'sqlite' as EngineId,
  schema: [] as SchemaNode[],
  selectedNode: undefined as SchemaNode | undefined,
  ready: false,
  busy: false,
  message: '',
});

let controller: SidebarController | undefined;

export function connectWorkbenchSidebar(next: SidebarController) {
  controller = next;
  workbenchSidebarState.connected = true;
  return () => {
    if (controller === next) controller = undefined;
    workbenchSidebarState.connected = false;
  };
}

export function selectSidebarEngine(id: EngineId) { return controller?.selectEngine(id); }
export function selectSidebarNode(node: SchemaNode) { return controller?.selectNode(node); }
export function refreshSidebarSchema() { return controller?.refresh(); }
