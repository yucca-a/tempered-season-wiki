const beta=(file,line)=>({file,line});
const cfg=line=>beta('modinfo.lua',line);
const link=(id,label)=>({id,label});

export const itemChangesArticles=[
 {
  id:'inventory-backpacks',category:'items',icon:'backpack',title:'空背包进物品栏',aliases:['Backpacks and Alikes','背包放物品栏','空背包','背包当燃料'],
  summary:'清空的背包可以直接放进物品栏或箱子，可燃背包还能作为中大型燃料烧火。',
  configs:['inventory_backpacks'],
  sections:[
   ['空包收纳规则','默认开启。所有带 backpack 标签的容器在清空后都允许放进普通物品栏或箱子；只要里面放入了任意物品，就立刻禁止继续套娃装进其他容器。'],
   ['燃料属性','原本可燃但没有燃料组件的背包会获得中等偏大的燃料值（MED_LARGE_FUEL），可以直接用来给营火或火坑添柴。'],
  ],
  related:[link('clothing-pockets','服装口袋')],
  sources:[cfg(613),beta('init/init_postinit.lua',476),beta('postinit/prefabs/inventory_backpacks.lua',9),beta('postinit/prefabs/inventory_backpacks.lua',36)],
 },
 {
  id:'clothing-pockets',category:'items',icon:'beargervest',title:'服装口袋',aliases:['Clothing Pockets','衣服口袋','熊皮背心口袋','口袋'],
  summary:'多件穿戴类衣物自带额外口袋空间，穿上自动打开，耐久耗尽或腐烂前会把物品全部掉出。',
  configs:['pocket_powertrip_'],
  sections:[
   ['口袋开启与收纳','默认开启。为指定身体衣物挂载独立容器并在小地图显示图标。穿戴衣物时自动打开口袋，清空口袋后衣服可以放进普通物品栏或箱子，装有物品时则不能继续套娃放入容器。'],
   ['耗尽保护','衣物因耐久耗尽或腐烂消失时，会先把口袋里的全部物品掉落在地面上，避免随衣物一起消失。'],
  ],
  related:[link('inventory-backpacks','空背包进物品栏')],
  sources:[cfg(619),beta('init/init_postinit.lua',472),beta('postinit/prefabs/pocket_powertrip.lua',19),beta('postinit/prefabs/pocket_powertrip.lua',27)],
 },
 {
  id:'infinite-blueprints',category:'items',icon:'blueprint',title:'无限蓝图',aliases:['Blueprints','蓝图不消耗','蓝图复用'],
  summary:'学习蓝图后不会消耗蓝图本身，同一张蓝图可以给多名队友轮流学习。',
  configs:['infinite_blueprints_'],
  sections:[
   ['复用机制','默认开启。教学组件（teacher）在教授配方的瞬间会临时屏蔽自身的 Remove 调用，学完后恢复，因此蓝图可以反复传给其他玩家使用。'],
  ],
  sources:[cfg(615),beta('init/init_postinit.lua',581),beta('postinit/components/teacher.lua',5)],
 },
 {
  id:'compost-over-rot',category:'items',icon:'compost',title:'堆肥替代腐烂物',aliases:['Compost Replaces Rot','强心针配方','蘑菇农场配方','堆肥'],
  summary:'强心针、蘑菇农场和堆肥包等关键配方改为使用堆肥或调整材料，提高堆肥桶的地位。',
  configs:['compostoverrot'],
  sections:[
   ['配方变更','默认开启。强心针改为 2 硝石 + 6 红蘑菇 + 1 蜂刺；蘑菇农场改为 4 堆肥 + 5 粪肥 + 2 活木；堆肥包也同步调整配方材料。'],
  ],
  related:[link('mushrooms-and-planter','蘑菇与蘑菇农场调整')],
  sources:[cfg(620),beta('init/init_recipes/recipe_changes.lua',28)],
 },
 {
  id:'crafting-and-collisions',category:'items',icon:'researchlab',title:'禁用四材料配方与移除碰撞',aliases:['No 4-Ingredient Recipes','Remove Collisions','四材料配方','移除体积碰撞'],
  summary:'简化部分四材料配方的材料栏位，并放开部分障碍物的体积碰撞减少卡位。',
  configs:['no4crafts','passibleimpassibles'],
  sections:[
   ['禁用四材料配方','开启 no4crafts 后，会调整部分超出三格材料的配方结构。'],
   ['移除碰撞','开启 passibleimpassibles 后，会在通用实体初始化阶段移除部分易卡位障碍物的碰撞限制。'],
  ],
  sources:[cfg(652),cfg(653),beta('init/init_recipes/recipe_changes.lua',229),beta('postinit/any.lua',10)],
 },
 {
  id:'mushroom-hats',category:'items',icon:'red_mushroomhat',title:'三色蘑菇帽重做',aliases:['Funcap Rework','红蘑菇帽','绿蘑菇帽','蓝蘑菇帽'],
  summary:'戴着蘑菇帽吃对应颜色蘑菇可以叠加充能层数，获得攻击、移速或制作相关加成。',
  configs:['funcap_fun'],
  sections:[
   ['充能与衰减','默认开启。红、绿、蓝蘑菇帽分别对应红、绿、蓝蘑菇充能，最高可叠至 12 层。超过 6 层时每 40 秒掉 1 层，6 层及以下每 120 秒掉 1 层，并随层数显示对应颜色的孢子特效。'],
   ['三色效果','红蘑菇帽提供外部伤害倍率加成，绿蘑菇帽提供外部移速加成，蓝蘑菇帽在穿戴状态下触发专属制作状态分支；脱下或充能归零时移除对应增益。'],
  ],
  sources:[cfg(616),beta('init/init_postinit.lua',589),beta('postinit/prefabs/mushroom_hats.lua',61),beta('postinit/prefabs/mushroom_hats.lua',81),beta('postinit/stategraphs/SGwilson.lua',343)],
 },
 {
  id:'cookiecutter-hat',category:'items',icon:'cookiecutterhat',title:'饼干切割机帽反刺',aliases:['Cookie Cutter Hat','饼干帽','反伤帽'],
  summary:'戴着饼干切割机帽挨打或格挡时，会向周围爆出饼干尖刺反击敌人。',
  configs:['cookiecutterhat'],
  sections:[
   ['受击反刺','默认开启。装备状态下只要受到非重定向攻击或触发格挡，每隔至少 0.3 秒就会在自身周围生成一次饼干尖刺特效（cookiespikes），对近身敌人造成反击。'],
  ],
  sources:[cfg(621),beta('init/init_postinit.lua',564),beta('postinit/prefabs/cookiecutterhat.lua',9),beta('postinit/prefabs/cookiecutterhat.lua',34)],
 },
 {
  id:'eyebrella-rework',category:'items',icon:'eyebrellahat',title:'眼球伞调整',aliases:['Eyebrella Rework','眼球伞','隔热削弱'],
  summary:'默认关闭重做时眼球伞隔热被压低到 60；开启实验重做后耐久升至 12 天，但只能用眼球类材料修补。',
  configs:['eyebrellarework'],
  sections:[
   ['默认状态（关闭重做）','未开启实验重做时，测试版仍会把眼球伞的夏季隔热值从原版 240 压低到小型隔热（INSULATION_SMALL = 60），使其不再兼任顶级防暑装备。'],
   ['实验重做（开启）','开启 eyebrellarework 后，眼球伞耐久延长到原版的 12/9 倍（12 天），禁止使用针线包修补，改为接受眼球类燃料（FUELTYPE.EYE）补充耐久。'],
  ],
  sources:[cfg(1439),beta('postinit/prefabs/eyebrella.lua',20),beta('init/init_durability.lua',125)],
 },
 {
  id:'scalemail-buff',category:'items',icon:'armordragonfly',title:'鳞甲召唤岩浆虫',aliases:['Scalemail Buff','火甲','龙鳞甲','随从岩浆虫'],
  summary:'装备鳞甲时会召唤最多 3 只友方岩浆虫替你作战，阵亡后 8 秒自动复活。',
  configs:['scalemailbuff'],
  sections:[
   ['三只随从岩浆虫','默认开启。穿上鳞甲时最多保持 3 只友方岩浆虫（armorlavae）跟随主人作战。任意一只岩浆虫死亡后，鳞甲内部会启动 8 秒复活计时器，计时结束且鳞甲仍穿在身上时重新召出。'],
  ],
  related:[link('scaled-chest-buff','25 格龙鳞宝箱')],
  sources:[cfg(657),beta('init/init_postinit.lua',489),beta('postinit/prefabs/armor_dragonfly.lua',26),beta('postinit/prefabs/armor_dragonfly.lua',44),beta('postinit/prefabs/armor_dragonfly.lua',53)],
 },
 {
  id:'scaled-chest-buff',category:'items',icon:'dragonflychest',title:'25 格龙鳞宝箱',aliases:['Scaled Chest Buff','龙鳞箱子','25格箱子'],
  summary:'龙鳞宝箱的容器空间扩展为 5×5 共 25 格。',
  configs:['scaledchestbuff'],
  sections:[
   ['容量扩展','默认开启。将龙鳞宝箱的界面布局改为 5 行 × 5 列共 25 格，并提供配套的龙鳞边框界面。'],
  ],
  related:[link('scalemail-buff','鳞甲召唤岩浆虫')],
  sources:[cfg(658),beta('init/init_containers.lua',712)],
 },
 {
  id:'hambat-nerf',category:'items',icon:'hambat',title:'火腿棒削弱',aliases:['Ham Bat','火腿球棒','腐烂加速'],
  summary:'火腿棒保质期缩短到 6 天，新鲜度掉到底时的最低伤害再砍一半。',
  configs:['hambatnerf'],
  sections:[
   ['保质期与伤害曲线','默认开启。火腿棒腐烂时间改为较快档（PERISH_FASTISH，6 天），最低伤害系数减半（原版最低伤害倍率的一半）。装备、卸下和每次攻击时都会按当前新鲜度实时重新计算伤害。'],
  ],
  sources:[cfg(642),beta('init/init_postinit.lua',547),beta('postinit/prefabs/hambat.lua',5),beta('postinit/prefabs/hambat.lua',19)],
 },
 {
  id:'electrical-weapons',category:'items',icon:'nightstick',title:'电气武器与电池燃料',aliases:['Electrical Weapon Retune','晨星锤','电池燃料','电光浆果'],
  summary:'晨星锤等电气武器在 2 档配置下可直接用土豆、电元件、伏特羊角、羊奶、电光浆果等电池类燃料充能。',
  configs:['electricalmishap'],
  sections:[
   ['电池燃料清单','当 electricalmishap 设为 2 档时，以下物品都会获得电池燃料属性（BATTERYPOWER）：土豆（中型燃料 1/3）、金丝雀羽毛（中型燃料 2/3）、电子元件与烂电线（中型燃料）、伏特羊角、羊奶与电光浆果（大型燃料）。'],
  ],
  sources:[cfg(624),beta('init/init_batterypower.lua',15),beta('init/init_batterypower.lua',47)],
 },
 {
  id:'walking-cane',category:'items',icon:'cane',title:'步行手杖耐久',aliases:['Walking Cane','手杖耐久','走路耗耐久'],
  summary:'开启后步行手杖在手持向前行走时会持续消耗燃料耐久，停步、收起或骑牛时暂停消耗。',
  configs:['cane_durability'],
  sections:[
   ['移动耗耐久','开启 cane_durability 后，步行手杖会监听持有者的移动事件：只有装备在手、未骑牛且向前移动时才消耗耐久；停下来或卸下会立刻停止消耗。'],
  ],
  related:[link('lazy-explorer','懒人魔杖冷却')],
  sources:[cfg(687),beta('postinit/prefabs/cane.lua',6),beta('postinit/prefabs/cane.lua',103),beta('postinit/prefabs/cane.lua',127)],
 },
 {
  id:'watering-can-temp',category:'items',icon:'wateringcan',title:'浇水壶取消降温',aliases:['Watering Can Temperature','鸟嘴壶','浇水壶降温'],
  summary:'普通浇水壶和鸟嘴壶的水分保护降温值归零，不能再靠泼水快速压低体温或暖石温度。',
  configs:['watering_thermal'],
  sections:[
   ['降温归零','默认开启。将 wateringcan 与 premiumwateringcan 的 wateryprotection.temperaturereduction 设为 0，保留浇水和灭火功能，但不再提供额外降温。'],
  ],
  sources:[cfg(690),beta('postinit/prefabs/wateringcan.lua',4)],
 },
 {
  id:'lazy-explorer',category:'items',icon:'orangestaff',title:'懒人魔杖三档冷却',aliases:['Lazy Explorer','橙杖','瞬移手杖','冷却'],
  summary:'懒人魔杖移除有限使用次数，改为按瞬移距离分三档消耗理智并进入独立冷却。',
  configs:['cooldown_orangestaff'],
  sections:[
   ['三档距离结算','默认开启。移除有限耐久（finiteuses），改为可充能冷却（rechargeable）：近距离消耗中等理智（15）、中距离消耗中大型理智（33）、远距离消耗大型理智（50），并分别触发三档递增长度的冷却时间。冷却期间暂时禁用瞬移组件，充能完成后恢复。'],
  ],
  related:[link('walking-cane','步行手杖耐久')],
  sources:[cfg(646),beta('postinit/prefabs/cane.lua',10),beta('postinit/prefabs/staffs.lua',60),beta('postinit/prefabs/staffs.lua',105)],
 },
 {
  id:'telestaff-rework',category:'items',icon:'telestaff',title:'传送法杖与紫宝石道具重做',aliases:['Purple Gem Items','传送法杖','传送焦点','紫宝石'],
  summary:'传送法杖会检索全场可用传送焦点，没有焦点时改为安全传送到主世界可通行的非隔离陆地节点。',
  configs:['telestaff_rework'],
  sections:[
   ['传送目标逻辑','默认开启。施法时会先查找所有可接收传送的传送焦点（telebase）；若没有可用焦点，则从世界拓扑节点中随机挑选可通行且非独立隔离房间的陆地落点，并在传送后保护目标不被雷击点燃。同步调整紫宝石相关配方。'],
  ],
  sources:[cfg(655),beta('init/init_recipes/recipe_changes.lua',300),beta('postinit/prefabs/staffs.lua',120),beta('postinit/prefabs/staffs.lua',148)],
 },
 {
  id:'lazy-deserter',category:'items',icon:'townportal',title:'懒人传送塔范围自动拾取',aliases:['Lazy Deserter Rework','懒人传送塔','沙之石','自动采摘'],
  summary:'引导懒人传送塔时，会自动将周围大范围内的地面物品和可采摘作物吸进引导者背包。',
  configs:['townportal_rework'],
  sections:[
   ['范围拾取与采摘','默认开启。懒人传送塔生效半径为雪球发射器范围的 1.1 倍，会跳过不可替代物、火源、蜘蛛、花朵、暖石、包袱等排除标签，自动收集范围内的地面掉落与可采作物。'],
  ],
  sources:[cfg(644),beta('init/init_postinit.lua',555),beta('postinit/prefabs/townportal.lua',4),beta('postinit/prefabs/townportal.lua',50)],
 },
 {
  id:'life-amulet',category:'items',icon:'amulet',title:'重生护符重做',aliases:['Life Giving Amulet Rework','红护符','重生护符','复活护符'],
  summary:'重做重生护符的保命与复活触发逻辑，使其更贴合测试版的死亡与生命上限规则。',
  configs:['lifeamulet'],
  sections:[
   ['保命与复活模块','默认开启。通过独立模块 init_lifeamulet 接管重生护符的佩戴与濒死触发机制，与生命上限惩罚等核心规则协同工作。'],
  ],
  related:[link('max-health-penalties','生命上限惩罚机制')],
  sources:[cfg(649),beta('init/init_gamemodes/init_uncompromising_mode.lua',210),beta('init/init_lifeamulet.lua',8)],
 },
 {
  id:'celestial-items',category:'items',icon:'glasscutter',title:'天体祭坛物品与玻璃刀调整',aliases:['Celestial Altar Item Changes','玻璃刀','月光玻璃斧','天体祭坛'],
  summary:'玻璃刀对暗影阵营目标获得 1.25 倍伤害加成并套用暗影损耗系数，同步调整天体工具加成与配方。',
  configs:['celestialitems_revert'],
  sections:[
   ['玻璃刀与月光玻璃斧','默认开启。将原版默认的对暗影伤害常数归 1，并改为给玻璃刀挂上对 shadow_aligned 目标的 1 + 17/68（即 1.25 倍）伤害类型加成；攻击暗影阵营目标时采用暗影损耗系数，同时调整部分天体祭坛配方。'],
  ],
  sources:[cfg(617),beta('init/init_postinit.lua',585),beta('init/init_tuning.lua',543),beta('init/init_recipes/recipe_changes.lua',80),beta('postinit/prefabs/glasscutter.lua',10),beta('postinit/prefabs/glasscutter.lua',20)],
 },
 {
  id:'sleeping-rework',category:'items',icon:'tent',title:'睡眠回复与速率调整',aliases:['Sleeping Buff','Sleeping Stat Speed','睡觉','帐篷','凉棚','草席卷','毛皮铺盖'],
  summary:'睡觉除了恢复生命和理智，还会逐步修复生命上限惩罚，且睡眠结算速度默认加快。',
  configs:['gotobed','sleepingbuff'],
  sections:[
   ['睡觉修复黑血','默认开启（gotobed）。使用帐篷、凉棚、铺盖等睡眠设施时，每次睡眠结算除了正常回血，还会按当次生命回复量的一半换算为百分比修复生命上限惩罚（例如每次回 2 血就减少 1% 惩罚）。默认档（default）下只在生命上限惩罚低于 25% 时修复，传统档（legacy）则不设 25% 上限。'],
   ['睡眠速率倍率','睡眠速率（sleepingbuff）直接按所选倍率缩短睡眠的每次结算周期（TUNING.SLEEP_TICK_PERIOD / 倍率），让睡觉回复更快完成。WX-78 在启用相关规则时睡觉每 6 秒还会回复 1 格电量。'],
  ],
  related:[link('max-health-penalties','生命上限惩罚机制')],
  sources:[cfg(665),cfg(676),beta('postinit/components/sleepingbaguser.lua',5),beta('postinit/components/sleepingbaguser.lua',9),beta('postinit/components/sleepingbaguser.lua',27),beta('init/init_tuning.lua',616)],
 },
];
