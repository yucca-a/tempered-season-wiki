import fs from 'node:fs/promises';
import path from 'node:path';
import {articles,auditedVersion,auditedCnVersion} from './articles.mjs';
import {configName,groupName,techName,extraNames} from './labels.mjs';

const snapshot=JSON.parse(await fs.readFile(new URL('./snapshot.json',import.meta.url),'utf8'));
const icons=JSON.parse(await fs.readFile(new URL('../data/icon-manifest.json',import.meta.url),'utf8'));
const {betaVersion,cnVersion,configs,preset,recipes,names}=snapshot;
const wikiTitle='永不妥协测试版 Wiki';
const workshop='https://steamcommunity.com/sharedfiles/filedetails/?id=3193922031';
const translation='https://steamcommunity.com/sharedfiles/filedetails/?id=3597225156';
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const code=s=>`<code>${esc(s)}</code>`;
const val=v=>code(JSON.stringify(v));
const link=(href,title)=>`<a href="${esc(href)}">${esc(title)}</a>`;
const filters=placeholder=>`<div class="wiki-filter"><label for="wiki-filter">筛选</label><input type="search" id="wiki-filter" placeholder="${esc(placeholder)}" autocomplete="off"><span role="status" id="filter-count"></span></div>`;
const nav=[['index.html','测试版词条'],['configs.html','配置'],['recipes.html','制作与兑换'],['sources.html','来源']];
const sources=article=>article.sources.map(s=>`<li>${s.kind==='cn'?'汉化补丁':'测试版'} · ${code(s.file+':'+s.line)}</li>`).join('');
const configByKey=new Map(configs.map(c=>[c.key,c]));
const configId=key=>'config-'+key.replace(/[^a-z0-9_-]/giu,c=>'_'+c.codePointAt(0).toString(16)+'_');
const configLink=c=>link('configs.html#'+configId(c.key),configName(c));
const standard=c=>c.options.find(o=>o.value===c.default);
const modeLabel=o=>({Enabled:'开启',Disabled:'关闭',Default:'默认',Off:'关闭','Always On':'始终开启'}[o.title]??o.title);
const itemName=id=>names[id]?.zh??extraNames[id]??names[id]?.en??id;
function itemLabel(id){
 const name=itemName(id),art=icons[id];
 if(!art?.source.startsWith('DST images.zip/'))return esc(name);
 return `${esc(name.slice(0,-1))}<span class="item-tail">${esc(name.slice(-1))}<img src="../${esc(art.path)}" alt="" width="18" height="18" loading="lazy"></span>`;
}
const recipeTitle=r=>itemName(r.product);
const findAttr=values=>` data-find="${esc(values.filter(Boolean).join(' '))}"`;
const stale=betaVersion!==auditedVersion||cnVersion!==auditedCnVersion;
const reviewedNotice=stale?`<p class="badge">正文核对于测试版 v${esc(auditedVersion)}、汉化 ${esc(auditedCnVersion)}，与索引快照的版本有差异</p>`:'';
const betaFooter=`<footer>社区维护资料 · 测试版 v${esc(betaVersion)} · 汉化 ${esc(cnVersion)} · ${link('sources.html','资料来源与覆盖范围')}</footer>`;
const betaHeader=current=>`<header class="site"><strong>${link('../index.html','← 饥荒联机版模组 Wiki')}</strong><nav aria-label="测试版导航">${nav.map(([href,title])=>`<a href="${href}"${href===current?' aria-current="page"':''}>${title}</a>`).join('')}</nav></header>`;
function shell(title,description,body,{hub=false,current='',filter=false}={}){
 return `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="${esc(description)}"><title>${esc(title)}</title><link rel="stylesheet" href="${hub?'':'../'}hub.css">${filter?'<script src="filter.js" defer></script>':''}</head><body>${hub?'<header class="site"><strong>饥荒联机版模组 Wiki</strong><span class="muted">中文资料索引</span></header>':betaHeader(current)}<main class="content" id="main">${body}${hub?'':betaFooter}</main></body></html>`;
}
const hero=(tag,title,body)=>`<section class="hero"><div class="eyebrow">${esc(tag)}</div><h1>${esc(title)}</h1>${body}</section>`;
const grouped=(items,key)=>Map.groupBy(items,key);
const configGroup=c=>groupName(c.category);
const defaultText=c=>esc(modeLabel(standard(c)))+' · '+val(c.default);
const configAliases=c=>articles.filter(a=>a.configs.includes(c.key)).flatMap(a=>[a.title,...a.aliases]);

export async function buildHub(out,tempered){
 const dir=path.join(out,'um-beta');
 await fs.mkdir(dir,{recursive:true});
 const seen=new Set();
 for(const a of articles){
  if(seen.has(a.id)||!/^[-a-z]+$/.test(a.id)||!a.sources.length||a.configs.some(key=>!configByKey.has(key)))throw Error('Invalid Beta article '+a.id);
  for(const s of a.sources){
   const src=snapshot.sourceFiles[(s.kind??'beta')+'/'+s.file];
   if(!src||s.line<1||s.line>src.lines)throw Error('Invalid citation in '+a.id);
  }
  seen.add(a.id);
 }
 for(const file of await fs.readdir(dir,{withFileTypes:true})){
  if(file.isFile()&&file.name.endsWith('.html'))await fs.unlink(path.join(dir,file.name));
 }
 const portalCards=`<div class="cols"><article class="card"><img class="cover" src="assets/workshop-cover.png" width="112" height="112" alt=""><span class="badge">v${esc(tempered.version)}</span><h2>${link('tempered.html','淬炼之季')}</h2><p>查阅角色、战斗、世界协同和道具改动，也可按房间配置查默认值与生效条件。</p><nav class="section-nav" aria-label="淬炼之季快捷入口">${link('tempered.html','进入百科 →')}${link('directory.html','分类索引')}${link('settings.html','配置大全')}</nav></article><article class="card"><span class="badge">Public Beta v${esc(betaVersion)}</span><h2>${link('um-beta/index.html','永不妥协测试版')}</h2><p>从测试版源码核对角色、季节、洞穴和宝石学。中文术语参照社区测试版汉化补丁。</p><nav class="section-nav" aria-label="永不妥协测试版快捷入口">${link('um-beta/index.html','进入百科 →')}${link('um-beta/configs.html','配置')}${link('um-beta/recipes.html','制作与兑换')}</nav></article></div>`;
 const portal=hero('中文模组资料','饥荒联机版模组 Wiki','<p>选择你房间启用的模组，查看对应版本的玩法、配方和配置。</p>')+portalCards+
 `<script src="legacy-home.js"></script>`;
 await fs.writeFile(path.join(out,'index.html'),shell('饥荒联机版模组 Wiki','淬炼之季与永不妥协测试版的中文 Wiki 入口。',portal,{hub:true}));
 await fs.copyFile(new URL('./legacy-home.js',import.meta.url),path.join(out,'legacy-home.js'));
 await fs.copyFile(new URL('./hub.css',import.meta.url),path.join(out,'hub.css'));
 await fs.copyFile(new URL('./filter.js',import.meta.url),path.join(dir,'filter.js'));

 const render=async(file,title,desc,body,filter=false)=>{
  const html=shell(title+' · '+wikiTitle,desc,body,{current:file,filter});
  await fs.writeFile(path.join(dir,file),html);
 };
 const entries=[...grouped(articles,a=>a.category)].map(([group,list])=>`<section data-filter-group><h2>${esc(group)}</h2><div class="cols">${list.map(a=>`<article class="card"${findAttr([a.title,...a.aliases,a.summary,...a.sections.flat()])}><h3>${link(a.id+'.html',a.title)}</h3><small>${esc(a.aliases.join(' · '))}</small><p>${esc(a.summary)}</p></article>`).join('')}</div></section>`).join('');
 await render('index.html','永不妥协测试版','永不妥协公开测试版的中文词条、配置与配方索引。',hero('UNCOMPROMISING MODE · PUBLIC BETA','永不妥协测试版',`<p>源码快照 <strong>v${esc(betaVersion)}</strong>，术语参考社区汉化 <strong>${esc(cnVersion)}</strong>。本分区记录公开测试版的玩法。</p>${reviewedNotice}<nav class="section-nav" aria-label="快速查阅">${link('configs.html',configs.length+' 项配置 →')}${link('recipes.html',recipes.length+' 条制作与兑换注册 →')}${link('sources.html','版本与来源')}</nav>`)+filters('搜角色、俗称或玩法，如 弹弓妹、鼠潮')+entries,true);
 for(const a of articles){
  const info=hero(a.category,a.title,`<p>${esc(a.summary)}</p><small>常用称呼与检索词 · ${esc(a.aliases.join('、'))}</small>${reviewedNotice}`);
  const sections=a.sections.map(([title,text])=>`<section class="panel"><h2>${esc(title)}</h2><p>${esc(text)}</p></section>`).join('');
  const related=a.configs.length?`<section class="panel"><h2>相关配置</h2><ul class="clean">${a.configs.map(key=>{const c=configByKey.get(key);return `<li>${configLink(c)} · ${defaultText(c)}</li>`;}).join('')}</ul></section>`:'';
  await render(a.id+'.html',a.title,a.summary,`<article>${info}${sections}${related}<section class="panel"><h2>核对来源</h2><p>测试版 v${esc(auditedVersion)} · 汉化 ${esc(auditedCnVersion)}</p><ul class="clean">${sources(a)}</ul></section></article>`);
 }
 const renderedGroups=[...grouped(configs,configGroup)].map(([group,list],i)=>`<section data-filter-group id="group-${i+1}"><h2>${esc(group)}</h2>${list.map(c=>{
  const options=c.options.map(o=>`<tr><td>${esc(modeLabel(o))}${o.value===c.default?' <span class="badge">默认</span>':''}</td><td>${val(o.value)}</td></tr>`).join('');
  const related=articles.filter(a=>a.configs.includes(c.key));
  return `<details class="card" id="${configId(c.key)}"${findAttr([configName(c),c.title,c.key,group,...configAliases(c)])}><summary><strong>${esc(configName(c))}</strong><small>默认 ${defaultText(c)}</small></summary><p>${esc(c.title)} · ${c.client?'客户端':'服务器'} · ${code(c.key)}</p><div class="table-wrap"><table><thead><tr><th scope="col">界面选项</th><th scope="col">存档值</th></tr></thead><tbody>${options}</tbody></table></div><p><small>${code('modinfo.lua:'+c.line)}</small></p>${related.length?`<nav class="section-nav" aria-label="相关词条">${related.map(a=>link(a.id+'.html',a.title)).join('')}</nav>`:''}</details>`;
 }).join('')}</section>`).join('');
 const presets=preset.map(p=>`<details class="card"><summary><strong>${esc(p.title)}</strong> <small>${p.changes.length} 条覆盖声明</small></summary><p>预设有自己的覆盖值。标为「菜单无对应项」的键仍保留在源码预设表内。</p><div class="table-wrap"><table><thead><tr><th scope="col">配置</th><th scope="col">预设值</th></tr></thead><tbody>${p.changes.map(({key,value})=>`<tr><td>${configByKey.has(key)?configLink(configByKey.get(key)):code(key)+' <small>菜单无对应项</small>'}</td><td>${val(value)}</td></tr>`).join('')}</tbody></table></div><small>${code('modinfo.lua:'+p.line)}</small></details>`).join('');
 await render('configs.html','配置大全','公开测试版的客户端与服务器配置、默认值及档位。',hero('MODINFO · SOURCE INDEX','配置大全',`<p>从 v${esc(betaVersion)} 的实际菜单表提取 ${configs.length} 项配置。支持按中文名称、英文名称和配置键筛选。菜单值与执行逻辑的差异见对应词条。</p>`)+filters('搜配置名称或键，如 暴风雪、ratgrace')+renderedGroups+`<section><h2>难度预设</h2>${presets}</section>`,true);
 const recipeGroups=[...grouped(recipes,r=>r.file.endsWith('recipes_wixie.lua')?'薇希专属':r.file.endsWith('recipes_ia.lua')?'岛屿冒险兼容':'测试版制作与兑换')];
 const requirements={builder_tag:'制作者标签',builder_skill:'必需技能',no_builder_skill:'排斥技能',station_tag:'制作站标签',nounlock:'在对应科技站使用',testfn:'有额外位置或制作者检查'};
 const recipeRows=recipeGroups.map(([group,list])=>`<section data-filter-group><h2>${esc(group)}</h2>${list.map(r=>{
  const title=recipeTitle(r);
  const material=r.ingredients.map(i=>`<li>${itemLabel(i.id)} × ${esc(i.amount)} <small>${code(i.id)}</small></li>`).join('');
  const gates=r.gates.map(g=>`<li>${code(g)}</li>`).join('');
  const props=Object.entries(r.requirements).filter(([,value])=>value!==false).map(([key,value])=>`<li>${requirements[key]}${value===true?'':' · '+code(value)}</li>`).join('');
  return `<details class="card"${findAttr([title,r.id,names[r.product]?.en,r.tech,techName(r.tech),group,...r.ingredients.map(i=>itemName(i.id)),...r.gates])}><summary><strong>${itemLabel(r.product)}</strong><small>${esc(techName(r.tech))}</small></summary><p>配方 ID ${code(r.id)}${r.product!==r.id?' · 产物 '+code(r.product):''}</p><ul class="clean">${material||'<li>无常规物品材料</li>'}</ul><p>产量 ${typeof r.count==='number'?esc(r.count):'取决于 '+code(r.count)} · 科技 ${code(r.tech)}</p>${gates||props?`<p>注册或制作条件</p><ul class="clean">${gates}${props}</ul>`:''}<small>${code(r.file+':'+r.line)}</small></details>`;
 }).join('')}</section>`).join('');
 await render('recipes.html','制作与兑换','公开测试版源码中的制作、兑换与兼容注册。',hero('CRAFTING · SOURCE INDEX','制作与兑换',`<p>收录 v${esc(betaVersion)} 中 ${recipes.length} 条可解析的配方注册。中文物品名优先采用测试版汉化，原版物品参照游戏简中。</p><p class="muted">配方可能受房间配置、制作技能和其他模组影响。动态注册和后续覆盖需结合实现核对。</p>`)+filters('搜产物、材料或配方 ID，如 活木弹弓')+recipeRows+`<section class="panel"><h2>单独核对的动态配方</h2><p>温奇的定居鼠穴使用饥饿而非普通材料，见 ${link('winky.html','温奇')}。</p><ul class="clean">${snapshot.skipped.map(r=>`<li>${code(r.id??'动态 ID')} · ${code(r.file+':'+r.line)}</li>`).join('')}</ul></section>`,true);
 await render('sources.html','版本与来源','永不妥协测试版和社区汉化补丁的版本及维护范围。',hero('SOURCE NOTES','版本与来源',`<p>源码快照 v${esc(betaVersion)} · 社区汉化 ${esc(cnVersion)} · 正文核对 v${esc(auditedVersion)}</p>${reviewedNotice}`)+
 `<section class="panel"><h2>来源</h2><ul class="clean"><li>${link(workshop,'Steam 工坊 · Uncompromising Mode: Public Beta')} · 作者为 The Uncomp Dev Team</li><li>${link(translation,'Steam 工坊 · 永不妥协全汉化 - 测试版专供')} · 郎溪小杰哥、不堪白昼、不笑猫、去码头整点薯条</li><li>${link('https://github.com/LeeMo123/Hanization_um_beta','社区汉化项目源码')}</li><li>${link('https://uncompromisingmode.wiki.gg/','Uncompromising Mode 英文 Wiki')}</li></ul></section><section class="panel"><h2>覆盖范围</h2><p>本分区首批有 ${articles.length} 篇源码核对词条、${configs.length} 项实际菜单配置、${recipes.length} 条可解析的制作与兑换注册。配方页记录注册时的材料、科技和已解析的条件。食谱、运行中变动及尚未逐篇审阅的内容按后续复核补充。</p><p>机制、数值和开关从测试版本体核对。汉化补丁用于术语对照，配置中的中文辅助标题另行编辑，方便与工坊界面上的英文标题互查。</p></section>`);
 console.log(`Built Wiki hub and ${articles.length} Beta articles, ${configs.length} Beta configs, ${recipes.length} recipe rows.`);
}
