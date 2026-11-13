import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {articles} from './articles.mjs';
import {itemGroups} from './items.mjs';

const require=createRequire(import.meta.url);
const lua=require(process.env.WIKI_LUA_PARSER||'luaparse');
const args=process.argv.slice(2);
const check=args[0]==='--check';
if(check)args.shift();
if(args.length!==3)throw Error('Usage: node extract.mjs [--check] <workshop-3193922031> <workshop-3597225156> <chinese_s.po>');
const [betaDir,cnDir,gamePo]=args;
const resultFile=new URL('./snapshot.json',import.meta.url);
const sourceFiles={};
const sourceText=new Map();
async function read(dir,file){
 const key=(dir===betaDir?'beta':'cn')+'/'+file;
 if(sourceText.has(key))return sourceText.get(key);
 const bytes=await fs.readFile(path.join(dir,file));
 const value=bytes.toString('utf8').replace(/^\uFEFF/,'');
 sourceText.set(key,value);
 sourceFiles[key]={sha256:createHash('sha256').update(bytes).digest('hex'),lines:value.split('\n').length};
 return value;
}
const ast=(source,comments=false)=>lua.parse(source,{locations:true,ranges:true,comments,luaVersion:'5.1'});
const fields=node=>new Map((node?.fields??[]).filter(f=>f.type!=='TableValue').map(f=>[f.key.name??scalar(f.key),f.value]));
const values=node=>(node?.fields??[]).filter(f=>f.type==='TableValue').map(f=>f.value);
function scalar(node){
 if(!node)return undefined;
 if(node.type==='StringLiteral'){
  const quote=node.raw[0];
  if(quote==='[')return node.raw.replace(/^\[=*\[\r?\n?|\]=*\]$/g,'');
  return node.raw.slice(1,-1).replace(/\\(\d{1,3}|.)/gs,(_,v)=>/^\d+$/.test(v)?String.fromCharCode(Number(v)):({n:'\n',r:'\r',t:'\t',a:'\x07',b:'\b',f:'\f',v:'\v'}[v]??v));
 }
 if(['BooleanLiteral','NumericLiteral','NilLiteral'].includes(node.type))return node.value;
 if(node.type==='UnaryExpression'&&node.operator==='-')return -scalar(node.argument);
 if(node.type==='BinaryExpression'){
  const l=scalar(node.left),r=scalar(node.right);
  if(typeof l==='number'&&typeof r==='number'){
   const operations={'+':()=>l+r,'-':()=>l-r,'*':()=>l*r,'/':()=>l/r};
   return operations[node.operator]?.();
  }
 }
}
function assignment(tree,key){
 const stmt=tree.body.find(n=>['AssignmentStatement','LocalStatement'].includes(n.type)&&n.variables.some(v=>v.name===key));
 return stmt?.init[stmt.variables.findIndex(v=>v.name===key)];
}
const tidy=s=>String(s??'').replace(/[\u{F0000}-\u{FFFFF}]/gu,'').replace(/\s+/g,' ').trim();
const modinfo=ast(await read(betaDir,'modinfo.lua'));
const betaVersion=scalar(assignment(modinfo,'_version'));
const cnInfo=ast(await read(cnDir,'modinfo.lua'));
const cnVersion=scalar(assignment(cnInfo,'version'));
const cnModId=scalar(fields(values(assignment(cnInfo,'mod_dependencies'))[0]).get('workshop'));
if(!betaVersion||!cnVersion||cnModId!=='workshop-3193922031')throw Error('The Chinese patch must target the public beta');
let category='General';
const configs=[];
for(const entry of values(assignment(modinfo,'configuration_options'))){
 let key,title,def,client,options;
 if(entry.type==='CallExpression'){
  const fn=entry.base.name;
  if(fn==='Header'){
   if(scalar(entry.arguments[1])!==false)category=tidy(scalar(entry.arguments[0]));
   continue;
  }
  if(fn==='SkipSpace')continue;
  if(fn!=='BinaryConfig')throw Error('Unknown modinfo helper '+fn);
  [key,title,,def,client]=entry.arguments.map(scalar);
  options=[true,false].map(value=>({title:value?'Enabled':'Disabled',value}));
 }else{
  const f=fields(entry);
  key=scalar(f.get('name'));
  if(key==='')continue;
  title=scalar(f.get('label'));def=scalar(f.get('default'));client=scalar(f.get('client'));
  options=values(f.get('options')).map(o=>({title:tidy(scalar(fields(o).get('description'))),value:scalar(fields(o).get('data'))}));
 }
 if(typeof key!=='string'||typeof title!=='string'||def===undefined||!options.some(o=>o.value===def)||options.some(o=>o.value===undefined))throw Error('Unsupported config entry at line '+entry.loc.start.line+' ('+key+')');
 configs.push({key,title:tidy(title),default:def,client:client===true,options,category,line:entry.loc.start.line});
}
if(!configs.length||new Set(configs.map(c=>c.key)).size!==configs.length)throw Error('Invalid or duplicate configuration rows');
const preset=values(assignment(modinfo,'presets')).map(node=>{
 const f=fields(node);
 const changes=[...fields(f.get('values'))].map(([key,v])=>({key,value:scalar(v)}));
 if(changes.some(c=>c.value===undefined))throw Error('Unresolved preset');
 return {title:scalar(f.get('name')),changes,line:node.loc.start.line};
});

const cnNamesPath='init/init_strings/init_names.lua';
const baseNamesPath='init/init_strings/init_names.lua';
function namesFrom(tree){
 const out={};
 for(const n of tree.body){
  if(n.type!=='AssignmentStatement')continue;
  for(const [i,key] of n.variables.entries()){
   if(key.type!=='MemberExpression'||key.base.name!=='NAMES')continue;
   const label=scalar(n.init[i]);
   if(typeof label==='string'&&label.trim())out[key.identifier.name.toLowerCase()]=tidy(label);
  }
 }
 return out;
}
const baseNames=namesFrom(ast(await read(betaDir,baseNamesPath)));
const cnNames=namesFrom(ast(await read(cnDir,cnNamesPath)));
if(Object.keys(cnNames).length<50)throw Error('The Chinese naming table is missing or changed');
const gameNames={};
const po=await fs.readFile(gamePo);
sourceFiles['dst/chinese_s.po']={sha256:createHash('sha256').update(po).digest('hex')};
for(const [,id,en,zh] of po.toString('utf8').matchAll(/^msgctxt "STRINGS\.NAMES\.([A-Z0-9_]+)"\r?\nmsgid "([^"\r\n]*)"\r?\nmsgstr "([^"\r\n]+)"/gm)){
 gameNames[id.toLowerCase()]={en,zh};
}
if(Object.keys(gameNames).length<500)throw Error('Game localization is missing or changed');

// The game's field guide lists related entities, which may be ingredients,
// habitats or products. Keep that relationship separate from actual drops.
const scrapbookPath='scripts/um_scrapbookdata.lua';
const scrapbookTree=ast(await read(betaDir,scrapbookPath));
const fieldGuide=[];
for(const [id,node] of fields(assignment(scrapbookTree,'data'))){
 let data=node, type, dependencies=[];
 if(node.type==='CallExpression'){
  const fn=node.base.name;
  if(!['CreateBasicEntry','CreateCursedItemData'].includes(fn))throw Error('Unknown scrapbook constructor '+fn);
  const cursed=fn==='CreateCursedItemData';
  type=cursed?'item':scalar(node.arguments[1])??'thing';
  data=node.arguments[cursed?4:3];
  if(cursed)dependencies.push('veteranshrine');
 }
 const properties=fields(data);
 type??=scalar(properties.get('type'));
 if(!type)throw Error('Missing scrapbook type for '+id);
 dependencies.push(...values(properties.get('deps')).map(scalar).filter(Boolean));
 const nameKey=scalar(properties.get('name'))??id;
 fieldGuide.push({id,type,nameKey,related:[...new Set(dependencies)],line:node.loc.start.line});
}
const additionsPath='init/init_scrapbook/additions.lua';
const additions=ast(await read(betaDir,additionsPath));
function addGuide(id,type,related,file,node,details={}){
 if(fieldGuide.some(row=>row.id===id))throw Error('Duplicate scrapbook ID '+id);
 fieldGuide.push({id,type,nameKey:id,related,file,line:node.loc.start.line,...details});
}
for(const [colour,node] of fields(assignment(additions,'crabclaw_gem_colours')))
 addGuide(colour+'gem_cracked','item',[colour+'gem','crabclaw'],additionsPath,node);
for(const [name,node] of fields(assignment(additions,'turfs')))
 addGuide('turf_'+name,'item',['turfcraftingstation',...values(node).map(scalar)],additionsPath,node);
const dishesFile='scripts/um_preparedfoods.lua';
const dishesSource=await read(betaDir,dishesFile);
const dishes=ast(dishesSource);
function addDish(id,node,condition){
 const f=fields(node),chef=scalar(f.get('warly_only'));
 const nutrients=Object.fromEntries(['hunger','health','sanity'].map(k=>[k,scalar(f.get(k))]).filter(([,v])=>typeof v==='number'));
 addGuide(id,'food',chef?['spoiled_food','portablecookpot']:['spoiled_food','cookpot','portablecookpot','archive_cookpot'],dishesFile,node,{nutrients,condition});
}
for(const [id,node] of fields(assignment(dishes,'um_preparedfoods')))addDish(id,node);
for(const stmt of dishes.body.filter(s=>s.type==='IfStatement'))for(const clause of stmt.clauses){
 for(const entry of clause.body){
  const target=entry.variables?.[0];
  if(target?.type==='IndexExpression'&&target.base.name==='um_preparedfoods'){
   if(scalar(target.index)!=='um_kebab'||sourceExpr(clause.condition,dishesSource)!=='UM_CONFIG.BONESTEW_NERF == "bone_appetit"')throw Error('Unknown conditional dish');
   addDish('um_kebab',entry.init[0],'肉汤改动选择 Bone Requirement 时启用');
  }
 }
}
// Also index named entities returned literally by the beta's registered
// prefab files. Visual effects, placers and internal helpers usually lack names.
const knownEntities=new Set(fieldGuide.map(row=>row.id));
const registered=ast(await read(betaDir,'scripts/uncompromising_prefabs.lua'));
for(const file of values(assignment(registered,'prefabs')).map(scalar)){
 const relative='scripts/prefabs/'+file+'.lua';
 let source;
 try{source=await fs.readFile(path.join(betaDir,relative),'utf8');}
 catch(error){if(error.code==='ENOENT')continue;throw error;}
 if(!/\breturn\s+(Prefab|MakeCritter)\s*\(/.test(source))continue;
 const returned=ast(source).body.at(-1);
 if(returned?.type!=='ReturnStatement')continue;
 for(const call of returned.arguments){
  if(call.type!=='CallExpression')continue;
  const critter=file==='figgypet'&&call.base.name==='MakeCritter';
  if(call.base.name!=='Prefab'&&!critter)continue;
  const id=scalar(call.arguments[0]);
  if(!id||knownEntities.has(id)||!(baseNames[id]||cnNames[id]))continue;
  await read(betaDir,relative);
  knownEntities.add(id);
  fieldGuide.push({id,type:critter?'creature':'entity',nameKey:id,related:[],file:relative,line:call.loc.start.line});
 }
}
// Runtime registration also finds constructors using loops, aliases and unpack.
const native=JSON.parse(await fs.readFile(new URL('./native-prefabs.json',import.meta.url)));
if(native.version!==betaVersion)throw Error('Refresh the native prefab registry for '+betaVersion);
// Registered effects and scenery can lack an individual STRINGS.NAMES entry.
const indirectNames={corvushat:'乌鸦帽',goat_lightning:'山羊闪电',mothergoose_tornado:'麋鹿鹅龙卷风',mini_mothergoose_tornado:'小型麋鹿鹅龙卷风',
 cave_entrance_lush:'繁茂洞穴入口',saltpile:'盐堆',um_agonycloud:'痛苦云雾',rootspike:'根刺',sea_shadow:'海上暗影',
 rneshadowskittish:'胆小暗影',moonrock_pillarsmall:'月岩小柱',rnefissure:'梦魇裂隙',blueberrypuddle:'爆汁蓝莓水洼'};
const runtimeNames={};
for(const [file,record] of Object.entries(native.files)){
 if(!record.sha256)continue; // The loader also re-registers a base-game file.
 const source=await read(betaDir,file);
 if(sourceFiles['beta/'+file].sha256!==record.sha256)throw Error('Native registry source changed: '+file);
 const returned=ast(source).body.at(-1);
 for(const [id,label] of Object.entries(record.prefabs)){
  if(label)runtimeNames[id]=label;
  if(knownEntities.has(id)||!(label||cnNames[id]||baseNames[id]||indirectNames[id]))continue;
  if(returned?.type!=='ReturnStatement')throw Error('Missing prefab factory return: '+file);
  addGuide(id,'entity',[],file,returned);
  knownEntities.add(id);
 }
}
// Vanilla targets with an actual mod callback are a separate directory. A callback
// can apply conditionally, so its location alone does not describe the effect.
const nativeIds=new Set(Object.values(native.files).flatMap(f=>Object.keys(f.prefabs)));
for(const [id,refs] of Object.entries(native.callbacks)){
 if(knownEntities.has(id)||nativeIds.has(id)||!gameNames[id])continue;
 const locations=refs.map(ref=>{
  const colon=ref.lastIndexOf(':');
  return {file:ref.slice(0,colon),line:Number(ref.slice(colon+1))};
 });
 for(const loc of locations){
  const value=await read(betaDir,loc.file);
  if(!value.split('\n')[loc.line-1]?.trim())throw Error('Invalid callback source: '+loc.file+' '+loc.line);
 }
 fieldGuide.push({id,nameKey:id,type:'modified',related:[],...locations[0],locations});
 knownEntities.add(id);
}
function sourceExpr(node,source){return node?tidy(source.slice(...node.range)):null;}
// Objects used by a different entity or a world layout need no callback on themselves.
for(const [id,file,line,context] of [
 ['monkeybarrel','scripts/prefabs/um_slimestone_rock.lua',209,'生成带晶洞的黏液岩石时，会在 64 单位内寻找合适的穴居猴桶，并尝试在桶周围 4～5 单位放置岩石。'],
 ['saddle_wathgrithr','init/init_containers.lua',59,'战斗鞍具列在衣柜可收纳物品清单中。'],
 ['moonspiderden','scripts/map/rooms/caves/moonregions.lua',88,'月亮洞穴的对应房间使用 3～4 个破碎蜘蛛洞作为布置内容。'],
 ['eyeplant','init/init_character_changes/wes.lua',30,'眼球草列在韦斯专属老兵诅咒的近距离索敌组中。诅咒开启且符合目标条件时，会在 4 单位内尝试转攻韦斯。'],
]){
 const source=await read(betaDir,file);
 if(!source.split('\n')[line-1]?.includes(id))throw Error('Context source changed: '+id);
 if(!knownEntities.has(id))fieldGuide.push({id,type:'context',nameKey:id,related:[],file,line,context});
}
function member(node,base){
 return node?.type==='MemberExpression'&&node.base.name===base?node.identifier.name:null;
}
const hungerSource=await read(betaDir,'postinit/components/builder.lua');
const hungerKey=ast(hungerSource).body.find(s=>s.variables?.some(v=>sourceExpr(v,hungerSource)==='CHARACTER_INGREDIENT.HUNGER'));
const hungerId=scalar(hungerKey?.init[0]);
if(!hungerId)throw Error('Missing character hunger ingredient');
const recipes=[];
const skipped=[];
const recipeInit='init/init_recipes/init_recipes.lua';
const recipeImports=await read(betaDir,recipeInit);
const betaMain=await read(betaDir,'modmain.lua');
const mode='init/init_gamemodes/init_uncompromising_mode';
const modeInit=await read(betaDir,mode+'.lua');
function constantCondition(node){
 if(!node)return true;
 if(node.type==='UnaryExpression'&&node.operator==='not'){
  const inner=constantCondition(node.argument);
  return typeof inner==='boolean'?!inner:undefined;
 }
 const value=scalar(node);
 return value===undefined?undefined:value!==false&&value!==null;
}
function* reachableStatements(body,source,guards=[]){
 for(const statement of body){
  if(statement.type!=='IfStatement'){
   yield [statement,guards];
   if(statement.type==='ReturnStatement')return;
   continue;
  }
  const preceding=[];
  for(const clause of statement.clauses){
   const fixed=constantCondition(clause.condition);
   if(fixed===false)continue;
   const test=fixed===undefined?sourceExpr(clause.condition,source):null;
   yield* reachableStatements(clause.body,source,[...guards,...preceding.map(t=>'!('+t+')'),...(test?[test]:[])]);
   if(fixed===true)break;
   preceding.push(test);
  }
 }
}
function importGuards(source,entry){
 for(const [statement,guards] of reachableStatements(ast(source).body,source)){
  const call=statement.expression;
  if(statement.type==='CallStatement'&&call.base.name==='modimport'&&scalar(call.arguments[0])===entry)return guards;
 }
 throw Error('No active modimport for '+entry);
}
const loaderGuards=[...importGuards(betaMain,mode),...importGuards(modeInit,'init/init_recipes/init_recipes')];
function scanRecipes(body,source,file,loaderGuards,bindings={}){
 function resolve(node){
  if(node?.type==='Identifier')return bindings[node.name];
  if(node?.type==='IndexExpression')return bindings[node.base.name]?.[resolve(node.index)-1];
  if(node?.type==='BinaryExpression'&&node.operator==='..'){
   const l=resolve(node.left),r=resolve(node.right);
   if(l!==undefined&&r!==undefined)return String(l)+r;
  }
  return scalar(node);
 }
 for(const [statement,guards] of reachableStatements(body,source,loaderGuards)){
  const call=statement.expression;
  if(statement.type!=='CallStatement'||!['AddRecipe2','AddCharacterRecipe'].includes(call.base.name??member(call.base,'env')))continue;
  const [idNode,items,tech,props]=call.arguments;
  const id=resolve(idNode),options=fields(props),line=statement.loc.start.line;
  const ingredients=values(items).map(item=>{
   if(item.base?.name!=='Ingredient')return null;
   const resource=item.arguments[0];
   const key=sourceExpr(resource,source);
   const id=key==='GLOBAL.CHARACTER_INGREDIENT.HUNGER'?hungerId:key==='CHARACTER_INGREDIENT.HEALTH'?'decrease_health':resolve(resource);
   return typeof id==='string'?{id,amount:scalar(item.arguments[1])}:null;
  });
  const dynamic=items?.type!=='TableConstructorExpression'||ingredients.some(i=>!i||typeof i.amount!=='number');
  const techKey=member(tech,'TECH');
  if(!id||dynamic||!techKey){skipped.push({id:id??null,file,line});continue;}
  const count=options.get('numtogive');
  const product=resolve(options.get('product'));
  if(options.has('product')&&!product)throw Error('Unresolved recipe product: '+id);
  recipes.push({id,product:product??id,ingredients,tech:techKey,
   count:count?(scalar(count)??sourceExpr(count,source)):1,
   gates:guards,
   requirements:Object.fromEntries(['builder_tag','builder_skill','no_builder_skill','station_tag','nounlock','testfn','canbuild'].filter(k=>options.has(k)).map(k=>[k,['testfn','canbuild'].includes(k)?true:(scalar(options.get(k))??sourceExpr(options.get(k),source))])),
   file,line});
 }
}
for(const module of ['recipes','recipes_wixie','recipes_ia']){
 const entry='init/init_recipes/'+module,guard=[...loaderGuards,...importGuards(recipeImports,entry)];
 const file=entry+'.lua',source=await read(betaDir,file);
 const {body}=ast(source);
 scanRecipes(body,source,file,guard);
 if(module==='recipes_wixie'){
  const ownRecipes=new Map(recipes.filter(r=>r.file===file).map(r=>[r.id,r]));
  for(const statement of body.filter(node=>node.type==='AssignmentStatement')){
   const [target]=statement.variables;
   if(target.type!=='MemberExpression'||target.base.type!=='IndexExpression'||target.base.base.name!=='AllRecipes')continue;
   const r=ownRecipes.get(scalar(target.base.index)), key=target.identifier.name, value=scalar(statement.init[0]);
   if(!r||!['builder_tag','builder_skill','numtogive'].includes(key)||value===undefined)continue;
   if(key==='numtogive')r.count=value;
   else r.requirements[key]=value;
   (r.overrides??=[]).push(statement.loc.start.line);
  }
 }
}
const wormwoodModule='init/init_character_changes/wormwood';
const wormwoodFile=wormwoodModule+'.lua',wormwoodSource=await read(betaDir,wormwoodFile);
const wormwoodTree=ast(wormwoodSource);
const wormwoodGuards=[...importGuards(betaMain,mode),...importGuards(modeInit,wormwoodModule)];
scanRecipes(wormwoodTree.body,wormwoodSource,wormwoodFile,wormwoodGuards);
const plantTables=Object.fromEntries(['plants_1','plants_2'].map(k=>[k,values(assignment(wormwoodTree,k)).map(scalar)]));
const seedLoop=wormwoodTree.body.find(n=>n.type==='ForGenericStatement'&&n.iterators[0]?.arguments?.[0]?.name==='plants_1');
if(!seedLoop||!plantTables.plants_1.length||plantTables.plants_1.length!==plantTables.plants_2.length)throw Error('Invalid paired seed exchange tables');
for(const [i,v] of plantTables.plants_1.entries()){
 const [index,plant]=seedLoop.variables;
 scanRecipes(seedLoop.body,wormwoodSource,wormwoodFile,wormwoodGuards,{...plantTables,[index.name]:i+1,[plant.name]:v});
}
const changesFile='init/init_recipes/recipe_changes.lua',changesSource=await read(betaDir,changesFile);
const changesGuards=[...loaderGuards,...importGuards(recipeImports,changesFile.slice(0,-4))];
const recipeChanges=[];
for(const [stmt,gates] of reachableStatements(ast(changesSource).body,changesSource,changesGuards)){
 const target=stmt.variables?.[0];
 if(target?.identifier?.name!=='ingredients'||target.base?.base?.name!=='AllRecipes')continue;
 const id=scalar(target.base.index),items=stmt.init[0];
 if(!id||items.type!=='TableConstructorExpression')throw Error('Unknown ingredient override at '+stmt.loc.start.line);
 const ingredients=values(items).map(item=>{
  if(item.base?.name!=='Ingredient'||typeof scalar(item.arguments[0])!=='string')throw Error('Unknown ingredient at '+item.loc.start.line);
  return {id:scalar(item.arguments[0]),amount:scalar(item.arguments[1])??sourceExpr(item.arguments[1],changesSource)};
 });
 recipeChanges.push({id,ingredients,gates,file:changesFile,line:stmt.loc.start.line});
}
await read(betaDir,'init/init_configs.lua');
const geodeDefinitions=ast(await read(betaDir,'scripts/um_gemology_geode_defs.lua'));
const geodePools=Object.fromEntries([...fields(assignment(geodeDefinitions,'GEODE_LOOT_TABLE'))].map(([prefab,node])=>{
 const pool=Object.fromEntries([...fields(fields(node).get('gemloot'))].map(([item,weight])=>[item,scalar(weight)]));
 if(!Object.keys(pool).length||Object.values(pool).some(weight=>!Number.isFinite(weight)||weight<=0))throw Error('Unsupported geode loot table '+prefab);
 return [prefab,pool];
}));
const artworkIds=itemGroups.flatMap(g=>g.ids);
const articleArtIds=[...new Set(articles.flatMap(a=>[a.icon??a.prefab,...a.sections.flatMap(([, ,guide])=>guide?.prefabs??[])].filter(Boolean)))].sort();
const usedNames=new Set([...artworkIds,...articleArtIds,...recipeChanges.flatMap(r=>[r.id,...r.ingredients.map(i=>i.id)]),...recipes.flatMap(r=>[r.id,r.product,...r.ingredients.map(i=>i.id)]),...fieldGuide.flatMap(row=>[row.id,row.nameKey,...row.related])]);
// The 6.0.3.9 ammo rename retains the Chinese patch's existing player-facing term.
const cnNameAliases={um_slingshotammo_honey:'slingshotammo_honey'};
const names=Object.fromEntries([...usedNames].sort().map(id=>{
 const game=gameNames[id]??{};
 return [id,{en:baseNames[id]??game.en??runtimeNames[id]??id,zh:cnNames[id]??cnNames[cnNameAliases[id]]??game.zh??indirectNames[id]??null}];
}));
const activeLines=new Map();
const validatedCitations=new Map();
const inactiveCitations=[];
for(const [article,source] of articles.flatMap(a=>a.sources.map(s=>[a.id,s]))){
 const dir=source.kind==='cn'?cnDir:betaDir;
 const key=(source.kind??'beta')+'/'+source.file;
 if(!activeLines.has(key)){
  const value=await read(dir,source.file);
  const parts=[];
  let cursor=0;
  for(const {range:[start,end]} of ast(value,true).comments){
   parts.push(value.slice(cursor,start),value.slice(start,end).replace(/[^\r\n]/g,' '));
   cursor=end;
  }
  parts.push(value.slice(cursor));
  activeLines.set(key,parts.join('').split('\n').map(line=>Boolean(line.trim())));
 }
 if(!activeLines.get(key)[source.line-1]){
  inactiveCitations.push(article+' '+key+':'+source.line);
  continue;
 }
 if(!validatedCitations.has(key))validatedCitations.set(key,new Set());
 validatedCitations.get(key).add(source.line);
}
if(inactiveCitations.length)throw Error('Citations must point to code, not comments or blank lines:\n'+inactiveCitations.join('\n'));
for(const [key,lines] of validatedCitations)sourceFiles[key].citations=[...lines].sort((a,b)=>a-b);
const result={betaVersion,cnVersion,configs,preset,recipes,recipeChanges,skipped,names,artworkIds,articleArtIds,geodePools,fieldGuide,sourceFiles:Object.fromEntries(Object.entries(sourceFiles).sort())};
const json=JSON.stringify(result,null,2)+'\n';
if(check){
 const current=await fs.readFile(resultFile,'utf8');
 if(current!==json){
  const prior=JSON.parse(current);
  const changed=Object.keys({...prior.sourceFiles,...result.sourceFiles}).filter(key=>prior.sourceFiles[key]?.sha256!==result.sourceFiles[key]?.sha256);
  console.error('Snapshot differs. Review these sources before updating:',changed.join(', ')||'extractor output');
  process.exitCode=1;
 }
}else await fs.writeFile(resultFile,json);
console.log(`Beta ${betaVersion}, CN ${cnVersion}: ${configs.length} settings, ${recipes.length} literal recipe registrations, ${Object.keys(names).length} names, ${skipped.length} recipe registrations require manual review.`);
