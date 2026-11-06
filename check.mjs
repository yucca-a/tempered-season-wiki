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
for(const [file,term,asset] of [
 ['thulecite-club.html','远古铥矿盔甲','armorruins'],
 ['thulecite-club.html','铥矿','thulecite'],
 ['equipment-repair.html','铥矿甲','armorruins'],
 ['equipment-repair.html','金块','goldnugget'],
 ['frost-shrine.html','冰','ice'],
 ['role-wormwood.html','西瓜帽','watermelonhat'],
 ['role-wormwood.html','胡萝卜鼠诱饵甲','armor_carrotlure'],
 ['dried-vegetables.html','西瓜干','watermelon'],
 ['trap.html','草','cutgrass'],
 ['trap.html','树枝','twigs'],
 ['eyeturret.html','龙鳞皮','dragon_scales'],
 ['eyeturret.html','蘑菇皮','shroom_skin'],
 ['frost-core.html','寒霜之祠蓝图','blueprint'],
 ['frost-core.html','普通出逃腿靴','bootleg'],
]){
 const label=`>${term.slice(0,-1)}<span class="icon-tail">${term.slice(-1)}`;
 if(!pages.get(file)?.includes(`${label}<img class="inline-icon" src="assets/icons/${asset}.png"`)){
  errors.push(`${file}: incorrect or missing icon for ${term}`);
 }
}
for(const file of ['app.js','theme.js','search.js','search-index.js','legacy-home.js','um-beta/filter.js','um-beta/legacy-items.js'])new vm.Script(await fs.readFile(path.join(root,file),'utf8'),{filename:file});
const beta=JSON.parse(await fs.readFile(new URL('./um-beta/snapshot.json',import.meta.url),'utf8'));
for(const [file,marker] of [['index.html','href="tempered.html"'],['index.html','href="um-beta/index.html"'],['tempered.html','data-page="index"'],['um-beta/index.html',beta.betaVersion],['um-beta/sources.html',beta.cnVersion]]){
 if(!pages.get(file)?.includes(marker))errors.push('Missing Wiki route or version marker in '+file);
}
for(const [file,pattern,count] of [['um-beta/configs.html',/data-config="/g,beta.configs.length],['um-beta/recipes.html',/data-recipe data-find="/g,beta.recipes.length]]){
 if((pages.get(file)?.match(pattern)||[]).length!==count)errors.push('Beta index coverage mismatch: '+file);
}
const betaIndex={window:{}};
vm.runInNewContext(await fs.readFile(path.join(root,'um-beta/search-index.js'),'utf8'),betaIndex);
const betaResults=betaIndex.window.WIKI_INDEX;
if(new Set(betaResults.map(a=>a.id)).size!==betaResults.length)errors.push('Duplicate Beta search index IDs');
for(const a of betaResults)checkLink('um-beta/index.html',a.href);
if(betaResults.filter(a=>a.kind==='recipe').length!==beta.recipes.length||betaResults.filter(a=>a.kind==='config').length!==beta.configs.length)errors.push('Beta search coverage mismatch');
const betaArt=JSON.parse(await fs.readFile(new URL('./um-beta/artwork.json',import.meta.url),'utf8'));
for(const art of Object.values(betaArt))if(!paths.has(art.path))errors.push('Missing Beta artwork '+art.path);
if(betaResults.filter(a=>a.kind==='item').length!==beta.artworkIds.length)errors.push('Beta item gallery search coverage mismatch');
for(const [file,asset] of [['index.html','assets/um-beta/cover.png'],['um-beta/index.html','../assets/um-beta/cover.png'],['um-beta/wixie.html','../assets/um-beta/wixie.png'],['um-beta/recipes.html','../assets/um-beta/slingshot_gnasher.png'],['um-beta/index.html','../assets/um-beta/um_gemologypurplegem2.png']]){
 if(!pages.get(file)?.includes('src="'+asset+'"'))errors.push('Missing Beta artwork reference in '+file);
}
for(const [file,id,category] of [
 ['tempered.html','world-shadow','world'],['tempered.html','world-seasons','mechanics'],['tempered.html','role-wortox','characters'],
 ['tempered.html','frost-core','new-items'],['tempered.html','frost-core-staff','items'],['tempered.html','frostjaw','creatures'],
 ['um-beta/index.html','snowstorms','world'],['um-beta/index.html','gemology','mechanics'],['um-beta/index.html','thermal-stone','items'],
 ['um-beta/index.html','item-slingshot_gnasher','new-items'],
]){
 if(!pages.get(file)?.includes(`data-entry="${id}" data-category="${category}"`))errors.push('Unexpected Wiki topic for '+id);
}
if(!pages.get('um-beta/index.html')?.includes('data-entry="item-slingshot_gnasher" data-category="new-items"><a href="recipes.html#recipe-slingshot_gnasher-11"'))errors.push('Missing direct Beta item card link');
if(betaResults.find(a=>a.id==='item-slingshot_gnasher')?.href!=='recipes.html#recipe-slingshot_gnasher-11')errors.push('Missing direct Beta item search link');
const globalIndex={window:{}};
vm.runInNewContext(await fs.readFile(path.join(root,'global-search-index.js'),'utf8'),globalIndex);
const globalResults=globalIndex.window.WIKI_GLOBAL_INDEX;
for(const a of globalResults){
 checkLink('index.html',a.href);
 if(a.image)checkLink('index.html',a.image);
}
for(const [term,href] of [['附魔','um-beta/gemology.html#gemology-s2'],['宝石','um-beta/gemology.html']]){
 if(!globalResults.some(a=>a.jump&&a.href===href&&a.aliases.includes(term)))errors.push('Missing direct search result for '+term);
}
const context={window:{}};vm.runInNewContext(await fs.readFile(path.join(root,'search-index.js'),'utf8'),context);
for(const a of context.window.WIKI_INDEX){checkLink('index.html',a.href);if(!a.text||!a.title)errors.push('Invalid search entry '+a.id);}
for(const [id,aliases] of Object.entries({
 'role-wortox':['小恶魔','恶魔人','恶魔'],
 'role-wormwood':['植物人'],
 'role-wx78':['机器人','WX78'],
})){
 const entry=context.window.WIKI_INDEX.find(a=>a.id===id);
 if(!aliases.every(alias=>entry?.aliases?.includes(alias))||!pages.get(entry?.href)?.includes('class="role-aliases"'))errors.push('Missing character aliases for '+id);
}
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
