<template>
  <nav v-if="currentEngine" class="playground-context-nav" aria-label="当前位置">
    <a href="/playground/">← 返回统一工作台</a>
    <span aria-hidden="true">/</span>
    <strong>{{ engineCatalog[currentEngine].label }}</strong>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vitepress';
import { engineCatalog } from '../data/engineCatalog';
import type { EngineId } from '../runtime/types';

const route = useRoute();
const currentEngine = computed<EngineId | undefined>(() => {
  const match = route.path.match(/^\/playground\/(sqlite|duckdb|pglite|surrealdb|indexeddb)\/?$/);
  return match?.[1] as EngineId | undefined;
});
</script>

<style scoped>
.playground-context-nav { display: flex; align-items: center; gap: .55rem; margin: 0 0 1.1rem; border-bottom: 1px solid var(--vp-c-divider); padding: 0 0 .75rem; color: var(--vp-c-text-3); font-size: .76rem; }
.playground-context-nav a { color: var(--vp-c-brand-1); font-weight: 700; text-decoration: none; }
.playground-context-nav a:hover { text-decoration: underline; }
.playground-context-nav strong { color: var(--vp-c-text-2); }
</style>
