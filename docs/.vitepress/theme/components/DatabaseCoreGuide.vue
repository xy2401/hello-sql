<template>
  <article class="database-guide">
    <p class="guide-kicker">CORE CONCEPTS · {{ profile.family }}</p>
    <h1>{{ profile.name }} 核心知识</h1>
    <p class="guide-lead">{{ guide.intro }}</p>

    <section class="learning-goals">
      <h2 id="learning-goals">学完应该能做到</h2>
      <ul><li v-for="goal in guide.goals" :key="goal">{{ goal }}</li></ul>
    </section>

    <h2 id="mental-models">三个必须建立的心智模型</h2>
    <div class="concept-grid">
      <section v-for="(item, index) in guide.concepts" :key="item.title" class="concept-card">
        <span>0{{ index + 1 }}</span>
        <h3 :id="`concept-${index + 1}`" class="ignore-header">{{ item.title }}</h3>
        <p>{{ item.summary }}</p>
        <ul><li v-for="point in item.points" :key="point">{{ point }}</li></ul>
      </section>
    </div>

    <h2 id="engineering-decisions">把知识落到工程决策</h2>
    <div class="decision-grid">
      <section><h3 id="before-modeling" class="ignore-header">建模前</h3><p>先写出访问模式、正确性边界、数据生命周期和故障预算，再决定表、键、索引或分区。</p></section>
      <section><h3 id="before-launch" class="ignore-header">上线前</h3><p>使用接近生产的数据分布与并发压测，记录查询计划、资源水位和恢复时间作为基线。</p></section>
      <section><h3 id="in-production" class="ignore-header">运行中</h3><p>监控延迟分位数、容量增长、后台维护与复制健康；报警必须能映射到可执行处置步骤。</p></section>
    </div>

  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { databaseGuides } from '../data/databaseGuides';
import { databaseProfiles } from '../data/databaseProfiles';

const props = defineProps<{ id: string }>();
const guide = computed(() => databaseGuides[props.id]);
const profile = computed(() => databaseProfiles[props.id]);
</script>

<style scoped>
.database-guide { padding-bottom: 1rem; }
.guide-kicker { margin: 0 0 .35rem; color: var(--vp-c-brand-1); font-size: .72rem; font-weight: 800; letter-spacing: .08em; }
.database-guide h1 { margin-top: 0; font-size: clamp(2rem, 5vw, 3.2rem); }
.guide-lead { max-width: 780px; color: var(--vp-c-text-2); font-size: 1.05rem; line-height: 1.8; }
.learning-goals { margin: 1.5rem 0 2rem; padding: 1rem 1.2rem; border-left: 4px solid var(--vp-c-brand-1); background: var(--sql-panel); }
.learning-goals h2 { margin: 0 0 .5rem; border: 0; font-size: 1rem; }
.learning-goals ul { margin: 0; }
.concept-grid, .decision-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: .8rem; }
.concept-card, .decision-grid section { border: 1px solid var(--vp-c-divider); border-radius: 12px; padding: 1rem; background: var(--vp-c-bg); }
.concept-card > span { color: var(--vp-c-brand-1); font: 800 .72rem/1 ui-monospace, monospace; }
.concept-card h3, .decision-grid h3 { margin: .45rem 0; font-size: .95rem; }
.concept-card p, .decision-grid p { color: var(--vp-c-text-2); font-size: .82rem; line-height: 1.65; }
.concept-card ul { padding-left: 1.1rem; color: var(--vp-c-text-2); font-size: .76rem; }
@media (max-width: 760px) { .concept-grid, .decision-grid { grid-template-columns: 1fr; } }
</style>
