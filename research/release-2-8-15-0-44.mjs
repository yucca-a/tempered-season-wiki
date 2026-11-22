// 2.8.15.0.35–2.8.15.0.44: configuration changes read from the local release source.
// Article prose for these pages lives in editorial/*.md; this module keeps config notes,
// requirements and article config keys in line with modinfo.lua.
const version='2.8.15.0.46';
const W='Wilderness Survival';

export function refreshRelease44(articles,notes){
  const updated=[];
  const touch=id=>{const a=articles.find(a=>a.id===id);if(!a)throw Error('Missing article '+id);a.auditedVersion=version;updated.push(id);return a;};

  // 2.8.15.0.43: the old Bear/Ed master switches became one category switch. Every sub-option is
  // independent and only needs the category switch (modmain.lua: Wilderness Survival block).
  delete notes['德爷生存'];
  const survival={
    [W]:['默认关闭。荒野求生录的总开关，独立于简单和困难模式；下面的基础规则和各个子项都要先开这个才生效，各子项之间互不依赖。'],
    '贝爷求生':['默认关闭。开启后：制作变慢并显示进度条、新做的工具和护甲耐久随机、砍树挖矿采集的收获减半、在科技台旁做东西不会永久学会配方、猪王不再给金子。同时允许所有人读书、可以用燧石／纯粹辉煌／绝望石磨武器，并且不会被黑暗中的查理攻击。'],
    '种地种树需要书':['默认关闭。播种需要身上有园艺学类的书，种树需要应用造林学，每种一次扣书 1 点耐久。'],
    '做饭需要书':['默认关闭。开锅做饭需要身上有烹饪指南；烹饪指南共 5 次耐久，每开一锅扣 1 次，用完消失。随身锅也算。'],
    '材料制造翻倍':['默认关闭。所有配方的材料数量翻倍（生命、理智等代价和建造放置消耗不变）。'],
    '低san采集失败':['默认关闭。采集时可能失败：理智满时不会失败，理智越低越容易失败，理智为 0 时 50%。失败时作物照样被摘掉，但什么也拿不到。'],
    '捡东西变慢':['默认关闭。捡东西、采摘、收获都变成慢动作。'],
    '料理禁止堆叠':['默认关闭。锅里做出的料理每格只能放一份（本来就能多份出锅的料理，以及饮品、装饰品等除外）。旧存档里已经叠在一起的保留数量，拆开后不能再合。'],
    '护甲失效':['默认关闭。玩家穿的护甲不再挡伤害，也不会因挨打掉耐久。作为补偿，梦魇尖喙、爬行梦魇和海上恐惧不会主动伤害你；你打了它们之后 23 秒内它们才能还手。'],
    '难以冻结':['子项默认开启（需要先开总开关）。同一个目标被冻住后 23 秒内不会再被冻住，单次冰冻最多持续 4 秒。'],
    '下雨禁火':['子项默认开启（需要先开总开关）。下雨时点不着火，火把和打火机会立刻熄灭；龙鳞火炉、咩咩雕像和防雨火炉类不受影响。身边 3 格内有能挡雨的大树时不算淋雨。'],
    '火把传热':['子项默认开启（需要先开总开关）。点燃的火把、打火机火焰本身是一个小热源，能给身边 4 格内的人取暖。'],
    '空挥武器':['默认关闭。攻击时原地挥武器，不会自动走到最远攻击距离。'],
  };
  for(const [key,paragraphs] of Object.entries(survival))notes[key]={requires:key===W?[]:[W],paragraphs};
  for(const a of articles){
    if(a.configKeys?.includes('德爷生存'))a.configKeys=a.configKeys.filter(k=>k!=='德爷生存');
  }
  const modes=touch('survival-modes');
  modes.configKeys=[W,...modes.configKeys.filter(k=>k!==W)];
  const rating=touch('difficulty-rating');
  if(!rating.configKeys.includes(W))rating.configKeys.push(W);

  notes['UI Dragging']={requires:[],paragraphs:['默认开启。可以用右键拖动容器的背景，用左键拖动“查看模组”按钮，位置会记住。物品格和功能按钮的原有操作不受影响；同时装了其他拖拽模组时优先用淬炼的拖拽。只在客户端生效。']};
  const ui=touch('mod-interface');
  if(!ui.configKeys.includes('UI Dragging'))ui.configKeys.push('UI Dragging');

  notes['Wanda Watch Naming']={requires:['enable easy mode','role_easy','wanda_easy'],paragraphs:['默认开启。拿着羽毛笔右键真实的溯源表或裂缝表就能给它起名，最多 32 个字；升级、使用和读档后名字都保留，羽毛笔不消耗。旺达右键技能用的临时表不能命名。']};
  const wanda=touch('role-wanda');
  if(!wanda.configKeys.includes('Wanda Watch Naming'))wanda.configKeys.push('Wanda Watch Naming');

  notes['boss_health_wixie']={requires:['enable hard mode','extra_change','boss_health'],paragraphs:['只在“BOSS血量”大于 1 倍且启用永不妥协时有意义，决定永不妥协的暗影薇希怎样套用这个倍率。“限伤兼容”（默认）：血量和每轮撤退门槛（原本 500 点）一起乘倍率。“倍率兼容”：血量和 500 点撤退门槛不变，改为把它的攻击伤害乘倍率。两档都会按倍率增加掉落。']};
  const extra=touch('mechanic-extra-stats');
  if(!extra.configKeys.includes('boss_health_wixie'))extra.configKeys.push('boss_health_wixie');
  return updated;
}
