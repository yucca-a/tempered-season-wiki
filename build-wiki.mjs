import {buildHub} from './um-beta/build.mjs';
import {createUI,wikiStyles,wikiStylesFilename} from './ui.mjs';
import {applyArticleTerminology,canonicalText} from './terminology.mjs';
import {temperedTopics,temperedTopic,temperedSubtopic,temperedRelatedTopics} from './topics.mjs';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {articles,configs,groups,meta,iconManifest,iconLabels,protectedIconNames,defaultChoice,choiceText,itemAuditIds,entityAuditIds,lifeAuditIds,currentAuditIds} from './catalog.mjs';
const root=path.dirname(fileURLToPath(import.meta.url)),out=path.join(root,'dist');
await fs.mkdir(out,{recursive:true});
for(const entry of await fs.readdir(out,{withFileTypes:true}))if(entry.isFile()&&(entry.name.endsWith('.html')||/^styles-[0-9a-f]{12}\.css$/.test(entry.name)))await fs.unlink(path.join(out,entry.name));
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const rawValue=v=>typeof v==='string'?`"${v}"`:String(v);
const href=id=>`${id}.html`;
const releaseIndex=[
 ['2.8.15.1.19','疙瘩树加强、彼岸花之墓皮肤与战歌/牛铃/Boss/快捷键修复'],
 ['2.8.15.1.18','快捷收集、WX-78 夜视、韦斯分身与沃托克斯/沃托姆修复'],
 ['2.8.15.1.17','画师新贴图与彩虹喵之刃皮肤、换肤与鱼人台词更新'],
 ['2.8.15.1.16','修复韦斯右键自身动作冲突导致其他角色技能失效'],
 ['2.8.15.1.14','月龙提灯穿模修复、通信频率配置与制作栏弹窗优化'],
 ['2.8.15.1.13','月龙提灯骑乘外观与涡流骑乘冲刺修复'],
 ['2.8.15.1.12','丘陵保护、个人切装设置与快捷存放动画修复'],
 ['2.8.15.1.11','天体洋葱新美术、全量源码崩溃排查与戍卫塔修复'],
 ['2.8.15.1.9','荒野求生录春季花粉症与果蝇照料修复'],
 ['2.8.15.1.8','旧档修复、WX-78 与刮地皮头盔优化'],
 ['2.8.15.1.7','牛牛驯养、快捷收集与整理、天体英雄优化'],
 ['2.8.15.1.6','格子钉选、单人穿越与首领调整'],
 ['2.8.15.1.5','沃比被巨型蠕虫吞下后的背包恢复'],
 ['2.8.15.1.4','勋章制图、快捷键与随身睡具'],
 ['2.8.15.1.3','怪物角色夜视与远古织影者'],
 ['2.8.15.1.2','永不妥协测试版积水涟漪修复'],
 ['2.8.15.1.1','WX-78 附身备份分身热修'],
 ['2.8.15.1.0','WX-78 正式方案、落水回收与天体英雄优化'],
 ['2.8.15.0.46','永不妥协运行性能优化'],
 ['2.8.15.0.45','WX-78 草案修复与怀表命名'],
 ['2.8.15.0.44','游戏内简介补充致谢'],
 ['2.8.15.0.43','界面拖拽、天体后裔重做与荒野求生录开关'],
 ['2.8.15.0.41','远古织影者草案取消冷却减半'],
 ['2.8.15.0.40','机器人耗电调整与远古织影者草案'],
 ['2.8.15.0.39','角色快捷键、WX-78 激光与新界 Boss 兼容'],
 ['2.8.15.0.38','WX-78 草案修复'],
 ['2.8.15.0.37','WX-78 草案测试更新'],
 ['2.8.15.0.36','制作栏崩溃修复'],
 ['2.8.15.0.35','器械箱尺寸、小糖豆与随身蜘蛛修复'],
 ['2.8.15.0.34','专属道具与腿靴显示比例'],
 ['2.8.15.0.33','器械箱贴图与破冰特效'],
 ['2.8.15.0.32','寒霜之祠皮肤、器械箱与织影夜莓'],
 ['2.8.15.0.31','角色右键、滑行与材料修理'],
 ['2.8.15.0.30','WX-78方案与暗影魔法续费'],
 ['2.8.15.0.29','旧空间迁移与换装'],
 ['2.8.15.0.28','双尾心、自动产魂与火腿棒'],
 ['2.8.15.0.27','战斗收益与火腿棒皮肤'],
 ['2.8.15.0.26','智能锅、护目镜与韦伯随从'],
 ['2.8.15.0.25','角色技能、体型掉落与穿越恢复'],
 ['2.8.15.0.24','深埋之下饥饿上限与秋季复苏兼容'],
 ['2.8.15.0.23','薇诺娜电气改造、过充与工作修复'],
 ['2.8.15.0.22','圆形玻璃弹、天体同步与妥协运行优化'],
 ['2.8.15.0.19','牛铃、法杖、腿靴与月火斩修复'],
 ['2.8.15.0.17','模组五格锅兼容与影子转化修复'],
 ['2.8.15.0.16','五格锅与智能料理预告'],
 ['2.8.15.0.15','蝙蝠分身与魔术帽保存回档修复'],
 ['2.8.15.0.12','刮地皮头盔、睡眠与手部换装修复'],
 ['2.8.15.0.10','可选生存模式与私有难度查询'],
 ['2.8.15.0.9','穿越三档、默认原版与旧枢纽迁移'],
 ['2.8.15.0.8','暗影空间、注能显示与生命来源修复'],
 ['2.8.15.0.7','新战斗默认档、动态减伤与眼球伞修复'],
 ['2.8.15.0.6','跨层共享空间与动态减伤调整'],
 ['2.8.15.0.5','特殊容器穿越兼容与存取优化'],
 ['2.8.15.0.4','容器穿越与快捷存放交互'],
 ['2.8.15.0.3','钓具空间与容器交互恢复'],
 ['2.8.15.0.2','容器请求崩溃修复'],
 ['2.8.15.0.1','鼠潮关闭后的播报修复'],
 ['2.8.15.0','暗影枢纽、60 tick、料理与角色增强'],
 ['2.8.14.98.6','缩短穿越等待并修复两处崩溃'],
 ['2.8.14.98.2','世界协同、巨兽摧毁与岛屿冒险修复'],
 ['2.8.14.98.1','角色夜视合并、暗影分身与兼容修复'],
 ['2.8.14.98','游戏内 Wiki、角色修复与寒霜美术更新'],
 ['2.8.14.97.4','穿越机制、性能优化与陷阱必中'],
 ['2.8.14.97.3','多人穿越与交互修复'],
 ['2.8.14.97.2','沃尔特弹弓权限修正'],
 ['2.8.14.97.1','弹弓崩溃热修'],
 ['2.8.14.97','夜视、炮塔与穿越更新'],
 ['2.8.14.96.1','淬炼之季更名'],
 ['2.8.14.96','战斗机制与角色修复'],
];
await fs.mkdir(path.join(root,'releases'),{recursive:true});
for(const [v,releaseTitle] of releaseIndex){
 const file=`update-notes-${v}.txt`,copy=path.join(root,'releases',file);
 try{await fs.copyFile(path.join(root,'../workshop',file),copy);}catch(e){if(e.code!=='ENOENT')throw e;}
 const releaseText=(await fs.readFile(copy,'utf8')).replace(/，由 Yucca 持续维护与调整/g,'');
 await fs.writeFile(copy,releaseText);
 const lines=releaseText.replace(/^\uFEFF/,'').trim().split(/\r?\n/);if(lines[0].startsWith(v)||lines[0].startsWith('淬炼之季 '+v))lines.shift();
 const sections=[];let section={title:'更新内容',paragraphs:[],list:[]};
 for(let k=0;k<lines.length;k++){
  const line=lines[k].trim();if(!line)continue;
  const heading=/^【(.+)】$/.exec(line),plain=!heading&&!line.startsWith('·')&&line.length<20&&lines[k+1]?.trim().startsWith('·');
  if(heading||plain){if(section.paragraphs.length||section.list.length)sections.push(section);section={title:heading?heading[1]:line,paragraphs:[],list:[]};}
  else if(line.startsWith('·'))section.list.push(line.slice(1).trim());else section.paragraphs.push(line);
 }
 if(section.paragraphs.length||section.list.length)sections.push(section);
 articles.push({id:`update-${v.replaceAll('.','-')}`,title:`v${v}`,category:'updates',tag:v===meta.version?'当前版本':'历史版本',summary:releaseTitle,keywords:`版本 更新 日志 ${v}`,sections,release:true,configKeys:[],source:[`workshop/${file}`]});
}
applyArticleTerminology(articles);
const articleMap=new Map(articles.map(a=>[a.id,a])),configMap=new Map(configs.map(c=>[c.key,c]));
if(articleMap.size!==articles.length)throw Error('Duplicate article IDs');
const counts={articles:articles.length,configs:configs.length,choices:configs.reduce((n,c)=>n+c.options.length,0)};
const categories=temperedTopics;
for(const article of articles){
 article.topic=temperedTopic(article);
 article.subtopic=temperedSubtopic(article);
 article.relatedTopics=temperedRelatedTopics(article);
}
const catName=id=>categories.find(c=>c.id===id)?.name??id;
const symbols={search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4 4"/>',globe:'<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/>',menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',close:'<path d="M6 6L18 18M18 6L6 18"/>',sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 1.5 1.5M5 19l1.5-1.5M17.5 6.5 1.5-1.5"/>',arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>',link:'<path d="m9 15 6-6M8 16l-2 2a4 4 0 0 1-6-6l4-4a4 4 0 0 1 6 0M16 8l2-2a4 4 0 0 1 6 6l-4 4a4 4 0 0 1-6 0" transform="translate(0 -1) scale(.92)"/>',star:'<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3l-5.6 2.9 1.1-6.2L3 9.6l6.2-.9Z"/>',book:'<path d="M12 6v15M12 6C9 3 5 3 2 4v15c3-1 7-1 10 2 3-3 7-3 10-2V4c-3-1-7-1-10 2Z"/>',external:'<path d="M14 4h6v6M20 4 10 14M10 4H4v16h16v-6"/>'};
const icon=(name,size=18)=>`<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${symbols[name]??symbols.book}</svg>`;
for(const [term,key] of Object.entries(iconLabels)){
 if(!iconManifest[key])throw Error('Missing icon '+key+' for '+term);
}
const terms=new Map(Object.entries(iconLabels));
for(const name of [...protectedIconNames,...articles.filter(a=>['items','food','creatures','buildings'].includes(a.category)).map(a=>a.title)]){
 if(!terms.has(name))terms.set(name,null);
}
for(const term of Object.keys(iconLabels).filter(t=>t.length>1)){
 for(const suffix of ['蓝图','图纸']){
  const name=term+suffix;
  if(!terms.get(name))terms.set(name,'blueprint');
 }
}
const termRegex=new RegExp([...terms.keys()].sort((a,b)=>b.length-a.length).map(t=>t.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|'),'gu');
const termTargets=new Map();
for(const term of Object.keys(iconLabels)){const a=articles.find(a=>a.title===term)??articles.find(a=>a.title.startsWith(term+' ·'));if(a)termTargets.set(term,a.id);}
function isSingleItem(text,start){
 const before=text.slice(0,start),after=text.slice(start+1);
 const listStart=/(?:^|[，,、；;：:（(/／→])\s*$/u.test(before);
 const listEnd=/^\s*(?:[×x]\s*)?\d*(?:\s*(?:个|根|块|份))?\s*(?:$|[，,、；;。)）/／→])/u.test(after);
 return listStart&&listEnd;
}
function rich(text,self='',linkTerms=true){
 let last=0,html='';text=String(text??'');
 for(const match of text.matchAll(termRegex)){
  const term=match[0],asset=iconManifest[terms.get(term)];
  if(!asset||(term.length===1&&!isSingleItem(text,match.index)))continue;
  html+=esc(text.slice(last,match.index));const target=linkTerms&&termTargets.get(term);
  const label=`${esc(term.slice(0,-1))}<span class="icon-tail">${esc(term.slice(-1))}<img class="inline-icon" src="${asset.path}" alt="" width="24" height="24" loading="lazy"></span>`;
  html+=target&&target!==self?`<a class="term-link" href="${href(target)}">${label}</a>`:`<span class="item-term">${label}</span>`;last=match.index+term.length;
 }return html+esc(text.slice(last));
}
function articleIcon(a){
 const topic=a.title.split(/\s+·\s+/u)[0];
 return iconManifest[a.icon??iconLabels[a.title]??iconLabels[topic]]?.path??null;
}
const articleLink=id=>{const a=articleMap.get(id);if(!a)throw Error('Missing linked article '+id);return `<a href="${href(id)}">${esc(a.title)} ${icon('arrow',13)}</a>`;};
function configLink(key){const c=configMap.get(key);if(!c)throw Error('Missing config '+key);return `<a href="settings.html#${c.id}">${esc(c.label)}</a>`;}
function optionSummary(c){const opt=defaultChoice(c);return choiceText(opt)+(c.options.filter(o=>o.label===opt?.label).length>1&&opt?.description?' · '+opt.description:'');}
function tableHTML(t,s,a){return `<div class="table-wrap" tabindex="0" role="region" aria-label="${esc(s.title)}" style="--table-columns:${t.headers.length}"><table><thead><tr>${t.headers.map(h=>`<th scope="col">${rich(h,a.id,false)}</th>`).join('')}</tr></thead><tbody>${t.rows.map(row=>`<tr>${row.map(c=>`<td>${rich(c,a.id)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;}
function sectionHTML(s,index,a,continuous=false){
 const level=continuous?3:2,id=`${a.id}-s${index+1}`;
 return `<section class="article-section" id="${id}"><h${level}><a href="#${id}">${rich(s.title,a.id,false)}<span class="anchor-hash">#</span></a></h${level}>${s.callout?`<div class="callout">${rich(s.callout,a.id)}</div>`:''}${s.body?s.body.map(b=>b.heading!=null?`<h${level+1} class="sub-heading">${rich(b.heading,a.id,false)}</h${level+1}>`:b.text!=null?`<p>${rich(b.text,a.id)}</p>`:b.items?`<ul>${b.items.map(p=>`<li>${rich(p,a.id)}</li>`).join('')}</ul>`:tableHTML(b,s,a)).join(''):(s.paragraphs??[]).map(p=>`<p>${rich(p,a.id)}</p>`).join('')+(s.table?tableHTML(s.table,s,a):'')+(s.list?.length?`<ul>${s.list.map(p=>`<li>${rich(p,a.id)}</li>`).join('')}</ul>`:'')}${s.notes?.length?`<details class="source-note"><summary>考据备注</summary>${s.notes.map(n=>`<p>${rich(n,a.id)}</p>`).join('')}</details>`:''}${s.links?`<div class="related-links">${s.links.map(articleLink).join('')}</div>`:''}${s.wikiLinks?`<div class="related-links">${s.wikiLinks.map(l=>`<a href="${esc(l.url)}">${esc(l.label)}</a>`).join('')}</div>`:''}${s.externalLinks?`<div class="related-links">${s.externalLinks.map(l=>`<a href="${esc(l.url)}" target="_blank" rel="noopener noreferrer">${esc(l.label)} ${icon('external',13)}</a>`).join('')}</div>`:''}</section>`;
}
function configStrip(a){
 if(!a.configKeys.length)return '';
 const rows=a.configKeys.map(k=>{const c=configMap.get(k);return `<tr><th scope="row">${configLink(k)}</th><td>${esc(optionSummary(c))}</td><td>${c.requires.length?c.requires.map(configLink).join('、'):'无模式前提'}${c.note.conditions?`<small>${rich(c.note.conditions,a.id)}</small>`:''}</td></tr>`;}).join('');
 return `<details class="article-config"><summary>相关配置 <span>${a.configKeys.length}</span></summary><p class="entry-config-note">以下为模组默认值，实际效果取决于房间设置。点击配置名称可查看全部档位。</p><div class="table-wrap entry-config-table" tabindex="0" role="region" aria-label="${esc(a.title)}相关配置"><table><thead><tr><th scope="col">配置</th><th scope="col">默认</th><th scope="col">还需开启</th></tr></thead><tbody>${rows}</tbody></table></div></details>`;
}
const {ordered,articleHTML,shell,visual,categoryNav,settingsIntro,groupSidebar}=createUI({articles,configs,groups,categories,meta,esc,icon,articleIcon,sectionHTML,configStrip,counts});
const changes=articles.filter(article=>article.release).slice(0,5).map((article,idx)=>
 `<li><a href="${href(article.id)}"><strong class="release-ver">${esc(article.title)}</strong>${idx===0?'<span class="release-badge">当前</span>':''}<span>${esc(article.summary)}</span>${icon('arrow',14)}</a></li>`).join('');
const topicCardCount=cid=>articles.filter(a=>a.topic===cid||a.relatedTopics?.includes(cid)).length;
const homeTopicCards=categories.map(cat=>{
 const img=cat.icon&&iconManifest[cat.icon]?.path;
 return `<a class="home-topic-card" href="tempered.html?category=${cat.id}#encyclopedia">${img?`<img src="${img}" alt="" width="36" height="36" loading="lazy">`: `<span class="home-topic-icon">${icon('book',20)}</span>`}<span><strong>${esc(cat.name)} <small>${topicCardCount(cat.id)}</small></strong><small>${esc(cat.description||'')}</small></span>${icon('arrow',14)}</a>`;
}).join('');
const overview=`<article class="tempered-overview">
 <header class="tempered-intro">
  <img src="assets/workshop-cover.png" alt="" width="128" height="128">
  <div class="tempered-intro-copy">
   <p class="tempered-version">v${esc(meta.version)}${meta.date?` · ${esc(meta.date)}`:''}</p>
   <h1>淬炼之季</h1>
   <p>《<a href="${esc(meta.originalWorkshop)}" target="_blank" rel="noopener noreferrer">为爽而虐</a>》的二改模组。开启暗影世界、体验战斗险境，并按房间偏好调整角色、生物和生存机制。</p>
   <div class="tempered-cta-row">
    <a class="tempered-enter" href="tempered.html#encyclopedia">进入词条 ${icon('arrow',15)}</a>
    <a class="tempered-secondary-cta" href="settings.html">配置大全 <span>${counts.configs}</span></a>
    <a class="tempered-secondary-cta" href="getting-started.html">新手入门</a>
   </div>
  </div>
 </header>
 <section class="home-topics" aria-labelledby="home-topics-title">
  <header class="section-bar"><h2 id="home-topics-title">按板块浏览</h2><a href="directory.html">全部 ${counts.articles} 篇索引 ${icon('arrow',13)}</a></header>
  <div class="home-topic-grid">${homeTopicCards}</div>
 </section>
 <nav class="tempered-quick-links" aria-label="常用入口">
  <span class="quick-links-label">热门直达</span>
  <a href="world-shadow.html">暗影世界</a>
  <a href="combat.html">战斗险境</a>
  <a href="armor.html">巨兽装甲</a>
  <a href="containers.html">快捷收集与存放</a>
  <a href="world-random-size.html">随机生物大小</a>
  <a href="role-wx78.html">WX-78 电路</a>
  <a href="settings-guide.html">配置阅读指南</a>
 </nav>
 <section class="tempered-changes" aria-labelledby="recent-changes">
  <header class="section-bar"><h2 id="recent-changes">近期更新</h2><a href="tempered.html?category=updates#encyclopedia">全部版本 ${icon('arrow',13)}</a></header>
  <ul>${changes}</ul>
 </section>
</article>`;
await fs.writeFile(path.join(out,'tempered-home.html'),shell('overview','模组主页','淬炼之季模组简介、近期更新和百科入口。',overview));
const home='<header class="catalog-home-link" data-default-category="featured"><div><h1>淬炼百科</h1><p>收录 '+counts.articles+' 篇源码核对词条，支持按分类、子分类或关键字快速定位。</p></div><a class="catalog-directory-link" href="directory.html">分类总览 '+icon('arrow',13)+'</a></header>'+categoryNav('<div class="empty-state" id="entry-empty" hidden>没有匹配的词条，请调整搜索或切换分类。</div>'+ordered.map(a=>articleHTML(a,true)).join(''));
await fs.writeFile(path.join(out,'tempered.html'),shell('index','百科全览',`${counts.articles}篇玩法解析与${counts.configs}项配置，淬炼之季中文Wiki。`,home));
const configHTML=c=>{
 const opt=defaultChoice(c),warn=c.note.status==='inactive'?'当前未生效':c.note.status?'与菜单说明不同':'';
 const optionDescription=o=>{if(['boss_damagetake','boss_damagetake2','notboss_damagetake','notboss_damagetake2'].includes(c.key))return typeof o.value==='number'?`实际保留 ${Math.round((1-o.value)*100)}% ${c.key.endsWith('2')?'生命损失':'战斗伤害'}；当前计算为 1−${o.value}。`:'不额外修改此项伤害比例。';return o.description||(o.value===false?'此档采用界面所示的禁用或范围选择，具体行为见上方说明。':c.description||'按此档位选择，作用范围见上方说明。');};
 const opts=c.options.map(o=>`<tr ${o.value===c.default?'class="default-row"':''}><td>${esc(choiceText(o))}${o.value===c.default?'<span class="default-badge">默认</span>':''}</td><td>${esc(optionDescription(o))}</td><td><code>${esc(rawValue(o.value))}</code></td></tr>`).join('');
 const related=articles.filter(a=>a.configKeys.includes(c.key));
 return `<details class="config-card" id="${c.id}" data-config="${c.id}" data-mode="${esc(c.mode)}" data-group="${c.groupId}" data-default="${c.default===false?'off':'on'}"><summary><span class="config-summary-copy"><span class="config-title">${esc(c.label)}${warn?'<em class="warning-badge">'+warn+'</em>':''}</span><span class="config-summary-note">${esc(c.note.paragraphs?.[0]||c.description||'展开查看作用、生效条件与全部档位。')}</span></span><span class="config-default" data-default-state="${c.default===false?'off':'on'}"><span>默认</span><strong>${esc(choiceText(opt))}</strong></span></summary><div class="config-content"><p class="config-path">${esc(c.mode)} / ${esc(c.group)} <a href="#${c.id}" class="config-anchor" aria-label="定位${esc(c.label)}">#</a></p><p class="config-description">${rich(c.description||c.label)}</p>${c.note.paragraphs?.length?`<div class="${warn?'implementation-note':'config-explanation'}">${warn?`<strong>${warn}</strong>`:''}${c.note.paragraphs.map(p=>`<p>${rich(p)}</p>`).join('')}</div>`:''}<div class="requirements"><span>生效条件</span>${c.requires.length?c.requires.map(configLink).join('<span class="plus">+</span>'):'<span>不依赖简单 / 困难模式的分类总开关</span>'}${c.note.conditions?`<p>${rich(c.note.conditions)}</p>`:''}</div><h3>可选档位 <span>${c.options.length}</span></h3><div class="table-wrap" tabindex="0" role="region" aria-label="${esc(c.label)}可选档位"><table><thead><tr><th>界面选项</th><th>档位说明</th><th>存档值</th></tr></thead><tbody>${opts}</tbody></table></div>${related.length?`<div class="related-links"><span>玩法解析</span>${related.map(a=>articleLink(a.id)).join('')}</div>`:''}<details class="source-note"><summary>服主配置键与核对来源</summary><code>${esc(c.key)}</code><p>配置定义：modinfo.lua 第 ${c.line} 行。${c.references.length?'关联实现：'+[...new Set(c.references.map(r=>r.file))].map(esc).join('、'):''}</p></details></div></details>`;
};
const settings=settingsIntro()+'<div class="empty-state" id="config-empty" hidden>没有匹配的设置，请调整搜索或筛选条件。</div>'+groups.map(g=>'<section class="config-group" data-config-group="'+g.id+'" data-group-mode="'+esc(g.mode)+'"><h2 id="'+g.id+'">'+(g.mode===g.name?'':'<span class="config-mode-label" data-mode="'+esc(g.mode)+'">'+esc(g.mode)+'</span>')+esc(g.name)+'<small data-group-count>'+g.configs.length+' 项</small></h2>'+g.configs.map(configHTML).join('')+'</section>').join('');
const settingsSidebar=groupSidebar(groups,{title:'配置分组'});
await fs.writeFile(path.join(out,'settings.html'),shell('settings','配置大全',`全部${counts.configs}项模组配置、默认值、档位、生效条件和注意事项。`,settings,'',settingsSidebar));
const directoryJump=`<nav class="directory-jump" aria-label="快速跳转分类">${categories.map(cat=>`<a href="#dir-${cat.id}">${esc(cat.name)} <small>${articles.filter(a=>a.topic===cat.id).length}</small></a>`).join('')}</nav>`;
const directory=`<div class="wiki-heading"><div><span class="eyebrow">ALL ENTRIES</span><h1>分类索引</h1><p>按模组板块一次浏览全部 ${counts.articles} 篇角色、机制、物品与更新词条。</p></div>${directoryJump}</div>${categories.map(cat=>`<section class="directory-group" id="dir-${cat.id}"><h2>${cat.name}<small>${articles.filter(a=>a.topic===cat.id).length} 篇</small></h2><div class="directory-grid">${articles.filter(a=>a.topic===cat.id).map(a=>{const img=visual(a);return `<a href="${href(a.id)}">${img?`<span class="dir-icon-wrap"><img src="${img}" width="36" height="36" alt="" loading="lazy"></span>`:`<span class="directory-symbol">${icon('book',18)}</span>`}<span><strong>${esc(a.title)}</strong><small>${esc(a.summary)}</small></span></a>`;}).join('')}</div></section>`).join('')}`;
await fs.writeFile(path.join(out,'directory.html'),shell('directory','分类索引','按分类查阅全部机制、角色、道具、建筑、食物与生物条目。',directory));
for(const a of articles){
 const toc=`<aside class="toc" aria-label="本页目录"><div class="toc-inner"><h2>本页目录</h2><nav>${a.sections.map((s,i)=>`<a href="#${a.id}-s${i+1}">${esc(s.title)}</a>`).join('')}</nav>${a.configKeys.length?`<h2>相关配置 <small>${a.configKeys.length}</small></h2><div class="toc-config">${a.configKeys.slice(0,12).map(configLink).join('')}${a.configKeys.length>12?`<a class="toc-more-cfg" href="#${a.id}-settings">查看全部 ${a.configKeys.length} 项 →</a>`:''}</div>`:''}</div></aside>`;
 const peers=articles.filter(p=>p.topic===a.topic),position=peers.findIndex(p=>p.id===a.id);
 const adjacent='<nav class="adjacent-entries" aria-label="继续查阅">'+[peers[position-1],peers[position+1]].map((p,i)=>p?'<a href="'+p.id+'.html"><small>'+(i===0?'← 上一篇':'下一篇 →')+'</small><strong>'+esc(p.title)+'</strong></a>':'<span></span>').join('')+'</nav>';
 const body=`<nav class="breadcrumbs" aria-label="当前位置"><a href="tempered.html">百科首页</a><span>/</span><a href="tempered.html?category=${a.topic}#encyclopedia">${catName(a.topic)}</a><span>/</span><span>${esc(a.title)}</span></nav>${articleHTML(a)}${adjacent}<div class="article-bottom"><span>按 v${meta.version} 核对 · ${meta.date}</span><a href="tempered.html?category=${a.topic}#entry-${a.id}">返回${catName(a.topic)} ${icon('arrow',13)}</a></div>`;
 await fs.writeFile(path.join(out,href(a.id)),shell(a.id,a.title,a.summary,body,toc));
}
const articleIndex=articles.map(a=>({id:a.id,href:href(a.id),kind:'article',title:a.title,category:catName(a.topic),categoryId:a.topic,topic:a.topic,summary:a.summary,aliases:a.aliases??[],keywords:[a.keywords,...a.configKeys].join(' '),text:a.sections.map(s=>[s.title,s.callout,...(s.paragraphs??[]),...(s.list??[]),...(s.table?.rows.flat()??[]),...(s.body?.filter(x=>x.rows).slice(1).flatMap(x=>x.rows.flat())??[]),...(s.body?.filter(x=>x.heading).map(x=>x.heading)??[])].filter(Boolean).join(' ')).join(' '),image:visual(a)??undefined}));
const configIndex=configs.map(c=>({id:c.id,href:'settings.html#'+c.id,kind:'config',title:c.label,category:c.mode+' / '+c.group,defaultValue:choiceText(defaultChoice(c)),summary:c.note.paragraphs?.[0]||c.description||`默认：${optionSummary(c)}`,keywords:c.key,text:[c.description,...(c.note.paragraphs??[]),...c.options.flatMap(o=>[o.label,o.description,rawValue(o.value)]),...c.requires.map(k=>configMap.get(k).label)].join(' '),status:c.note.status||''}));
await fs.writeFile(path.join(out,'search-index.js'),`window.WIKI_INDEX=${JSON.stringify([...articleIndex,...configIndex]).replaceAll('<','\\u003c')};\n`);
await fs.writeFile(path.join(out,'navigation-index.js'),`window.WIKI_INDEX=${JSON.stringify(articleIndex.map(({id,title,summary,href,category,aliases,kind,image})=>({id,title,summary,href,category,aliases,kind,image}))).replaceAll('<','\\u003c')};\n`);
await fs.cp(path.join(root,'assets'),path.join(out,'assets'),{recursive:true});
for(const [src,dest] of [['wiki.js','app.js'],['theme.js','theme.js'],['search.js','search.js']])await fs.copyFile(path.join(root,'src',src),path.join(out,dest));
await fs.writeFile(path.join(out,wikiStylesFilename),wikiStyles);
await fs.writeFile(path.join(root,'content-sources.json'),JSON.stringify({version:meta.version,checkedAt:meta.date,targetedRefresh:[...currentAuditIds],articles:articles.map(({id,source,configKeys,auditedVersion})=>({id,source,configKeys,auditedVersion})),configs:configs.map(c=>({key:c.key,id:c.id,sourceLine:c.line,status:c.note.status??'documented',requires:c.requires}))},null,2)+'\n');
const lifeTargets=articles.filter(a=>a.category==='food'||(a.category==='creatures'&&!a.id.startsWith('boss-')));
const entityTargets=articles.filter(a=>a.category==='characters'||a.category==='buildings'||a.id.startsWith('boss-'));
await fs.writeFile(path.join(root,'coverage.json'),JSON.stringify({...counts,targetedRefresh:{version:meta.version,articles:[...currentAuditIds],count:currentAuditIds.size},sourceAuditVersions:Object.fromEntries([...new Set(articles.map(a=>a.auditedVersion).filter(Boolean))].map(v=>[v,articles.filter(a=>a.auditedVersion===v).length])),groups:groups.length,images:Object.keys(iconManifest).length,itemAudit:{version:meta.version,articles:itemAuditIds.size,items:articles.filter(a=>a.category==='items'&&itemAuditIds.has(a.id)).length,missing:articles.filter(a=>a.category==='items'&&!itemAuditIds.has(a.id)).map(a=>a.id)},entityAudit:{version:meta.version,articles:entityAuditIds.size,characters:entityTargets.filter(a=>a.category==='characters'&&entityAuditIds.has(a.id)).length,buildings:entityTargets.filter(a=>a.category==='buildings'&&entityAuditIds.has(a.id)).length,bosses:entityTargets.filter(a=>a.id.startsWith('boss-')&&entityAuditIds.has(a.id)).length,missing:entityTargets.filter(a=>!entityAuditIds.has(a.id)).map(a=>a.id)},lifeAudit:{version:meta.version,articles:lifeAuditIds.size,food:lifeTargets.filter(a=>a.category==='food'&&lifeAuditIds.has(a.id)).length,creatures:lifeTargets.filter(a=>a.category==='creatures'&&lifeAuditIds.has(a.id)).length,missing:lifeTargets.filter(a=>!lifeAuditIds.has(a.id)).map(a=>a.id)},notedSettings:configs.filter(c=>c.note.paragraphs?.length).length,implementationDifferences:configs.filter(c=>c.note.status).map(c=>({key:c.key,label:c.label,status:c.note.status})),unlinkedSettings:configs.filter(c=>!articles.some(a=>a.configKeys.includes(c.key))).map(c=>c.key)},null,2)+'\n');
await buildHub(out,meta,icon,[...articleIndex,...configIndex]);
console.log(`Built ${counts.articles+3} Tempered pages, ${counts.articles} articles, all ${counts.configs} settings and ${counts.choices} choices.`);
