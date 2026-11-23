(() => {
 const input=document.querySelector('#recipe-filter');
 const scope=document.querySelector('#recipe-scope');
 const tabs=[...document.querySelectorAll('[data-recipe-type]')];
 const groups=[...document.querySelectorAll('[data-recipe-group]')].map(node=>({
  node, id:node.id, count:node.querySelector('[data-recipe-count]'),
  sidebarLink:document.querySelector(`[data-sidebar-group="${node.id}"]`),
  cards:[...node.querySelectorAll('[data-recipe]')].map(el=>({el,text:normalize(el.dataset.find),scopes:el.dataset.scopes.split(' ')})),
 }));
 const cards=groups.flatMap(group=>group.cards);
 const status=document.querySelector('#recipe-status');
 const clear=document.querySelector('#clear-filter');
 const sidebarTotal=document.querySelector('[data-sidebar-total]');
 const initial=new URLSearchParams(location.search);
 let type=tabs.some(tab=>tab.dataset.recipeType===initial.get('tech'))?initial.get('tech'):'all';
 if([...scope.options].some(option=>option.value===initial.get('scope')))scope.value=initial.get('scope');
 input.value=initial.get('q')??input.value;
 function normalize(text){return text.normalize('NFKC').toLowerCase().trim();}
 function filter(persist=true){
  const words=normalize(input.value).split(/\s+/).filter(Boolean);
  let shown=0, visibleGroups=0;
  for(const group of groups){
   let count=0;
   for(const {el,text,scopes} of group.cards){
    el.hidden=(type!=='all'&&type!==group.node.dataset.recipeGroup)||
     (scope.value!=='all'&&!scopes.includes(scope.value))||!words.every(word=>text.includes(word));
    if(!el.hidden)count++;
   }
   group.node.hidden=!count;
   if(count)visibleGroups++;
   if(group.count)group.count.textContent=count+' 条';
   if(group.sidebarLink){
    group.sidebarLink.hidden=!count;
    const sc=group.sidebarLink.querySelector('[data-sidebar-count]');
    if(sc)sc.textContent=String(count);
   }
   shown+=count;
  }
  if(sidebarTotal)sidebarTotal.textContent=visibleGroups+' 组';
  for(const tab of tabs)tab.setAttribute('aria-pressed',String(tab.dataset.recipeType===type));
  status.textContent=`显示 ${shown} / ${cards.length} 条配方`;
  if(clear)clear.hidden=!words.length;
  document.querySelector('#recipe-empty').hidden=shown>0;
  if(persist){
   const url=new URL(location.href);
   for(const [key,value] of [['q',input.value.trim()],['tech',type],['scope',scope.value]]){
    if(!value||value==='all'&&key!=='q')url.searchParams.delete(key);
    else url.searchParams.set(key,value);
   }
   history.replaceState(null,'',url);
  }
 }
 function reveal(){
  const card=document.getElementById(location.hash.slice(1));
  if(!card?.matches('[data-recipe]'))return;
  if(card.hidden){
   input.value='';scope.value='all';type='all';filter();
  }
  card.open=true;
  requestAnimationFrame(()=>card.scrollIntoView({block:'start'}));
 }
 input.addEventListener('input',()=>filter());
 scope.addEventListener('change',()=>filter());
 tabs.forEach(tab=>tab.addEventListener('click',()=>{type=tab.dataset.recipeType;filter();}));
 document.querySelector('#expand-recipes').addEventListener('click',()=>cards.forEach(({el})=>{if(!el.hidden)el.open=true;}));
 document.querySelector('#collapse-recipes').addEventListener('click',()=>cards.forEach(({el})=>{if(!el.hidden)el.open=false;}));
 filter(false);
 window.addEventListener('hashchange',reveal);
 reveal();
})();
