export const auditedVersion='6.0.3.8';
export const auditedCnVersion='20260926.1';

const beta=(file,line)=>({file,line});
const cn=(file,line)=>({kind:'cn',file,line});
const cfg=line=>beta('modinfo.lua',line);
const names=line=>cn('init/init_strings/init_names.lua',line);
const recipe=line=>beta('init/init_recipes/recipes.lua',line);
const character=line=>cn('init/init_character_um.lua',line);

export const articles=[
 {
  id:'rat-raids',category:'生存与世界',title:'鼠潮与鼠穴',aliases:['Rat Raids','背包鼠','穴居鼠','花衣吹笛者'],
  summary:'食物储存和开关容器都可能影响地表鼠潮。周期嗅探与容器触发走两条路径。',
  configs:['rat_raids','rattimer','ratgrace','ratsnifftimer'],
  sections:[
   ['计时与嗅探','默认开启。周期计时默认 9,600 秒，嗅探间隔默认 120 秒。周期嗅探要等世界周期计数严格大于宽限值，默认宽限值为 30。默认森林地表挂载鼠潮组件，普通洞穴没有这一路径。'],
   ['食物和容器','鼠群会检查附近鼠穴与食物。地面上不新鲜或腐坏的食物比存进容器的同类食物贡献更多嗅探分，料理按双倍计算，食物堆叠数量也计入。关闭木箱、冰箱、盐盒等容器以及收获锅中料理，可发出独立的鼠潮事件。'],
   ['宽限的适用范围','容器事件分支独立于周期宽限。在满足玩家附近的实体数量、可用位置与袭击状态条件时，可提前进入预警。'],
  ],
  sources:[cfg(229),cfg(578),beta('init/init_ratraid.lua',4),beta('init/init_ratraid.lua',35),beta('scripts/components/ratcheck.lua',213),beta('scripts/components/ratcheck.lua',301),beta('scripts/prefabs/uncompromising_rat.lua',1742),names(18)],
 },
 {
  id:'food-recovery',category:'生存与世界',title:'食物持续恢复',aliases:['Food Regen','回血','回理智'],
  summary:'食物恢复较多的生命或理智时，默认会改为持续结算。',
  configs:['foodregen'],
  sections:[
   ['即时与持续','默认开启。生命和理智分别判定，单项结算量大于 3 时进入持续恢复，其基础时长参数为该项结算量乘 0.1。数值不超过 3 或角色持有对应免疫标签时即时结算。饱食度按进食逻辑结算。'],
   ['重复进食','持续效果按食物 prefab 区分。再次吃同一种食物会延长对应效果，累计剩余时长受基础时长四倍的上限约束。老兵诅咒相关结算有独立分支。'],
  ],
  sources:[cfg(226),beta('init/init_food/init_foodregen.lua',4),beta('init/init_food/init_foodregen.lua',41),beta('scripts/prefabs/healthregenbuff_vetcurse.lua',24),beta('scripts/prefabs/healthregenbuff_vetcurse.lua',101)],
 },
 {
  id:'snowstorms',category:'生存与世界',title:'暴风雪与雪堆',aliases:['Snowstorms','猫眼护目镜','尖刺霜草'],
  summary:'冬季暴风雪分全域和局部天气，防护装备与近距离掩体能抵消移动惩罚。',
  configs:['snowstorms','weatherhazard_winter'],
  sections:[
   ['触发','暴风雪默认开启。全域暴雪达到世界周期门槛后，先预警并增加降水，约 60 秒后进入暴雪。默认门槛为 5 个世界周期，冬季最后两天不会发起新的全域暴雪。'],
   ['移动和防护','全域暴雪或局部暴雪中，无防护玩家移速乘 0.75。护目镜视野、骑乘、熊皮背心、雨罩，或角色 6 单位内有适用的墙、火或掩体，均可免去该移动惩罚。'],
   ['雪堆','玩家监测器可以在暴雪中生成雪堆。建筑脚本中隐藏容器的积雪逻辑当前处于注释状态，岩浆池和龙鳞火炉等仍有防雪堆标签。'],
  ],
  sources:[cfg(451),cfg(463),beta('scripts/components/snowstorminitiator.lua',21),beta('scripts/components/snowstormwatcher.lua',45),beta('init/init_weather/init_snowstorm_structures.lua',126),names(35),names(692)],
 },
 {
  id:'cave-worldgen',category:'生存与世界',title:'熔岩洞穴与潮湿陷坑',aliases:['Magma Caves','Flooded Caves','月岛','蓝蘑菇林'],
  summary:'洞穴配置会改变新世界的地形、入口和宝石学锻造台的位置。',
  configs:['worldgenmastertoggle','magma_caves','flooded_caves','gemology'],
  sections:[
   ['潮湿陷坑的三种档位','默认 lunar_cave 在月岛提供潮湿陷坑入口，对应离大陆洞穴区域。cave 将相关区域放在蓝蘑菇林方向。off 保留原版月亮石窟。'],
   ['熔岩洞穴与锻造台','熔岩洞穴和宝石学默认开启。两者同时启用时，新洞穴在熔岩区域要求生成宝石学锻造台。关闭熔岩洞穴并保留宝石学时，锻造台转入远古遗迹。'],
  ],
  sources:[cfg(556),beta('scripts/map/tasks/forest/moonisland.lua',19),beta('scripts/map/tasks/caves/mushroom_tasks.lua',46),beta('scripts/map/tasks/caves/magma_cave.lua',103),names(784)],
 },
 {
  id:'gemology',category:'装备与制作',title:'宝石学与装备附魔',aliases:['Gemology','晶洞','宝石学锻造台','鉴定'],
  searchJumps:[{terms:['宝石','宝石学','晶洞']},{section:'锻造台操作',terms:['附魔','装备附魔','锻造台','宝石学锻造台','宝石附魔','附魔石','鉴定']}],
  summary:'从不同晶洞取得宝石，再到锻造台把相容的宝石附加到装备上。',
  configs:['gemology','magma_caves'],
  sections:[
   ['晶洞掉落','按晶洞种类选择掉落池。每个晶洞基础抽取三次非宝石池、一次宝石池，并有 5% 概率再抽一次宝石池。如果该次抽到宝石学宝石，则三级概率 1%，二级概率 4%，其余为一级。'],
   ['锻造台操作','第一槽放装备，第二槽放宝石。装备与宝石相容时才能附魔。成功会消耗宝石，新附魔耐久设满。重复同种附魔会替换同种，槽满时新增不同种会移除旧附魔。普通附魔组件默认一个槽，具体装备可以有特例。'],
   ['配置的作用','宝石学开关与资源生成及若干配方有关。已有装备与附魔还涉及单独载入的运行代码。'],
  ],
  sources:[cfg(184),beta('scripts/prefabs/um_gemology_geodes.lua',17),beta('scripts/prefabs/um_gemologyforge.lua',25),beta('scripts/components/gem_enchantable.lua',25),beta('init/init_gamemodes/init_uncompromising_mode.lua',92),names(752),names(821)],
 },
 {
  id:'winky',category:'角色',title:'温奇',aliases:['Winky','鼠人','定居鼠穴'],
  summary:'温奇擅长地下通道和鼠穴储物，夜间走得更快。',
  configs:['funny rat'],
  sections:[
   ['基础属性','生命 175、饥饿 175、理智 125。移动倍率白天和黄昏为 1.15，夜间为 1.25。可以吃生肉和怪物肉。丢下非重物或触发符合条件的堆叠合并通常会扣 5 理智。'],
   ['鼠穴','空手右键合适的地面可打临时鼠穴。服务端要求饥饿严格大于 15 且未站在船等平台上，打洞消耗 15 饥饿，临时鼠穴约 180 秒消失。定居鼠穴消耗 20 饥饿，每个分片受一处定居鼠穴的限制。两类鼠穴在同一分片连接温奇的口袋空间。'],
   ['老兵诅咒','诅咒激活时，普通物品栏从 15 格降到 10 格，后 5 格的内容会被丢出。'],
  ],
  sources:[cfg(265),beta('modmain.lua',113),beta('scripts/prefabs/winky.lua',61),beta('scripts/prefabs/winky.lua',145),beta('scripts/prefabs/winky.lua',170),beta('init/init_actions.lua',140),recipe(737),beta('scripts/prefabs/uncompromising_rat.lua',1463),character(5)],
 },
 {
  id:'wixie',category:'角色',title:'薇希',aliases:['Wixie','薇茜','维希','弹弓妹','沃尔特重做'],
  summary:'测试版默认启用薇希和沃尔特重做，加入幽闭恐惧与专属弹弓配方。',
  configs:['wixie_walter'],
  sections:[
   ['角色与译名','相关配置默认开启。薇希的生命为 130、饥饿 150、理智 200。汉化的角色初始化写作「薇希」，角色专用文本又使用「薇茜」。两种写法都可搜索。'],
   ['幽闭恐惧','附近战斗生物、躲藏、骑乘、邻近墙壁或树木以及部分护具都会影响幽闭恐惧。部分头部和身体护甲各增加 0.2 的基础影响。累积到 100% 触发恐慌，降到 0 后解除并进入 10 秒冷却。'],
   ['弹弓','专属弹弓包括浮木弹弓-玛蒂尔达、活木弹弓-切齿、绝望弹弓-杰西和光芒弹弓-克莱尔。杰西和克莱尔分别要求暗影、月亮阵营技能及对应制作站。具体材料见配方页。'],
  ],
  sources:[beta('modmain.lua',355),beta('modmain.lua',382),beta('scripts/prefabs/wixie.lua',77),beta('scripts/prefabs/wixie.lua',176),beta('init/init_recipes/init_recipes.lua',81),beta('init/init_recipes/recipes_wixie.lua',11),character(16),cn('wixie_postinit/wixie_strings.lua',9),names(571)],
 },
 {
  id:'wathom',category:'角色',title:'沃托姆',aliases:['Wathom','跳劈哥','肾上腺素'],
  summary:'沃托姆靠近战积攒肾上腺素，强化状态与技能和房间配置有关。',
  configs:["holy fucking shit it's wathom",'wathom_ampvulnerability','wathom_armordamage'],
  sections:[
   ['基础属性','角色默认可用，生命 225、饥饿 120、理智 120。'],
   ['肾上腺素','肾上腺素至少 25% 时，符合条件的非投射物攻击会推迟自然衰减 10 秒。未进入强化或拒死状态时，25% 至不足 50%、50% 至不足 75%、75% 以上分别获得 5、4、3 点。肾上腺素至少 25%、且未强化时，部分受伤也可按伤害的 25% 向下取整增加。'],
   ['强化与代价','满肾上腺素进入强化要求对应的第二档强化技能。强化时默认承伤倍率为 5，房间可选 2 到 5，配置默认也计入护甲损耗。'],
  ],
  sources:[cfg(266),cfg(269),beta('scripts/prefabs/wathom.lua',12),beta('scripts/prefabs/wathom.lua',359),beta('scripts/prefabs/wathom.lua',535),beta('init/init_wathom.lua',1576),character(24)],
 },
 {
  id:'summer-dragonflies',category:'生物与首领',title:'时令龙蝇与月光龙蝇',aliases:['Wiltfly','Moonmaw Dragonfly','注能的玻璃碎片','启迪鳞片'],
  summary:'两种龙蝇共享地表季节生成器，月光龙蝇需要额外的世界进度和月亮条件。',
  configs:['wiltfly','wiltfly_spawn'],
  sections:[
   ['何时出现','额外夏季龙蝇默认开启。常规生成要求地表有活跃玩家、当前为夏季，世界周期高于房间档位，默认档位为 26。世界周期高于 50 后，在满月或天体祭坛激活的条件下，生成器可改用月光龙蝇。'],
   ['时令龙蝇','默认 4,000 生命。基础单次攻击为 125，面对玩家另有 0.5 倍伤害系数。基础掉落是 8 大肉和 1 鳞片。'],
   ['月光龙蝇','默认 8,000 生命，基础单次攻击为 100，面对玩家有 0.5 倍伤害系数。免疫火焰，半血会刷新玻璃熔岩虫。基础掉落为 8 大肉、1 启迪鳞片、3 注能的玻璃碎片。'],
  ],
  sources:[cfg(927),cfg(1237),cfg(1349),beta('scripts/components/mock_dragonflyspawner.lua',56),beta('scripts/components/mock_dragonflyspawner.lua',186),beta('scripts/prefabs/mock_dragonfly.lua',467),beta('scripts/prefabs/moonmaw_dragonfly.lua',633),names(53)],
 },
 {
  id:'dreadstone-shield',category:'装备与制作',title:'绝望石圆盾',aliases:['Dreadstone Shield','女武神','维格弗德'],
  summary:'女武神技能装备，可以格挡并使符合条件的攻击者恐慌。',
  configs:['wathgrithr_rework_'],
  sections:[
   ['制作','女武神重做选择 1 或 3 档，并点出对应的圆盾技能。配方为绝望石 6、纯粹恐惧 4、暗影碎布 1。'],
   ['属性与格挡','基础 41 普通伤害、20 位面伤害和 5 位面防御，耐久为基础女武神圆盾的两倍。成功格挡会让符合条件的攻击者恐慌 5 秒。主动挥击消耗 3 点基础耐久。'],
  ],
  sources:[cfg(360),recipe(669),beta('init/init_tuning.lua',39),beta('scripts/prefabs/wathgrithr_shield_dreadstone.lua',154),beta('scripts/prefabs/wathgrithr_shield_dreadstone.lua',290),names(811)],
 },
 {
  id:'beak-basher',category:'装备与制作',title:'喙击者',aliases:['Beak Basher','多目章鱼喙','锤子'],
  summary:'可用来战斗和拆建筑的锤子。',
  configs:[],
  sections:[
   ['制作','需要炼金引擎。配方为漂流木 2、海带 8、多目章鱼喙 1。'],
   ['用途','武器基础伤害为 51，锤击工作效率为普通值的 2 倍。满耐久为 425 次使用，每次锤击消耗 1 次。'],
  ],
  sources:[recipe(655),beta('scripts/prefabs/beakbasher.lua',51),names(550)],
 },
 {
  id:'veterans-curse',category:'生存与世界',title:'老兵诅咒',aliases:["Veteran's Curse",'头骨洞窟','诅咒神龛'],
  summary:'可选难度，激活方式由服务器设置决定，效果因角色而异。',
  configs:['vetcurse','ui_showvetcurse'],
  sections:[
   ['房间档位','默认档允许通过头骨洞窟开启，已激活的状态可随存档恢复。始终开启档会在玩家初始化时施加诅咒。房间另有关闭档。'],
   ['角色差异','诅咒有角色专属效果。例如温奇会失去 5 个普通物品栏槽位。客户端可单独切换诅咒图标显示。'],
  ],
  sources:[cfg(146),cfg(231),beta('init/init_vetcurse.lua',173),beta('scripts/prefabs/veteranshrine.lua',72),beta('scripts/map/tasks/forest/make_a_pick.lua',6),beta('scripts/prefabs/winky.lua',170),names(78),cn('init/init_strings/init_strings.lua',267)],
 },
 {
  id:'dread-eye',category:'生物与首领',title:'恐惧之眼',aliases:['Dread Eye','暗影生物','影怪'],
  summary:'强化梦魇生物中的伏击者，能用诱饵外观伪装。',
  configs:['harder_shadows','dreadeyes_allowed'],
  sections:[
   ['出现条件','强化梦魇生物和恐惧之眼两个开关默认启用。强化生成器为低于 50% 理智的目标挑选普通暗影时，陆地和海上的候选分支都可能选到恐惧之眼。'],
   ['战斗','基础生命 250、伤害 35、攻击间隔 6 秒。它会在玩家附近伪装后伏击，基础掉落为 1 个噩梦燃料。'],
  ],
  sources:[cfg(244),beta('init/init_creatures/init_harder_shadows.lua',71),beta('scripts/components/uncompromising_shadowcreaturespawner.lua',84),beta('scripts/prefabs/dreadeye.lua',280),beta('scripts/prefabs/dreadeye.lua',509),names(16)],
 },
];
