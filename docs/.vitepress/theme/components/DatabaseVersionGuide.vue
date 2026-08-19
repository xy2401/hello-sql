<template>
  <article class="database-guide">
    <p class="guide-kicker">RELEASES & UPGRADES · 核对日期 2026-08-11</p>
    <h1>{{ profile.name }} 版本演进</h1>
    <p class="guide-lead">{{ guide.versionModel }}</p>

    <div class="version-timeline">
      <section v-for="(item, index) in guide.versions" :key="item.line" class="version-entry">
        <div class="timeline-marker"><span>{{ index + 1 }}</span></div>
        <div>
          <h2>{{ item.line }}</h2>
          <ul><li v-for="change in item.changes" :key="change">{{ change }}</li></ul>
          <p><strong>工程影响：</strong>{{ item.impact }}</p>
        </div>
      </section>
    </div>

    <h2>升级检查清单</h2>
    <ol class="upgrade-list"><li v-for="item in guide.upgradeFocus" :key="item">{{ item }}</li></ol>

    <div class="source-callout">
      <div><strong>官方发布说明是最终依据</strong><p>补丁号、支持期、预览功能和许可会持续变化。部署前重新核对官方说明，不根据本文标题判断“最新版本”。</p></div>
      <a :href="guide.officialReleaseNotes" target="_blank" rel="noreferrer">查看 {{ profile.name }} 官方发布说明 ↗</a>
    </div>

    <nav class="topic-nav" aria-label="数据库专题导航">
      <a href="./core-concepts">← 核心知识</a>
      <a href="./">返回 {{ profile.name }} 概览 →</a>
    </nav>
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
.version-timeline { margin: 2rem 0; }
.version-entry { display: grid; grid-template-columns: 2.2rem minmax(0, 1fr); gap: .8rem; position: relative; padding-bottom: 1.5rem; }
.version-entry:not(:last-child)::before { position: absolute; top: 2rem; bottom: 0; left: 1rem; width: 1px; background: var(--vp-c-divider); content: ''; }
.timeline-marker span { display: grid; width: 2rem; height: 2rem; place-items: center; border-radius: 50%; background: var(--vp-c-brand-1); color: var(--sql-on-accent); font-size: .72rem; font-weight: 800; }
.version-entry h2 { margin: .2rem 0 .55rem; border: 0; padding: 0; font-size: 1.05rem; }
.version-entry ul { margin: 0 0 .55rem; }
.version-entry p { margin: 0; padding: .65rem .8rem; border-radius: 8px; background: var(--sql-panel); color: var(--vp-c-text-2); font-size: .82rem; }
.upgrade-list { display: grid; gap: .55rem; padding-left: 1.5rem; }
.upgrade-list li { padding: .55rem .7rem; border: 1px solid var(--vp-c-divider); border-radius: 8px; }
.source-callout { display: flex; align-items: center; justify-content: space-between; gap: 1rem; margin-top: 1.5rem; padding: 1rem; border: 1px solid var(--vp-c-brand-1); border-radius: 12px; background: var(--sql-panel); }
.source-callout p { margin: .25rem 0 0; color: var(--vp-c-text-2); font-size: .78rem; }
.source-callout a { flex: 0 0 auto; padding: .55rem .7rem; border-radius: 8px; background: var(--vp-c-brand-1); color: var(--sql-on-accent); font-size: .78rem; font-weight: 700; }
.topic-nav { display: flex; justify-content: space-between; gap: 1rem; margin-top: 2rem; padding-top: 1rem; border-top: 1px solid var(--vp-c-divider); }
@media (max-width: 760px) { .source-callout { align-items: flex-start; flex-direction: column; } .topic-nav { align-items: flex-start; flex-direction: column; } }
</style>
