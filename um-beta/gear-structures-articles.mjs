const beta=(file,line)=>({file,line});
const recipe=line=>beta('init/init_recipes/recipes.lua',line);
const prefab=(file,line)=>beta(`scripts/prefabs/${file}.lua`,line);
const link=(id,label)=>({id,label});

export const gearStructuresArticles=[
 {
  id:'armor-reed-um',category:'new-items',prefab:'armor_reed_um',title:'芦苇甲',aliases:['Reed Tunic','沼泽甲','前期防水甲'],
  summary:'无需科技即可制作的沼泽过渡护甲，沿用草甲减伤并附带中小档防水。',
  configs:[],
  sections:[
   ['获取与属性','无需科技站，用采下的芦苇 ×8、树枝 ×3 制作。吸收率同草甲（60%），自带中小档防雨（WATERPROOFNESS_SMALLMED）。'],
  ],
  sources:[recipe(390),prefab('armor_reed_um',69),prefab('armor_reed_um',73)],
 },
 {
  id:'armor-sharksuit-um',category:'new-items',prefab:'armor_sharksuit_um',title:'鲨甲',aliases:['Shark Suit','鲨鱼甲','岩颚鲨护甲'],
  summary:'用木甲、鲨鱼皮和海泥制成的重型防水护甲，拥有大理石甲耐久、绝望石甲吸收率与 80% 防水。',
  configs:[],
  sections:[
   ['获取与属性','在炼金引擎旁用木甲 ×1、鲨鱼皮 ×1、海泥 ×4 制作。耐久沿用大理石甲（735）、伤害吸收沿用绝望石甲（90%），同时提供 80% 防雨。'],
  ],
  sources:[recipe(397),prefab('armor_sharksuit_um',63),prefab('armor_sharksuit_um',68)],
 },
 {
  id:'pyre-nettles-armor',category:'new-items',prefab:'um_armor_pyre_nettles',title:'荨麻斗篷',aliases:['Pyre Nettles Armor','火荨麻甲'],
  summary:'用荨麻孢子和火荨麻叶制成的火系护甲，附带小型保暖与防雨。',
  configs:[],
  sections:[
   ['获取与属性','用荨麻孢子 ×2、火荨麻叶 ×16、蜘蛛丝 ×2 制作，提供小型保暖（60）与小型防雨（20%）。'],
  ],
  sources:[recipe(33),prefab('um_armor_pyre_nettles',256),prefab('um_armor_pyre_nettles',259)],
 },
 {
  id:'um-hat-bee-moon',category:'new-items',prefab:'um_hat_bee_moon',title:'腐臭蜂帽',aliases:['Carrion Bee Hat','月亮蜂帽'],
  summary:'用腐臭蜂和腐臭蜂蜜制作的帽子，附带小型保暖并有轻微掉理智光环。',
  configs:['moon_bees'],
  sections:[
   ['获取与属性','在炼金引擎旁用腐臭蜂 ×2、腐臭蜂蜜 ×3、蜘蛛丝 ×1 制作。提供小型保暖（60），穿戴时会持续缓慢降低理智（CRAZINESS_SMALL）。'],
  ],
  related:[link('lunar-island','月岛与腐臭蜂巢')],
  sources:[recipe(184),prefab('um_hat_bee_moon',104),prefab('um_hat_bee_moon',108)],
 },
 {
  id:'um-hat-leafwing',category:'new-items',prefab:'um_hat_leafwing',title:'转瞬即逝的叶冠',aliases:['Leafwing Crown','叶翼冠','移速帽'],
  summary:'提供 +15% 移动速度与小型防雨的连帽森林头饰。',
  configs:[],
  sections:[
   ['获取与属性','在炼金引擎旁用叶翼 ×2、连帽苔藓 ×4、木头 ×3 制作。装备提供 1.15× 移动速度倍率与小型防雨（20%）。'],
  ],
  related:[link('hooded-forest','连帽森林')],
  sources:[recipe(660),prefab('um_hat_leafwing',83),prefab('um_hat_leafwing',97)],
 },
 {
  id:'gasmask-and-plaguemask',category:'new-items',prefab:'gasmask',variantPrefabs:['plaguemask'],title:'鹅毛面具与瘟疫面具',aliases:['Gas Mask','Plague Mask','防毒面具','烟雾面具'],
  summary:'防护夏季烟雾和毒气的面具系列：瘟疫面具升级后提供高额回理智与中档防雨。',
  configs:['smog'],
  sections:[
   ['鹅毛面具（gasmask）','在炼金引擎旁用麋鹿鹅羽毛 ×10、红蘑菇 ×2、猪皮 ×2 制作。穿戴会缓慢扣理智，用于防护烟雾与毒气。'],
   ['瘟疫面具（plaguemask）','在炼金引擎旁用鹅毛面具 ×1、多孔海绵块 ×6、巨型触手皮 ×2 制作。改为提供大型理智回复（DAPPERNESS_LARGE）与中档防雨（WATERPROOFNESS_MED），耐久沿用雨帽时长。'],
  ],
  related:[link('summer-heat-smog','夏季热浪与烟雾'),link('lunar-tentacle','月岛巨型触手')],
  sources:[recipe(69),recipe(73),prefab('gasmask',90),prefab('plaguemask',87),prefab('plaguemask',96)],
 },
 {
  id:'scrap-monocle-and-ratmask',category:'new-items',prefab:'scrap_monoclehat',variantPrefabs:['hat_ratmask','meatrack_hat'],title:'视界扩展器、老鼠面具与风干帽',aliases:['Horizon Expander','Rat Mask','Meatrack Hat','望远镜帽','晒肉帽'],
  summary:'三款功能头饰：视界扩展器拉远视野，老鼠面具配合鼠潮机制，风干帽（5 次耐久）由薇希/沃尔特重做提供。',
  configs:[],
  sections:[
   ['配方与用途','视界扩展器（scrap_monoclehat）在炼金引擎旁用废料 ×4、电子元件 ×1、空瓶子 ×1 制作。老鼠面具（hat_ratmask）在炼金引擎旁用绳子 ×2、胡须 ×3、针线包 ×1 制作。风干帽（meatrack_hat）无需科技用树枝 ×2、绳子 ×1、木炭 ×1 制作，最大使用 5 次。'],
  ],
  related:[link('rat-raids','鼠潮与鼠穴')],
  sources:[recipe(60),recipe(234),beta('init/init_recipes/recipes_wixie.lua',210),prefab('meatrack_hat',178)],
 },
 {
  id:'ancient-amulet-red',category:'new-items',prefab:'ancient_amulet_red',title:'唤灵护符',aliases:['Ancient Red Amulet','远古红护符','吸魂护符'],
  summary:'远古伪科学站制作的 1,000 耐久魔法护符，提供小型回理智、暗影等级并按受伤量转化回复。',
  configs:[],
  sections:[
   ['获取与特性','在完整远古伪科学站旁用铥矿 ×2、噩梦燃料 ×3、红宝石 ×2 制作。拥有 1,000 点耐久、小型魔法回理智与暗影等级；触发机制时单次最多消耗 50 点耐久并按伤害值的 1/4 生成回复效果。'],
  ],
  sources:[recipe(189),prefab('ancient_amulet_red',20),prefab('ancient_amulet_red',45),prefab('ancient_amulet_red',199),prefab('ancient_amulet_red',209)],
 },
 {
  id:'air-conditioner',category:'new-items',prefab:'air_conditioner',title:'空调',aliases:['Air Conditioner','烟雾净化器','基地降温'],
  summary:'用 2 张蘑菇皮、1 个齿轮和 2 个石砖建造的基地环境调节建筑，可应对烟雾与夏季高温。',
  configs:['smog'],
  sections:[
   ['建造与用途','在炼金引擎旁用蘑菇皮 ×2、齿轮 ×1、石砖 ×2 制作。放置在基地后用于净化烟雾并调节周边环境温度。'],
  ],
  related:[link('summer-heat-smog','夏季热浪与烟雾')],
  sources:[recipe(307),prefab('air_conditioner',1)],
 },
 {
  id:'skullchest',category:'new-items',prefab:'skullchest_child',title:'骷髅箱',aliases:['Skull Chest','跨空间箱子','骸骨箱'],
  summary:'用化石碎片、噩梦燃料和木板制作的共享储物箱，需要解锁对应蓝图。',
  configs:[],
  sections:[
   ['获取与用途','解锁配方后用化石碎片 ×2、噩梦燃料 ×4、木板 ×3 建造，提供跨点位共享的储物空间。'],
  ],
  sources:[recipe(315),prefab('skullchest',1)],
 },
 {
  id:'astral-projector',category:'new-items',prefab:'um_astral_projector',variantPrefabs:['um_astral_projector_target'],title:'星界投射器与接收器',aliases:['Astral Projector','星界传送','远古投射器'],
  summary:'用紫月眼、铥矿和月岩制作的成对远古装置，解锁后用于在投射器与接收器之间建立远距离联结。',
  configs:[],
  sections:[
   ['获取','解锁对应配方后，用紫月眼 ×1、铥矿 ×4、月岩 ×4 建造星界投射器与配套星界接收器。'],
  ],
  sources:[recipe(621),prefab('um_astral_projector',1)],
 },
 {
  id:'um-scrapper',category:'new-items',prefab:'um_scrapper',title:'远古拆解机',aliases:['Ancient Scrapper','拆解机','自动拆解'],
  summary:'用绿月眼、铥矿和齿轮建造的远古分解建筑，可回收物品材料。',
  configs:[],
  sections:[
   ['获取','解锁配方后用绿月眼 ×1、铥矿 ×4、齿轮 ×1 建造，用于拆解不需要的装备和道具以回收资源。'],
  ],
  sources:[recipe(645),prefab('um_scrapper',1)],
 },
 {
  id:'rain-horn',category:'new-items',prefab:'rain_horn',title:'唤雨海螺',aliases:['Rain Horn','休眠唤雨海螺','dormant_rain_horn','帝王蟹海螺'],
  summary:'用帝王蟹掉落的休眠唤雨海螺在寄居蟹隐士处兑换激活，可主动呼唤降雨，耐久同独角鲸号角。',
  configs:[],
  sections:[
   ['获取与耐久','击杀帝王蟹固定掉落休眠唤雨海螺（dormant_rain_horn），在寄居蟹隐士 7 级商店用休眠唤雨海螺 ×1、口水鱼 ×3、空瓶子 ×2 兑换成品唤雨海螺。使用次数沿用独角鲸号角（GNARWAIL_HORN.USES）。'],
  ],
  related:[link('crab-king','帝王蟹')],
  sources:[beta('postinit/prefabs/vetcurse_drops.lua',36),recipe(249),prefab('rain_horn',107)],
 },
 {
  id:'healing-and-utility-consumables',category:'new-items',prefab:'floral_bandage',variantPrefabs:['brine_balm','um_firecream','honey_log','watermelon_lantern'],title:'夏花绷带、盐晶药膏、防火霜、蜂蜜原木卷与西瓜灯',aliases:['Floral Bandage','Brine Balm','Fire Cream','Honey Log','Watermelon Lantern','去黑血药膏','防火药膏'],
  summary:'五款测试版特色消耗与照明道具：夏花绷带回 45 血，防火霜回 15 血并防火，盐晶药膏处理生命上限惩罚，西瓜灯为万圣节照明。',
  configs:[],
  sections:[
   ['夏花绷带（floral_bandage）','在炼金引擎旁用蜂蜜药膏 ×1、仙人掌花 ×2 制作，直接回复 45 点生命。'],
   ['防火霜（um_firecream）','在炼金引擎旁用干火荨麻叶 ×3、储火袋 ×1、幽灵辣椒 ×2 制作，回复 15 生命并提供火焰防护。'],
   ['盐晶药膏（brine_balm）','在科学机器旁用盐晶 ×2、海带叶 ×1 制作，通过先扣当前血量来修复生命上限惩罚。'],
   ['蜂蜜原木卷与西瓜灯','蜂蜜原木卷（honey_log）无需科技用活木 ×1、蜂蜜 ×2 制作（饱食 5 / 生命 −10，用于特殊交互）。西瓜灯（watermelon_lantern）在万圣节活动用西瓜 ×1、萤火虫 ×1 制作。'],
  ],
  related:[link('max-health-penalties','生命上限惩罚机制'),link('ingredient-uses','干火荨麻叶')],
  sources:[recipe(270),recipe(274),recipe(286),recipe(324),recipe(402),prefab('floral_bandage',51),prefab('um_firecream',39),prefab('brine_balm',9),prefab('honey_log',56)],
 },
 {
  id:'seafaring-and-camp-tools',category:'new-items',prefab:'portableboat_item',variantPrefabs:['mastupgrade_windturbine_item','um_boatbottle','um_blueprinting_kit','plaunt_manny','snaildrakebucket'],title:'气垫船、风力涡轮灯台、船瓶、蓝图套件、警戒娃娃与蜗龙盆',aliases:['Portable Boat','Wind Turbine','Boat in a Bottle','Blueprinting Kit','Manny','Snaildrake Bucket','蜗龙桶','降温熔岩'],
  summary:'涵盖三件航海道具、蓝图复制套件、魔法警戒娃娃，以及可冷却熔岩地皮且续航一整年的蜗龙盆。',
  configs:[],
  sections:[
   ['航海三件套','气垫船套装（portableboat_item，智囊团：蚊子血囊 ×2 + 绳子 ×2）便于随身下水；风力涡轮灯台（mastupgrade_windturbine_item，智囊团：石砖 ×2 + 电子元件 ×2）装在桅杆上借助风力照明；船瓶（um_boatbottle，解锁后用弹性空间制造器 ×1 + 废料 ×2 + 月亮碎片 ×8）用于收纳整艘船。'],
   ['蓝图套件与汪汪警戒娃娃','蓝图套件（um_blueprinting_kit）在炼金引擎旁用海象牙 ×1、邪天翁羽毛 ×1、莎草纸 ×2 制作。汪汪警戒娃娃（plaunt_manny）在灵子分解器旁用曼德拉草 ×1、活木 ×2、多目章鱼触手眼 ×5 制作。'],
   ['蜗龙盆（snaildrakebucket）','在洞穴熔岩区使用可冷却范围内的熔岩地皮，内置燃料时长相当于一整年（70 天）。'],
  ],
  related:[link('snaildrakes','蜗龙与裂缝'),link('cave-worldgen','熔岩洞穴')],
  sources:[recipe(311),recipe(555),recipe(558),recipe(687),recipe(698),prefab('um_blueprinting_kit',44),prefab('snaildrakebucket',101),prefab('snaildrakebucket',286)],
 },
 {
  id:'sludge-maritime-gear',category:'new-items',prefab:'sludge_oil',variantPrefabs:['sludge_cork','boatpatch_sludge','boat_bumper_sludge_kit','cannonball_sludge_item'],title:'海泥提取物、海泥塞与海泥船用套件',aliases:['Sludge Oil','Sludge Cork','Sludge Boat Patch','Sludge Bumper','Sludge Cannonball','海泥补丁','海泥保险杠','海泥炮弹'],
  summary:'以海上采集的海泥为核心的五件实用道具，覆盖燃料提取、堵喷孔、10 次耐久补船、海泥保险杠与海泥炮弹。',
  configs:[],
  sections:[
   ['海泥提取物与海泥塞','海泥提取物（sludge_oil，炼金引擎：海泥 ×3 + 空瓶子 ×1）拥有 10 次使用耐久，用于补充燃料或配合海泥机制；海泥塞（sludge_cork，无需科技：浮木 ×2 + 绳子 ×2）用于封堵海面海泥喷孔。'],
   ['海泥船用三件套','海泥补丁套件（boatpatch_sludge，无需科技：海泥 ×3 + 浮木 ×2）可修补船体漏洞 10 次；海泥保险杠套装（boat_bumper_sludge_kit，智囊团：海泥 ×4 + 浮木 ×2）与海泥炮弹（cannonball_sludge_item，智囊团：海泥 ×1 + 硝石 ×1 + 木炭 ×1）用于航海攻防。'],
  ],
  related:[link('sludge-sack','海泥包'),link('armor-sharksuit-um','鲨甲')],
  sources:[recipe(299),recipe(374),recipe(377),recipe(386),recipe(405),prefab('sludge',123),prefab('boatpatch_sludge',52)],
 },
 {
  id:'wixie-slingshot-ammo-guide',category:'new-items',prefab:'bagofmarbles',variantPrefabs:['slingshotammo_rubber','slingshotammo_firecrackers','slingshotammo_moonrock','slingshotammo_slime','slingshotammo_tar','slingshotammo_salt','slingshotammo_goop','slingshotammo_tremor','slingshotammo_flare','slingshotammo_lazy','slingshotammo_moonglass','slingshotammo_obsidian','slingshotammo_shadow','slingshotammo_scrapfeather'],title:'弹珠袋与测试版全套弹弓弹药',aliases:['Bag of Marbles','橡皮弹药','鞭炮弹药','月岩弹药','黏糊弹药','海泥弹药','盐晶弹药','粘液弹药','沙石弹药','爆燃弹药','替身弹药','月亮碎片弹药','黑曜石弹药','梦魇弹药','电击废料弹'],
  summary:'汇总薇希/沃尔特重做加入的弹珠袋与 14 种专属弹弓弹药的制作科技与核心材料。',
  configs:['wixie_walter'],
  sections:[
   ['弹珠袋（bagofmarbles）','在炼金引擎旁用大理石弹 ×10、绳子 ×1 制作，可朝 8–10 单位处投掷撒出弹珠干扰或滑倒敌人。'],
   ['科学类弹药','科学机器：橡皮弹药（蚊子血囊 ×1）。炼金引擎：鞭炮弹药（硝石 ×1）、月岩弹药（月岩 ×1）、黏糊弹药（蛞蝓龟黏液 ×1 + 石头 ×1）、海泥弹药（海泥 ×1）、盐晶弹药（盐晶 ×1）、粘液弹药（格罗姆黏液 ×1）、沙石弹药（沙之石 ×1）；岛屿冒险兼容另含电击废料弹（铁矿 ×1 + 雷鸟羽毛 ×1）。'],
   ['魔法、远古与天体弹药','灵子分解器：爆燃弹药（红宝石 ×1）。远古伪科学站：替身弹药（橙宝石 ×1 + 噩梦燃料 ×1）。天体祭坛：月亮碎片弹药（月亮碎片 ×1）。蓝图解锁：梦魇弹药（噩梦燃料 ×1）。岛屿冒险黑曜石台：黑曜石弹药。蜂蜜弹药见单独词条。'],
  ],
  related:[link('wixie','薇希'),link('honey-rounds','蜂蜜弹药'),link('slingshot-gnasher','活木弹弓-切齿')],
  sources:[beta('init/init_recipes/recipes_wixie.lua',29),beta('init/init_recipes/recipes_wixie.lua',62),beta('init/init_recipes/recipes_wixie.lua',82),beta('init/init_recipes/recipes_wixie.lua',101),beta('init/init_recipes/recipes_wixie.lua',108),beta('init/init_recipes/recipes_wixie.lua',117),beta('init/init_recipes/recipes_wixie.lua',127),beta('init/init_recipes/recipes_ia.lua',134),prefab('bagofmarbles',212)],
 },
];
