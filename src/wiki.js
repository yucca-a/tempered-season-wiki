(() => {
 const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
 const index=window.WIKI_INDEX||[], normalize=s=>String(s||'').normalize('NFKC').toLowerCase().replace(/\s+/g,' ').trim();
 const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k))??f;}catch{return f;}}, save=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));}catch{}};

 const toastEl=$('#wiki-toast');
 let toastTimer;
 function showToast(msg){
  if(!toastEl)return;
  toastEl.textContent=msg;
  toastEl.hidden=false;
  toastEl.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>{toastEl.classList.remove('visible');toastTimer=setTimeout(()=>{toastEl.hidden=true;},200);},1800);
 }

 function copyUrl(url,msg='已复制链接'){
  if(navigator.clipboard?.writeText){
   navigator.clipboard.writeText(url).then(()=>showToast(msg)).catch(()=>showToast('链接已定位'));
  }else{
   showToast('链接已定位');
  }
 }

 // Record recent article visits for Portal Hub and Ctrl+K quick jump.
 const wikiId=document.body.dataset.wiki||'tempered';
 const articleTitle=document.body.dataset.articleTitle;
 if(articleTitle){
  const pageFile=location.pathname.split('/').pop()||'';
  const relHref=wikiId==='um-beta'?'um-beta/'+pageFile:pageFile;
  const recent=read('dst-wiki-recent',[]);
  const next=[{href:relHref,title:articleTitle,wiki:wikiId},...(Array.isArray(recent)?recent.filter(r=>r.href!==relHref):[])].slice(0,8);
  save('dst-wiki-recent',next);
 }

 let hay, lastQueryKey='', lastParsed=null;
 const compact=s=>normalize(s).replace(/[\s.\-_·、()（）/]/g,'');
 function matches(id,q){
  if(!q)return true;
  const eng=window.WIKI_SEARCH_ENGINE;
  if(eng){
   hay??=new Map(index.map(a=>[a.id,eng.prepareItem(a)]));
   const item=hay.get(id);
   if(!item)return false;
   if(q!==lastQueryKey){lastQueryKey=q;lastParsed=eng.parseQuery(q);}
   return eng.scoreEntry(item,lastParsed).score>0;
  }
  hay??=new Map(index.map(a=>{
   const full=normalize([a.title,a.summary,a.keywords,a.text,a.category,...(a.aliases??[])].join(' '));
   return [a.id,{full,compact:compact(full)}];
  }));
  const item=hay.get(id);
  if(!item)return false;
  return q.split(' ').filter(Boolean).every(t=>{const tc=compact(t);return item.full.includes(t)||item.compact.includes(tc);});
 }

 const setHidden=(node,value)=>{if(node&&node.hidden!==value)node.hidden=value;};
 const setText=(node,value)=>{value=String(value);if(node&&node.textContent!==value)node.textContent=value;};

 const entryInput=$('#entry-filter'), configInput=$('#config-filter');
 const entryNodes=$$('[data-entry]'), configNodes=$$('[data-config]');
 const configGroups=$$('[data-config-group]').map(node=>({
  node, id:node.dataset.configGroup, mode:node.dataset.groupMode||'',
  countEl:node.querySelector('[data-group-count]'),
  sidebarLink:document.querySelector(`[data-sidebar-group="${node.dataset.configGroup}"]`),
  cards:[...node.querySelectorAll('[data-config]')],
 }));
 const bookmarkButtons=$$('[data-bookmark]'), categoryChoices=$$('[data-category-choice]'), configModeButtons=$$('[data-config-mode]');
 const subcategoryGroups=$$('[data-category-parent]');
 const categoryParents=new Map(subcategoryGroups.flatMap(group=>
  [...group.querySelectorAll('[data-category-choice]')].filter(c=>c.dataset.categoryChoice!==group.dataset.categoryParent)
   .map(choice=>[choice.dataset.categoryChoice,group.dataset.categoryParent])));
 const categoryLabels=new Map(categoryChoices.map(c=>[c.dataset.categoryChoice,c.querySelector('span')?.textContent.trim()||c.textContent.trim()]));
 const welcome=$('#welcome');
 const entriesBox=$('.catalog-entries');
 const updatesBanner=$('#updates-banner');

 let entryTimer, configTimer;
 function bindDebouncedInput(input,run,kind){
  let composing=false,timer;
  const cancel=()=>{clearTimeout(timer);timer=undefined;};
  const schedule=()=>{cancel();timer=setTimeout(()=>{timer=undefined;run();},90);};
  input.addEventListener('compositionstart',()=>{composing=true;cancel();});
  input.addEventListener('compositionend',()=>{composing=false;schedule();});
  input.addEventListener('input',event=>{if(!composing&&!event.isComposing)schedule();});
  if(kind==='entry')entryTimer=cancel;
  else if(kind==='config')configTimer=cancel;
 }

 const bookmarkKey=wikiId+'-wiki-bookmarks';
 let bookmarkData=read(bookmarkKey,[]), bookmarks=new Set(Array.isArray(bookmarkData)?bookmarkData:[]), onlyBookmarks=false;
 function updateBookmarks(){
  bookmarkButtons.forEach(b=>{
   const active=bookmarks.has(b.dataset.bookmark);
   if(b.getAttribute('aria-pressed')!==String(active))b.setAttribute('aria-pressed',String(active));
   b.title=active?'取消收藏':'收藏词条';
  });
  setText($('#bookmark-count'),bookmarks.size);
  const headerBadge=$('#header-bookmark-count');
  if(headerBadge){setText(headerBadge,bookmarks.size);setHidden(headerBadge,bookmarks.size===0);}
 }
 updateBookmarks();
 bookmarkButtons.forEach(b=>b.addEventListener('click',e=>{
  e.preventDefault();e.stopPropagation();
  const id=b.dataset.bookmark;
  const added=!bookmarks.has(id);
  if(added)bookmarks.add(id);else bookmarks.delete(id);
  save(bookmarkKey,[...bookmarks]);
  updateBookmarks();
  showToast(added?'已加入收藏':'已取消收藏');
  if(onlyBookmarks)filterEntries();
 }));

 const themeButton=$('#theme-toggle');
 function themeLabel(){
  if(!themeButton)return;
  const dark=document.documentElement.dataset.theme==='dark';
  const label=dark?'切换到浅色模式':'切换到深色模式';
  themeButton.setAttribute('aria-label',label);themeButton.title=label;
 }
 themeLabel();
 themeButton?.addEventListener('click',()=>{
  const theme=document.documentElement.dataset.theme==='dark'?'light':'dark';
  document.documentElement.dataset.theme=theme;
  try{localStorage.setItem('tempered-wiki-theme',theme);}catch{}
  themeLabel();
 });

 const fontButtons=$$('#font-toggle');
 function fontLabel(){
  const large=document.documentElement.dataset.font==='large';
  fontButtons.forEach(b=>{b.setAttribute('aria-label',large?'恢复标准字号':'增大阅读字号');b.setAttribute('aria-pressed',String(large));});
 }
 fontLabel();
 fontButtons.forEach(b=>b.addEventListener('click',()=>{
  const large=document.documentElement.dataset.font!=='large';
  const font=large?'large':'normal';
  document.documentElement.dataset.font=font;
  try{localStorage.setItem('tempered-wiki-font',font);}catch{}
  fontLabel();
  showToast(large?'已切换大号阅读字号':'已恢复标准阅读字号');
 }));

 const defaultCategory=$('[data-default-category]')?.dataset.defaultCategory??'featured';
 const legacyCategories=wikiId==='tempered'
  ? {buildings:'item-buildings',food:'qol-mechanics','item-food':'qol-mechanics','other-survival':'qol-survival'}
  : {buildings:'items',food:'items'};
 const validCategories=new Set(categoryChoices.map(c=>c.dataset.categoryChoice));
 let currentCategory=validCategories.has(defaultCategory)?defaultCategory:'all';
 let visibleAnchor=null;

 function matchesCategory(node,cat){
  if(cat==='all')return true;
  if(cat==='featured')return node.dataset.featured==='true';
  return node.dataset.category===cat||node.dataset.subcategory===cat||Boolean(node.dataset.relatedCategories?.split(' ').includes(cat));
 }

 function filterEntries(persist=true,anchorEntry=null){
  if(!entryInput)return;
  entryTimer?.();
  const q=normalize(entryInput.value);
  const effectiveCat=(q||onlyBookmarks)?'all':currentCategory;
  visibleAnchor=anchorEntry;
  let count=0;
  for(const node of entryNodes){
   const visible=anchorEntry
    ? node===anchorEntry
    : matches(node.dataset.entry,q)&&matchesCategory(node,effectiveCat)&&(!onlyBookmarks||bookmarks.has(node.dataset.entry));
   setHidden(node,!visible);
   if(!node.hidden)count++;
  }
  const showMixedTags=effectiveCat==='featured'||effectiveCat==='all'||!!q||onlyBookmarks;
  entriesBox?.classList.toggle('show-cat-tags',showMixedTags);
  entriesBox?.classList.toggle('is-updates',effectiveCat==='updates'&&!q&&!onlyBookmarks);
  setHidden(updatesBanner,!(effectiveCat==='updates'&&!q&&!onlyBookmarks));

  const title=onlyBookmarks?'我的收藏':q?'搜索结果':(categoryLabels.get(currentCategory)||'百科词条');
  setText($('#catalog-title'),title);
  const status=q?`匹配 ${count} / ${entryNodes.length} 项`:`共 ${count} 项${onlyBookmarks?' · 仅看收藏':''}`;
  setText($('#entry-status'),status);
  setHidden($('#clear-filter'),!q);
  setHidden($('#entry-empty'),count>0);
  setHidden(welcome,!!q||onlyBookmarks||!!anchorEntry||(currentCategory!==defaultCategory));
  setHidden($('#reset-entries'),!q&&!onlyBookmarks&&currentCategory===defaultCategory&&!anchorEntry);

  const parent=categoryParents.get(currentCategory);
  const activeParent=parent??currentCategory;
  for(const group of subcategoryGroups)setHidden(group,group.dataset.categoryParent!==activeParent||!!q||onlyBookmarks);
  for(const node of categoryChoices){
   const choice=node.dataset.categoryChoice;
   const isSubLink=Boolean(node.closest('[data-category-parent]'));
   const active=isSubLink?(choice===currentCategory):(choice===currentCategory||choice===parent);
   if(active){if(node.getAttribute('aria-current')!=='true')node.setAttribute('aria-current','true');}
   else if(node.hasAttribute('aria-current'))node.removeAttribute('aria-current');
  }
  if(persist){
   const url=new URL(location.href);
   if(currentCategory===defaultCategory)url.searchParams.delete('category');
   else url.searchParams.set('category',currentCategory);
   history.replaceState(null,'',url);
  }
 }

 const initialQuery=new URLSearchParams(location.search).get('q');
 function showCategory(){
  const url=new URL(location.href);url.hash='encyclopedia';history.replaceState(null,'',url);
  $('#catalog-title')?.focus({preventScroll:true});
  $('#encyclopedia')?.scrollIntoView({block:'start'});
 }

 if(entryInput){
  if(initialQuery!==null)entryInput.value=initialQuery;
  bindDebouncedInput(entryInput,()=>filterEntries(),'entry');
  $('#only-bookmarks')?.addEventListener('click',()=>{
   onlyBookmarks=!onlyBookmarks;
   $('#only-bookmarks').setAttribute('aria-pressed',String(onlyBookmarks));
   filterEntries();
  });
  const requested=new URLSearchParams(location.search).get('category');
  const mapped=legacyCategories[requested]??requested;
  if(mapped&&validCategories.has(mapped))currentCategory=mapped;
  filterEntries(false);

  categoryChoices.forEach(a=>a.addEventListener('click',e=>{
   if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
   e.preventDefault();
   onlyBookmarks=false;
   $('#only-bookmarks')?.setAttribute('aria-pressed','false');
   currentCategory=a.dataset.categoryChoice;
   filterEntries();
   showCategory();
  }));
  $('#reset-entries')?.addEventListener('click',()=>{
   entryInput.value='';
   currentCategory=defaultCategory;
   onlyBookmarks=false;
   $('#only-bookmarks')?.setAttribute('aria-pressed','false');
   filterEntries();
  });
 }

 const configData=new Map(index.filter(a=>a.kind==='config').map(a=>[a.id,a]));
 const sidebarSections=$$('[data-sidebar-section]');
 const sidebarTotal=$('[data-sidebar-total]');
 let currentMode='all';
 function filterConfigs(){
  if(!configInput)return;
  configTimer?.();
  const q=normalize(configInput.value), state=$('#config-state')?.value||'all';
  let count=0, visibleGroups=0;
  for(const group of configGroups){
   let groupVisible=0;
   for(const node of group.cards){
    const hidden=!(matches(node.id,q)&&(currentMode==='all'||node.dataset.mode===currentMode)&&(state==='all'||state===node.dataset.default||(state==='notes'&&configData.get(node.id)?.status)));
    setHidden(node,hidden);
    if(!hidden){count++;groupVisible++;}
   }
   setHidden(group.node,groupVisible===0);
   if(groupVisible>0)visibleGroups++;
   if(group.countEl)setText(group.countEl,groupVisible+' 项');
   if(group.sidebarLink){
    setHidden(group.sidebarLink,groupVisible===0);
    const sc=group.sidebarLink.querySelector('[data-sidebar-count]');
    if(sc)setText(sc,groupVisible);
   }
  }
  for(const sec of sidebarSections){
   setHidden(sec,![...sec.querySelectorAll('[data-sidebar-group]')].some(a=>!a.hidden));
  }
  if(sidebarTotal)setText(sidebarTotal,visibleGroups+' 组');
  const status=`显示 ${count} / ${configData.size} 项设置`;
  setText($('#config-status'),status);
  setHidden($('#config-empty'),count>0);
  setHidden($('#clear-filter'),!q);
  document.body.classList.toggle('config-filtering',!!q||currentMode!=='all'||state!=='all');
  for(const node of configModeButtons){
   const value=String(node.dataset.configMode===currentMode);
   if(node.getAttribute('aria-pressed')!==value)node.setAttribute('aria-pressed',value);
  }
 }

 if(configInput){
  if(initialQuery!==null)configInput.value=initialQuery;
  bindDebouncedInput(configInput,filterConfigs,'config');
  configModeButtons.forEach(b=>b.addEventListener('click',()=>{currentMode=b.dataset.configMode;filterConfigs();}));
  $('#config-state')?.addEventListener('change',filterConfigs);
  $('#expand-configs')?.addEventListener('click',()=>{for(const c of configNodes)if(!c.hidden)c.open=true;});
  $('#collapse-configs')?.addEventListener('click',()=>{for(const c of configNodes)c.open=false;});
  filterConfigs();
 }

 function revealHash(){
  let id;try{id=decodeURIComponent(location.hash.slice(1));}catch{return;}
  const target=id?document.getElementById(id):null;
  const entry=target?.closest('[data-entry]');
  if(visibleAnchor&&entry!==visibleAnchor)filterEntries(false);
  if(!id)return;
  if(!target){
   if(entryInput){
    const article=index.find(a=>a.kind==='article'&&id.startsWith(a.id+'-s')&&/^\d+$/.test(id.slice(a.id.length+2)));
    if(article)location.replace(new URL(article.href.split('#')[0]+'#'+encodeURIComponent(id),location.href).href);
   }
   return;
  }
  if(entryInput&&entry?.hidden){
   entryInput.value='';currentCategory=entry.dataset.category||'all';onlyBookmarks=false;
   $('#only-bookmarks')?.setAttribute('aria-pressed','false');
   filterEntries(true);
  }
  const config=target.closest('[data-config]');
  if(config){
   if(config.hidden){configInput.value='';currentMode='all';if($('#config-state'))$('#config-state').value='all';filterConfigs();}
   config.open=true;
  }
  if(target.matches('.config-group>h2')){
   const group=target.closest('.config-group');
   if(group.hidden){configInput.value='';currentMode='all';if($('#config-state'))$('#config-state').value='all';filterConfigs();}
  }
  let parent=target.parentElement;
  while(parent){if(parent.tagName==='DETAILS')parent.open=true;parent=parent.parentElement;}
  requestAnimationFrame(()=>target.scrollIntoView({block:'start'}));
 }
 window.addEventListener('hashchange',revealHash);
 revealHash();

 const headerInput=entryInput||configInput||$('#recipe-filter')||$('#header-search');
 if(headerInput){
  const widePlaceholder=headerInput.placeholder, compactHeader=matchMedia('(max-width:700px)');
  function searchPlaceholder(){headerInput.placeholder=compactHeader.matches?'搜索…':widePlaceholder;}
  searchPlaceholder();compactHeader.addEventListener('change',searchPlaceholder);
  $('#clear-filter')?.addEventListener('click',()=>{
   headerInput.value='';
   if(entryInput)filterEntries();
   else if(configInput)filterConfigs();
   else headerInput.dispatchEvent(new Event('input',{bubbles:true}));
   headerInput.focus();
  });
 }

 const actions=$('#actions-menu'), actionsButton=$('#actions-toggle');
 function closeActions(){if(!actions||!actionsButton)return;delete actions.dataset.open;actionsButton.setAttribute('aria-expanded','false');}
 actionsButton?.addEventListener('click',()=>{
  const open=actionsButton.getAttribute('aria-expanded')!=='true';
  actionsButton.setAttribute('aria-expanded',String(open));
  if(open)actions.dataset.open='';else closeActions();
 });
 document.addEventListener('click',e=>{if(!e.target.closest('.site-actions'))closeActions();});
 document.addEventListener('keydown',e=>{if(e.key==='Escape')closeActions();});

 const bookmarksDialog=$('#bookmarks-dialog');
 function showBookmarks(){
  closeActions();
  if(!bookmarksDialog)return;
  $('#bookmarks-list').innerHTML=index.filter(a=>a.kind==='article'&&bookmarks.has(a.id)).map(a=>
   `<a class="search-result" href="${esc(a.href)}"><span class="result-category">${esc(a.category)}</span><strong>${esc(a.title)}</strong><p>${esc(a.summary)}</p></a>`
  ).join('')||'<div class="empty-state">还没有收藏词条。点击词条右上角的星标即可加入。</div>';
  bookmarksDialog.showModal();
 }
 $('#mobile-bookmarks')?.addEventListener('click',showBookmarks);
 if(!entryInput)$('#only-bookmarks')?.addEventListener('click',showBookmarks);
 $('#bookmarks-close')?.addEventListener('click',()=>bookmarksDialog?.close());
 bookmarksDialog?.addEventListener('click',e=>{
  if(e.target!==bookmarksDialog)return;
  const r=bookmarksDialog.getBoundingClientRect();
  if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)bookmarksDialog.close();
 });

 // Copy page / section link with toast feedback.
 $$('[data-copy-link]').forEach(btn=>btn.addEventListener('click',()=>{
  copyUrl(location.href.split('#')[0],'已复制当前词条链接');
 }));
 $$('.article-section h2 > a, .article-section h3 > a, .config-anchor').forEach(a=>a.addEventListener('click',()=>{
  const url=new URL(a.getAttribute('href'),location.href).href;
  copyUrl(url,'已复制定位链接');
 }));

 // Reading progress bar + scroll-aware back-to-top button.
 const backTop=$('#back-top');
 const progressBar=$('#reading-progress');
 let scrollTicking=false;
 function onScroll(){
  scrollTicking=false;
  const y=window.scrollY;
  if(backTop)setHidden(backTop,y<360);
  if(progressBar){
   const max=document.documentElement.scrollHeight-window.innerHeight;
   const ratio=max>0?Math.min(1,Math.max(0,y/max)):0;
   progressBar.style.transform=`scaleX(${ratio})`;
  }
 }
 window.addEventListener('scroll',()=>{if(!scrollTicking){scrollTicking=true;requestAnimationFrame(onScroll);}},{passive:true});
 onScroll();
 backTop?.addEventListener('click',()=>window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'}));

 // Scrollspy for right article TOC and left group sidebar.
 function bindScrollspy(links,targets,hashFn){
  if(!links.length||!targets.length||!('IntersectionObserver'in window))return;
  const observer=new IntersectionObserver(entries=>{
   const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>a.boundingClientRect.top-b.boundingClientRect.top);
   if(!visible[0])return;
   const activeHash=hashFn(visible[0].target);
   links.forEach(a=>{
    const active=a.hash===activeHash;
    a.classList.toggle('active',active);
    if(active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');
   });
  },{rootMargin:'-84px 0px -65% 0px'});
  targets.forEach(t=>observer.observe(t));
 }
 bindScrollspy($$('.toc nav a'),$$('.article-section'),el=>'#'+el.id);
 bindScrollspy($$('.group-sidebar-nav a'),$$('.config-group > h2[id]'),el=>'#'+el.id);
})();
