const section=(title,...paragraphs)=>({title,paragraphs});
const version='2.8.15.0.34';

export function refreshRelease34(articles,notes){
  const updated=[];
  function revise(id,sources,edit){
    const a=articles.find(a=>a.id===id);
    edit(a);
    a.source=[...new Set([...a.source,...sources.map(s=>'content/'+s)])];
    a.auditedVersion=version;
    updated.push(id);
  }
  function add(a){
    articles.push({...a,auditedVersion:version});
    updated.push(a.id);
  }
  const watchKey='Wanda Dread Watch';
  const watchGates=['enable easy mode','role_easy',watchKey];
  add({
    id:'dread-alarming-clock',title:'恐惧-警告表',category:'items',tag:'旺达武器',icon:'pocketwatch_weapon',
    summary:'旺达用 1 个附身暗影心房升级警钟。连续命中提高攻速，满 6 层增加位面伤害并延长攻击距离。',
    aliases:['恐惧警告表','恐惧—警告表','恐惧警钟','Dread Alarming Clock'],
    keywords:'旺达 表姐 警钟 怀表 pocketwatch_weapon dreadwatch2hm shadowheart_infused',
    configKeys:watchGates,source:['content/modinfo.lua','content/modmain.lua','content/easy_role/wanda_dreadwatch2hm.lua','DST scripts.zip/scripts/prefabs/pocketwatch_weapon.lua','DST scripts.zip/scripts/prefabs/horrorfuel.lua'],
    sections:[
      section('如何升级','开启简单模式、角色改动和“恐惧-警告表”后，由旺达拿起 1 个附身暗影心房，右键一把普通警钟选择“升级”。警钟在满耐久时也可升级。升级保存在这把表上，实体代码仍是 pocketwatch_weapon。'),
      section('连续命中','每次命中叠 1 层，攻速相对基础值每层增加 12%，最高 6 层，即 1.72 倍攻速。满层时角色获得 34 点位面伤害，攻击距离与命中距离均为原来的 1.2 倍。每次命中刷新计时，3 秒内未续击或角色受到攻击会清空层数。'),
      section('补充耐久','每个噩梦燃料补充最大耐久的 10%。纯粹恐惧沿用警钟的燃料结算，每个补充 50%。'),
      {title:'相关词条',links:['role-wanda','cracked-ageless-watch','possessed-magician-hat']},
    ],
  });
  notes[watchKey]={requires:watchGates.slice(0,2),status:'mismatch',paragraphs:['此项独立于旺达总开关。菜单仍写“只能用纯粹恐惧”，当前升级后的警钟也接受噩梦燃料，每个补充 10%。']};
  revise('role-wanda',['easy_role/wanda_dreadwatch2hm.lua'],a=>{
    const s=a.sections.find(s=>s.title.includes('警告表'));
    s.title='恐惧-警告表';
    s.paragraphs=['旺达可用 1 个附身暗影心房升级警钟。此项有独立开关，即使关闭旺达简单总开关也可单独启用。'];
    s.links=['dread-alarming-clock'];
  });
  add({
    id:'shadowweaver-nightberry',title:'织影夜莓',category:'food',tag:'首领战利品',icon:'devil_heart2hm',
    summary:'正常击杀强化远古织影者可得，也可在暗影术基座制作。首次食用后，受到的伤害会分 10 次结算。',
    aliases:['只因拟态梅','恶魔之心','Shadowweaver Nightberry'],keywords:'devil_heart2hm 缓伤 夜莓',
    configKeys:['enable hard mode','monster_change','atriumstalker'],source:['content/modmain.lua','content/epic/atriumstalker.lua','content/scripts/prefabs/devil_heart2hm.lua'],
    sections:[
      section('掉落与制作','开启困难模式、怪物改动与“远古织影者加强”后，正常击杀远古织影者额外掉落 1 个织影夜莓。大门失效、织影者消散时不掉。也可在暗影术基座用 4 个暗影碎布和 4 个夜莓制作，每次都需要靠近制作站。'),
      section('食用与缓伤','基础食物属性为 25 饥饿、0 生命、0 理智。玩家食用后永久获得缓伤，同一角色再次食用不会叠加。符合条件的一次扣血会按减伤后的数值分成 10 份，每 0.3 秒扣一份，多次受伤分别计时。分期扣血仍可致死。'),
      section('例外','制作配方扣除生命、旺达的衰老结算以及直接扣除无穷大生命的效果沿用各自规则。'),
      {title:'掉落来源',links:['boss-fuelweaver']},
    ],
  });
  revise('boss-fuelweaver',['epic/atriumstalker.lua'],a=>a.sections.find(s=>s.title==='击杀掉落').links=['shadowweaver-nightberry']);
  add({
    id:'devil-fruit',title:'恶魔植物与恶魔果实',category:'food',tag:'远古守护者',icon:'berries',
    summary:'远古守护者战区里看似普通的植物可能强制玩家采摘。果实会占住口袋，吃下会损失理智并产生睡意。',
    aliases:['恶魔花园','诅咒果实'],keywords:'devil_fruit2hm_berries devil_plant2hm_berrybush 远古守护者',
    configKeys:['enable hard mode','monster_change','minotaur'],source:['content/modmain.lua','content/epic/minotaur.lua','content/epic/minotaur_old.lua','content/scripts/prefabs/devilfruits2hm.lua','content/scripts/prefabs/devilplants2hm.lua'],
    sections:[
      section('如何识别','强化远古守护者会在战区生成模仿野生植物和农作物的恶魔植物。靠近开花植株可能触发强制采摘，采下的果实绑定采摘者。果实有浆果、香蕉、蘑菇和多种蔬菜外观。'),
      section('口袋与腐坏','果实只能放进角色口袋，死亡或溺水仍保留。尝试丢弃时，它会寻找空格或挤掉一件未受诅咒的物品回到口袋。保鲜期为 1 个游戏日，腐坏时会尝试让仍可进食的持有者吃下整组。'),
      section('食用后果','果实不回复饥饿，会降低当前理智，随后施加睡意。进食还会暂时削减理智上限，通常每次降低 30 点，上限较低的角色另有限制。每次的惩罚分别计时，480 秒后解除。'),
      {title:'相关词条',links:['boss-ancient-guardian','cursed-item-retention']},
    ],
  });
  revise('boss-ancient-guardian',['scripts/prefabs/devilfruits2hm.lua','scripts/prefabs/devilplants2hm.lua'],a=>a.sections.find(s=>s.title==='旧版与地形限制').links=['devil-fruit']);
  add({
    id:'skill-keybindings',title:'角色与装备快捷键',category:'mechanics',tag:'操作',icon:'gears',
    summary:'在模组面板为角色自身技能、指向鼠标的技能和当前手持装备录制按键或组合键。',
    aliases:['快捷键绑定配置','键位设置','组合键'],keywords:'快捷键 绑定 改键 蓄力 清除',
    configKeys:[],source:['content/modmain.lua','content/easy_other/ui.lua','content/scripts/keybindings2hm.lua','content/scripts/keybindingmodel2hm.lua','content/scripts/keybindingscreen2hm.lua'],
    sections:[
      section('录制绑定','打开聊天区小扫把的模组面板，选择“快捷键绑定配置”。面板会列出当前角色和手持装备可用的技能。点对应行的“绑定”，按下要用的键或组合键，全部松开后点“保存绑定”。'),
      section('冲突与保存','Esc、Enter 与控制台按键由游戏保留。若面板提示与其他绑定重叠，可换键或清除旧绑定。设置按角色保存在本机，切换世界或回档后仍保留。'),
      {title:'相关操作',links:['right-click-actions']},
    ],
  });
  revise('winona-toolbox',['scripts/winonatoolboxart2hm.lua'],a=>{
    a.aliases=[...(a.aliases??[]),'薇诺娜的工具箱','女工工具箱'];
    a.title='薇诺娜的器械箱';
    a.icon='winona_toolbox2hm';
    a.sections.push(section('箱内外观','打开空箱和装有物品的器械箱时，内景不同。'));
  });
  revise('frost-shrine',['common/frostshrine_skin.lua'],a=>a.sections.push(section('破冰皮肤','建造时可选“破冰”，已有的寒霜之祠也能用清洁扫把切换。')));
  for(const [id,icon] of [['anti-slip-boots','bootleg_2hm'],['eternal-boots','bootleg2hm'],['celestial-onion','onion_celestial2hm']]){
    revise(id,[],a=>{a.icon=icon;});
  }
  revise('role-wx78',['common/wx78_mode.lua','common/wx78_recovery.lua','scripts/wx78config2hm.lua','scripts/wx78draft2hm.lua'],a=>{
    a.configKeys.push('WX-78 Mode');
    a.sections[0].paragraphs=['“WX-78方案”默认沿用旧档的简单、困难及角色开关。手动选择旧方案·简单、旧方案·困难、草案测试或关闭改动时，以所选方案为准。下文的融合、成长、超载和无人机强化属于旧方案。'];
    a.sections.splice(1,0,section('草案测试','激活的生命电路在护甲前提供固定格挡，合计上限 20。小理智电路每块每分钟恢复 1 理智，大小理智电路均可削弱负面理智光环。饥饿电路保留基础效果。','普通食物累计实际补入 45 饥饿就回 1 格电，满饱溢出部分不计，自带回电的食物不重复兑换。满电清空余量。','切入草案时，融合电路按等级拆回同种普通电路并保留耐久。多余芯片和暂存物品优先归还背包，放不下时掉在地上。'));
  });
  notes['WX-78 Mode']={requires:[],paragraphs:['默认按旧档开关运行。手动选择的简单、困难、草案或关闭档独立生效。草案使用原版电路并加入护甲前格挡、理智光环抗性和进食回电。']};
  const renewal='右键给予暗影操控器或已绑定暗影操控器的清洁扫把噩梦燃料，可将权限补满至 20 个游戏日。每缺 5 天收 1 个，不足 5 天向上取整。例如还剩 14 天时收 2 个；已满或材料不足时不扣费。';
  revise('shadow-manipulator',['easy_other/easy_structures.lua','scripts/shadowmagic2hm.lua'],a=>{
    a.summary='用噩梦燃料换取 20 天暗影魔法权限，随后可向暗影操控器或绑定它的清洁扫把按需续费。';
    a.sections.find(s=>s.title==='持续时间').paragraphs=['权限按实际经过的游戏时间计时，保存重载保留到期时刻。到期后角色恢复原有能力与读书理智消耗倍率。'];
    a.sections.find(s=>s.title==='延长期限').paragraphs=[renewal,'每次成功给暗影秘典补充燃料另续 1 天，已过期时从当前时刻起算，上限仍为 20 天。'];
  });
  notes['Prestihatitator Redeem shadowmagic Tag'].paragraphs=[renewal];
  revise('role-wortox',['easy_role/wortox_easy.lua','scripts/umwortox2hm.lua'],a=>{
    const row=a.sections.find(s=>s.title==='食物与灵魂').table.rows.find(([title])=>title==='自动获得灵魂');
    row[1]='生命、理智和饥饿均至少 75%，且随身灵魂和灵魂罐合计少于 10 个时，普通每 120 秒、困难每 240 秒补 1 个。';
    notes['Wortox Auto Receive Soul'].paragraphs=[row[1],'困难档还调整排箫相关技能。'];
    a.sections.find(s=>s.title==='永不妥协测试版兼容').paragraphs.push('启用妥测的沃托克斯改动时，双尾心自动免死有 120 秒角色冷却。换一颗心也要等到冷却结束，手动复活仍可使用。');
  });
  revise('role-webber',['easy_role/webber_easy.lua','scripts/components/removeleaveinventory2hm.lua'],a=>{
    const rule='启用妥测护甲重制时，复制帽的防御达到 65% 可免疫冻结和睡眠，达到 75% 再免疫火焰伤害和惊吓。其他情况下两道门槛分别为 80% 和 90%。';
    a.sections.find(s=>s.title==='帽子戏法').paragraphs[1]=rule+'原帽剩余护甲耐久不超过 5% 时会自动摘下。';
    notes['Hat Trick'].paragraphs=[notes['Hat Trick'].paragraphs[0].replace('护甲吸收率≥80%免疫冻眠，≥90%再免疫火焰和惊吓。',rule)];
  });
  revise('fuel-cooking',['scripts/complexsmartpot2hm.lua','scripts/cookingredientcollect2hm.lua'],a=>a.sections.find(s=>s.title==='智能锅与火炉例外').paragraphs.push('兼容的智能锅支持右键食材图标，从附近允许取物的容器收集指定食材或食材度。按普通肉度收集会排除带怪物度的食材。月炆宝炊按可见食材格逐行放料，成品格留空。'));
  revise('world-moon-island',[],a=>a.sections.push(section('进出月亮风暴','开启护目镜分类时，普通护目镜在月亮风暴中仍可佩戴，但不提供风暴防护。月亮专用护目镜与对应升级保留防护。')));
  revise('new-hambat',['scripts/hambatweightedskins2hm.lua'],a=>a.sections.push(section('重量与皮肤','使用官方皮肤时，手持外观也随重量档位缩放。加肉、啃食和重新装备都会保留对应的皮肤和大小。')));
  revise('right-click-actions',[],a=>{
    a.sections[0].paragraphs.push('右键自身时优先使用角色自身技能。持妥协滑行手杖且盈能可用时，普通右键滑行，Ctrl＋右键盈能。');
    a.sections[0].links=[...(a.sections[0].links??[]),'skill-keybindings'];
  });
  revise('getting-started',[],a=>a.sections.find(s=>s.title==='资料覆盖范围').paragraphs[0]='资料基线为淬炼之季 '+version+'。可在版本记录查阅本分支的发布改动，角色、装备和配置页提供对应的玩法与开关。');
  return updated;
}
