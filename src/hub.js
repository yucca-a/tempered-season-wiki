(() => {
 const toggle=document.querySelector('[data-hub-theme]');
 const root=document.documentElement;
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function syncThemeButton(){
  if(!toggle)return;
  const dark=root.dataset.theme==='dark';
  const label=dark?'切换到浅色模式':'切换到深色模式';
  toggle.setAttribute('aria-label',label);
  toggle.setAttribute('aria-pressed',String(dark));
  toggle.title=label;
 }
 syncThemeButton();
 toggle?.addEventListener('click',()=>{
  root.dataset.theme=root.dataset.theme==='dark'?'light':'dark';
  try{localStorage.setItem('tempered-wiki-theme',root.dataset.theme);}catch{}
  syncThemeButton();
 });
 const recentBox=document.querySelector('#hub-recent');
 const recentList=document.querySelector('#hub-recent-list');
 if(recentBox&&recentList){
  const wikiNames={tempered:'淬炼之季','um-beta':'永不妥协测试版'};
  let items=[];
  try{items=JSON.parse(localStorage.getItem('dst-wiki-recent')||'[]');}catch{}
  if(Array.isArray(items)&&items.length){
   recentList.innerHTML=items.slice(0,6).map(item=>
    `<a class="hub-recent-item" href="${esc(item.href)}"><span class="hub-recent-wiki" data-wiki-tag="${esc(item.wiki)}">${esc(wikiNames[item.wiki]||item.wiki)}</span><strong>${esc(item.title)}</strong></a>`
   ).join('');
   recentBox.hidden=false;
   document.querySelector('#hub-recent-clear')?.addEventListener('click',()=>{
    try{localStorage.removeItem('dst-wiki-recent');}catch{}
    recentBox.hidden=true;
   });
  }
 }
})();
