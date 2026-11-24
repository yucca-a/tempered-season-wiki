const sharedTopics=[
 {id:'characters',name:'角色改动',icon:'wilson',description:'角色能力、技能、操作与兼容'},
 {id:'mechanics',name:'机制改动',icon:'gears',description:'战斗、生存和共享玩法规则'},
 {id:'items',name:'物品改动',icon:'hammer',description:'原有道具、装备、建筑和食物的变化'},
 {id:'creatures',name:'生物改动',icon:'deerclops_eyeball',description:'普通生物、敌怪、首领与掉落'},
 {id:'new-items',name:'新增物品',icon:'blueprint',description:'模组新增的装备、道具、建筑与食材'},
];

export const temperedTopics=[
 {...sharedTopics.find(topic=>topic.id==='characters'),children:[
  {id:'default-characters',name:'默认角色'},
  {id:'mod-characters',name:'模组角色'},
  {id:'character-mechanics',name:'机制改动'},
 ]},
 {...sharedTopics.find(topic=>topic.id==='items'),children:[
  {id:'item-buildings',name:'建筑'},
  {id:'item-equipment',name:'装备'},
  {id:'item-tools',name:'道具'},
 ]},
 {...sharedTopics.find(topic=>topic.id==='creatures'),children:[
  {id:'creature-mechanics',name:'生物机制'},
  {id:'creature-neutral',name:'中立生物'},
  {id:'creature-hostile',name:'敌对生物'},
  {id:'creature-bosses',name:'巨兽与首领'},
 ]},
 {id:'new-items',name:'全新内容',icon:'blueprint',description:'模组新增的装备、建筑、食物与道具',children:[
  {id:'new-equipment',name:'装备与武器'},
  {id:'new-buildings',name:'建筑与设施'},
  {id:'new-food',name:'食物与作物'},
  {id:'new-tools',name:'道具与弹药'},
 ]},
 {id:'quality-of-life',name:'生活质量改动',icon:'gears',description:'日常便利机制、作物与环境规则',children:[
  {id:'qol-mechanics',name:'机制改动'},
  {id:'qol-survival',name:'生存环境'},
 ]},
 {id:'mechanics',name:'其他改动',icon:'nightmarefuel',description:'暗影世界、战斗险境与核心系统',children:[
  {id:'world',name:'暗影世界'},
  {id:'other-danger',name:'险境与战斗'},
  {id:'other-mechanics',name:'其他机制'},
 ]},
 {id:'start',name:'入门与说明',icon:'torch',description:'新手入门、配置阅读指南与模组说明',utility:true},
 {id:'updates',name:'更新内容',icon:'cartographydesk',description:'各版本更新日志与历史改动记录',utility:true},
];

export const betaTopics=[
 {id:'world',name:'世界改动',icon:'lantern',description:'地形、世界生成与季节天气',children:[
  {id:'world-weather',name:'季节与天气'},
  {id:'world-biomes',name:'地形与植物'},
 ]},
 {id:'characters',name:'角色改动',icon:'wilson',description:'角色能力、技能、操作与兼容',children:[
  {id:'beta-mod-characters',name:'新增与重做角色'},
  {id:'beta-vanilla-characters',name:'原版角色改动'},
 ]},
 {id:'mechanics',name:'机制改动',icon:'gears',description:'战斗、生存和共享玩法规则',children:[
  {id:'mech-survival',name:'核心生存规则'},
  {id:'mech-systems',name:'宝石、烹饪与模式'},
 ]},
 {id:'items',name:'物品改动',icon:'hammer',description:'原有道具、装备、建筑和食物的变化',children:[
  {id:'item-gear',name:'装备与工具'},
  {id:'item-structures',name:'建筑与容器'},
  {id:'item-food-farm',name:'食物与农作物'},
 ]},
 {id:'creatures',name:'生物改动',icon:'deerclops_eyeball',description:'普通生物、敌怪、首领与掉落',children:[
  {id:'creature-bosses',name:'首领与巨兽'},
  {id:'creature-new',name:'新增与遗迹怪物'},
  {id:'creature-reworks',name:'原版生物改动'},
 ]},
 {id:'new-items',name:'新增物品',icon:'blueprint',description:'模组新增的装备、道具、建筑与料理',children:[
  {id:'new-vetcurse',name:'老兵诅咒神装'},
  {id:'new-weapons',name:'武器、炸弹与弹弓'},
  {id:'new-gear-tools',name:'护甲、头盔与工具'},
  {id:'new-dishes',name:'新增锅料理'},
  {id:'new-buildings-misc',name:'建筑与材料'},
 ]},
];

const newTemperedItems=new Set([
 'frost-core','frost-shrine','eternal-boots','anti-slip-boots','mourning-tomb','soul-bottle',
 'cracked-ageless-watch','dread-alarming-clock','shadowweaver-nightberry','vortex-sword','celestial-onion','small-candy','carrot-cake','four-season-fish-soup','dried-vegetables',
 'winona-toolbox','winona-electrical-upgrades','walter-moonglass-rounds','dried-berries',
]);
const temperedOverrides={
 'frostjaw':'creatures','containers':'mechanics','luck-adjustment':'mechanics','quick-transfer-hunger':'mechanics',
};

const characterMechanics=new Set([
 'skill-tree','night-vision','right-click-actions','character-mode-switches','skill-keybindings',
 'walter','wanda','wixie',
]);
const modCharacters=new Set(['role-wathom','role-wixie']);
const qualityMechanics=new Set([
 'equipment-repair','login-irreplaceables','science-level-rules','fire-cooking',
 'equipment-slot-swapping','world-forgotten-map','world-admin-control','prototype-costs',
 'cursed-item-retention','world-mining-work','sleep-recovery-ranges','newcomer-gifts',
 'hard-food-system','fuel-cooking','living-container','crop-growth','random-seeds','resource-regrowth',
 'archive-puzzle-changes','world-ancient-altar','world-ancient-statues',
 'world-farm-cracks','world-seasonal-nutrients',
]);
const qualityEnvironment=new Set([
 'world-complex-generation','world-renewable-plants','world-ecosystem','world-boulderbough','twiggy-tree-harvest',
 'knobbly-tree','world-long-night','world-player-temperature','environment-temperature-sources',
 'world-moonlight','world-seasons','world-humidity','world-summer','world-winter','world-autumn',
 'world-ocean-adventure','world-cave-access','world-sandstorm','world-moon-island','food-values',
]);
// These entries also belong to the character, creature, item or combat indexes.
const qualityMechanicsCrossLinks=new Set([
 'configuration','monster-meat-purification','walter','walter-moonglass-rounds','upgraded-tents',
 'horizon-expandinator','eyebrella','creature-flying','creature-monkeys','creature-krampus',
 'creature-spiders','gathering-hazards','giftwrap-aging','armor','shadow-door-purification',
 'world-ocean-adventure','food-values',
]);
const qualityEnvironmentCrossLinks=new Set([
 'archive-puzzle-changes','shadow-door-purification','world-ancient-altar','world-ancient-statues',
 'random-seeds','crop-growth','gathering-hazards','resource-regrowth',
]);
const equipment=new Set([
 'frost-core-staff','infused-lunar-sword','possessed-magician-hat','turf-raiser-helm',
 'infused-glass-cutter','infused-nightsword','thulecite-club','scalemail','shadow-thurible',
 'bone-helm','enlightened-crown','moongleam-weapons','bee-queen-crown','scrap-hat','eyebrella',
 'terror-shield','horn-enchant','new-hambat','deck-lamp-hat','rift-equipment-changes',
 'wagpunk-rift-upgrade','shadow-battleaxe-rift',
]);
const neutralCreatures=new Set([
 'creature-bees','creature-pigman','creature-otter','creature-monkeys','creature-glommer-insects',
 'creature-birds-retaliation','creature-oceanfish-behavior','creature-beefalo-bonding','creature-koalefant-herds',
]);
const creatureMechanics=new Set([
 'creature-elites','creature-walls','creature-boss-truce','creature-combat-calm',
 'creature-moving-attack','creature-flying','creature-poor-armor',
]);
const newEquipment=new Set(['eternal-boots','anti-slip-boots','vortex-sword','dread-alarming-clock']);
const newBuildings=new Set(['frost-shrine','mourning-tomb','winona-electrical-upgrades']);
const newFood=new Set(['celestial-onion','small-candy','carrot-cake','four-season-fish-soup','dried-vegetables','shadowweaver-nightberry','dried-berries','devil-fruit']);

export function temperedTopic(article){
 if(newTemperedItems.has(article.id)||article.id==='devil-fruit')return 'new-items';
 if(characterMechanics.has(article.id))return 'characters';
 if(article.category==='food'||qualityMechanics.has(article.id)||qualityEnvironment.has(article.id))return 'quality-of-life';
 if(isShadowWorld(article.id))return 'mechanics';
 if(temperedOverrides[article.id])return temperedOverrides[article.id];
 if(article.category==='world')return 'mechanics';
 if(article.category==='buildings')return 'items';
 return article.category;
}

function isShadowWorld(id){
 return id==='world-shadow'||id.startsWith('world-shadow-')||id==='shadow-nexus'||id==='world-exchange';
}

export function temperedRelatedTopics({id,topic}){
 const related=[];
 if(qualityMechanicsCrossLinks.has(id))related.push('qol-mechanics');
 if(qualityEnvironmentCrossLinks.has(id))related.push('qol-survival');
 if(related.length&&topic!=='quality-of-life')related.unshift('quality-of-life');
 return related;
}

export function temperedSubtopic({id,topic,category}){
 switch(topic){
  case 'characters':
   if(characterMechanics.has(id))return 'character-mechanics';
   return modCharacters.has(id)?'mod-characters':'default-characters';
  case 'items':
   if(equipment.has(id))return 'item-equipment';
   if(category==='buildings')return 'item-buildings';
   return 'item-tools';
  case 'creatures':
   if(creatureMechanics.has(id))return 'creature-mechanics';
   if(id.startsWith('boss-')||id==='frostjaw')return 'creature-bosses';
   return neutralCreatures.has(id)?'creature-neutral':'creature-hostile';
  case 'new-items':
   if(newEquipment.has(id))return 'new-equipment';
   if(newBuildings.has(id))return 'new-buildings';
   return newFood.has(id)?'new-food':'new-tools';
  case 'quality-of-life':
   return qualityEnvironment.has(id)?'qol-survival':'qol-mechanics';
  case 'mechanics':
   if(isShadowWorld(id))return 'world';
   if(id.includes('-danger')||id.startsWith('mechanic-')||['combat','armor','survival-modes'].includes(id))return 'other-danger';
   return 'other-mechanics';
 }
}

const betaWeather=new Set(['snowstorms','autumn-weather','winter-burning','spring-tornadoes','summer-heat-smog','rimeweed']);
const betaModChars=new Set(['winky','wixie','wathom','walter','winona']);
const betaMechSurvival=new Set(['max-health-penalties','burning-loot-longpig','winter-growth-limbo','veterans-curse','freeze-immunity']);
const betaItemStructures=new Set(['inventory-backpacks','clothing-pockets','infinite-blueprints','compost-over-rot','crafting-and-collisions','scaled-chest-buff','lazy-deserter','sleeping-rework','merm-houses','birdcage-feeding','icebox-tweaks']);
const betaItemFood=new Set(['farm-crops-and-seeds','mushrooms-and-planter','beebox-and-honey','ingredient-uses']);
const betaBosses=new Set(['creature-guide','summer-dragonflies','hooded-widow','ancient-guardian','ancient-fuelweaver','toadstool','nightmare-werepig','celestial-champion','shadow-pieces','great-depths-worm','deerclops','bearger','moose-goose','dragonfly','bee-queen','klaus','antlion','crab-king','eyes-of-terror','harder-treeguard','harder-spider-queen','boss-health-adjustments']);
const betaCreatureReworks=new Set(['pigking-guards','harder-krampus','elemental-hounds','spider-and-bat-reworks','adjusted-butterflies','frog-reworks','pig-and-werepig-reworks','beefalo-and-koalefant-reworks','walrus-and-other-mobs','slurtles','rock-lobster','marotter']);
const betaVetcurse=new Set(['gore-horn-hat','silk-sack','cursed-antler','crystal-cursed-antler','bearger-claw','slobber-lobber','feather-frock','klaus-amulet','crab-claw','um-beegun','moonfly-lantern']);
const betaWeapons=new Set(['dreadstone-shield','beak-basher','widows-grasp','charlies-slider','slingshot-gnasher','slingshot-matilda','slingshot-jessie','slingshot-claire','honey-rounds','wixie-slingshot-ammo-guide','jawed-scythe','um-ice-sicle','rimeweed-whip','rat-whip','bugzapper','um-magnerang','um-flamethrower','um-blowdarts','um-tentaclespike-moon','um-boomberry-bomb','um-bomb-moon','um-fyre-bomb','um-beemine-moon','um-bear-traps','um-detonator']);
const betaDishes=new Set(['beefalowings','californiaking','devilsfruitcake','liceloaf','simpsalad','snotroast','theatercorn','um-deviled-eggs','viperjam','zaspberryparfait','um-chiles-en-nogada','um-kebab','blueberrypancakes','um-boom-tart','um-boomberrypie','um-sponge-cake','snowcone','seafoodpaella','um-ghost-fajita','um-rimeweed-spagett','um-rimeweed-tequila','stuffed-peeper-poppers','um-durian-cream-marshcake','um-rice-pudding']);
const betaBuildingsMisc=new Set(['air-conditioner','skullchest','astral-projector','um-scrapper','um-fyrite','rat-tail','glass-scales']);

export function betaSubtopic({id,category}){
 switch(category){
  case 'world':return betaWeather.has(id)?'world-weather':'world-biomes';
  case 'characters':return betaModChars.has(id)?'beta-mod-characters':'beta-vanilla-characters';
  case 'mechanics':return betaMechSurvival.has(id)?'mech-survival':'mech-systems';
  case 'items':
   if(betaItemStructures.has(id))return 'item-structures';
   if(betaItemFood.has(id))return 'item-food-farm';
   return 'item-gear';
  case 'creatures':
   if(betaBosses.has(id))return 'creature-bosses';
   return betaCreatureReworks.has(id)?'creature-reworks':'creature-new';
  case 'new-items':
   if(betaVetcurse.has(id))return 'new-vetcurse';
   if(betaWeapons.has(id))return 'new-weapons';
   if(betaDishes.has(id))return 'new-dishes';
   if(betaBuildingsMisc.has(id))return 'new-buildings-misc';
   return 'new-gear-tools';
 }
}
