import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const docs = path.join(root, 'docs');
const errors = [];

function walk(directory, predicate = () => true) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(target, predicate) : predicate(target) ? [target] : [];
  });
}

function existsAsDoc(target) {
  return [target, `${target}.md`, path.join(target, 'index.md')].some(fs.existsSync);
}

function relative(file) { return path.relative(root, file).replaceAll('\\', '/'); }

const markdownFiles = walk(docs, (file) => file.endsWith('.md'));
for (const file of markdownFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const withoutCode = content.replace(/```[\s\S]*?```/g, '').replace(/`[^`\r\n]*`/g, '');
  const links = [...withoutCode.matchAll(/\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)];
  for (const match of links) {
    const raw = match[1];
    if (/^(https?:|mailto:|#)/.test(raw)) continue;
    const clean = decodeURIComponent(raw.split(/[?#]/, 1)[0]);
    if (!clean) continue;
    const target = clean.startsWith('/') ? path.join(docs, clean.slice(1)) : path.resolve(path.dirname(file), clean);
    if (!existsAsDoc(target)) errors.push(`${relative(file)} 链接不存在：${raw}`);
  }
  if (/无需\s*(Docker|容器)|复制到.*实验室|粘贴到.*实验室/.test(content)) {
    errors.push(`${relative(file)} 包含过时的 Live 引导文案`);
  }
}

const profileData = fs.readFileSync(path.join(docs, '.vitepress/theme/data/databaseProfiles.ts'), 'utf8');
const guideData = fs.readFileSync(path.join(docs, '.vitepress/theme/data/databaseGuides.ts'), 'utf8');
const brandingData = fs.readFileSync(path.join(docs, '.vitepress/theme/data/databaseBranding.ts'), 'utf8');
const configData = fs.readFileSync(path.join(docs, '.vitepress/config.ts'), 'utf8');
for (const component of ['DatabaseProfile.vue', 'DatabaseCoreGuide.vue', 'DatabaseVersionGuide.vue']) {
  const file = path.join(docs, '.vitepress/theme/components', component);
  const content = fs.readFileSync(file, 'utf8');
  if (/<h2(?![^>]*\bid=)[^>]*>/.test(content)) errors.push(`${relative(file)} 包含没有锚点 id 的章节标题，产品页右侧目录会缺项`);
}
for (const file of markdownFiles.filter((item) => item.includes(`${path.sep}products${path.sep}`))) {
  const content = fs.readFileSync(file, 'utf8');
  for (const match of content.matchAll(/<DatabaseProfile id="([^"]+)"/g)) {
    if (!profileData.includes(`${match[1]}:`) && !profileData.includes(`'${match[1]}':`)) {
      errors.push(`${relative(file)} 引用了不存在的数据库资料：${match[1]}`);
    }
  }
}

const productsDirectory = path.join(docs, 'products');
const databaseDirectories = fs.readdirSync(productsDirectory, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => path.join(productsDirectory, entry.name));

if (databaseDirectories.length !== 25) errors.push(`独立数据库目录数量应为 25，当前为 ${databaseDirectories.length}`);
for (const directory of databaseDirectories) {
  const directoryName = path.basename(directory);
  const id = directoryName === 'mssqlserver' ? 'sql-server' : directoryName;
  for (const page of ['index.md', 'core-concepts.md', 'versions.md']) {
    if (!fs.existsSync(path.join(directory, page))) errors.push(`${relative(directory)} 缺少 ${page}`);
  }
  if (!guideData.includes(`${id}:`) && !guideData.includes(`'${id}':`)) errors.push(`${relative(directory)} 缺少核心知识与版本资料`);
  if (!brandingData.includes(`${id}:`) && !brandingData.includes(`'${id}':`)) errors.push(`${relative(directory)} 缺少品牌注册信息`);
  if (!fs.existsSync(path.join(docs, 'public', 'logos', 'databases', `${id}.svg`))) errors.push(`${relative(directory)} 缺少本地 Logo`);
}

for (const id of ['pglite', 'surrealdb', 'indexeddb']) {
  if (!brandingData.includes(`${id}:`)) errors.push(`浏览器运行环境 ${id} 缺少品牌注册信息`);
}

const logoFiles = walk(path.join(docs, 'public', 'logos', 'databases'), (file) => file.endsWith('.svg'));
for (const file of logoFiles) {
  const svg = fs.readFileSync(file, 'utf8');
  if (/<script\b/i.test(svg) || /<(?:image|use)\b[^>]+(?:href|xlink:href)=["']https?:/i.test(svg)) errors.push(`${relative(file)} 包含脚本或远程资源`);
}

const forbiddenHeadings = ['主流关系型数据库', '主流 NoSQL：先选模型，再选产品', '数据库横向对比矩阵', '五个真实浏览器运行环境', '按问题域学习，而不是堆版本号', 'WASM 数据库统一工作台'];
for (const file of markdownFiles) {
  const headings = fs.readFileSync(file, 'utf8').split(/\r?\n/).filter((line) => /^#{1,6}\s/.test(line));
  for (const phrase of forbiddenHeadings) if (headings.some((heading) => heading.includes(phrase))) errors.push(`${relative(file)} 仍包含待精简标题：${phrase}`);
}
for (const file of markdownFiles.filter((item) => item.includes(`${path.sep}products${path.sep}`))) {
  const content = fs.readFileSync(file, 'utf8');
  for (const match of content.matchAll(/<Database(?:CoreGuide|VersionGuide) id="([^"]+)"/g)) {
    if (!guideData.includes(`${match[1]}:`) && !guideData.includes(`'${match[1]}':`)) {
      errors.push(`${relative(file)} 引用了不存在的数据库专题资料：${match[1]}`);
    }
  }
}

const requiredPages = [
  'index.md', 'reference/index.md', 'products/browser/index.md', 'products/browser/core-concepts.md',
  'products/browser/versions.md', 'products/browser/indexeddb.md',
  'products/browser/opfs.md', 'products/browser/local-first.md', 'playground/sqlite.md',
  'playground/duckdb.md', 'playground/pglite.md', 'playground/surrealdb.md', 'playground/indexeddb.md',
  'matrix/sql-dialects.md', 'matrix/browser-wasm.md', 'matrix/connection-strings.md',
];
for (const page of requiredPages) if (!fs.existsSync(path.join(docs, page))) errors.push(`缺少必需页面：docs/${page}`);

if (markdownFiles.length < 90) errors.push(`内容页面数量不足：${markdownFiles.length}`);

if (errors.length) {
  console.error(`内容检查失败（${errors.length} 项）：`);
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}
console.log(`内容检查通过：${markdownFiles.length} 篇文档，内部链接、Live 文案和数据库资料引用完整。`);
