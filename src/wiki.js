(() => {
 const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
 const index=window.WIKI_INDEX||[], normalize=s=>String(s||'').toLowerCase().replace(/\s+/g,' ').trim();
 const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k))??f;}catch{return f;}}, save=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));}catch{}};
 // Detail pages only need navigation/bookmark metadata, not a normalized copy
 // of every article. Listing pages build the full-text map on their first query.
 let hay;
 function matches(id,q){
  if(!q)return true;
  hay??=new Map(index.map(a=>[a.id,normalize([a.title,a.summary,a.keywords,a.text,a.category,...(a.aliases??[])].join(' '))]));
  return q.split(' ').filter(Boolean).every(t=>hay.get(id)?.includes(t));
 }
 const setHidden=(node,value)=>{if(node&&node.hidden!==value)node.hidden=value;};
 const setText=(node,value)=>{value=String(value);if(node&&node.textContent!==value)node.textContent=value;};
 const entryInput=$('#entry-filter'),configInput=$('#config-filter');
 const entryNodes=$$('[data-entry]'),configNodes=$$('[data-config]');
 const configGroups=$$('[data-config-group]').map(node=>({node,cards:[...node.querySelectorAll('[data-config]')]}));
 const bookmarkButtons=$$('[data-bookmark]'),categoryChoices=$$('[data-category-choice]'),configModeButtons=$$('[data-config-mode]');
 const subcategoryGroups=$$('[data-category-parent]');
 const categoryParents=new Map(subcategoryGroups.flatMap(group=>
  [...group.querySelectorAll('[data-category-choice]')].map(choice=>[choice.dataset.categoryChoice,group.dataset.categoryParent])));
 const welcome=$('#welcome');
 let entryTimer,configTimer;
 function bindDebouncedInput(input,run,kind){
  let composing=false,timer;
  const cancel=()=>{clearTimeout(timer);timer=undefined;};
  const schedule=()=>{cancel();timer=setTimeout(()=>{timer=undefined;run();},100);};
  input.addEventListener('compositionstart',()=>{composing=true;cancel();});
  input.addEventListener('compositionend',()=>{composing=false;schedule();});
  input.addEventListener('input',event=>{if(!composing&&!event.isComposing)schedule();});
  if(kind==='entry')entryTimer=cancel;
  else if(kind==='config')configTimer=cancel;
 }
 const bookmarkKey=(document.body.dataset.wiki||'tempered')+'-wiki-bookmarks';
 let bookmarkData=read(bookmarkKey,[]), bookmarks=new Set(Array.isArray(bookmarkData)?bookmarkData:[]), onlyBookmarks=false;
 function updateBookmarks(){ bookmarkButtons.forEach(b=>{const active=bookmarks.has(b.dataset.bookmark);if(b.getAttribute('aria-pressed')!==String(active))b.setAttribute('aria-pressed',String(active));b.title=active?'取消收藏':'收藏词条';});setText($('#bookmark-count'),bookmarks.size); }
 updateBookmarks();bookmarkButtons.forEach(b=>b.addEventListener('click',()=>{const id=b.dataset.bookmark;if(bookmarks.has(id))bookmarks.delete(id);else bookmarks.add(id);save(bookmarkKey,[...bookmarks]);updateBookmarks();if(onlyBookmarks)filterEntries();}));
 const themeButton=$('#theme-toggle');function themeLabel(){const dark=document.documentElement.dataset.theme==='dark';themeButton.setAttribute('aria-label',dark?'切换到浅色模式':'切换到深色模式');themeButton.title=themeButton.getAttribute('aria-label');}themeLabel();themeButton.addEventListener('click',()=>{const theme=document.documentElement.dataset.theme==='dark'?'light':'dark';document.documentElement.dataset.theme=theme;try{localStorage.setItem('tempered-wiki-theme',theme);}catch{}themeLabel();});
 const fontButtons=$$('#font-toggle');function fontLabel(){const large=document.documentElement.dataset.font==='large';fontButtons.forEach(b=>{b.setAttribute('aria-label',large?'恢复标准字号':'增大阅读字号');b.setAttribute('aria-pressed',String(large));});}fontLabel();fontButtons.forEach(b=>b.addEventListener('click',()=>{const font=document.documentElement.dataset.font==='large'?'normal':'large';document.documentElement.dataset.font=font;try{localStorage.setItem('tempered-wiki-font',font);}catch{}fontLabel();}));
 let visibleAnchor=null;
 function filterEntries(persist=true,anchorEntry=null){
  if(!entryInput)return;entryTimer?.();
  const q=normalize(entryInput.value),cat=$('#entry-category').value;let count=0;
  const filteringEntries=!!q||cat!=='all'||onlyBookmarks;
  visibleAnchor=filteringEntries?null:anchorEntry;
  for(const node of entryNodes){
   const visible=filteringEntries
    ? matches(node.dataset.entry,q)&&(cat==='all'||node.dataset.category===cat||node.dataset.subcategory===cat||node.dataset.relatedCategories?.split(' ').includes(cat))&&(!onlyBookmarks||bookmarks.has(node.dataset.entry))
    : node===anchorEntry;
   setHidden(node,!visible);
   if(!node.hidden)count++;
  }
  const status=`显示 ${count} / ${entryNodes.length} 项内容${onlyBookmarks?' · 只看收藏':''}`;
  setText($('#entry-status'),filteringEntries?status:'');setText($('#filter-notice'),status);
  setHidden($('#filter-notice'),!q&&!onlyBookmarks);setHidden($('#clear-filter'),!q);setHidden($('#entry-empty'),!filteringEntries||count>0);
  setHidden(welcome,filteringEntries||!!anchorEntry);document.body.classList.toggle('topic-selected',cat!=='all');setHidden($('#reset-entries'),(!filteringEntries||(!q&&!onlyBookmarks&&cat===defaultCategory))&&!anchorEntry);
  setText($('#catalog-title'),cat==='all'?'百科词条':$('#entry-category').selectedOptions[0].text);
  const parent=categoryParents.get(cat);
  for(const group of subcategoryGroups)setHidden(group,group.dataset.categoryParent!==(parent??cat));
  for(const node of categoryChoices){
   if(node.dataset.categoryChoice===cat||node.dataset.categoryChoice===parent){if(node.getAttribute('aria-current')!=='true')node.setAttribute('aria-current','true');}
   else if(node.hasAttribute('aria-current'))node.removeAttribute('aria-current');
  }

  if(persist){const url=new URL(location.href);if(cat==='all')url.searchParams.delete('category');else url.searchParams.set('category',cat);history.replaceState(null,'',url);}

 }
 const initialQuery=new URLSearchParams(location.search).get('q');
 const defaultCategory=$('[data-default-category]')?.dataset.defaultCategory??'all';
 const legacyCategories=document.body.dataset.wiki==='tempered'
  ? {buildings:'item-buildings',food:'qol-mechanics','item-food':'qol-mechanics','other-survival':'qol-survival'}
  : {buildings:'items',food:'items'};
 function showCategory(){
  const url=new URL(location.href);url.hash='encyclopedia';history.replaceState(null,'',url);
  $('#catalog-title').focus({preventScroll:true});$('#encyclopedia').scrollIntoView({block:'start'});
 }
 if(entryInput){if(initialQuery!==null)entryInput.value=initialQuery;bindDebouncedInput(entryInput,filterEntries,'entry');$('#entry-category').addEventListener('change',()=>{filterEntries();showCategory();});$('#only-bookmarks').addEventListener('click',()=>{onlyBookmarks=!onlyBookmarks;$('#only-bookmarks').setAttribute('aria-pressed',String(onlyBookmarks));filterEntries();});const requested=new URLSearchParams(location.search).get('category');const cat=legacyCategories[requested]??requested;if([...$('#entry-category').options].some(o=>o.value===cat))$('#entry-category').value=cat;else if(!initialQuery&&(!location.hash||location.hash==='#encyclopedia'))$('#entry-category').value=defaultCategory;filterEntries(false);}
 if($('#entry-filter')){$$('[data-category-choice]').forEach(a=>a.addEventListener('click',e=>{if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;e.preventDefault();$('#entry-category').value=a.dataset.categoryChoice;filterEntries();showCategory();}));$('#reset-entries').addEventListener('click',()=>{$('#entry-filter').value='';$('#entry-category').value=defaultCategory;onlyBookmarks=false;$('#only-bookmarks').setAttribute('aria-pressed','false');filterEntries();showCategory();});}
 const configData=new Map(index.filter(a=>a.kind==='config').map(a=>[a.id,a]));
 function filterConfigs(){
  if(!configInput)return;configTimer?.();
  const q=normalize(configInput.value),mode=$('#config-mode').value,state=$('#config-state').value;let count=0;
  for(const node of configNodes){
   setHidden(node,!(matches(node.id,q)&&(mode==='all'||node.dataset.mode===mode)&&(state==='all'||state===node.dataset.default||(state==='notes'&&configData.get(node.id)?.status))));
   if(!node.hidden)count++;
  }
  for(const {node,cards} of configGroups)setHidden(node,!cards.some(card=>!card.hidden));
  const status=`显示 ${count} / ${configData.size} 项设置`;
  setText($('#config-status'),status);setText($('#filter-notice'),status);setHidden($('#config-empty'),count>0);setHidden($('#clear-filter'),!q);
  setHidden($('#filter-notice'),!q&&mode==='all'&&state==='all');document.body.classList.toggle('config-filtering',!!q||mode!=='all'||state!=='all');
  for(const node of configModeButtons){const value=String(node.dataset.configMode===mode);if(node.getAttribute('aria-pressed')!==value)node.setAttribute('aria-pressed',value);}

 }
 if(configInput){if(initialQuery!==null)configInput.value=initialQuery;bindDebouncedInput(configInput,filterConfigs,'config');configModeButtons.forEach(b=>b.addEventListener('click',()=>{$('#config-mode').value=b.dataset.configMode;filterConfigs();}));['config-mode','config-state'].forEach(id=>$('#'+id).addEventListener('change',filterConfigs));$('#expand-configs').addEventListener('click',()=>{for(const c of configNodes)if(!c.hidden)c.open=true;});$('#collapse-configs').addEventListener('click',()=>{for(const c of configNodes)c.open=false;});filterConfigs();}
 function revealHash(){
  let id;try{id=decodeURIComponent(location.hash.slice(1));}catch{return;}
  const target=id?document.getElementById(id):null;
  const entry=target?.closest('[data-entry]');
  if(visibleAnchor&&entry!==visibleAnchor)filterEntries(false);
  if(!id)return;
  if(!target){
   // Old full-overview section links now open that article's complete page.
   if(entryInput){
    const article=index.find(a=>a.kind==='article'&&id.startsWith(a.id+'-s')&&/^\d+$/.test(id.slice(a.id.length+2)));
    if(article)location.replace(new URL(article.href.split('#')[0]+'#'+encodeURIComponent(id),location.href).href);
   }
   return;
  }
  if(entry&&target!==entry)entry.classList.add('topic-expanded');
  if(entryInput&&entry?.hidden){entryInput.value='';$('#entry-category').value='all';onlyBookmarks=false;$('#only-bookmarks').setAttribute('aria-pressed','false');filterEntries(true,entry);}
  const config=target.closest('[data-config]');
  if(config){if(config.hidden){configInput.value='';$('#config-mode').value='all';$('#config-state').value='all';filterConfigs();}config.open=true;}
  if(target.matches('.config-group>h2')){const group=target.closest('.config-group');if(group.hidden){configInput.value='';$('#config-mode').value='all';$('#config-state').value='all';filterConfigs();}}
  let parent=target.parentElement;while(parent){if(parent.tagName==='DETAILS')parent.open=true;parent=parent.parentElement;}
  requestAnimationFrame(()=>target.scrollIntoView({block:'start'}));
 }
 window.addEventListener('hashchange',revealHash);revealHash();
 const headerInput=entryInput||configInput||$('#recipe-filter')||$('#header-search'),widePlaceholder=headerInput.placeholder,compactHeader=matchMedia('(max-width:700px)');function searchPlaceholder(){headerInput.placeholder=compactHeader.matches?'输入搜索':widePlaceholder;}searchPlaceholder();compactHeader.addEventListener('change',searchPlaceholder);$('#clear-filter').addEventListener('click',()=>{headerInput.value='';if(entryInput)filterEntries();else if(configInput)filterConfigs();else headerInput.dispatchEvent(new Event('input',{bubbles:true}));headerInput.focus();});

 const actions=$('#actions-menu'),actionsButton=$('#actions-toggle');function closeActions(){delete actions.dataset.open;actionsButton.setAttribute('aria-expanded','false');}actionsButton.addEventListener('click',()=>{const open=actionsButton.getAttribute('aria-expanded')!=='true';actionsButton.setAttribute('aria-expanded',String(open));if(open)actions.dataset.open='';else closeActions();});document.addEventListener('click',e=>{if(!e.target.closest('.site-actions'))closeActions();});document.addEventListener('keydown',e=>{if(e.key==='Escape')closeActions();});
 const bookmarksDialog=$('#bookmarks-dialog');function showBookmarks(){closeActions();$('#bookmarks-list').innerHTML=index.filter(a=>a.kind==='article'&&bookmarks.has(a.id)).map(a=>`<a class="search-result" href="${esc(a.href)}"><span class="result-category">${esc(a.category)}</span><strong>${esc(a.title)}</strong><p>${esc(a.summary)}</p></a>`).join('')||'<div class="empty-state">还没有收藏词条。点击词条右上角的星标即可加入。</div>';bookmarksDialog.showModal();}$('#mobile-bookmarks').addEventListener('click',showBookmarks);if(!$('#entry-filter'))$('#only-bookmarks').addEventListener('click',showBookmarks);$('#bookmarks-close').addEventListener('click',()=>bookmarksDialog.close());
 $('#back-top').addEventListener('click',()=>window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'}));
 const toc=$$('.toc nav a');if(toc.length&&'IntersectionObserver'in window){const observer=new IntersectionObserver(entries=>{const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>a.boundingClientRect.top-b.boundingClientRect.top);if(visible[0])toc.forEach(a=>{const active=a.hash==='#'+visible[0].target.id;a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});},{rootMargin:'-90px 0px -60% 0px'});$$('.article-section').forEach(s=>observer.observe(s));}
})();
