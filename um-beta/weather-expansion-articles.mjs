const beta=(file,line)=>({file,line});
const cfg=line=>beta('modinfo.lua',line);
const link=(id,label)=>({id,label});

export const weatherExpansionArticles=[
 {
  id:'autumn-weather',category:'world',icon:'frog',title:'秋季天气、毒蟾蜍与锈蚀陷阱',aliases:['Autumn Weather','Toads','Rusty Traps','蟾蜍','秋季灾害','捕兽夹','幽灵海象'],
  summary:'达到秋季天气起始天数后，普通青蛙会转为死亡爆毒云的蟾蜍；海象猎场在冬季还会刷出隐藏的锈蚀捕兽夹。',
  configs:['weatherhazard_autumn','toads','ghostwalrus'],
  sections:[
   ['秋季起始天数与毒蟾蜍','秋季天气起始天数（weatherhazard_autumn）控制秋季灾害生效的门槛。达到天数且开启蟾蜍（toads）后，秋季的普通青蛙会变成黄色皮肤的蟾蜍，死亡时有 50% 概率在原地爆出毒菌蟾蜍的孢子云。离开秋季后恢复为普通青蛙。'],
   ['锈蚀捕兽夹','开启锈蚀陷阱（ghostwalrus）后，海象猎场相关区域会布置锈蚀捕兽夹。若设为完全开启档（enabled），冬季还会按 600–900 秒的计时周期继续补充新陷阱。该配置同时与连帽森林共同控制对应陷阱配方的启用。'],
  ],
  sources:[cfg(435),cfg(445),cfg(542),beta('postinit/prefabs/frog.lua',14),beta('postinit/prefabs/frog.lua',23),beta('init/init_weather/init_acid_rain_disease.lua',29),beta('scripts/prefabs/um_bear_trap.lua',544),beta('scripts/prefabs/um_bear_trap.lua',557),beta('scripts/map/tasks/forest/the_hunters.lua',46)],
 },
 {
  id:'winter-burning',category:'world',icon:'torch',title:'冬季更难生火',aliases:['Harder Burning','Winter Burning','冬季点火','阴燃','火把'],
  summary:'冬季用火把或打火机直接点燃可燃物只会让目标开始阴燃，并额外消耗燃料。',
  configs:['winter_burning'],
  sections:[
   ['阴燃与燃料消耗','默认开启（非海难/火山世界生效）。冬季时，非纵火犯角色用带点燃组件的工具去点燃可燃物，不再立刻起明火，而是改为触发阴燃，同时消耗 5 点工具燃料。薇洛等带 pyromaniac 标签的角色不受此限制。'],
  ],
  related:[link('snowstorms','暴风雪与雪堆')],
  sources:[cfg(461),beta('init/init_postinit.lua',497),beta('init/init_weather/init_harder_weather.lua',23)],
 },
 {
  id:'spring-tornadoes',category:'world',icon:'um_tornado',title:'春季龙卷风与花粉灾害',aliases:['Tornadoes','Spring Weather','龙卷风','风暴','春季天气','花粉'],
  summary:'春季达到起始天数后，世界会周期性生成巨型龙卷风席卷地表，可把玩家和物品卷走并传送到随机陆地。',
  configs:['weatherhazard_spring','um_storms','um_storms_performance'],
  sections:[
   ['触发与路径','春季天气起始天数（weatherhazard_spring）控制龙卷风与春季花粉螨巢的生效门槛。开启龙卷风（um_storms）后，春季（或海难雨季/绿季）会按计时器周期刷出巨型龙卷风，并可通过薇克巴顿的实用求雨仪式临时改道。'],
   ['卷走与传送','被龙卷风卷入的玩家若正搬运重物会先强制放下，随后会被传送到主大陆的随机可通行陆地节点（避开月岛与独立隔离房间）并进入醒来状态。'],
   ['性能与画面档位','龙卷风性能优化（um_storms_performance）用于降低风暴的服务器运算开销；客户端另有降低龙卷风特效（um_storms_over）可把风暴视觉强度从 15 降到 5。'],
  ],
  related:[link('wickerbottom','薇克巴顿的求雨改道'),link('client-and-special-modes','客户端特效设置')],
  sources:[cfg(469),cfg(478),cfg(480),beta('init/init_weather/init_harder_weather.lua',139),beta('scripts/components/um_stormspawner.lua',217),beta('scripts/components/um_stormspawner.lua',235),beta('scripts/components/pollenmitedenspawner.lua',127),beta('scripts/prefabs/um_tornado.lua',9),beta('scripts/prefabs/um_tornado.lua',38),beta('scripts/prefabs/um_tornado.lua',59)],
 },
 {
  id:'summer-heat-smog',category:'world',icon:'um_hotspring',title:'夏季热浪、滚烫洞穴与烟雾',aliases:['Heat Waves','Hotter Caves','Smog','Summer Weather','热浪','洞穴高温','烟雾','野火'],
  summary:'夏季达到起始天数后会周期性刮起热浪并同步波及洞穴，滚烫洞穴让夏季地下不再凉爽，野火还会产生遮挡与窒息烟雾。',
  configs:['weatherhazard_summer','heatwaves','hotcaves','smog'],
  sections:[
   ['热浪周期','达到夏季天气起始天数（weatherhazard_summer）且开启热浪（heatwaves）后，夏季每 3 天加 0–120 秒会触发一次热浪。热浪开始时会强制停雨并在 5 秒后进入持续半天加 80–120 秒的高温阶段，同时把热浪状态同步给洞穴分片。'],
   ['滚烫洞穴','默认开启（hotcaves）。夏季洞穴的世界温度倍率改用测试版的高温系数，不再像原版那样轻易避暑；冬季洞穴也有独立的低温倍率。'],
   ['烟雾与火荨麻','开启烟雾（smog）后，燃烧和野火会产生扩散的烟雾云，靠近需要防护面具或远离；夏季起始天数同时控制夏季火荨麻的生成。'],
  ],
  related:[link('nettle-mask','荨麻面具'),link('summer-dragonflies','时令龙蝇与月光龙蝇')],
  sources:[cfg(494),cfg(505),cfg(508),cfg(510),beta('scripts/components/um_heatwaves.lua',30),beta('scripts/components/um_heatwaves.lua',55),beta('scripts/components/um_heatwaves.lua',101),beta('scripts/components/um_pyre_nettles_summer_spawner.lua',59),beta('postinit/prefabs/cave_network.lua',6),beta('init/init_gamemodes/init_uncompromising_mode.lua',149),beta('scripts/prefabs/smog.lua',14)],
 },
];
