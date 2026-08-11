import { expect, test } from '@playwright/test';

test('site navigation and SQLite query work from the domain root', async ({ page }) => {
  await page.goto('playground/sqlite');
  await expect(page.getByRole('heading', { name: 'SQLite WASM 实验室' })).toBeVisible();
  await expect(page.getByText('已连接').first()).toBeVisible({ timeout: 45_000 });
  await expect(page.locator('.playground-sidebar-explorer details')).toHaveCount(6);
  await page.getByRole('tab', { name: '查询 1' }).click();
  await page.getByRole('button', { name: '▶ 运行' }).click();
  await expect(page.getByRole('columnheader', { name: 'course' })).toBeVisible({ timeout: 30_000 });
  await expect(page.getByText('SQL 从入门到进阶', { exact: true }).first()).toBeVisible();
});

test('IndexedDB executes JavaScript and exposes schema', async ({ page }) => {
  await page.goto('playground/indexeddb');
  await expect(page.getByText('已连接').first()).toBeVisible({ timeout: 20_000 });
  await expect(page.locator('.playground-sidebar-explorer details')).toHaveCount(6);
  await expect(page.locator('.playground-sidebar-explorer details summary').filter({ hasText: 'books' })).toBeVisible();
  await page.getByRole('tab', { name: '查询 1' }).click();
  await page.getByRole('button', { name: '▶ 运行' }).click();
  await expect(page.getByRole('columnheader', { name: 'learner' })).toBeVisible();
  await expect(page.getByText('小陈').first()).toBeVisible();
});

test('unified workbench switches engines without copying code', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'Full multi-engine switch is covered in Chromium; other projects run core engines.');
  await page.goto('playground/');
  await expect(page.getByText('已连接').first()).toBeVisible({ timeout: 45_000 });
  const databases = page.locator('.database-name');
  await expect(databases).toHaveCount(5);
  await databases.filter({ hasText: 'IndexedDB' }).click();
  await expect(page.getByText('Browser Native · JavaScript · Worker').first()).toBeVisible();
  await expect(page.getByText('IndexedDB 数据库概览')).toBeVisible({ timeout: 20_000 });
  await expect(page.getByText('已连接').first()).toBeVisible({ timeout: 20_000 });
});

test('database tree opens object details and previews table rows', async ({ page }) => {
  await page.goto('playground/sqlite');
  await expect(page.getByText('已连接').first()).toBeVisible({ timeout: 45_000 });
  const overviewResultTop = (await page.locator('.result-pane').boundingBox())?.y;
  await page.getByRole('tab', { name: '查询 1' }).click();
  const queryResultTop = (await page.locator('.result-pane').boundingBox())?.y;
  expect(queryResultTop).toBe(overviewResultTop);
  await page.getByRole('tab', { name: '数据库概览' }).click();
  await page.locator('.playground-sidebar-explorer details summary').filter({ has: page.getByText('lessons', { exact: true }) }).click();
  await expect(page.getByRole('heading', { name: 'lessons' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'id', exact: true })).toBeVisible();

  await page.getByRole('button', { name: '插入查询' }).click();
  await expect(page.getByRole('tab', { name: '查询 1' })).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('.cm-content')).toContainText('FROM "lessons"');
  await expect(page.getByRole('columnheader', { name: 'category' })).not.toBeVisible();

  await page.getByRole('tab', { name: /对象 · lessons/ }).click();
  await page.getByRole('button', { name: '预览前 100 行' }).click();
  await expect(page.getByRole('columnheader', { name: 'category' })).toBeVisible({ timeout: 30_000 });
});

test('narrow layout collapses the database explorer', async ({ page }) => {
  await page.setViewportSize({ width: 700, height: 900 });
  await page.goto('playground/');
  await expect(page.getByText('已连接').first()).toBeVisible({ timeout: 45_000 });
  const explorer = page.locator('.VPSidebar');
  await expect(explorer).not.toHaveClass(/open/);
  const toggle = page.getByRole('button', { name: '数据库', exact: true });
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await toggle.click();
  await expect(explorer).toHaveClass(/open/);
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
});

for (const engine of [
  { id: 'duckdb', marker: 'average_progress', objects: 6 },
  { id: 'pglite', marker: 'engagement_rank', objects: 6 },
  { id: 'surrealdb', marker: 'score', objects: 5 },
] as const) {
  test(`${engine.id} initializes and executes in Chromium`, async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'SQLite and IndexedDB provide the cross-browser core smoke tests.');
    await page.goto(`playground/${engine.id}`);
    await expect(page.getByText('已连接').first()).toBeVisible({ timeout: 45_000 });
    await expect(page.locator('.playground-sidebar-explorer details')).toHaveCount(engine.objects);
    await page.getByRole('tab', { name: '查询 1' }).click();
    await page.getByRole('button', { name: '▶ 运行' }).click();
    await expect(page.getByRole('columnheader', { name: engine.marker })).toBeVisible({ timeout: 30_000 });
  });
}

test('persistent workspaces initialize or show an explicit fallback', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'Persistence implementation is exercised in Chromium CI.');
  for (const engine of ['sqlite', 'pglite', 'surrealdb']) {
    await page.goto(`playground/${engine}`);
    await expect(page.getByText('已连接').first()).toBeVisible({ timeout: 45_000 });
    await page.getByRole('checkbox', { name: '本地持久工作区' }).click();
    await expect(page.getByText('已连接').first()).toBeVisible({ timeout: 45_000 });
    const pageText = await page.locator('.VPDoc').innerText();
    expect(pageText.includes('工作区') || pageText.includes('已降级到内存模式')).toBeTruthy();
  }
});
