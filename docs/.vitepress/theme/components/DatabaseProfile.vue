<template>
  <article v-if="profile" class="database-profile">
    <section class="profile-hero">
      <div class="profile-heading">
        <DatabaseLogo :id="profile.id" :size="58" />
        <div><span class="profile-kicker">{{ profile.family }}</span><h1>{{ profile.name }}</h1></div>
      </div>
      <p>{{ profile.positioning }}</p>
      <div class="profile-facts">
        <div class="profile-fact"><span>数据模型</span><strong>{{ profile.family }}</strong></div>
        <div class="profile-fact"><span>查询接口</span><strong>{{ queryLabel }}</strong></div>
        <div class="profile-fact"><span>许可证</span><strong>{{ profile.license }}</strong></div>
        <div class="profile-fact"><span>浏览器 Live</span><strong>{{ profile.liveEngine ? '正式支持' : '知识页' }}</strong></div>
      </div>
    </section>

    <h2 id="model-and-query">模型与查询语言</h2>
    <div class="profile-columns">
      <section class="profile-section"><h3 id="data-model" class="ignore-header">数据表达</h3><p>{{ profile.model }}</p></section>
      <section class="profile-section"><h3 id="query-language" class="ignore-header">查询方式</h3><p>{{ profile.query }}</p></section>
    </div>

    <h2 id="transactions-indexes-and-scaling">事务、索引与扩展</h2>
    <div class="profile-columns">
      <ProfileList id="transactions" title="事务与一致性" :items="profile.transactions" />
      <ProfileList id="indexes" title="索引与查询优化" :items="profile.indexes" />
      <ProfileList id="scaling" title="复制、分片与扩展" :items="profile.scaling" />
      <ProfileList id="deployment" title="部署形态" :items="profile.deployment" />
    </div>

    <h2 id="use-cases">适用边界</h2>
    <div class="profile-columns">
      <ProfileList id="suitable-for" title="适合" :items="profile.useCases" />
      <ProfileList id="limitations" title="限制" :items="profile.limitations" />
    </div>
    <div class="decision-callout"><strong>选型建议：</strong>{{ profile.recommendation }}</div>

    <template v-if="profile.liveEngine">
      <h2 id="live-experiment">页面内 Live 实验</h2>
      <p>当前产品具有正式浏览器运行环境。直接修改查询并运行，不需要复制到其他页面。</p>
      <DatabaseWorkbench :engine="profile.liveEngine" :title="`${profile.name} Live`" />
    </template>

    <h2 id="further-reading">深入学习</h2>
    <div class="profile-columns">
      <a class="profile-section topic-card" href="./core-concepts"><h3 id="core-concepts" class="ignore-header">核心知识</h3><p>建立 {{ profile.name }} 的存储、查询、事务与扩展心智模型。</p></a>
      <a class="profile-section topic-card" href="./versions"><h3 id="version-evolution" class="ignore-header">版本演进</h3><p>理解版本线、关键变化、升级影响和官方发布说明。</p></a>
      <a class="profile-section topic-card" href="/matrix/connection-strings"><h3 id="connection-strings" class="ignore-header">连接串对比</h3><p>对比协议、端口、TLS、驱动与命名空间写法。</p></a>
    </div>
  </article>
  <div v-else class="query-error">未知数据库资料：{{ props.id }}</div>
</template>

<script setup lang="ts">
import { computed, defineComponent, h, type PropType } from 'vue';
import { databaseProfiles } from '../data/databaseProfiles';
import DatabaseLogo from './DatabaseLogo.vue';

const props = defineProps<{ id: string }>();
const profile = computed(() => databaseProfiles[props.id]);
const queryLabel = computed(() => {
  const text = profile.value?.query || '';
  return text.split(/[；。]/)[0] || '产品查询接口';
});

const ProfileList = defineComponent({
  props: { id: { type: String, required: true }, title: { type: String, required: true }, items: { type: Array as PropType<string[]>, required: true } },
  setup(innerProps) {
    return () => h('section', { class: 'profile-section' }, [
      h('h3', { id: innerProps.id, class: 'ignore-header' }, innerProps.title),
      h('ul', innerProps.items.map((item) => h('li', item))),
    ]);
  },
});
</script>
