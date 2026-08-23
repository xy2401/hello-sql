<template>
  <div v-if="currentProduct" class="database-sidebar-explorer">
    <section class="database-sidebar-product-list">
      <div v-for="item in products" :key="item.id" class="database-sidebar-product" :class="{ active: isProductActive(item.link) }">
        <div class="database-sidebar-row">
          <a :href="`${item.link}/`"><DatabaseLogo :id="item.id" :size="24" /><strong>{{ item.name }}</strong></a>
          <button type="button" :aria-expanded="Boolean(expanded[item.id])" :aria-label="`${item.name} 展开页面`" @click="expanded[item.id] = !expanded[item.id]">›</button>
        </div>
        <ul v-if="expanded[item.id]">
          <li v-for="page in productPages" :key="page.suffix"><a :class="{ active: isPageActive(`${item.link}${page.suffix}`) }" :href="`${item.link}${page.suffix}`">{{ page.text }}</a></li>
        </ul>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import { useRoute } from 'vitepress';
import { allDatabases } from '../data/databaseNavigation';
import DatabaseLogo from './DatabaseLogo.vue';

const route = useRoute();
const expanded = reactive<Record<string, boolean>>({});
const productPages = [
  { text: '概览', suffix: '/' },
  { text: '核心知识', suffix: '/core-concepts' },
  { text: '版本演进', suffix: '/versions' },
];

function normalize(path: string) { return path.length > 1 ? path.replace(/\/$/, '') : path; }
const currentProduct = computed(() => allDatabases.find((item) => {
  const path = normalize(route.path);
  return path === item.link || path.startsWith(`${item.link}/`);
}));
const products = computed(() => currentProduct.value ? [currentProduct.value] : []);

watch(currentProduct, (item) => {
  if (item) expanded[item.id] = true;
}, { immediate: true });

function isPageActive(path: string) { return normalize(route.path) === normalize(path); }
function isProductActive(link: string) { return normalize(route.path) === link || route.path.startsWith(`${link}/`); }
</script>

<style scoped>
.database-sidebar-explorer { width: calc(var(--vp-sidebar-width) - 64px); padding-top: 10px; }
.database-sidebar-group + .database-sidebar-group { margin-top: 1.2rem; border-top: 1px solid var(--vp-c-divider); padding-top: 1rem; }
.database-sidebar-heading { display: block; margin-bottom: .45rem; color: var(--vp-c-text-1); font-size: .84rem; font-weight: 800; }
.database-sidebar-heading.active { color: var(--vp-c-brand-1); }
.database-sidebar-product { margin: .18rem 0; border-radius: .48rem; }
.database-sidebar-product.active { background: var(--vp-c-bg-soft); }
.database-sidebar-row { display: grid; grid-template-columns: minmax(0, 1fr) 1.8rem; align-items: center; }
.database-sidebar-row > a { display: flex; min-width: 0; align-items: center; gap: .5rem; padding: .35rem; color: var(--vp-c-text-2); }
.database-sidebar-row strong { overflow: hidden; font-size: .73rem; text-overflow: ellipsis; white-space: nowrap; }
button { border: 0; background: transparent; color: var(--vp-c-text-3); cursor: pointer; font-size: 1.1rem; transition: transform .2s; }
button:hover { color: var(--vp-c-brand-1); }
button[aria-expanded="true"] { transform: rotate(90deg); }
ul { margin: .1rem 0 .4rem 2.15rem; border-left: 1px solid var(--vp-c-divider); padding: 0 0 0 .5rem; list-style: none; }
li { margin: 0; }
li a { display: block; border-radius: .3rem; padding: .28rem .35rem; color: var(--vp-c-text-3); font-size: .65rem; }
li a:hover, li a.active { background: var(--vp-c-brand-soft); color: var(--vp-c-brand-1); }
</style>
