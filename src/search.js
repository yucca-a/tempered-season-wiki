(() => {
 const dialog=document.querySelector('#search-dialog');
 if(!dialog)return;
 const input=dialog.querySelector('#search-input');
 const results=dialog.querySelector('#search-results');
 const status=dialog.querySelector('#search-meta');
 const branch=dialog.querySelector('#search-wiki');
 const kinds=[...dialog.querySelectorAll('[data-kind]')];
 const indexUrl=new URL(dialog.dataset.index,location.href);
 const wikiNames={tempered:'淬炼之季','um-beta':'永不妥协测试版'};
 const kindNames={article:'词条',config:'配置',recipe:'配方',item:'新增物品',entity:'实体图鉴',materials:'材料改动'};
 const normalize=text=>String(text??'').normalize('NFKC').toLowerCase().replace(/\s+/g,' ').trim();
 const compact=text=>normalize(text).replace(/[\s.\-_·、()（）/]/g,'');
 const escape=text=>String(text??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const escapeRegex=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
 const querySynonyms=[
  [['老瓦头','瓦头','老瓦甲','瓦甲','瓦套','老瓦套','瓦器头盔','瓦器盔甲','瓦格斯塔夫盔甲','瓦格斯塔夫头盔','warbis','wagpunk'],['warbis','wagpunk','w.a.r.b.i.s.']],
  [['犀牛角'],['守护者之角','远古守护者']],
  [['瓜皮头','刮皮头','刮地皮头','蚁狮头','蚁狮帽'],['刮地皮头盔']],
  [['熊罐','熊桶','大熊罐'],['极地熊獾桶']],
  [['影刀'],['暗夜剑']],
  [['影甲'],['魂甲']],
  [['眼球塔','眼球炮台'],['眼睛炮塔']],
  [['三基佬','暗影三基佬'],['暗影棋子']],
  [['蛤蟆','毒蛤','大蛤蟆'],['毒菌蟾蜍']],
  [['蜂后'],['蜂王']],
  [['熊大'],['熊獾']],
  [['巨鹿'],['独眼巨鹿']],
  [['织影','骨头架子'],['远古织影者']],
  [['避茄针','防亮茄'],['冰眼结晶器']],
  [['火甲','龙鳞甲'],['鳞甲']],
  [['启迪头','启迪皇冠','天体头'],['启迪之冠']],
  [['火女'],['薇洛']],
  [['老麦','麦克斯韦'],['麦斯威尔']],
  [['老奶奶'],['薇克巴顿']],
  [['机器人','wx78'],['wx-78']],
  [['女工'],['薇诺娜']],
  [['女武神'],['薇格弗德']],
  [['植物人'],['沃姆伍德']],
  [['小恶魔','恶魔人'],['沃拓克斯']],
  [['表姐','钟表匠'],['旺达']],
  [['鱼妹'],['沃特']],
  [['大厨','厨师'],['沃利']],
  [['大力士'],['沃尔夫冈']],
  [['蜘蛛人'],['韦伯']],
  [['鬼女'],['温蒂']],
 ];
 function expandTerm(term){
  const tc=compact(term), out=new Set([term,tc]);
  for(const [triggers,targets] of querySynonyms){
   if(triggers.some(k=>tc===compact(k)||tc.includes(compact(k)))){
    for(const t of targets){out.add(t);out.add(compact(t));}
   }
  }
  return [...out].filter(Boolean);
 }

 function mark(text,terms){
  text=String(text??'');
  if(!terms||!terms.length)return escape(text);
  const pattern=terms.filter(Boolean).sort((a,b)=>b.length-a.length).map(escapeRegex).join('|');
  if(!pattern)return escape(text);
  const re=new RegExp(pattern,'gi');
  let out='',last=0,m;
  while((m=re.exec(text))!==null){
   out+=escape(text.slice(last,m.index))+'<mark>'+escape(m[0])+'</mark>';
   last=m.index+m[0].length;
   if(!m[0].length)re.lastIndex++;
  }
  return out+escape(text.slice(last));
 }

 function prepare(entries,base,wiki){
  return entries.map(entry=>{
   const titleKey=normalize(entry.title), aliasesKey=(entry.aliases??[]).map(normalize);
   const hay=normalize([entry.title,entry.summary,entry.keywords,entry.text,entry.category,...(entry.aliases??[])].join(' '));
   return {...entry,wiki:entry.wiki??wiki,url:new URL(entry.href,base).href,imageUrl:entry.image?new URL(entry.image,base).href:null,
    titleKey, titleCompact:compact(titleKey), summaryKey:normalize(entry.summary), keywordsKey:normalize(entry.keywords),
    aliasesKey, aliasesCompact:aliasesKey.map(compact), hay, hayCompact:compact(hay),
   };
  });
 }

 let entries=[],localPrepared=false,globalPrepared=false;
 let kind='all',selected=-1,loading=false,failed=false,loadStarted=false,pendingEnter=null;
 let renderTimer=0,composing=false,renderedQuery=null;
 function cancelRender(){if(renderTimer)clearTimeout(renderTimer);renderTimer=0;}
 function scheduleRender(){
  cancelRender();
  if(!dialog.open)return;
  renderTimer=setTimeout(()=>{renderTimer=0;if(dialog.open&&!composing)render();},90);
 }
 function useLocalIndex(){
  if(localPrepared||globalPrepared)return;
  entries=prepare(window.WIKI_INDEX??[],location.href,document.body.dataset.wiki);
  localPrepared=true;
 }
 function useGlobalIndex(){
  if(!globalPrepared){entries=prepare(window.WIKI_GLOBAL_INDEX,indexUrl);globalPrepared=true;}
  failed=false;
 }
 function finishLoading(){
  const pending=pendingEnter;
  pendingEnter=null;
  if(!dialog.open||composing)return;
  render();
  if(pending?.query!==input.value)return;
  const links=[...results.querySelectorAll('a')];
  (links.find(a=>a.href===pending.url)??links[0])?.click();
 }
 function loadIndex(){
  if(window.WIKI_GLOBAL_INDEX){useGlobalIndex();return;}
  if(loadStarted)return;
  loadStarted=true;
  if(failed)useLocalIndex();
  loading=true;failed=false;
  const script=document.createElement('script');
  script.src=indexUrl.href;
  script.onload=()=>{
   loading=false;
   if(window.WIKI_GLOBAL_INDEX){if(dialog.open)useGlobalIndex();}
   else {failed=true;loadStarted=false;script.remove();if(dialog.open)useLocalIndex();}
   finishLoading();
  };
  script.onerror=()=>{loading=false;failed=true;loadStarted=false;script.remove();if(dialog.open)useLocalIndex();finishLoading();};
  document.head.append(script);
 }
 function rank(entry,q,termGroups){
  const qc=compact(q);
  const aliasExact=entry.aliasesKey.includes(q)||entry.aliasesCompact.includes(qc);
  if(entry.jump)return aliasExact?1000:0;
  if(!termGroups.every(group=>group.some(t=>entry.hay.includes(t)||entry.hayCompact.includes(t))))return 0;
  const titleExact=entry.titleKey===q||entry.titleCompact===qc;
  const titleStart=entry.titleKey.startsWith(q)||entry.titleCompact.startsWith(qc);
  const titleSub=entry.titleKey.includes(q)||entry.titleCompact.includes(qc);
  const aliasStart=entry.aliasesKey.some(a=>a.startsWith(q))||entry.aliasesCompact.some(a=>a.startsWith(qc));
  const aliasSub=entry.aliasesKey.some(a=>a.includes(q))||entry.aliasesCompact.some(a=>a.includes(qc));
  return 1+(titleExact?95:titleStart?52:titleSub?34:0)
   +(aliasExact?88:aliasStart?42:aliasSub?34:0)
   +(entry.keywordsKey===q?72:entry.keywordsKey.includes(q)?14:0)
   +(entry.summaryKey.includes(q)?7:0);
 }

 function recentHTML(){
  let items=[];
  try{items=JSON.parse(localStorage.getItem('dst-wiki-recent')||'[]');}catch{}
  if(!Array.isArray(items)||!items.length)return '';
  const filtered=items.filter(item=>branch.value==='all'||branch.value===item.wiki).slice(0,5);
  if(!filtered.length)return '';
  const rootBase=new URL('./',indexUrl);
  return `<div class="search-section-label">最近浏览</div>`+filtered.map(item=>{
   const url=new URL(item.href,rootBase).href;
   return `<a class="search-result search-result-compact" href="${escape(url)}"><span class="result-badges"><span class="result-wiki-pill" data-wiki-tag="${escape(item.wiki)}">${escape(wikiNames[item.wiki]||item.wiki)}</span></span><strong>${escape(item.title)}</strong><span class="result-enter" aria-hidden="true">↵</span></a>`;
  }).join('')+`<div class="search-section-label">推荐词条</div>`;
 }

 function render(){
  cancelRender();
  if(!dialog.open)return;
  renderedQuery=input.value;
  const raw=input.value.trim();
  const q=normalize(raw);
  const qc=compact(raw);
  const terms=q.split(' ').filter(Boolean);
  const termGroups=terms.map(expandTerm);
  const rawTerms=raw.split(/\s+/).filter(Boolean);
  const seen=new Set();
  const candidates=entries.filter(e=>(kind==='all'||kind===e.kind||kind==='item'&&e.topic==='new-items')&&(branch.value==='all'||branch.value===e.wiki));
  const ranked=q?candidates.map(e=>({e,score:rank(e,q,termGroups)})).filter(r=>r.score).sort((a,b)=>b.score-a.score).map(r=>r.e):
   candidates.filter(e=>!e.jump&&(kind!=='all'||e.featured||['getting-started','settings-guide','combat','armor','world-exchange','eyeturret','role-wx78','world-shadow'].includes(e.id)));
  const unique=ranked.filter(e=>!seen.has(e.url)&&seen.add(e.url));
  const shown=unique.slice(0,q?70:14);
  status.textContent=loading?'正在载入两套 Wiki 的索引…':failed?(entries.length?'全站索引暂时无法载入，显示当前百科的结果。':'全站索引暂时无法载入，请关闭后重新打开搜索。'):
   q?`找到 ${unique.length} 个结果${unique.length>70?' · 先显示前 70 条':''}`:'可搜索词条、俗称、配置键、产物或材料（支持空格多词组合）';

  const prefix=!q&&kind==='all'?recentHTML():'';
  results.innerHTML=shown.length?prefix+shown.map(e=>{
   let snippet=e.summary;
   const aliasMatched=q&&(e.aliasesKey.some(a=>a.includes(q))||e.aliasesCompact.some(a=>a.includes(qc)));
   if(e.jump)snippet='直达 · '+snippet;
   else if(aliasMatched)snippet='常用称呼 · '+e.aliases.join('、');
   else if(q&&!e.summaryKey.includes(q)){
    const text=String(e.text??'');
    const firstTerm=rawTerms.find(t=>text.toLowerCase().includes(t.toLowerCase()))||raw;
    const hit=text.toLowerCase().indexOf(firstTerm.toLowerCase());
    if(hit>=0)snippet=(hit>24?'…':'')+text.slice(Math.max(0,hit-24),hit+105)+'…';
   }
   const defPill=e.kind==='config'&&e.defaultValue?`<span class="result-default-pill">默认 ${escape(e.defaultValue)}</span>`:'';
   return `<a class="search-result" href="${escape(e.url)}"><div class="result-badges"><span class="result-wiki-pill" data-wiki-tag="${escape(e.wiki)}">${escape(wikiNames[e.wiki]||'')}</span><span class="result-kind-pill">${escape(kindNames[e.kind]||'')}</span>${e.category?`<span class="result-category">${escape(e.category)}</span>`:''}${defPill}</div><strong>${e.imageUrl?`<img class="search-item-icon" src="${escape(e.imageUrl)}" alt="" width="20" height="20" loading="lazy">`:''}${mark(e.title,rawTerms)}</strong><p>${mark(String(snippet??'').slice(0,156),rawTerms)}</p><span class="result-enter" aria-hidden="true">↵</span></a>`;
  }).join(''):(loading?'':'<div class="empty-state">没有找到匹配的内容，试试简称、配置键或材料名。</div>');
  selected=-1;
 }
 function open(){
  document.dispatchEvent(new Event('wiki-search-open'));
  if(!dialog.open)dialog.showModal();
  loadIndex();
  render();
  input.focus();
 }
 document.querySelectorAll('[data-search]').forEach(button=>button.addEventListener('click',open));
 const headerSearch=document.querySelector('#header-search');
 function openFromHeader(){input.value=headerSearch.value;open();}
 headerSearch?.addEventListener('click',openFromHeader);
 headerSearch?.addEventListener('input',event=>{if(!event.isComposing)openFromHeader();});
 headerSearch?.addEventListener('compositionend',()=>{if(headerSearch.value.trim())openFromHeader();});
 headerSearch?.addEventListener('keydown',event=>{
  if(event.key==='Enter'&&!event.isComposing){event.preventDefault();openFromHeader();}
 });
 dialog.querySelector('#search-close').addEventListener('click',()=>dialog.close());
 input.addEventListener('compositionstart',()=>{composing=true;pendingEnter=null;cancelRender();});
 input.addEventListener('compositionend',()=>{composing=false;pendingEnter=null;scheduleRender();});
 input.addEventListener('input',event=>{
  pendingEnter=null;
  if(composing||event.isComposing){cancelRender();return;}
  scheduleRender();
 });
 branch.addEventListener('change',()=>{pendingEnter=null;render();});
 kinds.forEach(button=>button.addEventListener('click',()=>{
  pendingEnter=null;
  kind=button.dataset.kind;
  kinds.forEach(item=>{item.classList.toggle('active',item===button);item.setAttribute('aria-pressed',String(item===button));});
  render();input.focus();
 }));
 dialog.addEventListener('close',()=>{pendingEnter=null;composing=false;cancelRender();});
 dialog.addEventListener('click',event=>{
  if(event.target!==dialog)return;
  const r=dialog.getBoundingClientRect();
  if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();
 });
 results.addEventListener('click',event=>{if(event.target.closest('a'))dialog.close();});
 dialog.addEventListener('keydown',event=>{
  if(event.key==='Escape'&&!event.isComposing&&!composing){
   event.preventDefault();
   dialog.close();
   return;
  }
  if(event.isComposing||composing||event.target===branch)return;
  if((event.key==='ArrowDown'||event.key==='ArrowUp'||event.key==='Enter')&&
    (renderTimer||renderedQuery!==input.value))render();
  const links=[...results.querySelectorAll('a')];
  if(event.key==='ArrowDown'||event.key==='ArrowUp'){
   event.preventDefault();
   if(!links.length)return;
   selected=selected<0?(event.key==='ArrowDown'?0:links.length-1):
    (selected+(event.key==='ArrowDown'?1:-1)+links.length)%links.length;
   links.forEach((a,i)=>a.classList.toggle('selected',i===selected));
   links[selected].scrollIntoView({block:'nearest'});
  }else if(event.key==='Enter'&&event.target===input){
   event.preventDefault();
   if(loading)pendingEnter={query:input.value,url:links[selected]?.href};
   else links[Math.max(0,selected)]?.click();
  }
 });
 document.addEventListener('keydown',event=>{
  const active=document.activeElement;
  const typing=/INPUT|TEXTAREA|SELECT/.test(active?.tagName)||active?.isContentEditable;
  if(((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='k')||(event.key==='/'&&!typing)){
   event.preventDefault();open();
  }
 });
})();
