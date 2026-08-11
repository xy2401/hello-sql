<template>
  <div v-if="isPlayground" class="playground-sidebar-explorer">
    <div class="sidebar-heading">
      <div><strong>数据库</strong><small>{{ engineIds.length }} 个本地引擎</small></div>
      <button type="button" :disabled="state.busy" aria-label="刷新数据库对象" @click="refreshSidebarSchema">↻</button>
    </div>

    <section v-for="id in engineIds" :key="id" class="sidebar-database" :class="{ active: id === state.activeEngine }">
      <div class="database-row">
        <button class="database-name" type="button" :disabled="state.busy && id !== state.activeEngine" @click="activateEngine(id)">
          <span>▰</span><span><strong>{{ engineCatalog[id].label }}</strong><small>{{ engineCatalog[id].editorLanguage.toUpperCase() }}</small></span>
        </button>
        <button class="database-caret" type="button" :aria-expanded="expanded[id]" :aria-label="`${engineCatalog[id].label} 展开数据库`" @click="expanded[id] = !expanded[id]">›</button>
      </div>

      <div v-if="expanded[id] && id === state.activeEngine" class="database-children">
        <p v-if="state.busy && !state.ready">正在连接…</p>
        <p v-else-if="state.message" class="warning">{{ state.message }}</p>
        <p v-else-if="!state.schema.length">暂无数据对象</p>
        <details v-for="node in state.schema" v-else :key="`${node.type}:${node.name}`" :open="state.selectedNode?.name === node.name">
          <summary :class="{ selected: state.selectedNode?.name === node.name }" @click="selectSidebarNode(node)">
            <span>{{ node.type === 'store' ? '◇' : '▦' }}</span><strong>{{ node.name }}</strong>
          </summary>
          <ul v-if="node.children?.length">
            <li v-for="child in node.children" :key="`${child.type}:${child.name}`"><span>{{ child.type === 'index' ? '⌁' : '└' }}</span><span><strong>{{ child.name }}</strong><small>{{ child.detail || child.type }}</small></span></li>
          </ul>
          <p v-else>没有字段或索引元数据</p>
        </details>
      </div>
    </section>

    <div class="sidebar-links"><a href="/playground/catalog">WASM 成熟度目录</a></div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import { useRoute } from 'vitepress';
import { engineCatalog, engineOrder } from '../data/engineCatalog';
import { refreshSidebarSchema, selectSidebarEngine, selectSidebarNode, workbenchSidebarState as state } from '../runtime/workbenchSidebar';
import type { EngineId } from '../runtime/types';

const route = useRoute();
const isPlayground = computed(() => route.path.startsWith('/playground/') && route.path !== '/playground/catalog');
const engineIds = computed(() => state.allowEngineSwitch ? engineOrder : [state.activeEngine]);
const expanded = reactive<Record<EngineId, boolean>>({ sqlite: true, duckdb: false, pglite: false, surrealdb: false, indexeddb: false });

watch(() => state.activeEngine, (id) => { expanded[id] = true; });
function activateEngine(id: EngineId) {
  expanded[id] = true;
  void selectSidebarEngine(id);
}
</script>

<style scoped>
.playground-sidebar-explorer { width: calc(var(--vp-sidebar-width) - 64px); padding-top: 10px; }
.sidebar-heading { display: flex; align-items: center; justify-content: space-between; margin-bottom: .7rem; }
.sidebar-heading > div { display: grid; }
.sidebar-heading strong { font-size: .88rem; }
.sidebar-heading small { color: var(--vp-c-text-3); font-size: .65rem; }
button { border: 0; background: transparent; color: var(--vp-c-text-2); cursor: pointer; }
button:hover:not(:disabled) { color: var(--vp-c-brand-1); }
button:disabled { cursor: wait; opacity: .55; }
.sidebar-heading button { width: 1.8rem; height: 1.8rem; border: 1px solid var(--vp-c-divider); border-radius: .4rem; }
.sidebar-database { margin-bottom: .2rem; border-radius: .45rem; }
.sidebar-database.active { background: var(--vp-c-bg-soft); }
.database-row { display: grid; grid-template-columns: minmax(0, 1fr) 1.8rem; align-items: center; }
.database-name { display: grid; grid-template-columns: 1rem minmax(0, 1fr); align-items: center; gap: .35rem; padding: .42rem .35rem; text-align: left; }
.database-name > span:first-child { color: var(--vp-c-brand-1); font-size: .65rem; }
.database-name > span:last-child { display: grid; min-width: 0; }
.database-name strong { overflow: hidden; color: var(--vp-c-text-1); font-size: .75rem; text-overflow: ellipsis; white-space: nowrap; }
.database-name small { color: var(--vp-c-text-3); font-size: .56rem; }
.database-caret { font-size: 1.15rem; transition: transform .2s; }
.database-caret[aria-expanded="true"] { transform: rotate(90deg); }
.database-children { margin: 0 .25rem .35rem 1.1rem; border-left: 1px solid var(--vp-c-divider); padding-left: .45rem; }
.database-children > p, .database-children details > p { margin: 0; padding: .45rem .25rem; color: var(--vp-c-text-3); font-size: .62rem; }
.database-children p.warning { color: #b45309; }
.database-children summary { display: grid; grid-template-columns: .9rem minmax(0, 1fr); gap: .2rem; border-radius: .3rem; padding: .34rem .25rem; cursor: pointer; list-style: none; }
.database-children summary:hover, .database-children summary.selected { background: var(--vp-c-brand-soft); color: var(--vp-c-brand-1); }
.database-children summary strong { overflow: hidden; font-size: .69rem; text-overflow: ellipsis; white-space: nowrap; }
.database-children ul { margin: .1rem 0 .25rem; padding: 0 0 0 .65rem; list-style: none; }
.database-children li { display: grid; grid-template-columns: .7rem minmax(0, 1fr); gap: .2rem; margin: .16rem 0; color: var(--vp-c-text-3); font-size: .59rem; }
.database-children li > span:last-child { display: grid; min-width: 0; }
.database-children li strong, .database-children li small { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.database-children li strong { color: var(--vp-c-text-2); }
.sidebar-links { margin-top: .8rem; border-top: 1px solid var(--vp-c-divider); padding-top: .7rem; }
.sidebar-links a { color: var(--vp-c-text-2); font-size: .72rem; font-weight: 650; }
</style>
