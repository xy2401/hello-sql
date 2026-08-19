import DefaultTheme from 'vitepress/theme';
import type { Theme } from 'vitepress';
import { h } from 'vue';
import DatabaseProfile from './components/DatabaseProfile.vue';
import DatabaseWorkbench from './components/DatabaseWorkbench.vue';
import EngineSupportTable from './components/EngineSupportTable.vue';
import DatabaseCoreGuide from './components/DatabaseCoreGuide.vue';
import DatabaseVersionGuide from './components/DatabaseVersionGuide.vue';
import ConnectionStringMatrix from './components/ConnectionStringMatrix.vue';
import PlaygroundSidebarExplorer from './components/PlaygroundSidebarExplorer.vue';
import DatabaseSidebarExplorer from './components/DatabaseSidebarExplorer.vue';
import DatabaseCatalogGrid from './components/DatabaseCatalogGrid.vue';
import DatabaseLogo from './components/DatabaseLogo.vue';
import './styles.css';

export default {
  extends: DefaultTheme,
  Layout: () => h(DefaultTheme.Layout, null, {
    'sidebar-nav-before': () => [h(PlaygroundSidebarExplorer), h(DatabaseSidebarExplorer)],
  }),
  enhanceApp({ app }) {
    app.component('DatabaseProfile', DatabaseProfile);
    app.component('DatabaseWorkbench', DatabaseWorkbench);
    app.component('EngineSupportTable', EngineSupportTable);
    app.component('DatabaseCoreGuide', DatabaseCoreGuide);
    app.component('DatabaseVersionGuide', DatabaseVersionGuide);
    app.component('ConnectionStringMatrix', ConnectionStringMatrix);
    app.component('DatabaseCatalogGrid', DatabaseCatalogGrid);
    app.component('DatabaseLogo', DatabaseLogo);
  },
} satisfies Theme;
