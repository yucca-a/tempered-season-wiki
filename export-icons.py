"""Export only the inventory/portrait icons used by the Wiki from installed game assets.
KTEX metadata reference: https://github.com/oblivioncth/Stexatlaser#klei-tex-format
Decoding uses Pillow's built-in BCn decoder; no third-party game artwork is generated.
"""
from pathlib import Path
from zipfile import ZipFile
import json
import re
import struct
import xml.etree.ElementTree as ET
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'wiki/assets/icons'
OUT.mkdir(parents=True, exist_ok=True)
GAME = Path("D:/SteamLibrary/steamapps/common/Don't Starve Together/data/databundles")

def decode(data):
    assert data[:4] == b'KTEX'
    spec = struct.unpack_from('<I', data, 4)[0]
    fmt, count = (spec >> 4) & 31, (spec >> 13) & 31
    width, height, pitch, size = struct.unpack_from('<HHHI', data, 8)
    pixels = data[8+count*10:8+count*10+size]
    if fmt in (0, 1, 2):
        image = Image.frombytes('RGBA', (width,height), pixels, 'bcn', ((1,2,3)[fmt], ('DXT1','DXT3','DXT5')[fmt]))
    elif fmt in (4, 5):
        image = Image.frombytes('RGBA' if fmt == 4 else 'RGB', (width,height), pixels).convert('RGBA')
    else:
        raise ValueError(f'Unsupported KTEX format: {fmt}')
    return image.transpose(Image.Transpose.FLIP_TOP_BOTTOM)

def save(image, name):
    image = image.convert('RGBA')
    # KTEX generally stores premultiplied alpha; restore edge colours for web compositing.
    image.putdata([(min(255,round(r*255/a)),min(255,round(g*255/a)),min(255,round(b*255/a)),a) if a else (0,0,0,0) for r,g,b,a in image.getdata()])
    bbox = image.getbbox()
    if bbox: image = image.crop(bbox)
    image.thumbnail((96,96), Image.Resampling.LANCZOS)
    image.save(OUT / (name + '.png'))

names = '''spear hambat nightsword armorwood armorgrass armormarble armorruins ruinshat ruins_bat axe pickaxe multitool_axe_pickaxe glasscutter glassaxe tophat icestaff firestaff yellowstaff orangeamulet yellowamulet greenamulet orangegem yellowgem greengem bluegem redgem purplegem thulecite thulecite_pieces nightmarefuel livinglog log rocks cutgrass twigs gears papyrus boards cutstone silk spidergland reviver lifeinjector minotaurhorn deerclops_eyeball eyeturret_item eyeturret rainhat eyebrellahat umbrella slurtlehat shieldofterror mask_of_terror shadowthurible skeletonhat armorskeleton dragon_scales armordragonfly alterguardianhat lunarplant_husk purebrilliance horrorfuel dreadstone sword_lunarplant armor_lunarplant armor_voidcloth voidcloth_scythe voidclothhat pickaxe_lunarplant staff_lunarplant beargerfur_sack townportaltalisman beef_bell saddle_basic chestupgrade_stacksize gelblob_storage_kit trap trap_teeth trap_bramble tacklecontainer supertacklecontainer tackle_station boat_item boat_bumper_crabking_kit shadowheart shadowheart_infused bootleg oceanfish_small_6_inv oceanfish_small_7_inv oceanfish_small_8_inv oceanfish_medium_8_inv carrot onion onion_seeds monstermeat meat fish smallmeat honey royal_jelly forgetmelots glommerfuel goldenpitchfork turfcraftingstation researchlab researchlab2 researchlab3 researchlab4 cartographydesk townportal dragonflyfurnace mushroom_light mushroom_light2 cookpot meatrack tent siestahut bedroll_straw bedroll_furry portablecookpot portableblender lightninggoathorn moonglass moonrocknugget moonbutterflywings sewing_tape pocketwatch_heal pocketwatch_weapon pocketwatch_warp pocketwatch_portal pocketwatch_recall pocketwatch_revive book_brimstone book_tentacles book_horticulture_upgrade book_silviculture book_temperature book_fish spiderhat spiderden chester_eyebone hutch_fishbowl abigail_flower bernie_inactive torch lantern malbatross_beak mast_malbatross_item trident skeleton_player panflute flint lunar_seed opalpreciousgem spore_small spore_medium spore_tall beargervest icepack blueprint waxpaper bundlewrap fishingrod oceanfishingrod lightbulb batbat cave_banana wormlight lesserwormlight pepper garlic chili carrotcake tropicalbouillabaisse smallcandy'''.split()
manifest = {}
with ZipFile(GAME/'images.zip') as archive:
    for xmlname in ['images/inventoryimages1.xml','images/inventoryimages2.xml','images/inventoryimages3.xml','images/inventoryimages4.xml','images/avatars.xml']:
        tree = ET.fromstring(archive.read(xmlname))
        atlas = None
        texpath = 'images/' + tree.find('Texture').get('filename')
        for element in tree.findall('./Elements/Element'):
            name = element.get('name').removesuffix('.tex')
            if name not in names and not re.fullmatch(r'avatar_(wilson|willow|wolfgang|wendy|wx78|wickerbottom|woodie|wes|waxwell|wigfrid|webber|winona|warly|walter|wortox|wormwood|wurt|wanda|wonkey)',name): continue
            if atlas is None: atlas = decode(archive.read(texpath))
            w,h=atlas.size
            u1,u2,v1,v2=(float(element.get(k)) for k in ('u1','u2','v1','v2'))
            crop=atlas.crop((round(u1*w),round((1-v2)*h),round(u2*w),round((1-v1)*h)))
            name=name.removeprefix('avatar_')
            save(crop,name)
            manifest[name]={'path':'assets/icons/'+name+'.png','source':'DST images.zip/'+texpath}
    for character in 'wilson willow wolfgang wendy wx78 wickerbottom woodie wes waxwell wigfrid webber winona warly walter wortox wormwood wurt wanda wonkey'.split():
        target=f'images/avatars/avatar_{character}.tex'
        if target in archive.namelist():
            save(decode(archive.read(target)),character)
            manifest[character]={'path':'assets/icons/'+character+'.png','source':'DST images.zip/'+target}
for file in (ROOT/'content/images/inventoryimages').glob('*.tex'):
    save(decode(file.read_bytes()),file.stem)
    manifest[file.stem]={'path':'assets/icons/'+file.stem+'.png','source':str(file.relative_to(ROOT)).replace('\\','/')}
for name in ['frostshrine2hm', 'tomb_repair']:
    file=ROOT/'content/images'/f'{name}.tex'
    save(decode(file.read_bytes()),name)
    manifest[name]={'path':'assets/icons/'+name+'.png','source':str(file.relative_to(ROOT)).replace('\\','/')}
save(decode((ROOT/'content/modicon.tex').read_bytes()),'modicon')
manifest['modicon']={'path':'assets/icons/modicon.png','source':'content/modicon.tex'}
labels={}
with ZipFile(GAME/'scripts.zip') as archive:
    po=archive.read('scripts/languages/chinese_s.po').decode('utf-8-sig')
    for prefab, english, chinese in re.findall(r'msgctxt "STRINGS.NAMES\.([A-Z0-9_]+)"\s+msgid "([^"\n]*)"\s+msgstr "([^"\n]*)"',po):
        prefab=prefab.lower()
        if prefab in manifest and chinese: labels[chinese]=prefab
labels.update({'霜冻核心':'frostcore2hm','寒霜之祠':'frostshrine2hm','灵魂瓶':'bottle_soul','涡流':'sword_vortex2hm','裂开的不老表':'pocketwatch_heal2hm','永恒-出逃腿靴':'bootleg2hm','小糖豆':'smallcandy2hm','猪鼻胡萝卜蛋糕':'carrotcake2hm','四季鱼汤':'tropicalbouillabaisse2hm','哀悼之穴':'tomb_repair','眼球炮塔':'eyeturret_item','沃特':'wurt'})
(ROOT/'wiki/data/icon-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
(ROOT/'wiki/data/icon-labels.json').write_text(json.dumps(labels,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(f'Exported {len(manifest)} local game/mod icons.')
