(() => {
 const input=document.querySelector('#wiki-filter');
 if(!input)return;
 const group=[...document.querySelectorAll('[data-filter-group]')];
 const entries=[...document.querySelectorAll('[data-find]')];
 const status=document.querySelector('#filter-count');
 const normalize=s=>s.toLowerCase().normalize('NFKC').replace(/\s+/g,' ').trim();
 const hay=entries.map(el=>normalize(el.dataset.find));
 function filter(){
  const words=normalize(input.value).split(' ').filter(Boolean);
  let shown=0;
  entries.forEach((el,i)=>{
   el.hidden=!words.every(word=>hay[i].includes(word));
   if(!el.hidden)shown++;
  });
  group.forEach(el=>el.hidden=!el.querySelector('[data-find]:not([hidden])'));
  status.textContent=words.length?`找到 ${shown} / ${entries.length} 项`:`共 ${entries.length} 项`;
 }
 input.addEventListener('input',filter);
 if(new URL(location.href).searchParams.has('q')){
  input.value=new URL(location.href).searchParams.get('q');
 }
 filter();
 function reveal(){
  let id;
  try{id=decodeURIComponent(location.hash.slice(1));}catch{return;}
  const target=document.getElementById(id);
  if(!target)return;
  if(target.hidden||target.closest('[hidden]')){input.value='';filter();}
  if(target instanceof HTMLDetailsElement)target.open=true;
  target.scrollIntoView({block:'start'});
 }
 window.addEventListener('hashchange',reveal);
 if(location.hash)reveal();
})();
