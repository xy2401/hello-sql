<template>
  <span class="database-logo" :style="{ '--database-logo-size': sizeValue }">
    <img
      :src="databaseLogoPath(id)"
      :alt="decorative ? '' : databaseBrands[id].name"
      :aria-hidden="decorative ? 'true' : undefined"
      decoding="async"
    >
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { databaseBrands, databaseLogoPath, type DatabaseBrandId } from '../data/databaseBranding';

const props = withDefaults(defineProps<{
  id: DatabaseBrandId;
  size?: number | string;
  decorative?: boolean;
}>(), {
  size: 28,
  decorative: true,
});

const sizeValue = computed(() => typeof props.size === 'number' ? `${props.size}px` : props.size);
</script>

<style scoped>
.database-logo {
  display: inline-grid;
  flex: 0 0 var(--database-logo-size);
  width: var(--database-logo-size);
  height: var(--database-logo-size);
  place-items: center;
  border: 1px solid var(--sql-line);
  border-radius: 24%;
  background: var(--sql-logo-bg);
  box-shadow: var(--sql-shadow-sm);
  vertical-align: middle;
}
.database-logo img { width: 72%; height: 72%; object-fit: contain; }
</style>
