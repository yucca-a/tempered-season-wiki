const forest = ['worldgenmastertoggle', 'hoodedforest'];
const src = (file, line) => ({file, line});
const prefab = (name, line) => src('scripts/prefabs/' + name + '.lua', line);
const name = line => ({kind:'cn', file:'init/init_strings/init_names.lua', line});
const habitat = {id:'hooded-forest', label:'连帽森林'};

export const forestArticles = [
  {
    id:'figgy',title:'小蚜虫',category:'creatures',icon:'critter_figgy_builder',aliases:['Figgy','critter_figgy','critter_figgy_builder','宠物蚜虫'],
    summary:'用钢丝绒和爆汁蓝莓薄饼在岩石巢穴领养的小宠物，最喜欢鳄梨酱。',
    configs:[],
    sections:[
      ['领养与喂食','带 1 个钢丝绒和 1 份爆汁蓝莓薄饼到岩石巢穴旁，在宠物配方中领养。每次领养都需要靠近巢穴。小蚜虫是杂食宠物，可以跟随主人，最喜欢的食物是鳄梨酱。'],
      ['与野生蚜虫的区别','小蚜虫的实体代码为 critter_figgy，领养配方为 critter_figgy_builder。用捕虫网在森林里捉到的野生蚜虫代码为 aphid。'],
    ],
    related:[{id:'aphid',label:'野生蚜虫'},{id:'blueberrypancakes',label:'爆汁蓝莓薄饼'}],
    sources:[name(479),name(480),src('init/init_recipes/recipes.lua',552),prefab('figgypet',310),prefab('figgypet',311)],
  },
  {
    id:'feather-totem',title:'羽毛神像',category:'new-items',prefab:'um_feather_totem',aliases:['Feather Totem','um_feather_totem'],
    summary:'用连帽森林的活啄木鸟制作。带着装有羽毛的神像复活，可按羽毛种类获得回复和临时增益。',
    configs:['hoodedforest'],
    sections:[
      ['制作与触发','在暗影操控器用木板 ×3、连帽苔藓 ×4 和活啄木鸟 ×1 制作。随身携带一个神像并放入羽毛；从幽灵复活后约 5 秒结算，触发口袋复生事件时也可结算。羽毛会被消耗，神像初始耐久为 9 次，按本次处理的羽毛数量扣减。'],
      ['怎样选羽毛','每根红色羽毛恢复 10% 生命上限对应的生命，每根黑色羽毛恢复 15% 理智上限对应的理智。黄色羽毛提供 1.15 倍移速、每根持续 90 秒；麋鹿鹅羽毛提供 1.25 倍、每根持续 45 秒。两种混用时，倍率按数量加权，时长相加。蓝色羽毛提供隔热或保暖，邪天翁羽毛提供防潮。'],
    ],
    related:[{id:'woodpecker',label:'啄木鸟'},{id:'fern-fox',label:'连帽苔藓来源'}],
    sources:[name(857),src('init/init_recipes/recipes.lua',664),prefab('um_feather_totem',42),prefab('um_feather_totem',53),prefab('um_feather_totem',101),prefab('um_feather_totem',119),prefab('um_feather_totem',171),prefab('um_feather_totem',224)],
  },
  {
    id:'boomberry-plant',title:'爆汁蓝莓植株与猪笼草',category:'world',icon:'blueberryplant',aliases:['blueberryplant','pitcherplant','Boomberry Plant','猪笼草'],
    summary:'连帽森林里的蓝莓会连锁爆炸。植株附近还可能长出猪笼草，为果蝠提供栖息地。',
    configs:forest,
    sections:[
      ['靠近成熟植株','成熟植株会感应地面目标，触发后短暂延迟再爆开。附近尚未触发、未冻结的其他植株也可能被引爆，连成一片。触发后的再生计时为 8 个游戏日，在冬季到期会延后再生。'],
      ['铲与镐','非冬季的成熟植株可以用铲子挖取。冻结后改用镐开采，得到冰。'],
      ['猪笼草与果蝠','植株检查半径 50 内的猪笼草，附近没有时会生成一株。猪笼草仅在非冬季的白天放出果蝠，每株最多容纳 1 只，补充周期为 1 个游戏日，放出间隔为 30 秒。'],
    ],
    related:[habitat,{id:'fruitbat',label:'果蝠的掉落与爆炸'}],
    sources:[name(250),name(256),prefab('blueberryplant',57),prefab('blueberryplant',71),prefab('blueberryplant',173),prefab('blueberryplant',212),prefab('blueberryplant',221),prefab('blueberryplant',383),prefab('pitcherplant',40),prefab('pitcherplant',84)],
  },
  {
    id:'fern-fox', title:'蕨狐与狐穴', category:'creatures', icon:'um_fern_fox',
    aliases:['蕨叶狐','Ferned Fox','um_fern_fox','um_fern_fox_den','狐穴'],
    summary:'蕨狐会催长附近的植物。沿连帽森林寻找狐穴，狐狸聚集区会集中生成 3～4 个穴。',
    configs:forest,
    sections:[
      ['在哪里找','地表月台森林的狐狸聚集区放置 3～4 个狐穴，红杉林、入口和海象林也可能零散分布。狐穴每 3 个游戏日补充一只蕨狐，放出间隔与空心树桩相同。'],
      ['催长植物','蕨狐在活动时每 3 秒检查半径 4 内的植物，每次给至多一株施加催长。受影响的植物每 5 秒额外推进 10 秒的采摘再生或生长进度，持续 3 个游戏日；同一株已有此效果时会跳过。'],
      ['击杀与挖穴','蕨狐有 150 生命，击杀增加 25 淘气值。固定掉落 1 块叶肉和 2 个连帽苔藓，另有 50% 概率再掉 1 个苔藓。铲掉狐穴会得到 3 块石头、2 根树枝和 1 个连帽苔藓。'],
      ['游戏代码','蕨狐为 um_fern_fox，控制台输入 c_spawn("um_fern_fox") 生成一只。狐穴为 um_fern_fox_den。'],
    ],
    related:[habitat],
    sources:[src('scripts/map/tasks/forest/giant_trees.lua',24),src('scripts/map/rooms/forest/gianttreesrooms.lua',249),prefab('um_fern_fox',9),prefab('um_fern_fox',17),prefab('um_fern_fox',34),prefab('um_fern_fox',49),prefab('um_fern_fox',98),prefab('um_fern_fox',134),prefab('um_fern_fox',149),prefab('um_fern_fox',185),prefab('um_fern_fox',213),name(814),name(817),name(818)],
  },
  {
    id:'aphid', title:'蚜虫', category:'creatures', icon:'aphid', aliases:['Aphid','aphid','蚜虫群'],
    summary:'穿过茂密的高齿蕨可能惊动一群蚜虫。捕虫网可以活捉，附近的果蝠也会捕食它们。',
    configs:[...forest,'monstersmallmeat'],
    sections:[
      ['在哪里遇到','非冬季靠近可采摘的高齿蕨时，符合条件的目标会触发一次基础 10% 的幸运判定。普通地表成功后，蚜虫从周围其他蕨丛接连出现并追击目标，缺少合适蕨丛时会提前停止。岛屿世界在这一分支生成蛇。'],
      ['如何应对','每只蚜虫有 100 生命，基础伤害 10，攻击间隔在生成时取 1～3 秒。攻击一只会惊动半径 30 内最多 10 只同类。捕虫网一次即可活捉，也可让附近的果蝠捕猎。'],
      ['掉落与利用','死亡时分别判定 33% 的钢丝绒和 25% 的肉。开启小怪物肉选项时掉小怪物肉，关闭后掉怪物肉。活蚜虫可下锅，提供 0.5 肉度和 0.5 昆虫度。WX-78 扫描蚜虫可获得 2 点生物数据，关联初级饥饿电路。'],
      ['生吃活蚜虫','活蚜虫属于昆虫食物，基础理智 +10。符合杂食或食虫条件的麦斯威尔可以直接吃；其他角色还需穿戴具备食虫标签的装备，例如蜂帽（um_hat_bee_moon）。'],
    ],
    related:[habitat,{id:'hooded-fern',label:'高齿蕨的防护与采摘'},{id:'fruitbat',label:'果蝠'},{id:'figgy',label:'宠物小蚜虫'}],
    sources:[name(259),src('modinfo.lua',759),src('init/init_tuning.lua',386),prefab('hooded_fern',236),prefab('hooded_fern',264),prefab('aphid',13),prefab('aphid',56),prefab('aphid',157),prefab('aphid',162),prefab('aphid',169),src('init/init_food/init_crockpot.lua',118),src('init/init_character_changes/wx78.lua',30),src('init/init_creatures/init_ediblebugs.lua',17),src('init/init_creatures/init_ediblebugs.lua',27),prefab('um_hat_bee_moon',86)],
  },
  {
    id:'hooded-fern', title:'高齿蕨', category:'world', icon:'hooded_fern', aliases:['hooded_fern','连帽蕨丛'],
    summary:'连帽森林里会拖慢脚步的蕨丛。穿戴防护可以穿行，采摘另有荆棘伤害判定。',
    configs:forest,
    sections:[
      ['穿过蕨丛','未受保护的普通目标靠近茂盛蕨丛，移速会降到原来的 30%。转瞬即逝的叶冠、荆棘外壳等指定装备或沃姆伍德的荆棘专精技能可绕过穿行减速与蚜虫判定。皮弗娄牛和果蝠也在豁免名单中。'],
      ['采摘','徒手采摘可能受到与采仙人掌相同的刺伤，防刺装备可以抵挡。每次采摘有 20% 机会抽取一次奖励，候选有草、树枝、普通或作物种子，也可能惊出蜘蛛、蚜虫或翻出坟墓。作物种子的权重随季节变化。'],
    ],
    related:[habitat,{id:'aphid',label:'蚜虫'}],
    sources:[name(253),prefab('hooded_fern',88),prefab('hooded_fern',117),prefab('hooded_fern',160),prefab('hooded_fern',167),prefab('hooded_fern',184),prefab('hooded_fern',261),prefab('hooded_fern',278),src('init/init_tuning.lua',385)],
  },
  {
    id:'woodpecker', title:'啄木鸟与鸟巢', category:'creatures', icon:'woodpecker', aliases:['woodpecker','giant_tree_birdnest','鸟巢','Woodpecker'],
    summary:'在连帽森林找活啄木鸟可制作羽毛神像。砍红杉掉下的鸟巢则可拾取鸟蛋和树枝。',
    configs:forest,
    sections:[
      ['啄木鸟从哪里来','在带森林树冠标记的陆地上，刚出现并正在滑翔的野生乌鸦有一半机会被替换为啄木鸟，另一半替换为当季的红雀或雪雀。笼中或物品栏里的乌鸦保留原样。'],
      ['捕捉与掉落','开启连帽森林时，羽毛神像需要活啄木鸟 ×1、木板 ×3、连帽苔藓 ×4，在暗影操控器解锁。击杀啄木鸟的基础随机掉落为小肉 50%、红色羽毛和黑色羽毛各 25%，浮标广告另有 1% 概率。'],
      ['红杉树冠的鸟巢','砍倒巨型红杉时，鸟巢是树冠掉落候选之一。拾起鸟巢可得到 3～6 根树枝和 1～3 个鸟蛋。鸟巢代码为 giant_tree_birdnest，活啄木鸟为 woodpecker。'],
    ],
    related:[habitat,{id:'feather-totem',label:'羽毛神像的使用'}],
    sources:[name(331),name(488),name(857),src('postinit/prefabs/birds.lua',20),prefab('uncompromising_birds',288),prefab('uncompromising_birds',295),prefab('uncompromising_birds',394),src('init/init_recipes/recipes.lua',664),prefab('giant_tree',115),prefab('giant_tree_birdnest',21),prefab('giant_tree_birdnest',97)],
  },
];
