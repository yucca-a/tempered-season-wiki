const beta=(file,line)=>({file,line});
const cn=(file,line)=>({kind:'cn',file,line});
const cfg=line=>beta('modinfo.lua',line);
const names=line=>cn('init/init_strings/init_names.lua',line);
const link=(id,label)=>({id,label});

export const creatureChangesArticles=[
 {
  id:'ancient-trepidation',category:'creatures',icon:'nightmarefuel',title:'远古恐惧',aliases:['Ancient Trepidation','遗迹新怪','远古梦魇','梦魇阶段'],
  summary:'盘踞在洞穴远古遗迹的大型暗影威胁，拥有 3,000 生命与 75 伤害，受梦魇周期与防消失配置控制。',
  configs:['trepidations','nodespawn_trepidation'],
  sections:[
   ['出现与梦魇周期','默认开启（trepidations）。在洞穴远古遗迹区域由锚点管理生成，基础属性为 3,000 生命、75 伤害、移速 3.5，自带护盾减伤逻辑。进入暴动阶段时显形（不透明度 0.7），平息阶段变淡（0.4）；若未开启防消失（nodespawn_trepidation），平息后会自动准备消失。'],
   ['仇恨判定','与普通梦魇生物类似，持有暗影支配标签的目标不会被主动仇恨，理智过低或已在仇恨列表中时会被追击。'],
  ],
  sources:[cfg(852),cfg(855),beta('postinit/prefabs/cave.lua',49),beta('scripts/prefabs/ancient_trepidation.lua',269),beta('scripts/prefabs/ancient_trepidation.lua',352),beta('scripts/prefabs/ancient_trepidation.lua',360),beta('scripts/prefabs/ancient_trepidation_anchor.lua',76)],
 },
 {
  id:'clockwork-amalgams',category:'creatures',icon:'gears',title:'发条融合怪',aliases:['Clockwork Amalgams','发条融合','残破发条','废料发条'],
  summary:'洞穴遗迹中的残破发条装置和发条战损会唤醒发条融合怪加入战斗。',
  configs:['amalgams'],
  sections:[
   ['触发条件','默认开启。在遗迹残破发条装置（chessjunk）附近或其他发条生物战斗时，满足概率条件会从废料堆中唤醒发条融合怪，提高探索遗迹的清场压力。'],
  ],
  related:[link('clockwork-pawns','发条兵与梦魇发条兵')],
  sources:[cfg(858),beta('init/init_postinit.lua',501),beta('postinit/prefabs/clockworks.lua',43),beta('scripts/prefabs/pawn_spawn.lua',51)],
 },
 {
  id:'clockwork-pawns',category:'creatures',icon:'trinket_6',title:'发条兵与梦魇发条兵',aliases:['Clockwork Pawns','发条兵','自爆兵','梦魇发条兵'],
  summary:'带探测雷达的发条小兵会追踪 80 单位内最近的活人，梦魇变种还会冲锋自爆。',
  configs:['pawns'],
  sections:[
   ['雷达追踪','默认开启。发条兵能像探测杖一样扫描 80 单位内最近的存活玩家，并按距离（12 / 24 / 48 / 98 单位）发出由慢到快的警报声，基础移速 5.5。'],
   ['梦魇变种与掉落','梦魇发条兵移速提高到 6.5，带有爆炸组件（范围 6、伤害 200 等同火药，不伤建筑），点燃或锁定目标后倒计时自爆。普通发条兵掉落噩梦燃料（20%）、铥矿碎片（10%）和烂电线（40%）。'],
  ],
  related:[link('clockwork-amalgams','发条融合怪')],
  sources:[cfg(860),beta('scripts/prefabs/pawn_spawn.lua',62),beta('scripts/prefabs/um_pawn.lua',10),beta('scripts/prefabs/um_pawn.lua',373),beta('scripts/prefabs/um_pawn.lua',378)],
 },
 {
  id:'bush-crabs',category:'creatures',icon:'dug_berrybush',title:'浆果丛蟹',aliases:['Bush Crab','浆果蟹','伪装浆果丛'],
  summary:'采摘浆果丛时可能惊动伪装成浆果丛的伏击蟹，击杀后必掉移植浆果丛和浆果。',
  configs:['_bushcrabs'],
  sections:[
   ['伏击与掉落','默认开启。采摘或打扰野外浆果丛时可能钻出浆果丛蟹，采用洞穴蜘蛛的移速与伏击 AI，受伤会在 30 单位内呼唤同类。击杀固定掉落 1 个可移植浆果丛和 1 个浆果，另有各 50% 概率额外掉浆果、树枝和怪物肉。'],
  ],
  sources:[cfg(866),beta('postinit/prefabs/berrybush.lua',74),beta('scripts/prefabs/bushcrab.lua',6),beta('scripts/prefabs/bushcrab.lua',44),names(66)],
 },
 {
  id:'pigking-guards',category:'creatures',icon:'pigking',title:'猪王守卫',aliases:['Pig King Guards','猪王卫兵','猪王火炬','雇佣守卫'],
  summary:'猪王周围新增守卫猪人与火炬，给猪王喂食饱食度大于 70 的非粗饲料食物即可雇佣守卫。',
  configs:['pigking_guards'],
  sections:[
   ['雇佣方式','默认开启。猪王周围会建起专属火炬并刷新猪王守卫。非鱼人玩家把饱食度严格大于 70（且非粗饲料）的食物交给猪王时，会直接雇佣 20 单位内一名无主守卫跟随自己，忠诚时间按食物饱食度计算。'],
  ],
  related:[link('pig-and-werepig-reworks','加强猪人与愤怒疯猪')],
  sources:[cfg(869),beta('postinit/prefabs/pigking.lua',4),beta('postinit/prefabs/pigking.lua',21),beta('postinit/prefabs/pigking.lua',32),beta('postinit/prefabs/pigman.lua',4)],
 },
 {
  id:'harder-krampus',category:'creatures',icon:'krampus_sack',title:'加强坎普斯',aliases:['Harder Krampus','坎普斯','小偷','假动作'],
  summary:'坎普斯攻击中免疫普通打断，每攻击 3 次就会施放假动作攻击，受击硬直也能反打。',
  configs:['harder_krampus'],
  sections:[
   ['假动作与反打','默认开启。坎普斯在攻击动画期间不会吃普通受击打断（仅电击可打断），且受击硬直状态可以直接衔接攻击。10 秒内累计攻击满 3 次后，下一次会改用假动作攻击（feint_attack）打乱走位节奏。'],
  ],
  sources:[cfg(867),beta('init/init_postinit.lua',517),beta('postinit/stategraphs/SGkrampus.lua',8),beta('postinit/stategraphs/SGkrampus.lua',25)],
 },
 {
  id:'elemental-hounds',category:'creatures',icon:'firehound',title:'火狗与冰狗改动',aliases:['Fire Hound','Ice Hound','红色猎犬','蓝色猎犬','冰刺','喷火'],
  summary:'火狗新增中距离喷火，冰狗会放直线冰刺，两种元素猎犬宝石掉率均为 30%。',
  configs:['firehound','icehound'],
  sections:[
   ['远程技能与掉落','默认开启。火狗和冰狗的掉落表均为 1 怪物肉、2 狗牙和 30% 对应红/蓝宝石。特殊攻击就绪时射程提高到 6：火狗朝前方喷射火焰弹，冰狗沿直线生成 6 根冰刺（若带有冰盾则翻倍为 12 根）。'],
  ],
  related:[link('lightning-hound','闪电猎犬'),link('spore-hound','孢子猎犬'),link('glacial-hound','冰川青年座狼'),link('magma-hound','熔岩青年座狼')],
  sources:[cfg(776),cfg(777),beta('init/init_postinit.lua',459),beta('init/init_postinit.lua',463),beta('postinit/prefabs/firehound.lua',5),beta('postinit/prefabs/firehound.lua',38),beta('postinit/prefabs/icehound.lua',5),beta('postinit/prefabs/icehound.lua',23)],
 },
 {
  id:'spider-and-bat-reworks',category:'creatures',icon:'spider',title:'普通蜘蛛跳跃、蜘蛛战士反击与蝙蝠撤离',aliases:['Regular Spiders Jump','Warrior Counter','Bat Sinkhole Evacuation','普通蜘蛛','蜘蛛战士','黑蝙蝠'],
  summary:'普通蜘蛛也能远距离扑击，蜘蛛战士受击存活时更容易反击，并可控制落水洞蝙蝠撤离。',
  configs:['alljumperspiders','spiderwarriorcounter','batspooking'],
  sections:[
   ['蜘蛛强化','普通蜘蛛跳跃（alljumperspiders）开启后，普通蜘蛛在超过近战距离时也能像战士一样发动扑击；蜘蛛战士反击（spiderwarriorcounter）让非地穴蜘蛛的蜘蛛战士在受击未死时主动触发反击。'],
   ['蝙蝠落水洞撤离','batspooking 配置用于控制洞穴入口蝙蝠受惊撤离的相关选项。'],
  ],
  related:[link('trapdoor-spider','地穴蜘蛛'),link('harder-spider-queen','加强蜘蛛女王')],
  sources:[cfg(840),cfg(845),cfg(847),beta('postinit/prefabs/spider.lua',300),beta('postinit/stategraphs/SGspider.lua',70),beta('postinit/stategraphs/SGspider.lua',89)],
 },
 {
  id:'adjusted-butterflies',category:'creatures',icon:'butterfly',title:'蝴蝶闪避与属性调整',aliases:['Adjusted Butterflies','蝴蝶','蝴蝶翅膀','滑走'],
  summary:'默认档位下蝴蝶会提前起飞并闪避徒手近战，必须用远程武器、电蚊拍、灵魂攻击或趁落花硬直击杀。',
  configs:['butterfly_tweaks'],
  sections:[
   ['防徒手拍打（unique 档）','蝴蝶在 8 单位内感知到角色靠近后约 1.2 秒就会起飞。徒手或常规近战攻击会被它直接滑走闪避，只有趁它处于忙碌动作、使用远程武器、电蚊拍或灵魂类伤害时才能稳定命中。'],
   ['数值削弱（stat_nerf 档）','切换到 stat_nerf 档位后改为削弱蝴蝶翅膀回复属性及沃拓克斯吸魂收益。'],
  ],
  sources:[cfg(877),beta('postinit/prefabs/butterfly.lua',4),beta('postinit/prefabs/butterfly.lua',29),beta('postinit/prefabs/butterfly.lua',41),beta('init/init_food/init_food_changes.lua',322)],
 },
 {
  id:'frog-reworks',category:'creatures',icon:'frog',title:'青蛙防逃课与饥饿青蛙',aliases:['Frog Anti-cheese','Hungry Frogs','青蛙躲Boss','青蛙吃食物'],
  summary:'青蛙和秋季蟾蜍会主动躲避大型首领，并且会优先吃掉地上的食物。',
  configs:['cowardfrogs','hungryfrogs'],
  sections:[
   ['躲避首领与抢食','青蛙防逃课（cowardfrogs）默认开启，普通青蛙和秋季蟾蜍都会主动逃离带 epic 标签的首领，无法再像原版那样轻易拉青蛙雨换死 Boss。饥饿青蛙（hungryfrogs）默认开启，它们会主动寻路吃掉地面食物。'],
  ],
  related:[link('autumn-weather','秋季毒蟾蜍')],
  sources:[cfg(887),cfg(891),beta('postinit/brains/frogbrain.lua',43),beta('postinit/brains/frogbrain.lua',56)],
 },
 {
  id:'pig-and-werepig-reworks',category:'creatures',icon:'pigskin',title:'加强猪人与愤怒疯猪',aliases:['Harder Pigs','Angry Werepigs','猪人','疯猪'],
  summary:'猪人和疯猪的 AI 与状态机经过加强，常规走位风筝与月圆刷肉节奏更紧凑。',
  configs:['harder_pigs','angry_werepigs'],
  sections:[
   ['猪人与疯猪','加强猪人（harder_pigs）默认开启，同时调整猪人的实体、大脑和状态机；愤怒疯猪（angry_werepigs）默认开启，修改疯猪的大脑逻辑，提高近战对抗压迫感。'],
  ],
  related:[link('pigking-guards','猪王守卫')],
  sources:[cfg(886),cfg(890),beta('init/init_postinit.lua',441),beta('init/init_postinit.lua',447),beta('init/init_creatures/init_harder_monsters.lua',52)],
 },
 {
  id:'beefalo-and-koalefant-reworks',category:'creatures',icon:'beefalo',title:'加强皮弗娄牛与考拉象',aliases:['Harder Beefalo','Harder Koalefants','皮弗娄牛冲锋','考拉象缴械','考拉象践踏'],
  summary:'皮弗娄牛攻击后会接蓄力冲锋，考拉象近身受击会反击践踏并打飞你的手持武器。',
  configs:['harder_beefalo','harder_koalefants'],
  sections:[
   ['皮弗娄牛冲锋','默认开启（harder_beefalo）。普通攻击结束后若目标仍在且未连续冲锋，皮弗娄牛会原地怒吼蓄力 1 秒发动冲锋（charge_start），蓄力期间免疫普通打断（仅电击可打断）。'],
   ['考拉象践踏与缴械','默认开启（harder_koalefants）。近距离（4 单位内）攻击考拉象累积到一定次数会触发反击践踏（stomp）；攻击还可能打飞非防盗、非强握玩家手上的武器（DisarmTarget）。'],
  ],
  related:[link('winter-growth-limbo','骑牛分伤')],
  sources:[cfg(888),cfg(889),beta('init/init_postinit.lua',455),beta('init/init_postinit.lua',480),beta('postinit/stategraphs/SGBeefalo.lua',17),beta('postinit/stategraphs/SGBeefalo.lua',33),beta('postinit/stategraphs/SGkoalefant.lua',8),beta('postinit/stategraphs/SGkoalefant.lua',31)],
 },
 {
  id:'walrus-and-other-mobs',category:'creatures',icon:'walrushat',title:'海象投夹、领地企鸥、蜗牛龟与火药猴',aliases:['MacTusk','Territorial Penguins','Slurtle Tweaks','Sharpshooter Powder Monkeys','海象爸爸','捕兽夹','企鸥','蜗牛龟','火药猴'],
  summary:'海象爸爸每 15 秒投掷或放置捕兽夹，企鸥满月变异并 5–8 只编队围攻，蜗牛龟血量减半但攻速大幅加快且 50% 掉背壳头盔。',
  configs:['walrus','angrypenguins','fiendforcedmetodothis','sharpshooter_monkeys_'],
  sections:[
   ['海象爸爸投掷捕兽夹','默认开启（walrus）。海象爸爸每隔 15 秒会朝 7–17 单位外的目标投掷捕兽夹，或直接在脚下放一个捕兽夹，追击时务必留意脚下。'],
   ['领地企鸥','默认开启（angrypenguins）。企鸥在满月时会突变为月岩企鸥（非满月离开月岛后变回），且受击会组成 5–8 只的小队立刻集体围攻。'],
   ['蜗牛龟与火药猴','蜗牛龟调整（fiendforcedmetodothis）默认开启：蛞蝓龟与蜗牛龟血量减半、攻击间隔缩短至 0.4 倍，蛞蝓龟必掉 2 份黏液且背壳头盔掉率提高到 50%。火药猴神枪手（sharpshooter_monkeys_）对应海上火药猴的射击配置项。'],
  ],
  related:[link('slurtles','蛞蝓龟与蜗牛龟宝石交易')],
  sources:[cfg(892),cfg(894),cfg(895),cfg(896),beta('postinit/prefabs/walrus.lua',15),beta('postinit/prefabs/walrus.lua',42),beta('postinit/prefabs/penguin.lua',9),beta('postinit/prefabs/penguin.lua',34),beta('postinit/prefabs/snurtle.lua',4),beta('postinit/prefabs/snurtle.lua',19)],
 },
 {
  id:'eyes-of-terror',category:'creatures',icon:'eyeofterror',title:'恐怖之眼与双子魔眼重做',aliases:['Eyes of Terror Rework','Eye of Terror','Twins of Terror','恐怖之眼','激光眼','魔焰眼','双子魔眼'],
  summary:'恐怖之眼和双子魔眼会根据周围玩家人数动态缩短冲撞与召怪冷却，且双子受击会在 50 单位内共享仇恨。',
  configs:['reworked_eyes','eyeofterror_health_','twinofterror_health_'],
  sections:[
   ['动态冷却与联手仇恨','默认开启（reworked_eyes）。按 50 单位内活着的玩家数动态结算技能冷却：单人时冲撞 7 秒、张嘴冲撞 14 秒、召唤小眼 16.2 秒；人数越多冷却越短，超过 6 人时固定压低到 3.5 秒 / 7 秒 / 5.4 秒。双子魔眼任一只受击时，会在 50 单位内唤醒并通知另一只一起集火。'],
   ['血量倍率','恐怖之眼血量（eyeofterror_health_）与双子魔眼血量（twinofterror_health_）分别独立调整两者的生命倍率。'],
  ],
  sources:[cfg(965),cfg(1139),cfg(1321),beta('init/init_postinit.lua',484),beta('postinit/prefabs/eyeofterror.lua',23),beta('postinit/prefabs/eyeofterror.lua',49),beta('init/init_bosshealth.lua',46)],
 },
 {
  id:'harder-treeguard',category:'creatures',icon:'livinglog',title:'加强树精守卫',aliases:['Harder Treeguard','树精守卫','雷夫','树根缠绕'],
  summary:'树精守卫新增范围树根缠绕技能，可在中距离用根刺困住最多 20 个目标。',
  configs:['harder_leifs','leif_health_'],
  sections:[
   ['树根缠绕与强化','默认开启（harder_leifs）。同时改写树精守卫的实体、大脑和状态机：当目标距离平方小于 200（约 14.1 单位）且技能冷却就绪时，会召唤类似织影者的地面根刺（rootspike）困住周围最多 20 个目标。生命倍率由 leif_health_ 控制。'],
  ],
  sources:[cfg(952),cfg(1409),beta('init/init_postinit.lua',417),beta('postinit/prefabs/leif.lua',15),beta('postinit/prefabs/leif.lua',38),beta('init/init_bosshealth.lua',623)],
 },
 {
  id:'harder-spider-queen',category:'creatures',icon:'spiderqueen',title:'加强蜘蛛女王',aliases:['Harder Spider Queen','蜘蛛女王','远程喷网'],
  summary:'蜘蛛女王新增远程喷网抛射物技能并改写状态机，压缩远距离风筝空间。',
  configs:['harder_spider_queen','spiderqueen_health_'],
  sections:[
   ['远程喷网','默认开启（harder_spider_queen）。为蜘蛛女王加入喷网计时器与远程发射蛛网抛射物技能（LaunchWeb），配合改写后的状态机限制远距离走位。生命倍率由 spiderqueen_health_ 控制。'],
  ],
  related:[link('spider-and-bat-reworks','蜘蛛与蝙蝠改动')],
  sources:[cfg(950),cfg(1395),beta('init/init_postinit.lua',467),beta('postinit/prefabs/spiderqueen.lua',124),beta('init/init_bosshealth.lua',19)],
 },
 {
  id:'boss-health-adjustments',category:'creatures',icon:'alterguardian_phase1',title:'首领与月变巨兽血量倍率总览',aliases:['Armored Bearger','Crystal Deerclops','Possesed Varg','Frostjaw','Malbatross','W.A.R.B.O.T.','Lord of the Fruit Flies','装甲熊獾','晶体独眼巨鹿','附身座狼','霜颚','邪天翁','瓦格博特','果蝇王','Boss血量'],
  summary:'测试版为三只月变巨兽、霜颚、邪天翁、瓦格博特、果蝇王以及两只夏季龙蝇提供独立的生命倍率调节。',
  configs:['mutated_bearger_health_','mutated_deerclops_health_','mutated_warg_health_','sharkboi_health_','malbatross_health_','wagboss_robot_health_','lordfruitfly_health_','moonmaw_dragonfly_health_','mock_dragonfly_health_'],
  sections:[
   ['月变巨兽与终局机械','init_bosshealth.lua 在载入时直接按各自倍率缩放装甲熊獾、晶体独眼巨鹿、附身座狼以及裂隙终局机甲（同时作用于一阶段与四阶段）的基础生命值。'],
   ['海上、季节与小首领','霜颚、邪天翁、果蝇王以及时令龙蝇（基础 4,000）和月光龙蝇（基础 8,000）均支持独立调整生命倍率，方便房间按人数微调难度。'],
  ],
  related:[link('summer-dragonflies','时令龙蝇与月光龙蝇'),link('creature-guide','生物与首领速查')],
  sources:[cfg(1027),cfg(1097),cfg(1153),cfg(1209),cfg(1237),cfg(1279),cfg(1335),cfg(1349),cfg(1381),beta('init/init_bosshealth.lua',46),beta('init/init_bosshealth.lua',600),beta('init/init_bosshealth.lua',638),beta('init/init_tuning.lua',340)],
 },
 {
  id:'boulder-crab',category:'creatures',icon:'rocks',title:'岩石蟹',aliases:['Boulder Crab','石头蟹','巨石蟹'],
  summary:'背着岩石伪装的螃蟹，顶着月岩时减伤高达 90%、普通岩石 75%，用镐敲碎壳后再打最省力。',
  configs:[],
  sections:[
   ['岩石护甲与破壳','岩石蟹会在附近挑选一块岩石背在身上：背普通岩石时获得 75% 伤害吸收（等效 2,000 血），背月岩时高达 90% 伤害吸收（等效 5,000 血）。用镐先把壳敲碎，或者鬼魂作祟逼它钻出石壳后再攻击即可绕开高额减伤。'],
   ['掉落与习性','击杀固定掉落 2 块石头和 1 块大肉，另有 50% 概率多掉 1 块石头。石壳破碎后会钻洞计时，一段时间后带着新壳重新钻出。'],
  ],
  sources:[beta('scripts/prefabs/boulder_crab.lua',21),beta('scripts/prefabs/boulder_crab.lua',69),beta('scripts/prefabs/boulder_crab.lua',303)],
 },
 {
  id:'lunar-tentacle',category:'creatures',icon:'tentaclespike',title:'月岛巨型触手',aliases:['Giant Tentacle','um_tentacle_moon','巨型触手','巨型触手皮','巨型触手尖刺'],
  summary:'拥有 28 单位超长索敌范围的月亮阵营触手，击杀必掉 4–6 根巨型触手尖刺并有 50% 概率掉巨型触手皮。',
  configs:[],
  sections:[
   ['属性与仇恨','沿用原版触手 500 生命，单次伤害 34、攻击间隔 3 秒，索敌与追击范围高达 20–28 单位，属于月亮阵营（lunar_aligned）。会主动攻击视野内 20 单位的角色、怪物与动物（跳过带 swampbro 标签的目标）。'],
   ['掉落','击杀固定掉落 2 块怪物肉和 4 根巨型触手尖刺（um_tentaclespike_moon），另有两次 50% 概率额外掉尖刺、50% 概率掉巨型触手皮（um_tentaclespot_moon）和 1% 概率掉洞穴香蕉。'],
  ],
  sources:[beta('scripts/prefabs/um_tentacle_moon.lua',7),beta('scripts/prefabs/um_tentacle_moon.lua',23),beta('scripts/prefabs/um_tentacle_moon.lua',122),beta('scripts/prefabs/um_tentacle_moon.lua',126)],
 },
];
