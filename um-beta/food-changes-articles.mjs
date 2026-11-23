const beta=(file,line)=>({file,line});
const cfg=line=>beta('modinfo.lua',line);
const link=(id,label)=>({id,label});

export const foodChangesArticles=[
 {
  id:'monster-meat-cooking',category:'mechanics',icon:'monstermeat',title:'烹饪锅怪物肉稀释',aliases:['Monster Meat','怪物肉下锅','怪物千层饼','怪物度'],
  summary:'烹饪锅里多放普通肉类可以按比例稀释怪物度，同时烤怪物肉和怪物肉干的怪物度经过重调。',
  configs:['crockpotmonstmeat'],
  sections:[
   ['稀释公式','默认开启。锅中怪物度不再死板地达到 2 就出怪物千层饼，而是用总怪物度减去普通肉度乘以稀释系数后再判断是否小于 2。'],
   ['不同形态的怪物度','生怪物肉、烤怪物肉、怪物肉干以及小怪物肉都会重新注册对应的肉度与怪物度，搭配普通肉或晾干后更容易做出正常肉类料理。'],
  ],
  related:[link('cooking-guide','测试版新增料理速查')],
  sources:[cfg(699),beta('init/init_food/init_crockpot.lua',70),beta('init/init_food/init_crockpot.lua',78)],
 },
 {
  id:'seafood-and-goodies',category:'mechanics',icon:'icecream',title:'海鲜料理、零食类型与冰淇淋调整',aliases:['Fish Foods Rebalance','Goodies Food Type Changes','Ice Cream Buff','More Horrible Foods','海鲜牛排','海鲜浓汤','冰淇淋','零食','糟糕食物'],
  summary:'海鲜牛排和海鲜浓汤门槛提高，冰淇淋回 100 理智，四道原版零食改为通用或素食类型。',
  configs:['sr_foodrebalance','goodies_nerf','icecream_buff','horriblefood'],
  sections:[
   ['海鲜料理门槛','默认开启（sr_foodrebalance）。海鲜牛排改为肉度 ≥ 2.5 且鱼度 ≥ 2.0（不含冰）；海鲜浓汤改为鱼度 ≥ 3 且肉度 ≥ 3，优先级调至 31。'],
   ['零食食物类型与冰淇淋','零食改动（goodies_nerf）默认开启：冰淇淋与太妃糖改为通用食物（GENERIC），蘑菇蛋糕与冻香蕉代基里改为素食（VEGGIE），含全部调味版本。冰淇淋加强（icecream_buff）默认开启，所有冰淇淋理智回复提升至 100。'],
   ['糟糕食物与料理温度','更多糟糕食物（horriblefood）扩展难吃食物清单。此外所有烹饪锅料理的升降温幅度与持续时间均翻倍。'],
  ],
  related:[link('food-recovery','食物持续恢复'),link('cooking-guide','测试版新增料理速查')],
  sources:[cfg(710),cfg(711),cfg(712),cfg(761),beta('init/init_food/init_crockpot.lua',645),beta('init/init_food/init_crockpot.lua',662),beta('init/init_food/init_crockpot.lua',668),beta('init/init_food/init_food_changes.lua',90),beta('init/init_gamemodes/init_uncompromising_mode.lua',88)],
 },
 {
  id:'farm-crops-and-seeds',category:'items',icon:'potato_cooked',title:'农田料理、烤作物与种子调整',aliases:['Farmplot Food Redux','Raw Crops Nerf','Lowered Seeds Hunger','烤土豆','烤番茄','茄子','种子饱食'],
  summary:'下调烤土豆、烤番茄与茄子的回复数值，降低全部种子饱食度，并重调多道农田料理。',
  configs:['farmfoodredux','rawcropsnerf','seeds'],
  sections:[
   ['生烤作物削弱','默认开启（rawcropsnerf）。烤土豆改为 8 生命 / 18.75 饱食，烤番茄改为 8 生命，生茄子改为 18.75 饱食，烤茄子改为 18.75 饱食 / 12 生命。'],
   ['农田料理重做','默认开启（farmfoodredux）。重调土豆泥（75 饱食 / 15 理智）、花式回旋块茎（25 饱食）等多道农田料理的属性。'],
   ['种子饱食降低','默认开启（seeds）。普通种子、烤种子以及 14 种蔬菜种子的饱食度统一压低至测试版种子常量。'],
  ],
  related:[link('winter-growth-limbo','冬季停长作物')],
  sources:[cfg(708),cfg(747),cfg(765),beta('init/init_food/init_food_changes.lua',131),beta('init/init_food/init_food_changes.lua',343),beta('init/init_food/init_food_changes.lua',373)],
 },
 {
  id:'mushrooms-and-planter',category:'items',icon:'mushroom_farm',title:'蘑菇孢子与蘑菇农场调整',aliases:['Mushroom Changes','蘑菇农场','绿蘑菇','蘑菇续期','堆肥'],
  summary:'铲掉野生蘑菇会释放孢子，蘑菇农场未耗尽前也能随时用堆肥、格罗姆黏液、堆肥包或树果酱补充次数。',
  configs:['mushroom_changes'],
  sections:[
   ['野生蘑菇与孢子','默认开启。铲掉野生蘑菇除了在可采摘状态掉落蘑菇帽，还会直接释放一颗对应颜色的孢子。'],
   ['蘑菇农场多肥料续期','蘑菇农场未满 4 次收获前即可提前补充，无需等彻底枯萎。不同材料提供的补充次数为：堆肥 +1 次、格罗姆黏液 +2 次、堆肥包 +3 次、树果酱和活木直接补满 4 次。'],
  ],
  related:[link('compost-over-rot','堆肥替代腐烂物')],
  sources:[cfg(763),beta('postinit/prefabs/mushrooms.lua',4),beta('postinit/prefabs/mushroom_farm.lua',4),beta('postinit/prefabs/mushroom_farm.lua',18)],
 },
 {
  id:'beebox-and-honey',category:'items',icon:'beebox',title:'蜂箱与蜂蜜削弱',aliases:['Honey Nerf','蜂箱','蜂蜜','产蜜速度'],
  summary:'蜂箱的蜜蜂容量降到 1.5、放蜂周期拉长到 1.5 天，并同步调整蜂蜜与相关配方。',
  configs:['beebox_nerf'],
  sections:[
   ['产蜜节奏放缓','默认开启。将 TUNING.BEEBOX_BEES 调整为 1.5，TUNING.BEEBOX_RELEASE_TIME 延长至 1.5 天，同时调整蜂蜜本身的可食用数值与相关配方，限制前期无脑量产蜂蜜。'],
  ],
  sources:[cfg(746),beta('init/init_tuning.lua',533),beta('init/init_food/init_food_changes.lua',316),beta('init/init_recipes/recipe_changes.lua',117)],
 },
 {
  id:'icebox-tweaks',category:'items',icon:'icebox',title:'冰箱收纳调整',aliases:['Ice Box Tweaks','冰箱','盐盒','食材收纳','冰鲜蓝宝石'],
  summary:'冰箱允许直接收纳所有可入锅食材（不含活体小生物）以及带冰鲜蓝宝石附魔的装备。',
  configs:['um_icebox_tweaks'],
  sections:[
   ['扩充收纳范围','默认开启。只要物品属于可入锅的烹饪食材且不是活体小生物（如小鸟、兔子等），或者装备带有冰鲜蓝宝石（um_gemologybluegem2）附魔，都可以直接放进冰箱保存。同时将冰箱、盐盒和木箱设为低优先选中目标，减少基地密集摆放时的误点。'],
  ],
  related:[link('gemology','宝石学与冰鲜蓝宝石')],
  sources:[cfg(745),beta('init/init_containers.lua',1000)],
 },
];
