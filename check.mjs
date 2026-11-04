import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
const root=fileURLToPath(new URL('./dist/',import.meta.url));
const all=await fs.readdir(root,{recursive:true});
const html=all.filter(f=>f.endsWith('.html'));
const pages=new Map(await Promise.all(html.map(async f=>[f.replaceAll('\\','/'),await fs.readFile(path.join(root,f),'utf8')])));
const paths=new Set(all.map(f=>f.replaceAll('\\','/'))),errors=[];let links=0;
function checkLink(file,value){if(/^(https?:|mailto:|data:)/.test(value))return;links++;const url=new URL(value,`https://wiki.example/${file}`),target=decodeURIComponent(url.pathname.slice(1));if(!paths.has(target))errors.push(`${file}: missing ${value}`);if(url.hash&&pages.has(target)&&!pages.get(target).includes(`id="${decodeURIComponent(url.hash.slice(1))}"`))errors.push(`${file}: missing anchor ${value}`);}
for(const [file,text] of pages){const ids=[...text.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);if(new Set(ids).size!==ids.length)errors.push(`${file}: duplicate ID`);if((text.match(/<h1(?:\s[^>]*)?>/g)||[]).length!==1)errors.push(`${file}: expected one h1`);for(const [,value] of text.matchAll(/(?:href|src)="([^"]+)"/g))checkLink(file,value);}
for(const file of ['app.js','theme.js','search-index.js'])new vm.Script(await fs.readFile(path.join(root,file),'utf8'),{filename:file});
const context={window:{}};vm.runInNewContext(await fs.readFile(path.join(root,'search-index.js'),'utf8'),context);
for(const a of context.window.WIKI_INDEX){checkLink('index.html',a.href);if(!a.text||!a.title)errors.push('Invalid search entry '+a.id);}
const configData=JSON.parse(await fs.readFile(new URL('./data/configs.json',import.meta.url),'utf8'));
const coverage=JSON.parse(await fs.readFile(new URL('./coverage.json',import.meta.url),'utf8'));
const settings=pages.get('settings.html');
if((settings.match(/data-config="/g)||[]).length!==configData.configs.length)errors.push('Config coverage mismatch');
const choiceCount=configData.configs.reduce((n,c)=>n+c.options.length,0);
if(coverage.choices!==choiceCount)errors.push('Choice coverage mismatch');
if(coverage.notedSettings!==configData.configs.length)errors.push('Some configurations lack implementation notes');
if(coverage.unlinkedSettings.length)errors.push('Configurations without related articles: '+coverage.unlinkedSettings.join(', '));
if(coverage.itemAudit?.missing.length)errors.push('Items missing source audit: '+coverage.itemAudit.missing.join(', '));
if(coverage.entityAudit?.missing.length)errors.push('Characters/buildings/Bosses missing source audit: '+coverage.entityAudit.missing.join(', '));
if(coverage.lifeAudit?.missing.length)errors.push('Food/creatures missing source audit: '+coverage.lifeAudit.missing.join(', '));
for(const [file,text] of pages)if(/yucca/i.test(text))errors.push(`${file}: personal credit remains`);
if(/yucca/i.test(await fs.readFile(path.join(root,'search-index.js'),'utf8')))errors.push('Search index contains personal credit');
if(context.window.WIKI_INDEX.length!==coverage.articles+coverage.configs)errors.push('Search coverage mismatch');
for(const c of configData.configs){if(!c.options.some(o=>o.value===c.default))errors.push('Default absent '+c.key);}
try{const source=await fs.readFile(new URL('../content/modinfo.lua',import.meta.url));if(createHash('sha256').update(source).digest('hex')!==configData.sourceHash)errors.push('Configuration source changed; rerun extract-config.py');}catch(e){if(e.code!=='ENOENT')throw e;}
if(errors.length){console.error([...new Set(errors)].join('\n'));process.exitCode=1;}
else console.log(`PASS: ${html.length} pages; ${links} local links and anchors; ${coverage.configs} settings / ${choiceCount} choices; ${context.window.WIKI_INDEX.length} searchable entries; JavaScript syntax.`);
