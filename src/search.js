(() => {
 const normalize=text=>String(text??'').normalize('NFKC').toLowerCase().replace(/\s+/g,' ').trim();
 const compact=text=>normalize(text).replace(/[\s.\-_·、()（）/]/g,'');

 // Zero-dependency Chinese Pinyin initials via Intl.Collator('zh-Hans-CN') + DST polyphone fixes.
 const pyCollator=typeof Intl!=='undefined'&&Intl.Collator?new Intl.Collator('zh-Hans-CN'):null;
 const pyLetters='abcdefghjklmnopqrstwxyz';
 const pyBounds='阿芭擦搭蛾发噶哈击喀垃妈拿哦啪期然撒塌挖昔压匝';
 const pyOverride={茄:'q',铥:'d',獾:'h',蛤:'h',蟾:'c',薇:'w',沃:'w',旺:'w',韦:'w',温:'w',麦:'m',槌:'c',锤:'c',铠:'k',盔:'k',鳇:'h',鳄:'e',鲲:'k',蛎:'l',贻:'y',鳗:'m',鲛:'j',鲨:'s',鳍:'q',鳃:'s',藻:'z',藓:'x',蕨:'j',蘑:'m',菇:'g',萝:'l',卜:'b',蔓:'m',藤:'t',荆:'j',棘:'j',燧:'s',硝:'x',硫:'l',磺:'h',珀:'p',玛:'m',瑙:'n',曜:'y',熠:'y',烬:'j',炽:'c',灼:'z',霜:'s',凛:'l',冽:'l',霰:'x',雹:'b',飓:'j',霾:'m',瘴:'z',瘟:'w',疫:'y',魇:'y',魅:'m',魍:'w',魉:'l',骷:'k',髅:'l',骸:'h',冢:'z',棺:'g',悼:'d',祭:'j',坛:'t',祠:'c',龛:'k',鼎:'d',炉:'l',灶:'z',镰:'l',戟:'j',矛:'m',弩:'n',箭:'j',盾:'d',鞍:'a',缰:'j',铃:'l',铛:'d',哨:'s',笛:'d',锣:'l',鼓:'g',钟:'z',磬:'q',钵:'b',罐:'g',桶:'t',瓮:'w',瓶:'p',壶:'h',盏:'z',灯:'d',烛:'z',炬:'j',伞:'s',篷:'p',帐:'z',棚:'p',毯:'t',褥:'r',靴:'x',履:'l',袜:'w',袍:'p',衫:'s',褂:'g',裙:'q',巾:'j',帕:'p',冠:'g',冕:'m',簪:'z',环:'h',佩:'p',符:'f',咒:'z',契:'q',印:'y',章:'z',玺:'x',徽:'h',牌:'p',匾:'b',碑:'b',碣:'j',铭:'m'};
 const pyCache=new Map();
 function pyChar(ch){
  if(ch>='a'&&ch<='z'||ch>='0'&&ch<='9')return ch;
  if(ch<'\u4e00'||ch>'\u9fff')return '';
  const cached=pyCache.get(ch);
  if(cached!==undefined)return cached;
  let out=pyOverride[ch]||'';
  if(!out&&pyCollator&&pyCollator.compare(ch,pyBounds[0])>=0){
   for(let i=pyBounds.length-1;i>=0;i--){
    if(pyCollator.compare(ch,pyBounds[i])>=0){out=pyLetters[i];break;}
   }
  }
  pyCache.set(ch,out);
  return out;
 }
 const toInitials=s=>{let r='';for(const ch of compact(s))r+=pyChar(ch);return r;};

 // Full Pinyin -> Chinese DST lexicon (longest-first greedy segmentation).
 // Turns "laowatou", "niulingshengji", "liangqiejian", "laowa甲", "kongbudun" into Chinese tokens.
 const pinyinLexicon=[
  ['liangqiejian','亮茄剑'],['liangqie','亮茄'],['xukong','虚空'],['anying','暗影'],['diwangxie','帝王蟹'],
  ['guadipi','刮地皮'],['guapitou','刮地皮头'],['guapi','刮地皮'],['yanqiuta','眼睛炮塔'],['yanqiu','眼球'],
  ['xiniujiao','守护者之角'],['xiniu','远古守护者'],['niuling','牛铃'],['laowa','老瓦'],['warbis','warbis'],
  ['kongbudun','恐怖盾牌'],['kongbu','恐怖'],['yanmianju','眼面具'],['keyan','克眼'],['ketou','克头'],['kedun','克盾'],
  ['bulaobiao','不老表'],['bulao','不老表'],['fanghua','防滑'],['fanxian','反鲜'],['baoxian','保鲜'],
  ['xiongtong','熊桶'],['xiongguan','熊罐'],['xiongda','熊獾'],['fenghou','蜂王'],['fengwang','蜂王'],
  ['longying','龙蝇'],['longlin','龙鳞'],['diukuang','铥矿'],['yuangu','远古'],['zhiying','远古织影者'],
  ['bingsha','冰鲨'],['shuangsha','霜颚'],['chanchu','蟾蜍'],['hama','蛤蟆'],['duha','毒蛤'],
  ['julu','巨鹿'],['xiaochou','小丑机'],['liulang','流浪商人'],['weinuona','薇诺娜'],['weiluo','薇洛'],
  ['wendi','温蒂'],['weibo','韦伯'],['wanda','旺达'],['wote','沃特'],['woli','沃利'],
  ['wotuo','沃拓克斯'],['womu','沃姆伍德'],['maisi','麦斯威尔'],['nvwushen','薇格弗德'],['jiqiren','wx-78'],
  ['xiaoemo','沃拓克斯'],['huonv','薇洛'],['laomai','麦斯威尔'],['biaojie','旺达'],['yumei','沃特'],
  ['dachu','沃利'],['dalishi','沃尔夫冈'],['zhizhu','蜘蛛'],['guin','温蒂'],['guinv','温蒂'],
  ['yingdao','影刀'],['yingjia','影甲'],['yingfu','影斧'],['guchuan','骨船'],['bingzhang','冰杖'],
  ['jinengshu','技能树'],['dongcha','洞察'],['chuanyue','穿越'],['zhengli','整理'],['fuhuo','复活'],
  ['shengji','升级'],['fumo','附魔'],['xiuli','修理'],['naijiu','耐久'],['jiesuo','解锁'],
  ['shanghai','伤害'],['jianshang','减伤'],['zengshang','增伤'],['yisu','移速'],['lizhi','理智'],
  ['huixue','回血'],['peizhi','配置'],['shezhi','设置'],['kaiguan','开关'],['toukui','头盔'],
  ['kuijia','盔甲'],['dunpai','盾牌'],['fazhang','法杖'],['shouzhang','手杖'],['hufu','护符'],
  ['mogu','蘑菇'],['jiaren','假人'],['dangong','弹弓'],['saoba','扫把'],['diaoyu','钓鱼'],
  ['tou','头'],['jia','甲'],['dun','盾'],['jian','剑'],['dao','刀'],['fu','斧'],['chui','锤'],
  ['zhang','杖'],['san','伞'],['xue','靴'],['ling','铃'],['tong','桶'],['ta','塔'],['lu','炉'],
  ['biao','表'],['chuan','船'],['mao','帽'],['guan','冠'],
 ].sort((a,b)=>b[0].length-a[0].length);

 function decodePinyinRun(run){
  if(run.length<4)return null;
  let i=0, out='', matched=0;
  while(i<run.length){
   let hit=null;
   for(const [py,zh] of pinyinLexicon){
    if(run.startsWith(py,i)){hit=[py,zh];break;}
   }
   if(hit){out+=hit[1];matched+=hit[0].length;i+=hit[0].length;}
   else break;
  }
  return matched>=run.length&&out?out:null;
 }

 function decodePinyinInQuery(q){
  return q.replace(/[a-z]{4,}/g,run=>decodePinyinRun(run)||run);
 }

 // Phrase-level slang & mechanic intent expansions.
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
  [['小丑机','老虎机','小丑'],['巴拉特罗','小丑机']],
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
  // Mechanic & effect intents
  [['回脑残','回san','加san','掉san','脑残','san值'],['理智']],
  [['回血','加血','扣血','血量','血上限'],['生命','恢复','回血']],
  [['反鲜','保鲜','不腐烂','延长保质期'],['保鲜','极地熊獾桶','蘑菇灯','腐烂']],
  [['无限耐久','不掉耐久','修装备','修甲'],['耐久','修理','修复','永恒']],
  [['跑得快','移速','加速','走路快'],['移速','移动速度']],
  [['减伤','免伤','动态减伤','抗伤'],['减伤','遇强则坚','护甲','防御']],
  [['增伤','伤害上限','伤害递减','倍率递减'],['伤害','锋芒渐敛','增伤']],
  [['防滑','不打滑','冰面'],['防滑','出逃腿靴']],
  [['跨层','穿界','换世界','随身空间'],['穿越','世界交换']],
  [['一键整理','快捷整理','箱子整理','自动收集','钉选'],['整理','容器','钉选']],
  [['复活','重生','作祟复活'],['复活','告密的心','作祟']],
 ];

 // Compositional DST morphology: [entity/material/concept prefix] + [equipment/mechanic slot].
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
  [['废铁','垃圾'],['废铁','拾荒疯猪','单片眼镜']],
  [['触手'],['触手']],
  [['海象'],['海象']],
  [['树精'],['树精']],
  [['格罗姆'],['格罗姆']],
  [['火腿','肉'],['火腿棒']],
  [['假人'],['假人','衣架']],
  [['弹弓'],['弹弓','沃尔特']],
  [['扫把'],['扫把','清洁']],
  [['钓','鱼'],['钓具','钓鱼','鱼汤']],
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
  [['升','升级'],['升级','强化','附魔']],
  [['掉','掉落'],['掉落','战利品','蓝图']],
  [['解','解锁'],['解锁','配方','科技']],
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

 // Strip natural Chinese question/connector fillers so "牛铃怎么升级" -> ["牛铃", "升级"].
 const questionFillerRe=/(怎么获得|怎么解锁|怎么升级|怎么制作|怎么做|怎么用|怎么修|有什么用|是什么|为什么|怎么|如何|怎样|为啥|什么|哪些|哪里|在哪|能否|能不能|可以|是不是|吗|呢|啊|吧|\?|？)/g;
 function splitNaturalQuery(q){
  const rawTokens=q.split(' ').filter(Boolean);
  const out=[];
  for(const tok of rawTokens){
   if(/^[a-z0-9._-]+$/.test(tok)||tok.length<=2){out.push(tok);continue;}
   // Keep action verbs when stripping "怎么X" -> "X"
   const cleaned=tok
    .replace(/怎么(获得|解锁|升级|制作|使用|修理|修|用|打|回血|触发|开启|关闭)/g,' $1 ')
    .replace(questionFillerRe,' ')
    .replace(/的/g,' ')
    .trim();
   const parts=cleaned.split(/\s+/).filter(Boolean);
   if(parts.length)out.push(...parts);
   else out.push(tok);
  }
  return [...new Set(out)];
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

 // Pinyin initial matching (e.g. "lqj" -> 附魔亮茄剑, "gdptk" -> 刮地皮头盔, "kt" -> 克头).
 function pinyinScore(tc,titlePy,aliasPys){
  if(!tc||tc.length<2||tc.length>10||!/^[a-z]+$/.test(tc))return 0;
  if(titlePy===tc)return 70;
  if(aliasPys.includes(tc))return 64+(titlePy.includes(tc)?4:0);
  if(titlePy.startsWith(tc))return 46;
  if(aliasPys.some(p=>p.startsWith(tc)))return 42;
  if(tc.length>=3&&titlePy.includes(tc))return 36;
  if(tc.length>=3&&aliasPys.some(p=>p.includes(tc)))return 34;
  return 0;
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
  const titlePy=toInitials(titleKey);
  const aliasPys=aliasesKey.map(toInitials).filter(Boolean);
  return {
   titleKey, titleCompact, summaryKey, summaryCompact, keywordsKey,
   aliasesKey, aliasesCompact, headCompact, hay, hayCompact, asciiTokens, titlePy, aliasPys,
  };
 }

 function parseQuery(raw){
  const qRaw=normalize(raw);
  const q=decodePinyinInQuery(qRaw);
  const qc=compact(q);
  const terms=splitNaturalQuery(q);
  const parsedTerms=terms.map(t=>{
   const tc=compact(t);
   return {raw:t, tc, expanded:expandTerm(t), compounds:decomposeCompounds(tc)};
  });
  const highlightTerms=[...new Set(parsedTerms.flatMap(pt=>[pt.raw,...pt.expanded.filter(v=>v.length>=2&&v.length<=10)]))];
  const configIntent=/配置|开关|设置|默认|false|true/.test(q);
  return {q, qRaw, qc, terms, parsedTerms, highlightTerms, configIntent};
 }

 function scoreTerm(item,pt){
  // 1. Direct or synonym hit
  const directHit=pt.expanded.some(v=>item.hay.includes(v)||item.hayCompact.includes(v));
  if(directHit){
   const inHead=pt.expanded.some(v=>item.headCompact.includes(v));
   const inSummary=pt.expanded.some(v=>item.summaryCompact.includes(v));
   return {score:inHead?38:inSummary?18:7, mode:'direct'};
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

  // 3. Pinyin initials match (e.g. "lqj" -> 亮茄剑, "yqt" -> 眼球塔, "kt" -> 克头)
  const py=pinyinScore(pt.tc,item.titlePy,item.aliasPys);
  if(py)return {score:py, mode:'smart'};

  // 4. Ordered subsequence on title or aliases (e.g. "亮剑" -> "亮茄剑")
  let bestSub=subseqScore(pt.tc,item.titleCompact);
  for(const a of item.aliasesCompact){
   const s=subseqScore(pt.tc,a);
   if(s>bestSub)bestSub=s;
  }
  if(bestSub)return {score:bestSub, mode:'smart'};

  // 5. Typo-tolerant fallback (ASCII edit distance or CJK char overlap on title/aliases)
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

 function scoreEntry(entry,pq,allowPartial=false){
  const {q, qc, parsedTerms}=pq;
  if(!q)return {score:0, mode:'none'};
  const aliasExact=entry.aliasesKey.includes(q)||entry.aliasesCompact.includes(qc);
  if(entry.jump)return {score:aliasExact?1000:0, mode:aliasExact?'direct':'none'};

  let total=0, matchedCount=0, worstMode='direct';
  for(const pt of parsedTerms){
   const r=scoreTerm(entry,pt);
   if(!r.score){
    if(!allowPartial)return {score:0, mode:'none'};
    continue;
   }
   matchedCount++;
   total+=r.score;
   if(r.mode==='fuzzy')worstMode='fuzzy';
   else if(r.mode==='smart'&&worstMode==='direct')worstMode='smart';
  }
  if(!matchedCount)return {score:0, mode:'none'};

  const titleExact=entry.titleKey===q||entry.titleCompact===qc;
  const titleStart=entry.titleKey.startsWith(q)||entry.titleCompact.startsWith(qc);
  const titleSub=entry.titleKey.includes(q)||entry.titleCompact.includes(qc);
  const aliasStart=entry.aliasesKey.some(a=>a.startsWith(q))||entry.aliasesCompact.some(a=>a.startsWith(qc));
  const aliasSub=entry.aliasesKey.some(a=>a.includes(q))||entry.aliasesCompact.some(a=>a.includes(qc));
  const bonus=(titleExact?110:titleStart?60:titleSub?38:0)
   +(aliasExact?96:aliasStart?46:aliasSub?36:0)
   +(entry.keywordsKey===q?74:entry.keywordsKey.includes(q)?16:0)
   +(entry.summaryKey.includes(q)?10:0)
   +(!pq.configIntent&&entry.kind==='article'?10:0);
  const partialPenalty=matchedCount<parsedTerms.length?0.55*(matchedCount/parsedTerms.length):1;
  return {
   score:Math.round((total+bonus)*partialPenalty),
   mode:matchedCount<parsedTerms.length?'partial':(bonus?'direct':worstMode),
  };
 }

 window.WIKI_SEARCH_ENGINE={normalize, compact, toInitials, prepareItem, parseQuery, scoreEntry};

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

 const quickChips=['老瓦套','克头','克盾','牛铃升级','犀牛角','亮茄剑','反鲜','修装备','穿越','小丑机'];
 function quickChipsHTML(label='热门搜索'){
  return `<div class="search-section-label">${label}</div><div class="search-quick-chips">${quickChips.map(c=>`<button type="button" class="search-chip" data-chip="${escape(c)}">${escape(c)}</button>`).join('')}</div>`;
 }

 function recentUrls(){
  let items=[];
  try{items=JSON.parse(localStorage.getItem('dst-wiki-recent')||'[]');}catch{}
  if(!Array.isArray(items))return new Set();
  const rootBase=new URL('./',indexUrl);
  return new Set(items.map(i=>new URL(i.href,rootBase).href));
 }

 function recentHTML(){
  let items=[];
  try{items=JSON.parse(localStorage.getItem('dst-wiki-recent')||'[]');}catch{}
  const chips=quickChipsHTML('热门搜索');
  if(!Array.isArray(items)||!items.length)return chips+`<div class="search-section-label">推荐词条</div>`;
  const filtered=items.filter(item=>branch.value==='all'||branch.value===item.wiki).slice(0,5);
  if(!filtered.length)return chips+`<div class="search-section-label">推荐词条</div>`;
  const rootBase=new URL('./',indexUrl);
  return chips+`<div class="search-section-label">最近浏览</div>`+filtered.map(item=>{
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
  const {q, highlightTerms}=pq;
  const rawTerms=raw.split(/\s+/).filter(Boolean);
  const markTerms=highlightTerms.length?highlightTerms:rawTerms;
  const seen=new Set();
  const recents=recentUrls();
  const candidates=entries.filter(e=>(kind==='all'||kind===e.kind||kind==='item'&&e.topic==='new-items')&&(branch.value==='all'||branch.value===e.wiki));
  const boost=r=>({...r,score:r.score+(recents.has(r.e.url)?4:0)});
  let scored=q?candidates.map(e=>boost({e,...scoreEntry(e,pq,false)})).filter(r=>r.score>0).sort((a,b)=>b.score-a.score):
   candidates.filter(e=>!e.jump&&(kind!=='all'||e.featured||['getting-started','settings-guide','combat','armor','world-exchange','eyeturret','role-wx78','world-shadow'].includes(e.id))).map(e=>({e,score:1,mode:'direct'}));
  // Zero-result rescue for multi-word queries: relax to partial-term matching
  if(q&&!scored.length&&pq.parsedTerms.length>1){
   scored=candidates.map(e=>boost({e,...scoreEntry(e,pq,true)})).filter(r=>r.score>0).sort((a,b)=>b.score-a.score);
  }
  const unique=scored.filter(r=>!seen.has(r.e.url)&&seen.add(r.e.url));
  const shown=unique.slice(0,q?70:14);
  status.textContent=loading?'正在载入两套 Wiki 的索引…':failed?(entries.length?'全站索引暂时无法载入，显示当前百科的结果。':'全站索引暂时无法载入，请关闭后重新打开搜索。'):
   q?`找到 ${unique.length} 个结果${unique.length>70?' · 先显示前 70 条':''}`:'支持简称、全拼/首字母（如 laowa / lqj）、效果词或自然问句（如 牛铃怎么升级）';

  const prefix=!q&&kind==='all'?recentHTML():'';
  results.innerHTML=shown.length?prefix+shown.map(({e,mode})=>{
   let snippet=e.summary;
   if(e.jump)snippet='直达 · '+snippet;
   else if(mode==='partial')snippet='相关联想 · '+snippet;
   else if(mode==='smart'||mode==='fuzzy')snippet='智能联想 · '+snippet;
   else if(q&&!e.summaryKey.includes(q)){
    const text=String(e.text??'');
    const hitTerm=markTerms.find(t=>text.toLowerCase().includes(t.toLowerCase()))||raw;
    const hit=text.toLowerCase().indexOf(hitTerm.toLowerCase());
    if(hit>=0)snippet=(hit>24?'…':'')+text.slice(Math.max(0,hit-24),hit+105)+'…';
   }
   const defPill=e.kind==='config'&&e.defaultValue?`<span class="result-default-pill">默认 ${escape(e.defaultValue)}</span>`:'';
   return `<a class="search-result" href="${escape(e.url)}"><div class="result-badges"><span class="result-wiki-pill" data-wiki-tag="${escape(e.wiki)}">${escape(wikiNames[e.wiki]||'')}</span><span class="result-kind-pill">${escape(kindNames[e.kind]||'')}</span>${e.category?`<span class="result-category">${escape(e.category)}</span>`:''}${defPill}</div><strong>${e.imageUrl?`<img class="search-item-icon" src="${escape(e.imageUrl)}" alt="" width="20" height="20" loading="lazy">`:''}${mark(e.title,markTerms)}</strong><p>${mark(String(snippet??'').slice(0,156),markTerms)}</p><span class="result-enter" aria-hidden="true">↵</span></a>`;
  }).join(''):(loading?'':`<div class="empty-state">没有找到匹配的内容，试试换个简称或点击下方热门搜索。</div>${quickChipsHTML('试试这些')}`);
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
 results.addEventListener('click',event=>{
  const chip=event.target.closest('[data-chip]');
  if(chip){input.value=chip.dataset.chip;render();input.focus();return;}
  if(event.target.closest('a'))dialog.close();
 });
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
