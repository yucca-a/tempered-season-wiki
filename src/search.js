(() => {
 const normalize=text=>String(text??'').normalize('NFKC').toLowerCase().replace(/\s+/g,' ').trim();
 const compact=text=>normalize(text).replace(/[\s.\-_·、()（）/]/g,'');

 // Phrase-level slang expansions (multi-char colloquialisms -> canonical terms).
 const querySynonyms=[
  [['老瓦','瓦器','瓦格斯塔夫','warbis','wagpunk'],['warbis','wagpunk','w.a.r.b.i.s.','瓦格斯塔夫']],
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
  [['克眼','克苏鲁'],['恐怖之眼','双子魔眼','恐怖盾牌','眼面具']],
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

 // Compositional DST morphology: [entity/material prefix] + [equipment/mechanic slot].
 // Allows queries like "克头", "克盾", "瓦头", "虚镰", "茄甲", "鹿伞", "龙炉", "绿符", "橙铃"
 // to resolve automatically without hand-listing every combination.
 const stemGroups=[
  [['克','克眼','眼'],['克眼','克苏鲁','恐怖','眼面具','恐怖盾牌','双子']],
  [['瓦','老瓦'],['warbis','wagpunk','瓦格斯塔夫','瓦器']],
  [['虚','虚空'],['虚空','暗影','裂隙']],
  [['影','暗影'],['暗影','虚空','暗夜','梦魇']],
  [['月','月亮'],['月亮','天体','亮茄','月光','启迪','月岛']],
  [['月后','影后'],['裂隙','亮茄','虚空','位面']],
  [['茄','亮茄'],['亮茄','裂隙']],
  [['铥','远古'],['铥矿','远古']],
  [['骨','织影'],['骨头','远古织影者','暗影']],
  [['熊','熊大'],['熊獾','极地熊獾']],
  [['鹿','巨鹿'],['独眼巨鹿','巨鹿','晶体巨鹿']],
  [['蜂','蜂后'],['蜂王','蜂后']],
  [['龙','火'],['龙蝇','龙鳞','火焰','鳞甲']],
  [['猪','疯猪'],['猪人','疯猪','拾荒疯猪','废铁']],
  [['犀','犀牛'],['远古守护者','守护者之角']],
  [['蚁','瓜','刮'],['蚁狮','刮地皮']],
  [['蟹','螃蟹'],['帝王蟹']],
  [['鲨'],['冰鲨','霜颚','岩石大白鲨']],
  [['蛤','蟾'],['毒菌蟾蜍','蟾蜍']],
  [['牛'],['皮弗娄牛','牛铃']],
  [['冰','霜'],['冰','霜','寒霜','冰核','结晶器']],
  [['电','工'],['薇诺娜','电气','发电机','投石机']],
  [['魂','灵'],['灵魂','沃拓克斯','哀悼']],
  [['表'],['旺达','怀表','不老表']],
  [['船','海'],['船','海洋','风帆','保险杠']],
  [['狗','狼'],['猎犬','座狼','狗牙']],
  [['蛛','蜘蛛'],['蜘蛛','韦伯']],
  [['鸟'],['邪天翁','鸟']],
  [['猴'],['猴子','海盗']],
  [['绝望'],['绝望石','绝望']],
  [['辉煌'],['纯粹辉煌','亮茄']],
  [['绿'],['建造护符','绿宝石']],
  [['橙'],['懒人','橙宝石','牛铃']],
  [['黄'],['唤星','黄宝石']],
  [['紫'],['传送','紫宝石']],
  [['防滑','出逃'],['防滑','腿靴','靴']],
  [['玻璃'],['月光玻璃','玻璃刀']],
  [['恶液'],['恶液']],
 ];
 const slotGroups=[
  [['头','帽','冠','盔'],['头','头盔','帽','面具','皇冠','冠','护目镜','眼镜']],
  [['甲','衣','袍'],['盔甲','护甲','甲','长袍','背心','鳞甲']],
  [['盾'],['盾牌','盾']],
  [['套'],['套装','头盔','盔甲','装备']],
  [['剑','刀'],['剑','刀','刃']],
  [['斧'],['斧','战斧','镐斧']],
  [['锤'],['锤','粉碎者']],
  [['棒','矛','枪','炮'],['棒','矛','炮','吹箭','弹弓']],
  [['镰'],['镰刀','收割者']],
  [['杖'],['法杖','魔杖','手杖']],
  [['伞'],['伞','眼球伞']],
  [['鞋','靴'],['靴','鞋','腿靴']],
  [['铃'],['牛铃','铃']],
  [['桶','罐','箱','包','袋'],['桶','箱','包','袋','容器']],
  [['塔'],['炮塔','祭坛','传送塔','塔']],
  [['炉','锅'],['火炉','炉','烹饪锅','锅']],
  [['灯','火炬'],['灯','火炬']],
  [['表'],['怀表','表']],
  [['符','链'],['护符','项链']],
  [['船','帆'],['船','风帆','保险杠']],
  [['心','核'],['心','核','石']],
  [['鞍'],['鞍','牛鞍']],
  [['树'],['技能树','树精']],
  [['角'],['守护者之角','角']],
  [['修','修理'],['修理','修甲','修复']],
 ];

 const stemMap=new Map();
 for(const [keys,vals] of stemGroups){
  const list=vals.map(compact);
  for(const k of keys)stemMap.set(compact(k),list);
 }
 const slotMap=new Map();
 for(const [keys,vals] of slotGroups){
  const list=vals.map(compact);
  for(const k of keys)slotMap.set(compact(k),list);
 }

 function expandTerm(term){
  const tc=compact(term), out=new Set([term,tc]);
  for(const [triggers,targets] of querySynonyms){
   if(triggers.some(k=>{const ck=compact(k);return tc===ck||tc.includes(ck);})){
    for(const t of targets){out.add(t);out.add(compact(t));}
   }
  }
  return [...out].filter(Boolean);
 }

 function decomposeCompounds(tc){
  const pairs=[];
  if(!tc||tc.length<2||tc.length>8||/^[a-z0-9]+$/.test(tc))return pairs;
  for(let i=1;i<tc.length;i++){
   const left=tc.slice(0,i), right=tc.slice(i);
   const stems=stemMap.get(left), slots=slotMap.get(right);
   if(stems&&slots)pairs.push([left,right,stems,slots]);
   else if(stems&&right.length>=2)pairs.push([left,right,stems,[right]]);
   else if(slots&&left.length>=2)pairs.push([left,right,[left],slots]);
  }
  return pairs;
 }

 // Tight ordered subsequence match (e.g. "亮剑" -> "亮茄剑", "克盾" -> "克眼盾").
 function subseqScore(needle,hay){
  if(!needle||needle.length<2||!hay||hay.length<needle.length)return 0;
  let first=-1, pos=-1;
  for(let i=0;i<needle.length;i++){
   pos=hay.indexOf(needle[i],pos+1);
   if(pos<0)return 0;
   if(first<0)first=pos;
  }
  const span=pos-first+1;
  if(span>needle.length*2+2)return 0;
  return 18+Math.round(24*(needle.length/span));
 }

 // Unordered CJK character overlap for minor typos / reversed shorthand (e.g. "克鲁苏", "刮地头", "亮加剑").
 function charOverlapScore(needle,hay){
  if(!needle||needle.length<2||!hay)return 0;
  const chars=[...new Set([...needle])];
  let hits=0;
  for(const ch of chars)if(hay.includes(ch))hits++;
  if(chars.length===2)return hits===2?16:0;
  const ratio=hits/chars.length;
  if(hits>=2&&ratio>=0.66)return Math.round(14+ratio*16);
  return 0;
 }

 // Bounded Levenshtein distance for ASCII typos (e.g. "warbs" -> "warbis", "eyeturet" -> "eyeturret").
 function editDistance(a,b,maxDist){
  if(Math.abs(a.length-b.length)>maxDist)return maxDist+1;
  let prev=new Array(b.length+1);
  for(let j=0;j<=b.length;j++)prev[j]=j;
  for(let i=1;i<=a.length;i++){
   const curr=[i];
   let rowMin=i;
   for(let j=1;j<=b.length;j++){
    const cost=a[i-1]===b[j-1]?0:1;
    const v=Math.min(prev[j]+1,curr[j-1]+1,prev[j-1]+cost);
    curr[j]=v;
    if(v<rowMin)rowMin=v;
   }
   if(rowMin>maxDist)return maxDist+1;
   prev=curr;
  }
  return prev[b.length];
 }

 function asciiFuzzyScore(tc,tokens){
  if(!tc||tc.length<3||!/^[a-z0-9]+$/.test(tc)||!tokens.length)return 0;
  const maxDist=tc.length<=5?1:2;
  let best=0;
  for(const tok of tokens){
   if(tok.length<3)continue;
   const d=editDistance(tc,tok,maxDist);
   if(d<=maxDist){
    const s=d===1?24:16;
    if(s>best)best=s;
   }
  }
  return best;
 }

 function prepareItem(entry){
  const titleKey=normalize(entry.title);
  const aliasesKey=(entry.aliases??[]).map(normalize);
  const summaryKey=normalize(entry.summary);
  const keywordsKey=normalize(entry.keywords);
  const hay=normalize([entry.title,entry.summary,entry.keywords,entry.text,entry.category,...(entry.aliases??[])].join(' '));
  const titleCompact=compact(titleKey);
  const aliasesCompact=aliasesKey.map(compact);
  const summaryCompact=compact(summaryKey);
  const headCompact=[titleCompact,...aliasesCompact].join(' ');
  const hayCompact=compact(hay);
  const asciiTokens=[...new Set((titleKey+' '+aliasesKey.join(' ')+' '+keywordsKey).split(/[^a-z0-9]+/).filter(w=>w.length>=3))];
  return {
   titleKey, titleCompact, summaryKey, summaryCompact, keywordsKey,
   aliasesKey, aliasesCompact, headCompact, hay, hayCompact, asciiTokens,
  };
 }

 function parseQuery(raw){
  const q=normalize(raw);
  const qc=compact(raw);
  const terms=q.split(' ').filter(Boolean);
  const parsedTerms=terms.map(t=>{
   const tc=compact(t);
   return {raw:t, tc, expanded:expandTerm(t), compounds:decomposeCompounds(tc)};
  });
  return {q, qc, terms, parsedTerms};
 }

 function scoreTerm(item,pt){
  // 1. Direct or synonym hit
  const directHit=pt.expanded.some(v=>item.hay.includes(v)||item.hayCompact.includes(v));
  if(directHit){
   const inHead=pt.expanded.some(v=>item.headCompact.includes(v));
   const inSummary=pt.expanded.some(v=>item.summaryCompact.includes(v));
   return {score:inHead?36:inSummary?16:6, mode:'direct'};
  }
  // 2. Compositional DST stem+slot match (e.g. "克头" -> 恐怖/眼面具 + 头盔/面具)
  let bestComp=0;
  for(const [left,right,stems,slots] of pt.compounds){
   const stemHead=stems.some(s=>item.headCompact.includes(s));
   const slotHead=slots.some(s=>item.headCompact.includes(s));
   const literalBonus=(item.headCompact.includes(left)?10:0)+(item.headCompact.includes(right)?6:0);
   if(stemHead&&slotHead){bestComp=Math.max(bestComp,54+literalBonus);continue;}
   const stemSum=stemHead||stems.some(s=>item.summaryCompact.includes(s));
   const slotSum=slotHead||slots.some(s=>item.summaryCompact.includes(s));
   if(stemSum&&slotSum&&(stemHead||slotHead))bestComp=Math.max(bestComp,32+Math.round(literalBonus/2));
   else if(stemHead&&slots.some(s=>item.hayCompact.includes(s)))bestComp=Math.max(bestComp,20);
  }
  if(bestComp)return {score:bestComp, mode:'smart'};

  // 3. Ordered subsequence on title or aliases (e.g. "亮剑" -> "亮茄剑")
  let bestSub=subseqScore(pt.tc,item.titleCompact);
  for(const a of item.aliasesCompact){
   const s=subseqScore(pt.tc,a);
   if(s>bestSub)bestSub=s;
  }
  if(bestSub)return {score:bestSub, mode:'smart'};

  // 4. Typo-tolerant fallback (ASCII edit distance or CJK char overlap on title/aliases)
  let bestFuzzy=asciiFuzzyScore(pt.tc,item.asciiTokens);
  if(!bestFuzzy&&!/^[a-z0-9]+$/.test(pt.tc)){
   bestFuzzy=charOverlapScore(pt.tc,item.titleCompact);
   for(const a of item.aliasesCompact){
    const s=charOverlapScore(pt.tc,a);
    if(s>bestFuzzy)bestFuzzy=s;
   }
  }
  if(bestFuzzy)return {score:bestFuzzy, mode:'fuzzy'};
  return {score:0, mode:'none'};
 }

 function scoreEntry(entry,pq){
  const {q, qc, parsedTerms}=pq;
  if(!q)return {score:0, mode:'none'};
  const aliasExact=entry.aliasesKey.includes(q)||entry.aliasesCompact.includes(qc);
  if(entry.jump)return {score:aliasExact?1000:0, mode:aliasExact?'direct':'none'};

  let total=0, worstMode='direct';
  for(const pt of parsedTerms){
   const r=scoreTerm(entry,pt);
   if(!r.score)return {score:0, mode:'none'};
   total+=r.score;
   if(r.mode==='fuzzy')worstMode='fuzzy';
   else if(r.mode==='smart'&&worstMode==='direct')worstMode='smart';
  }

  const titleExact=entry.titleKey===q||entry.titleCompact===qc;
  const titleStart=entry.titleKey.startsWith(q)||entry.titleCompact.startsWith(qc);
  const titleSub=entry.titleKey.includes(q)||entry.titleCompact.includes(qc);
  const aliasStart=entry.aliasesKey.some(a=>a.startsWith(q))||entry.aliasesCompact.some(a=>a.startsWith(qc));
  const aliasSub=entry.aliasesKey.some(a=>a.includes(q))||entry.aliasesCompact.some(a=>a.includes(qc));
  const bonus=(titleExact?110:titleStart?60:titleSub?38:0)
   +(aliasExact?96:aliasStart?46:aliasSub?36:0)
   +(entry.keywordsKey===q?74:entry.keywordsKey.includes(q)?16:0)
   +(entry.summaryKey.includes(q)?10:0);
  return {score:total+bonus, mode:bonus? 'direct' : worstMode};
 }

 window.WIKI_SEARCH_ENGINE={normalize, compact, prepareItem, parseQuery, scoreEntry};

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
 const escape=text=>String(text??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const escapeRegex=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');

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
  return entries.map(entry=>({
   ...entry,
   wiki:entry.wiki??wiki,
   url:new URL(entry.href,base).href,
   imageUrl:entry.image?new URL(entry.image,base).href:null,
   ...prepareItem(entry),
  }));
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
  const pq=parseQuery(raw);
  const {q, qc}=pq;
  const rawTerms=raw.split(/\s+/).filter(Boolean);
  const seen=new Set();
  const candidates=entries.filter(e=>(kind==='all'||kind===e.kind||kind==='item'&&e.topic==='new-items')&&(branch.value==='all'||branch.value===e.wiki));
  const scored=q?candidates.map(e=>({e,...scoreEntry(e,pq)})).filter(r=>r.score>0).sort((a,b)=>b.score-a.score):
   candidates.filter(e=>!e.jump&&(kind!=='all'||e.featured||['getting-started','settings-guide','combat','armor','world-exchange','eyeturret','role-wx78','world-shadow'].includes(e.id))).map(e=>({e,score:1,mode:'direct'}));
  const unique=scored.filter(r=>!seen.has(r.e.url)&&seen.add(r.e.url));
  const shown=unique.slice(0,q?70:14);
  status.textContent=loading?'正在载入两套 Wiki 的索引…':failed?(entries.length?'全站索引暂时无法载入，显示当前百科的结果。':'全站索引暂时无法载入，请关闭后重新打开搜索。'):
   q?`找到 ${unique.length} 个结果${unique.length>70?' · 先显示前 70 条':''}`:'支持词条、俗称、简称联想（如 克头 / 克盾 / 亮剑 / 瓦甲）或空格多词组合';

  const prefix=!q&&kind==='all'?recentHTML():'';
  results.innerHTML=shown.length?prefix+shown.map(({e,mode})=>{
   let snippet=e.summary;
   const aliasMatched=q&&(e.aliasesKey.some(a=>a.includes(q))||e.aliasesCompact.some(a=>a.includes(qc)));
   if(e.jump)snippet='直达 · '+snippet;
   else if(aliasMatched)snippet='常用称呼 · '+e.aliases.join('、');
   else if(mode==='smart'||mode==='fuzzy')snippet='智能联想 · '+snippet;
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
