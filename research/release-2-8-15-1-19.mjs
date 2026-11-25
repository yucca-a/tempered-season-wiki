// 2.8.15.1.11–2.8.15.1.19: configuration notes and article bindings read from local source.
const version = '2.8.15.1.19';

export function refreshRelease119(articles, notes) {
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

  notes['Host Tick Rate'] = {
    requires: [],
    paragraphs: ['默认 60。仅房主本地开房时生效，用于调整主机通信频率；若移动出现虚影或卡顿，可降到 30 或改回跟随游戏默认。'],
  };
  bind('configuration', 'Host Tick Rate');

  notes.uncivilized_merm_speech = {
    requires: [],
    paragraphs: ['默认开启（全服生效）。为鱼人、鱼人守卫和鱼王替换 540 句原创中文台词，可选脏字打码或关闭；沃特与佩戴鱼人伪装帽的角色能看懂，其他角色只看到咕噜声。'],
  };
  bind('role-wurt', 'uncivilized_merm_speech');

  notes['Hills Protection'] = {
    requires: [],
    paragraphs: ['默认开启。第 1～3 天内，随机生物体型倍率上限限制在 1.5 倍，且不会刷出远程或属性精英；第 4 天起自动解除限制。'],
  };
  bind('world-random-size', 'Hills Protection');

  notes['Wes Backstab Attack'] = {
    requires: ['enable easy mode', 'role_easy', 'wes_easy'],
    paragraphs: ['默认开启。韦斯从敌怪背后攻击额外造成 100% 伤害，右键自身可召唤复制装备的暗影分身吸引仇恨（分身装备锁定，不会掉落或被偷取）。'],
  };
  bind('role-wes', 'Wes Backstab Attack');

  notes.knobbly_tree = {
    requires: ['enable hard mode', 'weather_change'],
    paragraphs: ['默认开启。玩家催长成型的疙瘩巨树会吸引水中木鱼群与龙虾、额外多垂下 3～4 条无花果藤，22 距离内的树荫可挡雨与风暴（兼容永不妥协两版大雨与玻璃落物），树下肉架在雨中继续风干。'],
  };
  bind('knobbly-tree', 'knobbly_tree');

  return updated;
}
