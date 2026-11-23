import {readFile, readdir, stat} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const config = JSON.parse(await readFile(path.join(root, 'site.config.json'), 'utf8'));
const base = `/${config.projectName}/`;
const build = path.join(root, 'build');
const html = [];
async function walk(directory) {
  for (const item of await readdir(directory, {withFileTypes:true})) {
    const target = path.join(directory,item.name);
    if (item.isDirectory()) await walk(target);
    else if (item.name.endsWith('.html')) html.push(target);
  }
}
await walk(build);
const failures = [];
let references = 0;
for (const file of html) {
  const source = await readFile(file, 'utf8');
  if (!/<html[^>]+lang="ja"/.test(source)) failures.push(`${path.relative(build,file)}: wrong language`);
  for (const [,value] of source.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (!value.startsWith(base)) continue;
    const urlPath = decodeURIComponent(value.split('#')[0].split('?')[0].slice(base.length));
    const local = path.join(build,urlPath);
    try {
      const info = await stat(local);
      if (info.isDirectory()) await stat(path.join(local,'index.html'));
      references++;
    } catch {failures.push(`${path.relative(build,file)}: missing ${value}`);}
  }
}
const sourceRoots = ['docs','src','static','scripts','.github'];
const sourceFiles = ['package.json','package-lock.json','site.config.json','docusaurus.config.js','sidebars.js','README.md','.gitignore','.nvmrc'];
async function collect(directory) {
  for (const item of await readdir(path.join(root,directory),{withFileTypes:true})) {
    const relative = path.join(directory,item.name);
    if (item.isDirectory()) await collect(relative); else sourceFiles.push(relative);
  }
}
for (const directory of sourceRoots) await collect(directory);
for (const file of sourceFiles) {
  if (/\.(unitypackage|unity|prefab|fbx|glb|cs|asset|ogg|wav)$/i.test(file)) failures.push(`Unexpected product payload: ${file}`);
  const content = await readFile(path.join(root,file),'utf8');
  if (/[A-Z]:[\\/](?:Users|Unity)[\\/]|(?:usr|avtr)_[0-9a-f]{8}-|gh[pousr]_[A-Za-z0-9]{20,}/i.test(content)) failures.push(`Private path or identifier: ${file}`);
}
const index = JSON.parse(await readFile(path.join(build,'search-index.json'),'utf8'));
for (const phrase of ['Fist','マッチ','診断ログ','衣装用プリセット']) {
  if (!index.some(entry=>entry.text.includes(phrase))) failures.push(`Search content missing: ${phrase}`);
}
if (failures.length) {console.error(failures.join('\n')); process.exitCode=1;}
else console.log(`PASS: ${html.length} pages; ${references} local references; ${sourceFiles.length} public source files; search content and privacy checks.`);
