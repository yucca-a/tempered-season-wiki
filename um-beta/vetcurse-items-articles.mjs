const beta=(file,line)=>({file,line});
const cn=(file,line)=>({kind:'cn',file,line});
const names=line=>cn('init/init_strings/init_names.lua',line);
const prefab=(file,line)=>beta(`scripts/prefabs/${file}.lua`,line);
const drop=line=>beta('postinit/prefabs/vetcurse_drops.lua',line);
const link=(id,label)=>({id,label});

export const vetcurseItemsArticles=[
 {
  id:'bearger-claw',category:'new-items',prefab:'beargerclaw',title:'诅咒熊爪',aliases:['Bearger Claw','熊爪','熊獾老兵装备'],
  summary:'开启老兵诅咒后击杀熊獾固定掉落的暗影工具武器，支持快速施法并自带暗影等级。',
  configs:['vetcurse'],
  sections:[
   ['获取与穿戴条件','开启老兵诅咒（默认或始终开启档）时，击杀熊獾必掉 1 件诅咒熊爪。带有 vetcurse_item 标签，通常需要处于老兵诅咒状态才能正常发挥或装备。'],
   ['特性','施法距离参考雪球发射器范围（FIRE_DETECTOR_RANGE），支持在不可通行区域施法（allow_action_on_impassable）和快速施法（quickcast），同时提供暗影等级与防自动拾取标记。'],
  ],
  related:[link('veterans-curse','老兵诅咒'),link('bearger','熊獾')],
  sources:[drop(16),prefab('beargerclaw',79),prefab('beargerclaw',173),prefab('beargerclaw',205)],
 },
 {
  id:'slobber-lobber',category:'new-items',prefab:'slobberlobber',title:'熔岩口器',aliases:['Slobber Lobber','龙蝇老兵装备','吐岩浆'],
  summary:'开启老兵诅咒后击杀龙蝇或时令龙蝇掉落的远程施法武器，冷却制发射熔岩球。',
  configs:['vetcurse'],
  sections:[
   ['获取与穿戴条件','开启老兵诅咒时，击杀龙蝇（及对应龙蝇变种）必掉 1 件熔岩口器，带有 vetcurse_item 与暗影等级标签。'],
   ['特性','支持快速施法，最大射程参考雪球发射器范围，每次施法后按 SLOBBERLOBBER_COOLDOWN 进入充能冷却。'],
  ],
  related:[link('veterans-curse','老兵诅咒'),link('dragonfly','龙蝇')],
  sources:[drop(23),prefab('slobberlobber',74),prefab('slobberlobber',95),prefab('slobberlobber',148),prefab('slobberlobber',180)],
 },
 {
  id:'feather-frock',category:'new-items',prefab:'feather_frock',title:'羽毛长袍',aliases:['Feather Frock','麋鹿鹅老兵装备','羽毛衣'],
  summary:'开启老兵诅咒后击杀麋鹿鹅必掉的身体装备，提供高额防雨，并根据装入的羽毛类型减伤和反刺。',
  configs:['vetcurse'],
  sections:[
   ['获取','开启老兵诅咒时，击杀麋鹿鹅或母鹅必掉 1 件羽毛长袍。'],
   ['防雨与羽毛反刺','自带高额防水（WATERPROOFNESS_HUGE）与暗影等级。衣内可放入不同羽毛，受击时按羽毛种类提供对应的固定减伤（5 至 15 点）并向周围爆出对应伤害（10 至 50 点）的羽毛尖刺反击。'],
  ],
  related:[link('veterans-curse','老兵诅咒'),link('moose-goose','麋鹿鹅')],
  sources:[drop(29),drop(30),prefab('feather_frock',21),prefab('feather_frock',52),prefab('feather_frock',349),prefab('feather_frock',393)],
 },
 {
  id:'klaus-amulet',category:'new-items',prefab:'klaus_amulet',title:'无锁',aliases:['Naught Lock','Klaus Amulet','克劳斯护符','克劳斯老兵装备'],
  summary:'开启老兵诅咒后击杀克劳斯必掉的永不损坏护甲护符，并可触发连击增伤修正。',
  configs:['vetcurse'],
  sections:[
   ['获取与特性','开启老兵诅咒时，击杀克劳斯必掉 1 件无锁。装备后提供不可损坏的基础护甲吸收（KLAUS_AMULET_ABSORPTION）与暗影等级，并在连续攻击机制下应用第二击伤害倍率修正（KLAUS_AMULET_SECOND_HIT_DAMAGE_MULT）。'],
  ],
  related:[link('veterans-curse','老兵诅咒'),link('klaus','克劳斯')],
  sources:[drop(28),prefab('klaus_amulet',36),prefab('klaus_amulet',74),prefab('klaus_amulet',101),prefab('klaus_amulet',104)],
 },
 {
  id:'crab-claw',category:'new-items',prefab:'crabclaw',title:'诅咒蟹钳',aliases:['Crab Claw','蟹钳','帝王蟹老兵装备'],
  summary:'开启老兵诅咒后击杀帝王蟹必掉的镶嵌型钝器，支持宝石学附魔，镶嵌不同宝石可改变伤害并附带吸血或回理智。',
  configs:['vetcurse'],
  sections:[
   ['获取','开启老兵诅咒时，击杀帝王蟹必掉 1 件诅咒蟹钳（同时帝王蟹也会掉落休眠唤雨海螺）。'],
   ['宝石镶嵌与附魔','蟹钳内置宝石槽位且本身支持宝石学附魔（gem_enchantable）。攻击伤害随槽内宝石动态计算；镶嵌红宝石或彩虹宝石时每次攻击按 (红+彩)/5 回复生命，镶嵌黄宝石或彩虹宝石时按 (黄+彩)/5 回复理智。'],
  ],
  related:[link('veterans-curse','老兵诅咒'),link('crab-king','帝王蟹'),link('gemology','宝石学与附魔')],
  sources:[drop(19),prefab('crabclaw',354),prefab('crabclaw',361),prefab('crabclaw',456),prefab('crabclaw',478)],
 },
 {
  id:'um-beegun',category:'new-items',prefab:'um_beegun',title:'手持蜂巢',aliases:['Bee Gun','蜂枪','蜂王老兵装备','子弹蜂'],
  summary:'开启老兵诅咒后击杀蜂王必掉的远程武器，发射会持续追击并叠加假毒伤害的子弹蜂。',
  configs:['vetcurse'],
  sections:[
   ['获取','开启老兵诅咒时，击杀蜂王必掉 1 把手持蜂巢。'],
   ['子弹蜂攻击','采用弹弓同档射程，攻击时发射子弹蜂（bulletbee）追踪目标。子弹蜂具备飞行、无魂与蜜蜂过敏额外伤害机制，且能通过叠层对目标造成持续额外扣血。'],
  ],
  related:[link('veterans-curse','老兵诅咒'),link('bee-queen','蜂王')],
  sources:[drop(15),prefab('um_beegun',161),prefab('um_beegun',207),prefab('um_beegun',630),prefab('um_beegun',689)],
 },
 {
  id:'moonfly-lantern',category:'new-items',prefab:'um_moonfly_lantern',title:'月蝇提灯',aliases:['Moonfly Lantern','月光龙蝇老兵装备','月光提灯'],
  summary:'开启老兵诅咒后击杀月光龙蝇必掉的手持光源武器，提供 +10% 移速与虚影防护。',
  configs:['vetcurse'],
  sections:[
   ['获取与特性','开启老兵诅咒时，击杀月光龙蝇必掉 1 盏月蝇提灯。手持时提供稳定照明、防虚影干扰标签（gestaltprotection），基础近战伤害等同步行手杖，并附带步行手杖倍率减 0.15（即 1.10×）的移速加成，移动时留下月光轨迹。'],
  ],
  related:[link('veterans-curse','老兵诅咒'),link('summer-dragonflies','月光龙蝇')],
  sources:[drop(25),prefab('um_moonfly_lantern',171),prefab('um_moonfly_lantern',174),prefab('um_moonfly_lantern',199),prefab('um_moonfly_lantern',202)],
 },
];
