<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useData } from 'vitepress';
import { EditorState } from '@codemirror/state';
import { EditorView, lineNumbers } from '@codemirror/view';
import { javascript } from '@codemirror/lang-javascript';
import { sql } from '@codemirror/lang-sql';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { tags } from '@lezer/highlight';

const props = defineProps<{ code: string; language: 'javascript' | 'sql' | 'json'; label: string }>();
const { isDark } = useData();
const host = ref<HTMLElement>();
let editor: EditorView | undefined;

function render() {
  if (!host.value) return;
  editor?.destroy();
  const dark = isDark.value;
  const palette = dark
    ? { keyword: '#d8b4fe', string: '#86efac', literal: '#fcd34d', comment: '#94a3b8', property: '#93c5fd' }
    : { keyword: '#7e22ce', string: '#15803d', literal: '#a16207', comment: '#64748b', property: '#1e40af' };
  editor = new EditorView({
    parent: host.value,
    state: EditorState.create({
      doc: props.code,
      extensions: [
        props.language === 'sql' ? sql() : javascript(),
        EditorState.readOnly.of(true), EditorView.editable.of(false), EditorView.lineWrapping, lineNumbers(),
        EditorView.contentAttributes.of({ 'aria-label': props.label, tabindex: '0' }),
        syntaxHighlighting(HighlightStyle.define([
          { tag: tags.keyword, color: palette.keyword, fontWeight: '600' },
          { tag: [tags.string, tags.regexp], color: palette.string },
          { tag: [tags.number, tags.bool, tags.null], color: palette.literal },
          { tag: tags.comment, color: palette.comment, fontStyle: 'italic' },
          { tag: [tags.propertyName, tags.variableName], color: palette.property },
        ])),
        EditorView.theme({
          '&': { backgroundColor: 'var(--sql-editor-bg)', color: 'var(--sql-editor-text)', fontSize: '13px' },
          '.cm-content': { padding: '8px 0', fontFamily: 'var(--vp-font-family-mono)', lineHeight: '1.55' },
          '.cm-line': { padding: '0 10px' },
          '.cm-gutters': { backgroundColor: 'var(--sql-editor-gutter-bg)', color: 'var(--sql-editor-gutter-text)', border: 'none' },
          '.cm-scroller': { maxHeight: props.language === 'json' ? '400px' : '260px', overflow: 'auto', scrollbarColor: 'var(--sql-scrollbar-thumb) var(--sql-scrollbar-track)' },
          '&.cm-focused': { outline: '2px solid var(--vp-c-brand-1)', outlineOffset: '-2px' },
        }, { dark }),
      ],
    }),
  });
}

onMounted(render);
watch(() => [props.code, props.language, isDark.value], render);
onBeforeUnmount(() => editor?.destroy());
</script>

<template><div ref="host" class="sample-query-code" /></template>

<style scoped>
.sample-query-code { min-width: 0; overflow: hidden; }
</style>
