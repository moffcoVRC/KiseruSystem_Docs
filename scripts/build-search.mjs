import {readFile, readdir, writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const entries = [];
for (const file of (await readdir(path.join(root, 'docs'))).filter(file => /\.mdx?$/.test(file)).sort()) {
  const source = await readFile(path.join(root, 'docs', file), 'utf8');
  const title = /^title:\s*(.+)$/m.exec(source)?.[1];
  if (!title) throw new Error(`Missing title: ${file}`);
  const text = source.replace(/^---[\s\S]*?---\s*/, '').replace(/^import .*;\s*$/gm, '').replace(/<[^>]+>/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/\{#[^}]+\}/g, '')
    .replace(/^:::.*/gm, '').replace(/[#*`|]/g, '').replace(/\s+/g, ' ').trim();
  entries.push({title, url:`/docs/${file.replace(/\.mdx?$/, '')}/`, text});
}
await writeFile(path.join(root, 'static/search-index.json'), `${JSON.stringify(entries, null, 2)}\n`);
console.log(`Search index: ${entries.length} Japanese documents.`);
