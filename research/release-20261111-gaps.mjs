// Published v2.8.15.0.25 only. These are documentation additions, not new game features.
const P = (title, ...paragraphs) => ({title, paragraphs});
const T = (title, headers, rows) => ({title, table: {headers, rows}});
const temperature = ['enable hard mode', 'weather_change', 'temperature_change'];
const temperatureSources = ['content/modmain.lua', 'content/modinfo.lua', 'content/weather/temperature.lua'];

export function refreshDocumentationGaps(articles, notes) {
  const updated = [];
  function revise(id, change, sources = []) {
    const article = articles.find(a => a.id === id);
    if (!article) throw Error('Unknown documentation gap article: ' + id);
    change(article);
    article.source = [...new Set([...article.source, ...sources])];
    article.auditedVersion = '2.8.15.0.25';
    updated.push(id);
  }
  function add(article) {
    if (articles.some(a => a.id === article.id)) throw Error('Duplicate documentation gap article: ' + article.id);
    articles.push({keywords: '', source: [], configKeys: [], ...article, auditedVersion: '2.8.15.0.25'});
    updated.push(article.id);
  }

  add({
    id: 'knobbly-tree', title: '疙瘩树与高出平均值的树干', category: 'world', tag: '植物', icon: 'treegrowthsolution',
    summary: '疙瘩树每次用树果酱催长，额外需要 1 个铥矿和 1 个蓝宝石；长成后的高出平均值的树干另有强力破坏要求。',
    aliases: ['水中木', '树果酱'],
    keywords: '疙瘩树 水中木 海中树 海上树 oceantree oceantree_short oceantree_normal oceantree_tall oceantree_pillar treegrowthsolution',
    configKeys: [...temperature, 'monster_change', 'wall_destroy'],
    source: [...temperatureSources, 'content/monster/wall.lua'],
    sections: [
      P('树果酱催长的额外成本',
        '开启困难模式、天气改动和“玩家温度”后，对疙瘩树使用树果酱催长，每次还要从操作者的物品栏中消耗 1 个铥矿和 1 个蓝宝石。树果酱本身仍按原有规则使用。',
        '缺少任一额外材料时，催长被阻止，并提示还需要铥矿和蓝宝石。该规则覆盖矮小、中等和高大的疙瘩树；树桩、燃烧、烧毁或不能强制催长的状态仍受原有条件限制。'),
      P('生效开关在哪里',
        '催长成本跟随“玩家温度”选项加载，−1 与 −2 两个启用档都会生效。只关闭植物生长倍率，不会关闭这项额外成本；关闭“玩家温度”或其上级天气、困难模式开关，才不加载这部分改动。'),
      P('长成后的破坏要求',
        '另行开启困难模式、怪物改动和“怪物破坏墙壁”后，由疙瘩树催长形成的“高出平均值的树干”需要强力破坏能力。这是另一组开关，独立于树果酱的额外成本。',
        '“高出平均值的树干”是该催长成树的官方中文名；海上天然生成的“大树干”是另一种实体，不能仅凭外观把两者当成同一对象。'),
      {title: '相关词条', links: ['world-player-temperature', 'creature-walls', 'resource-regrowth']},
    ],
  });

  add({
    id: 'environment-temperature-sources', title: '蘑菇树与冰钓洞的冷暖效果', category: 'world', tag: '环境温度', icon: 'ice',
    summary: '高大蓝蘑菇树提供 25℃冷源，中型红蘑菇树提供 45℃热源；冰钓洞的冷源随季节变化。',
    aliases: ['蓝蘑菇树', '红蘑菇树', '冰钓洞', '冰钓孔'],
    keywords: '蘑菇树 冷源 热源 降温 取暖 冰钓洞 mushtree_tall mushtree_medium icefishing_hole',
    configKeys: [...temperature], source: [...temperatureSources],
    sections: [
      T('附近的冷暖源', ['对象', '设定值', '作用'], [
        ['高大蓝蘑菇树', '25℃', '冷源，帮助附近角色降温'],
        ['中型红蘑菇树', '45℃', '热源，帮助附近角色取暖'],
        ['冰钓洞：春季、秋季', '−50℃', '冷源'],
        ['冰钓洞：夏季', '0℃', '冷源'],
        ['冰钓洞：冬季', '−100℃', '冷源'],
      ]),
      P('如何理解这些温度',
        '需要同时开启困难模式、天气改动和“玩家温度”。表中数值是冷暖源的设定值，角色实际体温还取决于距离、环境、衣物和其他冷热来源。',
        '这部分仅给原本没有供热组件的对象补上效果；其他模组已经提供冷热能力时，可能沿用已有实现。'),
      {title: '相关词条', links: ['world-player-temperature', 'boss-frostjaw-combat']},
    ],
  });

  add({
    id: 'thermal-stone-wateringcan', title: '暖石与谢天翁水壶', category: 'items', tag: '温控', icon: 'heatrock',
    summary: '暖石供热会混合自身与环境温度；同开永不妥协时，谢天翁水壶可用季节鱼为暖石调温。',
    aliases: ['热能哑铃温控', '谢天翁水壶', '暖石温控'],
    keywords: '暖石 温石 热能哑铃 谢天翁水壶 炽热太阳鱼 冰鲷鱼 永不妥协 heatrock dumbbell_heat icire_rock premiumwateringcan frigginbirdpail',
    configKeys: [...temperature], source: [...temperatureSources],
    sections: [
      P('适用物品与开关',
        '开启困难模式、天气改动和“玩家温度”后，暖石、热能哑铃以及模组温石 icire_rock 的供热会按下表混合。热能哑铃和模组温石需要本身具有温度及供热能力。'),
      T('供热的混合比例', ['位置与档位', '原供热值', '物品自身温度', '世界温度'], [
        ['携带，−1（默认）', '50%', '50%', '0%'],
        ['携带，−2', '25%', '75%', '0%'],
        ['地面，−1（默认）', '25%', '25%', '50%'],
        ['地面，−2', '12.5%', '37.5%', '50%'],
      ]),
      P('谢天翁水壶与季节鱼',
        '同时加载永不妥协时，谢天翁水壶的容器允许放入上述温控物品。水壶内每条炽热太阳鱼提供 +25℃、每条冰鲷鱼提供 −25℃的温度修正，由壶内所有温控物品均分。',
        '例如放入 1 条炽热太阳鱼和 2 块暖石，每块获得 +12.5℃修正；再放入 1 条冰鲷鱼，这项净修正变为 0℃。放入或取出物品后重新计算，取出暖石时移除水壶给予它的修正。',
        '温控物品在壶内暂停自身的受潮变化；取出时，若水壶剩余水量高于 15%，会按剩余比例设置该物品的潮湿度。'),
      {title: '相关词条', links: ['world-player-temperature', 'heat-dumbbell', 'um-compat-equipment']},
    ],
  });

  add({
    id: 'cursed-item-retention', title: '诅咒饰品与诅咒装备的保留', category: 'mechanics', tag: '诅咒', icon: 'nightmarefuel',
    summary: '诅咒饰品在死亡和落水时仍随身保留；淬炼诅咒装备还限制直接丢弃与装备交换。',
    aliases: ['诅咒饰品', '猴子诅咒', '诅咒装备'],
    keywords: '诅咒饰品 诅咒装备 猴子饰品 死亡 落水 丢弃 换人 cursed_monkey_token curse2hm',
    configKeys: [], source: ['content/modmain.lua', 'content/common/curse.lua'],
    sections: [
      P('死亡和落水',
        '猴子诅咒饰品会在角色死亡、落水时保留。这项通用改动直接加载，不要求开启简单模式、困难模式或复活诅咒。'),
      P('丢弃和转交的限制',
        '复活诅咒装备等带有淬炼专用诅咒标记的物品，不能直接丢弃，也不能通过交换装备转交。普通诅咒物品尝试进入鼠标手持格时，仍会触发诅咒绑定处理。',
        '通过天体传送门更换角色时，已有的淬炼诅咒装备会恢复到新角色身上。具体诅咒的获取、消退与解咒方法，见相应条目。'),
      {title: '相关词条', links: ['revival-curse', 'role-wonkey']},
    ],
  });

  revise('world-player-temperature', a => {
    a.sections.find(s => s.title === '暖石与周边物品').paragraphs = [
      '暖石、热能哑铃和模组温石的供热会混合物品自身温度及世界温度。同开永不妥协时，谢天翁水壶还可以用炽热太阳鱼和冰鲷鱼为壶内暖石调温，具体比例见下方词条。',
      '疙瘩树每次用树果酱催长额外消耗 1 个铥矿和 1 个蓝宝石。高大蓝蘑菇树、中型红蘑菇树和冰钓洞也有对应冷暖效果。这些功能都跟随“玩家温度”开关，详见独立条目。',
    ];
    a.sections.push({title: '相关词条', links: ['knobbly-tree', 'environment-temperature-sources', 'thermal-stone-wateringcan']});
  });
  revise('about', a => {
    a.sections[0].paragraphs.push('原版实体名称按游戏官方简体中文核对；模组新增内容使用对应版本的实际汉化，必要时参考灰机百科。常用俗称与英文名保留为搜索别名。');
  });
  revise('containers', a => {
    a.sections.push(P('永不妥协容器装备的地图图标',
      '同开永不妥协，并开启困难模式、天气改动和“玩家温度”时，没有自带小地图图标、可装备在身体或背包栏的容器装备，会补上跟随该物品位置的背包图标。此功能由温度模块加载，关闭容器整理本身不会关闭它。'));
  }, ['content/weather/temperature.lua', 'content/scripts/prefabs/backpackicon2hm.lua']);
  revise('creature-walls', a => {
    a.sections.find(s => s.title === '经典档').paragraphs[1] = '本项还使“高出平均值的树干”需要强力破坏能力。临时解除世界碰撞期间，溺水组件不把该生物判为落水或落入虚空。';
    a.sections.push({title: '高出平均值的树干', paragraphs: ['本项要求强力破坏能力的对象是由疙瘩树催长形成的“高出平均值的树干”。树果酱催长成本由“玩家温度”单独控制。'], links: ['knobbly-tree']});
  });
  revise('role-wonkey', a => {
    a.sections.push({title: '通用诅咒物品保留', paragraphs: ['诅咒饰品在死亡和落水时随身保留；这是所有角色共享的通用规则。'], links: ['cursed-item-retention']});
  }, ['content/common/curse.lua']);
  revise('revival-curse', a => {
    a.sections.push({title: '诅咒装备的丢弃与换人', paragraphs: ['淬炼诅咒装备限制直接丢弃与装备交换。通过天体传送门更换角色时，已有诅咒装备仍会恢复。'], links: ['cursed-item-retention']});
  }, ['content/common/curse.lua']);
  // Existing explanations were present; add their actual runtime entry points to provenance.
  revise('combat', () => {}, ['content/role/combat_progressive.lua']);
  for (const id of ['world-ancient-statues', 'world-ancient-altar']) {
    revise(id, () => {}, ['content/tech/common.lua']);
  }
  notes.temperature_change = {...notes.temperature_change, paragraphs: [
    ...notes.temperature_change.paragraphs,
    '疙瘩树每次树果酱催长额外消耗 1 铥矿和 1 蓝宝石；并调整蘑菇树、冰钓洞的冷暖效果。同开永不妥协时，还包含谢天翁水壶内的季节鱼调温及容器装备地图图标。',
  ]};
  return updated;
}
