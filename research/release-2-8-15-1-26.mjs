// 2.8.15.1.21–2.8.15.1.26: configuration notes and article bindings read from local source.
const version = '2.8.15.1.26';

export function refreshRelease126(articles, notes) {
  const updated = [];
  const touch = (id) => {
    const a = articles.find((item) => item.id === id);
    if (!a) throw Error('Missing article ' + id);
    a.auditedVersion = version;
    updated.push(id);
    return a;
  };
  const bind = (id, key) => {
    const a = touch(id);
    if (!a.configKeys.includes(key)) a.configKeys.push(key);
    return a;
  };

  notes['Willow Bernie Fire Blessing'] = {
    requires: ['enable easy mode', 'role_easy', 'willow_easy'],
    paragraphs: ['默认开启。点出「燃烧伯尼」技能树后，被点燃的大伯尼（含暗影分身）获得 20% 防御；薇洛每次消耗余烬时自动点燃大伯尼及其暗影分身；点燃中的大伯尼每次攻击延长燃烧 5 秒（上限 30 秒）。'],
  };
  bind('role-willow', 'Willow Bernie Fire Blessing');

  notes['Willow Ember Burn'] = {
    requires: ['enable hard mode', 'role_nerf'],
    paragraphs: ['默认开启。包含余烬灼身（每枚余烬理智上限 −2%/45 秒，每次消耗叠 1 层 −5% 移速/5 秒）、月夜灼烧（月火/影火 2 层起每层额外 −10% 理智上限/60 秒，期间伯尼受伤 +20%，非骑牛近战打敌对非随从 3 次清 1 层）与月火衰蚀（连击同目标每层 −1%，最低保留 60%，10 秒清除）。'],
  };
  bind('role-willow', 'Willow Ember Burn');

  notes['Willow Wet Bernie'] = {
    requires: ['enable hard mode', 'role_nerf'],
    paragraphs: ['默认开启。伯尼潮湿时受伤 +20%；巨型伯尼存在与被点燃时各扣主人 15% 理智上限，状态结束后恢复；仅蜜蜂的余烬掉落概率调整为 33%。'],
  };
  bind('role-willow', 'Willow Wet Bernie');

  notes['Ice Flingomatic No Freezing'] = {
    requires: ['enable easy mode'],
    paragraphs: ['默认开启。雪球发射器发射的雪球不再冻结生物，仍可正常灭火与防止植物枯萎。'],
  };
  bind('configuration', 'Ice Flingomatic No Freezing');

  return updated;
}
