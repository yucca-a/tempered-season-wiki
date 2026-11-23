const beta=(file,line)=>({file,line});
const cn=(file,line)=>({kind:'cn',file,line});
const cfg=line=>beta('modinfo.lua',line);
const names=line=>cn('init/init_strings/init_names.lua',line);
const link=(id,label)=>({id,label});

export const mechanicsExpansionArticles=[
 {
  id:'max-health-penalties',category:'mechanics',icon:'lifeinjector',title:'生命上限惩罚与黑血死亡',aliases:['Max Health Death','Max Health Starving','Max Health Temperature','黑血','血量上限','饥饿掉上限','过冷过热掉上限','灰血'],
  summary:'死亡、持续挨饿和极端温度都会压低你的生命上限，开启灰血显示后能在血量徽章上更直观地看到扣除部分。',
  configs:['maxhpdeath','maxhungerdamage','maxtempdamage','ui_healthpenalty_grey'],
  sections:[
   ['死亡扣上限','默认开启。无论以何种方式复活，从幽灵重生时都会额外增加 25% 生命上限惩罚，只有通过试金石复活时不吃这项惩罚。背包里带着装有羽毛的羽毛神像可以按羽毛数量抵消一部分死亡惩罚。'],
   ['挨饿扣上限','默认开启。空腹掉血持续一小段缓冲后，每次饥饿扣血都会把等比例的伤害转成生命上限惩罚。只要恢复进食、停止掉血超过 1.5 秒，缓冲计数就会回落。'],
   ['过冷与过热扣上限','默认开启。冻伤或中暑持续超过缓冲时间后，每次温度伤害都会把等比例伤害转成生命上限惩罚。环境温度离 35℃ 越远，缓冲时间越短。拥有对应抗性标签（如过热抗性、抗寒或鹿鸭形态）时不会吃这项惩罚。'],
   ['灰血显示','客户端选项默认开启，把血量徽章上的生命上限惩罚区域显示为灰色，方便与当前血量区分。'],
  ],
  related:[link('feather-totem','羽毛神像'),link('boiling-springs','用温泉浴球恢复生命上限')],
  sources:[cfg(162),cfg(203),cfg(207),cfg(208),beta('postinit/player.lua',22),beta('postinit/player.lua',57),beta('postinit/player.lua',230),beta('postinit/player.lua',383),beta('postinit/player.lua',391),beta('postinit/widgets/healthbadge.lua',131)],
 },
 {
  id:'burning-loot-longpig',category:'mechanics',icon:'reviver',title:'燃烧掉落重做与长猪',aliases:['Burning Loot','Fire Loot','Long Pig','火烧掉落','告密的心','骸骨','人肉'],
  summary:'烧死生物不再直接把所有掉落烧成灰，而是改为掉落烤熟版本或带火余烬；制作告密的心需要从骸骨敲出的长猪。',
  configs:['fireloot','longpig'],
  sections:[
   ['燃烧掉落重做','默认开启（档位高于 1）。非受控燃烧中的实体死亡掉落时，能找到烤熟版本的战利品会直接变成烤熟形态，其余无法烤熟的战利品会额外生成灰烬，并在原地留下会燃烧的火焰余烬。调到最高档（3）时，余烬点燃还会触发额外的引燃回调。'],
   ['长猪与复活配方','默认开启。敲碎野外骸骨或玩家骸骨都会固定随机掉出 1 块长猪。告密的心配方改为长猪 ×1 加蜘蛛腺 ×1，不再消耗玩家血量；温蒂的强效回复药剂则改为 3 朵幽灵花加 40 生命。'],
  ],
  sources:[cfg(192),cfg(201),beta('postinit/components/lootdropper.lua',116),beta('scripts/prefabs/firedrop.lua',97),beta('init/init_recipes/recipe_changes.lua',17),beta('postinit/prefabs/skeleton.lua',5),beta('postinit/prefabs/pktrades.lua',5),names(179)],
 },
 {
  id:'winter-growth-limbo',category:'mechanics',icon:'beefalo',title:'冬季停长、骑牛分伤与灵界跳跃',aliases:['No Winter Growing','Beefalo Nerf','Limbo Leap','冬天不长','骑牛削弱','幽灵回门','传送门'],
  summary:'冬季会暂停多种多年生作物的生长，骑牛挨打时骑手会分担一半伤害，死亡变成幽灵后可以直接瞬移回绚丽之门。',
  configs:['no_winter_growing_','beefalo_nerf','limbo_leap'],
  sections:[
   ['冬季停长','默认开启。石果灌木、仙人掌、绿洲仙人掌、公牛海带、蘑菇农场等作物在冬季都会暂停生长和产出计时，等冬季结束后自动恢复。'],
   ['骑牛分伤','默认开启。骑在皮弗娄牛背上受到攻击时，除了牛承受这次伤害，你自身还会额外承受一半伤害，不能再完全靠牛无伤硬抗。'],
   ['灵界跳跃','默认开启。变成幽灵后，状态栏会出现绚丽之门按钮。在空闲或移动状态下点击按钮，等待 2 秒读条即可直接瞬移到传送门附近，省去跑图找复活点的时间。'],
  ],
  sources:[cfg(188),cfg(190),cfg(241),beta('init/init_food/init_rare_foods.lua',85),beta('init/init_postinit.lua',522),beta('postinit/components/combat.lua',103),beta('postinit/components/rider.lua',11),beta('init/init_gamemodes/init_uncompromising_mode.lua',259),beta('init/init_limbo_leap.lua',82)],
 },
 {
  id:'creeping-fear',category:'creatures',icon:'nightmarefuel',title:'匍匐恐惧',aliases:['Creeping Fear','暗影怪','新影怪','暗影触手'],
  summary:'测试版新增的高威胁影怪，拥有 1,600 生命，会周期性召唤暗影触手或朝目标直线释放暗影尖刺波。',
  configs:['creepingfear_allowed'],
  sections:[
   ['出现条件','默认开启。由测试版影怪生成器在满足漂流影怪条件时生成，陆地和海面均可刷出。基础属性为 1,600 生命、60 伤害、2.3 秒攻击间隔、移速 4.8（行走 5 / 奔跑 6）。'],
   ['特殊技能','有目标且技能冷却归零时（冷却 20 秒），先嘲讽再二选一施放技能：要么连续三次在目标周围召唤带 50% 伤害（30 点）的暗影触手；要么在目标距离不超过 30 单位时，朝目标方向连发直线暗影尖刺波，命中造成 60 伤害。拥有暗影支配标签的目标不会吃到这两项技能。'],
  ],
  related:[link('dread-eye','恐惧之眼')],
  sources:[cfg(249),beta('scripts/components/uncompromising_shadowcreaturespawner.lua',12),beta('scripts/components/uncompromising_shadowcreaturespawner.lua',87),beta('init/init_tuning.lua',262),beta('scripts/prefabs/creepingfear.lua',31),beta('scripts/prefabs/creepingfear.lua',52),beta('scripts/prefabs/creepingfear.lua',88),names(15)],
 },
 {
  id:'maxwell',category:'characters',icon:'waxwell',title:'麦斯威尔',aliases:['Maxwell','老麦','暗影法典','暗影装备','暗影仆从'],
  summary:'麦斯威尔解锁暗影甲和暗影刀后，可以直接用噩梦燃料凭空召唤临时暗影装备；暗影仆从更听指挥，且携带暗影魔法物品时死亡不掉落。',
  configs:['waxwell'],
  sections:[
   ['召唤暗影装备','默认开启。当你亲手制作过一次暗影护甲或暗影剑后，会自动学会对应的专属召唤配方：携带暗影秘典时，直接消耗 5 个噩梦燃料即可召唤一件暗影护甲或暗影剑。召唤出来的暗影装备丢在地上 5 秒后会化作烟雾消失。'],
   ['暗影仆从与防丢','暗影劳工、暗影舞者和暗影角斗士的寻路允许越过海面与墙体，AI 移除了因领主进战而停工以及躲避爆炸物、逃跑的节点，且暗影劳工能主动挖掘雪堆。你身上或装备着的暗影魔法标签物品不会因死亡、溺水掉落，也不会被偷走。'],
   ['老兵诅咒','麦斯威尔激活老兵诅咒后，每次受伤都会按受伤量的一半折算为生命上限惩罚（每 75 点基础血量对应 100% 惩罚比例），且惩罚上限从常规上限放宽到 99%。'],
  ],
  related:[link('veterans-curse','老兵诅咒')],
  sources:[cfg(358),beta('init/init_character_changes/waxwell.lua',21),beta('init/init_character_changes/waxwell.lua',134),beta('init/init_character_changes/waxwell.lua',239),beta('init/init_character_changes/waxwell.lua',257),beta('init/init_character_changes/waxwell.lua',366),beta('init/init_recipes/recipes.lua',588),beta('postinit/components/health.lua',244)],
 },
 {
  id:'client-and-special-modes',category:'mechanics',icon:'um_gemologyforge',title:'客户端选项、实验功能与趣味模式',aliases:['Client-Side','Experimental','Dev Tools','ROLLBACK CITY','音效','多倍制作数量','龙卷风特效','远古宝箱','一血模式','刮胡子模式'],
  summary:'集中说明客户端界面选项、实验性玩法、开发调试开关，以及高难度娱乐模式（回档之城）的实际作用。',
  configs:['um_music','ui_showmultiproducts','ui_showmultiproducts_font','um_tips_only','um_storms_over','the_cooler_sacred_chest','winonawackycats','announce_basestatus','_uncompromising_spawnprotection','um_shave_mode','um_shrink','um_advertisements','maraboss_bottomtext','uncompromising_1hp'],
  sections:[
   ['客户端显示与特效','多倍制作数量（ui_showmultiproducts）在制作栏图标上标出单次产出数量，可自选字体（ui_showmultiproducts_font）。加载提示（um_tips_only）可只显示永不妥协提示。降低龙卷风特效（um_storms_over）会把风暴天气视觉强度上限从 15 降到 5 并简化屏幕遮罩。官方音乐（um_music）用于切换模组配乐开关。'],
   ['实验性功能','远古宝箱合成（the_cooler_sacred_chest）默认关闭，开启后激活远古宝箱的扩展合成配方。实验性薇诺娜投石机（winonawackycats）默认关闭，开启后调整投石机的攻击与战斗行为。'],
   ['开发与服务器辅助','播报鼠潮分（announce_basestatus）会在鼠潮嗅探检查时向全服公告基地鼠潮分数。改进出生点保护（_uncompromising_spawnprotection）调整玩家出生时的保护逻辑。'],
   ['回档之城（趣味与整活模式）','五项全部默认关闭：刮胡子模式（um_shave_mode）让玩家开局自带剃刀并加入铥矿剃刀等搞笑改动；不要缩小（um_shrink）会随状态改变角色体型；趣味广告模式（um_advertisements）会弹出恶搞弹窗；审判（maraboss_bottomtext）允许骸骨在月相突变下变成隐藏首领；一血模式（uncompromising_1hp）把玩家强制锁在 1 点生命上限，受任何伤害即死。'],
  ],
  sources:[cfg(131),cfg(132),cfg(134),cfg(147),cfg(148),cfg(1432),cfg(1435),cfg(1509),cfg(1511),cfg(1530),cfg(1531),cfg(1532),cfg(1533),cfg(1534),beta('init/init_showmultiproducts.lua',7),beta('init/init_loadingtips.lua',26),beta('postinit/components/weather.lua',44),beta('postinit/prefabs/sacred_chest.lua',26),beta('init/init_character_changes/winona.lua',227),beta('postinit/components/health.lua',263)],
 },
];
