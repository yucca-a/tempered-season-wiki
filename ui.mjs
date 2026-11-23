import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';

const appVersion=createHash('sha256').update(readFileSync(new URL('./src/wiki.js',import.meta.url))).digest('hex').slice(0,12);
export const wikiStyles=['wiki.css','refinements.css'].map(file=>readFileSync(new URL('./src/'+file,import.meta.url),'utf8')).join('\n');
export const wikiStylesFilename='styles-'+createHash('sha256').update(wikiStyles).digest('hex').slice(0,12)+'.css';

export const searchDialog=(icon,assets='')=>`<dialog id="search-dialog" data-index="${assets}global-search-index.js" aria-labelledby="search-title"><div class="search-dialog-head">${icon('search',18)}<label class="sr-only" id="search-title" for="search-input">搜索 Wiki</label><input type="search" id="search-input" autocomplete="off" placeholder="搜索名称、数值、别名、操作或配置键…"><button id="search-close" class="icon-button" aria-label="关闭搜索">${icon('close',17)}</button></div><div class="search-toolbar"><div class="search-kind" role="group" aria-label="搜索范围"><button class="active" data-kind="all" aria-pressed="true">全部</button><button data-kind="article" aria-pressed="false">词条</button><button data-kind="config" aria-pressed="false">配置</button><button data-kind="recipe" aria-pressed="false">配方</button><button data-kind="item" aria-pressed="false">物品</button></div><label class="search-wiki"><span class="sr-only">搜索模组</span><select id="search-wiki" aria-label="搜索模组"><option value="all">全部模组</option><option value="tempered">淬炼之季</option><option value="um-beta">永不妥协测试版</option></select></label></div><div class="search-meta" id="search-meta" role="status" aria-live="polite"></div><div id="search-results"></div><div class="search-hint"><span><kbd>↑</kbd> <kbd>↓</kbd> 选择 · <kbd>Enter</kbd> 打开</span><span><kbd>Esc</kbd> 关闭</span></div></dialog>`;

export function createUI({articles,configs,groups,categories,meta,esc,icon,articleIcon,sectionHTML,configStrip,counts,site={},extraEntries=[]}) {
 const {name='淬炼之季',subtitle='Tempered Season Wiki',home='tempered.html',settings='settings.html',sources='about.html',hub='index.html',assets='',mark='assets/workshop-cover-icon.png',id='tempered',recipeNav=[],extraStyles=''}=site;
 const names=Object.fromEntries(categories.map(c=>[c.id,c.name]));
 const colors={start:'#64748b',mechanics:'#d97706',world:'#7c3aed',characters:'#2563eb',items:'#dc2626',buildings:'#0284c7',food:'#ca8a04',creatures:'#db2777','new-items':'#ea580c','quality-of-life':'#0d9488',updates:'#64748b'};
 const defaultFeatured=['getting-started','settings-guide','combat','armor','world-shadow','world-random-size','configuration','world-exchange','containers','equipment-repair','skill-tree','right-click-actions','role-wx78','frost-core'];
 const featured=site.featured?.length?site.featured:defaultFeatured;
 const featuredSet=new Set(featured);
 const ranked=[...featured.map(fid=>articles.find(a=>a.id===fid)).filter(Boolean),...categories.map(c=>c.id).flatMap(cat=>articles.filter(a=>(a.topic??a.category)===cat))];
 const ordered=[...new Map(ranked.map(a=>[a.id,a])).values()];
 const configMap=new Map(configs.map(c=>[c.key,c]));
 const svg=(body,size=18)=>`<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
 const moon='<svg class="theme-moon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z"/></svg>';
 const sun='<svg class="theme-sun" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/></svg>';
 const heart=svg('<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>');
 const game=svg('<path d="M6 5h12a3 3 0 0 1 3 2.7l1 9.1a2 2 0 0 1-3.4 1.6L16 16H8l-2.6 2.4A2 2 0 0 1 2 16.8l1-9.1A3 3 0 0 1 6 5Z"/><path d="M7 8v6M4 11h6m6-1h.01M19 13h.01"/>');
 const dots=svg('<circle cx="5" cy="12" r="1.2"/><circle cx="12" cy="12" r="1.2"/><circle cx="19" cy="12" r="1.2"/>');
 const gridIcon=svg('<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>');
 const slidersIcon=svg('<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M2 14h4M10 8h4M18 16h4"/>');
 const topicIcons={combat:'nightsword',armor:'armorruins','world-shadow':'nightmarefuel','world-random-size':'lifeinjector',configuration:'gears','world-exchange':'townportal',containers:'bundlewrap','world-shadow-companions':'chester_eyebone','world-shadow-target':'shadowheart','world-shadow-weaken':'horrorfuel','world-ecosystem':'livinglog','world-forgotten-map':'cartographydesk','world-admin-control':'blueprint','world-seasons':'book_temperature','world-long-night':'lantern','world-moonlight':'moonglass','world-sandstorm':'eyebrellahat','world-moon-island':'moonrocknugget','world-humidity':'umbrella','world-summer':'firestaff','world-winter':'icestaff','world-autumn':'book_silviculture','world-ocean-adventure':'boat_item','world-complex-generation':'cartographydesk','world-clockwork-guard':'gears','world-mining-work':'pickaxe','world-ancient-statues':'thulecite','world-ancient-altar':'researchlab4','settings-guide':'blueprint','getting-started':'torch','skill-tree':'researchlab'};
 const visual=a=>articleIcon(a)||(topicIcons[a.id]?`assets/icons/${topicIcons[a.id]}.png`:['world','mechanics','start'].includes(a.category)?(id==='tempered'?'assets/icons/modicon.png':assets+mark):null);
 const chip=(text,color,cls='')=>`<span class="tag${cls?' '+cls:''}" style="--tag-color:${color}"><i></i>${esc(text)}</span>`;
 function modeTags(a){
  const modes=new Set(a.configKeys.flatMap(k=>{const c=configMap.get(k);return[c?.key,...(c?.requires??[])];}));
  return (modes.has('enable easy mode')?chip('简单模式','#16a34a','tag-easy'):'')+(modes.has('enable hard mode')?chip('困难模式','#dc2626','tag-hard'):'');
 }
 function tags(a){
  return chip(names[a.topic??a.category],colors[a.topic??a.category]??'#64748b','tag-cat')+modeTags(a);
 }

 function articleHTML(a,continuous=false){
  const image=visual(a),isFeatured=featuredSet.has(a.id);
  const attrs=`id="entry-${a.id}" data-entry="${a.id}" data-category="${a.topic??a.category}"`
   +(a.subtopic?` data-subcategory="${a.subtopic}"`:'')
   +(a.relatedTopics?.length?` data-related-categories="${a.relatedTopics.join(' ')}"`:'')
   +(isFeatured?' data-featured="true"':'');

  if(continuous){
   if(a.release){
    return `<article class="wiki-entry continuous-entry release-entry" ${attrs}><a class="release-row-link" href="${a.id}.html"><strong class="release-ver">${esc(a.title)}</strong>${a.tag==='当前版本'?'<span class="release-badge">当前</span>':''}<span class="release-summary">${esc(a.summary)}</span>${icon('arrow',14)}</a></article>`;
   }
   const cat=a.topic??a.category;
   const modeHtml=modeTags(a);
   const cfgHtml=a.configKeys.length?`<span class="card-cfg-count">配置 ${a.configKeys.length}</span>`:'';
   return `<article class="wiki-entry continuous-entry" ${attrs}><button class="icon-button bookmark-button card-bookmark" data-bookmark="${a.id}" aria-label="收藏${esc(a.title)}" aria-pressed="false" title="收藏词条">${icon('star',16)}</button><div class="card-top">${image?`<span class="card-icon-wrap"><img class="entry-icon" src="${image}" alt="" width="44" height="44" loading="lazy"></span>`:`<span class="card-icon-wrap card-icon-fallback">${icon('book',20)}</span>`}<div class="card-title-wrap"><h2><a class="card-main-link" href="${a.id}.html">${esc(a.title)}</a></h2><div class="card-meta">${chip(names[cat]??cat,colors[cat]??'#64748b','tag-cat')}${modeHtml}${cfgHtml}</div></div></div><p class="entry-lead">${esc(a.summary)}</p></article>`;
  }

  const aliases=a.aliases?.length?'<p class="role-aliases"><span>常用称呼</span> '+esc(a.aliases.join('、'))+'</p>':'';
  const outline=a.sections.length>1?'<nav class="entry-outline" aria-label="本篇内容"><span>目录</span>'+a.sections.map((s,i)=>'<a href="#'+a.id+'-s'+(i+1)+'">'+esc(s.title)+'</a>').join('')+'</nav>':'';
  let related=configStrip(a);
  if(a.auditedVersion||a.configKeys.length<=6)related=related.replace('<details class="article-config">','<details class="article-config" open>');
  const configShortcut=a.configKeys.length?'<a class="entry-config-shortcut" href="#'+a.id+'-settings">'+slidersIcon+' 相关配置 <b>'+a.configKeys.length+'</b></a>':'';
  return `<article class="wiki-entry detail-entry${a.release?' release-entry':''}" ${attrs}><div class="entry-actions"><button class="icon-button copy-link-button" data-copy-link aria-label="复制${esc(a.title)}链接" title="复制页面链接">${icon('link',17)}</button><button class="icon-button bookmark-button" data-bookmark="${a.id}" aria-label="收藏${esc(a.title)}" aria-pressed="false" title="收藏词条">${icon('star',17)}</button></div><header class="entry-head">${image?`<span class="entry-icon-frame"><img class="entry-icon" src="${image}" alt="" width="64" height="64" loading="eager"></span>`:''}<div class="entry-heading-copy"><h1>${esc(a.title)}</h1><div class="entry-meta"><span class="entry-alias">${esc(a.tag||name)}</span><div class="entry-tags">${tags(a)}</div>${configShortcut}</div>${aliases}</div></header><p class="entry-lead">${esc(a.summary)}</p>${outline}${a.release&&a.tag==='历史版本'?'<div class="history-notice">历史日志保留当时说明；当前机制以相应词条和房间配置为准。</div>':''}<div class="entry-body">${a.sections.map((s,i)=>sectionHTML(s,i,a,false)).join('')}</div><div class="entry-bottom" id="${a.id}-settings">${related}${id==='tempered'&&a.auditedVersion&&a.sections.some(s=>/配方|制作/.test(s.title))?'<p class="entry-config-note">开启 <a href="material-danger.html">材料险境</a> 后，制作栏中的材料数量还会随游戏天数变化；该项默认关闭。</p>':''}</div></article>`;
 }

 function primaryNav(current){
  const isArticle=!['overview','index','settings','directory','recipes','field-guide','sources','legacy-items','ingredient-changes'].includes(current);
  const items=id==='tempered'
   ? [['tempered-home.html','主页',current==='overview'],[home,'百科',current==='index'||isArticle],[settings,'配置大全',current==='settings'],['directory.html','分类索引',current==='directory']]
   : [[home,'百科',current==='index'||isArticle],[settings,'配置大全',current==='settings'],['recipes.html','制作与兑换',current==='recipes'||current==='ingredient-changes'],['field-guide.html','实体图鉴',current==='field-guide']];
  return `<nav class="header-nav" aria-label="主导航">${items.map(([href,label,active])=>`<a href="${href}"${active?' aria-current="page"':''}>${label}</a>`).join('')}</nav>`;
 }

 function searchbar(current){
  const isIndex=current==='index',isSettings=current==='settings',isRecipes=current==='recipes'&&recipeNav.length;
  const isFilter=isIndex||isSettings||isRecipes;
  const inputId=isIndex?'entry-filter':isSettings?'config-filter':isRecipes?'recipe-filter':'header-search';
  const indexUnit=extraEntries.length?'项内容':'篇词条';
  const placeholder=isIndex?`筛选 ${counts.articles+extraEntries.length} ${indexUnit}…`:isSettings?`筛选 ${counts.configs} 项配置…`:isRecipes?'筛选产物、材料或配方…':'搜索词条、物品或配置…';
  return `<div class="wiki-discovery"><div class="search-box">${icon('search',16)}<input id="${inputId}" type="search" autocomplete="off" aria-label="${placeholder}" placeholder="${placeholder}"><button id="clear-filter" class="icon-button" aria-label="清除查找" hidden>${icon('close',14)}</button><button type="button" class="global-search-trigger" data-search aria-label="打开全站搜索" title="全站搜索 (Ctrl+K)">${isFilter?`${icon('globe',14)}<span>全站</span>`:''}<kbd>Ctrl K</kbd></button></div></div>`;
 }

 function shell(current,title,description,body,toc='',leftNav=''){
  const isArticle=!['overview','index','settings','directory','recipes','field-guide','sources','legacy-items','ingredient-changes'].includes(current);
  const layoutClass=['layout',toc?'with-toc':'',leftNav?'with-left-nav':''].filter(Boolean).join(' ');
  const homeUrl=id==='tempered'?'tempered-home.html':home;
  return `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light dark"><title>${esc(title)} · ${esc(name)} Wiki</title><meta name="description" content="${esc(description)}"><link rel="icon" type="image/svg+xml" href="${assets}assets/wiki-favicon.svg"><link rel="stylesheet" href="${assets}${wikiStylesFilename}">${extraStyles?`<link rel="stylesheet" href="${extraStyles}">`:''}<script src="${assets}theme.js"></script><script src="${['index','settings'].includes(current)?'search-index.js':'navigation-index.js'}" defer></script><script src="${assets}app.js?v=${appVersion}" defer></script><script src="${assets}search.js" defer></script>${current==='recipes'&&recipeNav.length?'<script src="filter.js" defer></script>':''}</head><body data-page="${current}" data-wiki="${esc(id)}"${isArticle?` data-article-title="${esc(title)}"`:''}><a class="skip-link" href="#main">跳到正文</a>${isArticle?'<div class="reading-progress" id="reading-progress" aria-hidden="true"></div>':''}<header class="site-header"><div class="site-header-inner"><a class="brand" href="${homeUrl}" aria-label="${esc(name)} Wiki 首页"><span class="brand-mark"><img src="${esc(assets+mark)}" alt="" width="36" height="36"></span><span class="brand-text"><strong>${esc(name)}</strong><small>${esc(subtitle)}</small></span></a>${primaryNav(current)}${searchbar(current)}<div class="site-actions"><a class="site-action desktop-hub-link" href="${hub}" aria-label="模组 Wiki 总览" title="切换模组 Wiki">${gridIcon}<span>总览</span></a><button id="actions-toggle" class="site-action" aria-label="页面操作" aria-expanded="false" aria-controls="actions-menu">${dots}</button><div id="actions-menu" class="header-actions"><button class="site-action font-action" id="font-toggle" aria-label="增大阅读字号" title="切换阅读字号">Aa<span>阅读字号</span></button><button class="site-action theme-button" id="theme-toggle" aria-label="切换到深色模式" title="切换浅色/深色主题">${moon}${sun}<span>切换主题</span></button><button class="site-action bookmark-trigger" id="only-bookmarks" aria-label="我的收藏" aria-pressed="false" title="查看收藏词条">${heart}<span>我的收藏</span><em class="action-badge" id="header-bookmark-count" hidden>0</em></button><a class="site-action workshop-link" href="${meta.workshop}" target="_blank" rel="noopener noreferrer" aria-label="在 Steam Workshop 打开模组" title="Steam 创意工坊">${game}<span>创意工坊</span></a></div></div></div></header><div class="${layoutClass}">${leftNav}<main id="main" tabindex="-1">${body}<footer class="site-footer"><span>${counts.articles} 个词条 · <a href="${settings}">${counts.configs} 项配置</a> · v${meta.version}</span><span>${meta.date?`更新于 ${esc(meta.date)} · `:''}<a href="${sources}">来源与署名</a> · <a href="${hub}">模组 Wiki 总览</a></span></footer></main>${toc}</div><nav class="mobile-bar" aria-label="底部导航"><a href="${home}"${current==='index'||isArticle?' aria-current="page"':''}>${icon('book',18)}<span>百科</span></a><a href="${settings}"${current==='settings'?' aria-current="page"':''}>${slidersIcon}<span>配置</span></a><button id="mobile-bookmarks" aria-label="打开收藏词条">${icon('star',18)}<span>收藏 <small id="bookmark-count">0</small></span></button><a href="${hub}">${gridIcon}<span>总览</span></a></nav><button id="back-top" class="back-top" aria-label="回到顶部" hidden>↑</button><div id="wiki-toast" class="wiki-toast" role="status" aria-live="polite" hidden></div>${searchDialog(icon,assets)}<dialog id="bookmarks-dialog" aria-labelledby="bookmarks-title"><div class="search-dialog-head"><strong id="bookmarks-title">收藏词条</strong><button class="icon-button" id="bookmarks-close" aria-label="关闭收藏">${icon('close',17)}</button></div><div id="bookmarks-list"></div></dialog><noscript><div class="noscript">全部正文和配置可直接阅读；搜索、筛选与收藏需要启用 JavaScript。</div></noscript></body></html>`;
 }

 function categoryNav(entries){
  const featuredCount=ordered.filter(a=>featuredSet.has(a.id)).length;
  const catCount=cid=>{
   const matched=new Set();
   for(const a of ordered){
    if((a.topic??a.category)===cid||a.subtopic===cid||a.relatedTopics?.includes(cid))matched.add(a.id);
   }
   for(const e of extraEntries)if(e.category===cid)matched.add(e.id);
   return matched.size;
  };
  const tabLink=(cid,label,n)=>`<a href="${home}?category=${cid}#encyclopedia" data-category-choice="${cid}"><span>${esc(label)}</span>${n!=null?`<small>${n}</small>`:''}</a>`;
  const mainTabs=[
   featuredCount?tabLink('featured','精选推荐',featuredCount):'',
   ...categories.map(c=>tabLink(c.id,c.name,catCount(c.id))),
  ].join('');
  const subcategories=categories.filter(c=>c.children?.length).map(c=>{
   const allInParent=catCount(c.id);
   const childLinks=c.children.map(ch=>tabLink(ch.id,ch.name,catCount(ch.id))).join('');
   return `<nav class="catalog-subtabs" data-category-parent="${c.id}" aria-label="${esc(c.name)}子分类" hidden>${tabLink(c.id,'全部'+c.name,allInParent)}${childLinks}</nav>`;
  }).join('');
  const updatesNotice=categories.some(c=>c.id==='updates')?'<div class="history-notice updates-top-notice" id="updates-banner" hidden>历史日志保留当时说明；当前实际机制以对应玩法词条和房间配置为准。</div>':'';
  return `<section class="catalog-heading" id="encyclopedia" aria-labelledby="catalog-title"><nav class="category-tabs catalog-tabs" aria-label="模组内容分类">${mainTabs}</nav><div class="catalog-title-row"><h2 id="catalog-title" tabindex="-1">精选推荐</h2><span id="entry-status" role="status"></span><button id="reset-entries" hidden>返回推荐</button></div></section><div class="catalog-results">${subcategories}<div class="catalog-main-col">${updatesNotice}<div class="catalog-entries">${entries}</div></div></div>`;
 }

 function groupSidebar(sidebarGroups,{title='配置分组'}={}){
  const hasModes=sidebarGroups.some(g=>g.mode);
  let navHtml='';
  if(hasModes){
   const byMode=new Map();
   for(const g of sidebarGroups){
    const m=g.mode||'其他';
    if(!byMode.has(m))byMode.set(m,[]);
    byMode.get(m).push(g);
   }
   navHtml=[...byMode.entries()].map(([mode,list])=>`<div class="group-sidebar-section" data-sidebar-section="${esc(mode)}"><div class="group-sidebar-mode" data-mode="${esc(mode)}">${esc(mode)}</div>${list.map(g=>`<a href="#${esc(g.id)}" data-sidebar-group="${esc(g.id)}" data-sidebar-mode="${esc(mode)}"><span>${esc(g.name)}</span><small data-sidebar-count>${g.count??g.configs?.length??g.rows?.length??0}</small></a>`).join('')}</div>`).join('');
  }else{
   navHtml=sidebarGroups.map(g=>`<a href="#${esc(g.id)}" data-sidebar-group="${esc(g.id)}"><span>${esc(g.name)}</span><small data-sidebar-count>${g.count??g.configs?.length??g.rows?.length??0}</small></a>`).join('');
  }
  return `<aside class="group-sidebar" aria-label="${esc(title)}"><div class="group-sidebar-head"><strong>${esc(title)}</strong><small data-sidebar-total>${sidebarGroups.length} 组</small></div><nav class="group-sidebar-nav">${navHtml}</nav></aside>`;
 }

 function settingsIntro(){
  const common=[configMap.get('enable easy mode'),configMap.get('enable hard mode'),...['战斗险境','巨兽装甲','穿越机制'].map(label=>configs.find(c=>c.label===label))].filter(Boolean);
  const modes=[...new Set(configs.map(c=>c.mode))];
  const modeCount=m=>configs.filter(c=>c.mode===m).length;
  return '<section class="wiki-entry settings-intro"><header class="entry-head"><span class="entry-icon-frame"><img class="entry-icon" src="assets/icons/gears.png" alt="" width="64" height="64"></span><div class="entry-heading-copy"><h1>配置大全</h1><div class="entry-meta"><span class="entry-alias">'+counts.configs+' 项设置 · '+counts.choices.toLocaleString('en-US')+' 个可选档位</span>'+chip('服主参考','#64748b')+'</div></div></header><p class="entry-lead">把房间调成适合你们的样子。从模式总开关到单件道具，逐项查看作用、默认值和生效条件。</p><div class="settings-onboarding"><ol class="config-reading-steps"><li><span>01</span><div><strong>快速定位</strong><p>用顶部搜索直达配置，或从左侧分组目录跳转。</p></div></li><li><span>02</span><div><strong>核对生效条件</strong><p>子选项启用后，仍可能需要开启上级模式总开关。</p></div></li><li><span>03</span><div><strong>对照房间实际档位</strong><p>页面展示模组默认值，旧世界保留原有房间选择。</p></div></li></ol><div class="settings-guide-links"><span>常查：'+common.map(c=>'<a href="#'+c.id+'">'+esc(c.label)+'</a>').join('')+'</span><a href="settings-guide.html">完整阅读说明 '+icon('arrow',13)+'</a></div></div></section><section class="config-filter-panel" aria-label="配置筛选"><div class="config-mode-tabs"><button data-config-mode="all" aria-pressed="true">全部配置 <small>'+counts.configs+'</small></button>'+modes.map(mode=>'<button data-config-mode="'+esc(mode)+'" aria-pressed="false">'+esc(mode)+' <small>'+modeCount(mode)+'</small></button>').join('')+'</div><div class="settings-tools"><span id="config-status" role="status"></span><div><select id="config-state" aria-label="筛选默认状态"><option value="all">全部状态</option><option value="on">默认有值</option><option value="off">默认 false</option><option value="notes">有实现差异</option></select><button id="expand-configs">全部展开</button><button id="collapse-configs">全部收起</button></div></div></section>';
 }

 return {ordered,articleHTML,shell,visual,categoryNav,settingsIntro,groupSidebar};
}
