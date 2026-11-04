"""Evaluate actual modinfo.lua in an isolated Lua 5.1 runtime; export every option."""
from pathlib import Path
import hashlib
import json
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'work/test-python'))
from lupa.lua51 import LuaRuntime

lua = LuaRuntime(unpack_returned_tuples=True)
lua.globals().locale = 'zh'
raw = (ROOT / 'content/modinfo.lua').read_text(encoding='utf-8-sig')
instrumented = raw.replace('local conf = {name = key,', 'local conf = {__line = debug.getinfo(2, "l").currentline, name = key,')
lua.execute(instrumented)

def clean(value):
    if not isinstance(value, str):
        return value
    value = re.sub(r'[\U000f0000-\U000fffff]', '', value)
    return re.sub(r'\s+', ' ', value).strip().strip('-').strip()

files = {}
for p in (ROOT / 'content').rglob('*.lua'):
    if p.name == 'modinfo.lua':
        continue
    text = p.read_text(encoding='utf-8-sig')
    for i, line in enumerate(text.splitlines(), 1):
        if line.lstrip().startswith('--'):
            continue
        for _, key in re.findall(r'GetModConfigData\(\s*([\"\x27])(.*?)\1', line):
            files.setdefault(key, []).append({'file': str(p.relative_to(ROOT)).replace('\\', '/'), 'line': i})

mode, group, role = '通用设置', '通用设置', None
configs = []
for i in range(1, len(lua.globals().configuration_options) + 1):
    entry = lua.globals().configuration_options[i]
    label = clean(entry['label'])
    if not entry['name']:
        if label in ['简单模式', '困难模式', '暗影世界', 'Ray']:
            mode = label
            role = None
        elif label:
            group = label
            role = None
        continue
    name = entry['name']
    line = entry['__line']
    if not line:
        match = re.search(r'name\s*=\s*[\"\x27]' + re.escape(name) + r'[\"\x27]', raw)
        line = raw[:match.start()].count('\n') + 1 if match else None
    if label and '总开关' in label and name.endswith('_easy') and name != 'role_easy':
        role = name
    if name in ['other_role_easy', 'Monster Night Vision', 'wathom nightvision', 'All Right Dodge', 'Role Gym']:
        role = name if name == 'other_role_easy' else None
    opts = []
    for j in range(1, len(entry['options']) + 1):
        opt = entry['options'][j]
        opts.append({'label': clean(opt['description']), 'description': clean(opt['hover']) or '', 'value': opt['data']})
    configs.append({'key': name, 'label': label, 'description': clean(entry['hover']) or '', 'default': entry['default'], 'options': opts, 'mode': mode, 'group': group, 'roleParent': role if role != name else None, 'line': line, 'references': files.get(name, [])})

result = {'version': lua.globals().version, 'sourceHash': hashlib.sha256((ROOT/'content/modinfo.lua').read_bytes()).hexdigest(), 'total': len(configs), 'configs': configs}
out = ROOT / 'wiki/data/configs.json'
out.parent.mkdir(exist_ok=True)
out.write_text(json.dumps(result, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')
print(f'Exported {len(configs)} actual settings from Lua 5.1; {sum(len(c["options"]) for c in configs)} choices.')
for mode in dict.fromkeys(c['mode'] for c in configs):
    print(mode, sum(c['mode'] == mode for c in configs))
