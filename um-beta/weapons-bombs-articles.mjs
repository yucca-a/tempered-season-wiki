const beta=(file,line)=>({file,line});
const recipe=line=>beta('init/init_recipes/recipes.lua',line);
const prefab=(file,line)=>beta(`scripts/prefabs/${file}.lua`,line);
const link=(id,label)=>({id,label});

export const weaponsBombsArticles=[
 {
  id:'jawed-scythe',category:'new-items',prefab:'jawed_scythe',title:'颚镰',aliases:['Jawed Scythe','镰刀','割草'],
  summary:'基础伤害 44.2、耐久 100 次的镰刀武器，用于战斗与范围收割。',
  configs:[],
  sections:[
   ['获取与属性','在科学机器旁用树枝 ×4、钢丝绒 ×1、利颚 ×3 制作。基础伤害为长矛的 1.3 倍（44.2），最大使用次数 100 次。'],
  ],
  related:[link('um-ice-sicle','冰镰')],
  sources:[recipe(107),prefab('jawed_scythe',154),prefab('jawed_scythe',263)],
 },
 {
  id:'um-ice-sicle',category:'new-items',prefab:'um_ice_sicle',title:'冰镰',aliases:['Ice Sicle','Ice Scythe','冰霜镰刀'],
  summary:'基础伤害 44.2、攻击附带冰冻值的魔法镰刀，耐久为黄金工具倍率的 50 次（200 次）。',
  configs:['snowstorms'],
  sections:[
   ['获取与属性','在暗影操控器旁用冰魔杖 ×1、活木 ×1、霜花 ×1 制作。基础伤害 44.2，每次攻击为目标附加 1 点冰冻值，最大耐久 200 次（50 × GOLDENTOOLFACTOR）。'],
  ],
  related:[link('rimeweed','尖刺霜草与霜花'),link('jawed-scythe','颚镰')],
  sources:[recipe(147),prefab('um_ice_scythe',183),prefab('um_ice_scythe',200),prefab('um_ice_scythe',306)],
 },
 {
  id:'rimeweed-whip',category:'new-items',prefab:'rimeweed_whip',title:'霜鞭',aliases:['Rimeweed Whip','冰霜鞭'],
  summary:'击杀二、三阶段尖刺霜草掉落的长距离冰冻鞭子，耐久 150 次，命中可施加寒冷。',
  configs:['snowstorms'],
  sections:[
   ['获取与属性','破坏二阶段（25% 概率）或三阶段（50% 概率）尖刺霜草掉落。拥有三尾猫鞭同档射程，最大使用次数 150 次，攻击命中可按目标当前冰抗施加寒冷值。'],
  ],
  related:[link('rimeweed','尖刺霜草与局部暴雪')],
  sources:[prefab('um_rimeweed',795),prefab('um_rimeweed',831),prefab('um_rimeweed',837)],
 },
 {
  id:'rat-whip',category:'new-items',prefab:'rat_whip',title:'绞尾鼠鞭',aliases:['Rat Whip','鼠尾鞭'],
  summary:'用鼠尾制作的鞭类武器，兼具有限耐久与 200 点燃料槽位。',
  configs:['rat_raids'],
  sections:[
   ['获取与属性','在炼金引擎旁用树枝 ×3、蚊子血囊 ×1、鼠尾 ×3 制作。采用标准鞭类射程（WHIP_RANGE）与使用次数，内置 200 点燃料槽用于调节鞭打伤害。'],
  ],
  related:[link('rat-tail','鼠尾'),link('rat-raids','鼠潮与鼠穴')],
  sources:[recipe(229),prefab('rat_whip',104),prefab('rat_whip',105),prefab('rat_whip',115)],
 },
 {
  id:'bugzapper',category:'new-items',prefab:'bugzapper',title:'电蚊拍',aliases:['Bug Zapper','灭虫拍','打蝴蝶'],
  summary:'带电击与灭虫特攻的燃料武器，能直接拍中会闪避近战的蝴蝶。',
  configs:[],
  sections:[
   ['获取与用途','在炼金引擎旁用长矛 ×1、电子元件 ×2、金丝雀羽毛 ×2 制作，采用晨星锤同档燃料时长（NIGHTSTICK_FUEL）。对昆虫类目标有额外伤害，且无视测试版蝴蝶的近战滑走闪避。'],
  ],
  related:[link('adjusted-butterflies','蝴蝶闪避与属性调整')],
  sources:[recipe(162),prefab('bugzapper',199),prefab('bugzapper',215)],
 },
 {
  id:'um-magnerang',category:'new-items',prefab:'um_magnerang',title:'磁力回旋镖',aliases:['Magnerang','电磁回旋镖'],
  summary:'伤害 34、耐久为普通回旋镖 1.5 倍的改良回旋镖，支持机械开关切换。',
  configs:[],
  sections:[
   ['获取与属性','在炼金引擎旁用回旋镖 ×1、电子元件 ×2、废料 ×1 制作。单次命中伤害 34，射程比普通回旋镖更远，最大耐久为普通回旋镖的 1.5 倍（15 次）。'],
  ],
  sources:[recipe(246),prefab('um_magnerang',151),prefab('um_magnerang',152),prefab('um_magnerang',173)],
 },
 {
  id:'um-flamethrower',category:'new-items',prefab:'um_flamethrower',title:'爆焰喷射器',aliases:['Flamethrower','火焰喷射器','喷火器'],
  summary:'用椒龙储火袋与黄铁矿制成的火焰喷射武器。',
  configs:['magma_caves'],
  sections:[
   ['获取与用途','在炼金引擎旁用储火袋 ×1、黄铁矿 ×8、石头 ×5 制作。消耗耐久喷射火焰攻击前方敌人。'],
  ],
  related:[link('pepperdragon','椒龙与椒龙巢'),link('um-fyrite','黄铁矿')],
  sources:[recipe(328),prefab('um_guns',250)],
 },
 {
  id:'um-blowdarts',category:'new-items',prefab:'um_blowdart_rime',variantPrefabs:['um_blowdart_pyre'],title:'霜镖与荨麻飞镖',aliases:['Rime Dart','Pyre Dart','um_blowdart_rime','um_blowdart_pyre','冰吹箭','火吹箭'],
  summary:'两种测试版元素吹箭：霜镖 75 伤害并附带冰冻，荨麻飞镖 25 伤害并附带火焰与毒素效果。',
  configs:[],
  sections:[
   ['霜镖（um_blowdart_rime）','在炼金引擎旁用采下的芦苇 ×2、霜冻藤蔓 ×1、蓝色羽毛 ×1 制作。射程 8–10，单发 75 伤害并施加高额冰冻值。'],
   ['荨麻飞镖（um_blowdart_pyre）','在炼金引擎旁用采下的芦苇 ×2、荨麻孢子 ×1、火荨麻叶 ×1 制作。射程 8–10，单发 25 伤害并附带火荨麻灼烧效果。'],
  ],
  related:[link('rimeweed','尖刺霜草')],
  sources:[recipe(38),recipe(135),prefab('um_blowdart_rime',55),prefab('um_blowdart_rime',121),prefab('um_blowdart_pyre',129)],
 },
 {
  id:'um-tentaclespike-moon',category:'new-items',prefab:'um_tentaclespike_moon',title:'巨型触手尖刺',aliases:['Lunar Tentacle Spike','月亮触手尖刺','投掷尖刺'],
  summary:'击杀月岛巨型触手掉落的远程投掷武器，投掷射程高达 16 单位。',
  configs:[],
  sections:[
   ['获取与用法','击杀月岛巨型触手固定掉落 4 根（最多 6 根）。装备后可朝 16 单位内的目标远程投掷攻击。'],
  ],
  related:[link('lunar-tentacle','月岛巨型触手')],
  sources:[prefab('um_tentacle_moon',11),prefab('um_tentacle_moon_projectile',368),prefab('um_tentacle_moon_projectile',369)],
 },
 {
  id:'um-boomberry-bomb',category:'new-items',prefab:'um_boomberry_bomb',title:'爆汁蓝莓炸弹',aliases:['Boomberry Bomb','蓝莓炸弹'],
  summary:'用爆汁蓝莓制成的手抛炸弹，射程 8–10、爆炸半径 3。',
  configs:[],
  sections:[
   ['获取与用法','在科学机器旁用爆汁蓝莓 ×2、树枝 ×2、采下的草 ×1 制作。可投掷至 8–10 单位处，落地触发半径 3 的范围爆炸。'],
  ],
  related:[link('boomberry-plant','爆汁蓝莓植株与猪笼草')],
  sources:[recipe(166),prefab('um_boomberry_bomb',20),prefab('um_boomberry_bomb',165)],
 },
 {
  id:'um-bomb-moon',category:'new-items',prefab:'um_bomb_moon',title:'跨巨型气体炸弹',aliases:['Lunar Gas Bomb','月光炸弹','月亮气体炸弹'],
  summary:'用巨型触手皮、废料和月亮碎片制成的强力手抛炸弹，半径 5、基础爆炸伤害 150。',
  configs:[],
  sections:[
   ['获取与用法','在炼金引擎旁用巨型触手皮 ×1、废料 ×1、月亮碎片 ×8 制作。投掷射程 8–10，引爆后在半径 5 范围内造成 150 基础伤害并按月亮阵营倍率结算。'],
  ],
  related:[link('lunar-tentacle','月岛巨型触手'),link('um-detonator','万能引爆器')],
  sources:[recipe(172),prefab('um_bombs',89),prefab('um_bombs',225)],
 },
 {
  id:'um-fyre-bomb',category:'new-items',prefab:'um_fyre_bomb',title:'高爆弹',aliases:['Fyre Bomb','黄铁矿炸弹','高爆炸弹'],
  summary:'用黄铁矿制作的手抛爆破炸弹，投掷射程 8–10、爆炸半径 3。',
  configs:['magma_caves'],
  sections:[
   ['获取与用法','在炼金引擎旁用黄铁矿 ×2、树枝 ×2、石头 ×3 制作。可投掷至 8–10 单位处造成半径 3 的爆破伤害。'],
  ],
  related:[link('um-fyrite','黄铁矿'),link('um-detonator','万能引爆器')],
  sources:[recipe(349),prefab('um_bombs',33),prefab('um_bombs',225)],
 },
 {
  id:'um-beemine-moon',category:'new-items',prefab:'um_beemine_moon_item',title:'腐臭蜂地雷',aliases:['Carrion Bee Mine','月亮蜜蜂地雷'],
  summary:'用腐臭蜂和腐臭蜂蜜制作的可投掷地雷，触发后释放腐臭蜂攻击敌人。',
  configs:['moon_bees'],
  sections:[
   ['获取与用法','在炼金引擎旁用木头 ×2、腐臭蜂 ×1、腐臭蜂蜜 ×2 制作。支持 8–10 单位投掷或地面布置，敌人触发后释放腐臭蜂。'],
  ],
  related:[link('lunar-island','月岛与腐臭蜂巢')],
  sources:[recipe(181),prefab('um_beemine_moon',451),prefab('um_beemine_moon',452)],
 },
 {
  id:'um-bear-traps',category:'new-items',prefab:'um_bear_trap_equippable_tooth',variantPrefabs:['um_bear_trap_equippable_gold'],title:'捕兽夹与黄金捕兽夹',aliases:['Bear Trap','Gold Bear Trap','um_bear_trap_equippable_tooth','um_bear_trap_equippable_gold','利颚陷阱'],
  summary:'可手持投掷布置的捕兽夹陷阱，普通版与黄金版均可在 8–10 单位内远程抛设。',
  configs:['hoodedforest','ghostwalrus'],
  sections:[
   ['制作','开启连帽森林或锈蚀陷阱时解锁：普通捕兽夹在科学机器旁用石头 ×1、利颚 ×1 制作；黄金捕兽夹在炼金引擎旁用金块 ×3、狗牙 ×2、利颚 ×1 制作。'],
   ['布置与耐久','可直接装备在手朝 8–10 单位处投掷落地自动展开（基础耐久 8 次），踩中敌人造成伤害与定身。'],
  ],
  related:[link('autumn-weather','锈蚀捕兽夹')],
  sources:[recipe(193),recipe(202),prefab('um_bear_trap',672),prefab('um_bear_trap',741)],
 },
 {
  id:'um-detonator',category:'new-items',prefab:'um_detonator',title:'万能引爆器',aliases:['Detonator','遥控引爆器'],
  summary:'远距离遥控引爆范围内炸弹与地雷的电子工具，耐久高达 1,000 次。',
  configs:[],
  sections:[
   ['获取与用途','在炼金引擎旁用电光浆果 ×1、废料 ×2、伏特羊角 ×1 制作。作用范围沿用薇诺娜遥控器范围（WINONA_REMOTE_RANGE），最大使用次数 1,000 次，可一键远程触发区域内的炸弹与爆破物。'],
  ],
  related:[link('um-fyre-bomb','高爆弹'),link('um-bomb-moon','跨巨型气体炸弹')],
  sources:[recipe(213),prefab('um_detonator',494),prefab('um_detonator',542)],
 },
];
