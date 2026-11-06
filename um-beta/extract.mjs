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
async function read(dir,file){
 const bytes=await fs.readFile(path.join(dir,file));
 const value=bytes.toString('utf8').replace(/^\uFEFF/,'');
 sourceFiles[(dir===betaDir?'beta':'cn')+'/'+file]={sha256:createHash('sha256').update(bytes).digest('hex'),lines:value.split('\n').length};
 return value;
}
const ast=source=>lua.parse(source,{locations:true,ranges:true,comments:false,luaVersion:'5.1'});
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
function sourceExpr(node,source){return node?tidy(source.slice(...node.range)):null;}
function member(node,base){
 return node?.type==='MemberExpression'&&node.base.name===base?node.identifier.name:null;
}
const recipes=[];
const skipped=[];
const recipeInit='init/init_recipes/init_recipes.lua';
const recipeImports=await read(betaDir,recipeInit);
const betaMain=await read(betaDir,'modmain.lua');
const mode='init/init_gamemodes/init_uncompromising_mode';
const modeInit=await read(betaDir,mode+'.lua');
if(!betaMain.includes('modimport("'+mode+'")')||!modeInit.includes('modimport("init/init_recipes/init_recipes")'))throw Error('Recipe loader changed; inspect modmain.lua and '+mode+'.lua');
function scanRecipes(body,source,file,guards=[]){
 for(const statement of body){
  if(statement.type==='IfStatement'){
   const preceding=[];
   for(const clause of statement.clauses){
    const test=sourceExpr(clause.condition,source);
    scanRecipes(clause.body,source,file,[...guards,...preceding.map(t=>'!('+t+')'),...(test?[test]:[])]);
    if(test)preceding.push(test);
   }
   continue;
  }
  const call=statement.expression;
  if(statement.type!=='CallStatement'||!['AddRecipe2','AddCharacterRecipe'].includes(call.base.name))continue;
  const [idNode,items,tech,props]=call.arguments;
  const id=scalar(idNode),options=fields(props),line=statement.loc.start.line;
  const ingredients=values(items).map(item=>item.base?.name==='Ingredient'&&typeof scalar(item.arguments[0])==='string'?
   {id:scalar(item.arguments[0]),amount:scalar(item.arguments[1])}:null);
  const dynamic=items?.type!=='TableConstructorExpression'||ingredients.some(i=>!i||typeof i.amount!=='number');
  const techKey=member(tech,'TECH');
  if(!id||dynamic||!techKey){skipped.push({id:id??null,file,line});continue;}
  const count=options.get('numtogive');
  recipes.push({id,product:scalar(options.get('product'))??id,ingredients,tech:techKey,
   count:count?(scalar(count)??sourceExpr(count,source)):1,
   gates:guards,
   requirements:Object.fromEntries(['builder_tag','builder_skill','no_builder_skill','station_tag','nounlock','testfn'].filter(k=>options.has(k)).map(k=>[k,k==='testfn'?true:(scalar(options.get(k))??sourceExpr(options.get(k),source))])),
   file,line});
 }
}
for(const [module,guard] of [['recipes',[]],['recipes_wixie',['UM_CONFIG.WIXIE_WALTER']],['recipes_ia',[]]]){
 if(!recipeImports.includes('modimport("init/init_recipes/'+module+'")'))throw Error('Recipe import changed for '+module);
 const file='init/init_recipes/'+module+'.lua',source=await read(betaDir,file);
 scanRecipes(ast(source).body,source,file,guard);
}
await read(betaDir,'init/init_recipes/recipe_changes.lua');
await read(betaDir,'init/init_configs.lua');
const artworkIds=itemGroups.flatMap(g=>g.ids);
const usedNames=new Set([...artworkIds,...recipes.flatMap(r=>[r.id,r.product,...r.ingredients.map(i=>i.id)])]);
const names=Object.fromEntries([...usedNames].sort().map(id=>{
 const game=gameNames[id]??{};
 return [id,{en:baseNames[id]??game.en??id,zh:cnNames[id]??game.zh??null}];
}));
for(const source of articles.flatMap(a=>a.sources)){
 const dir=source.kind==='cn'?cnDir:betaDir;
 const key=(source.kind??'beta')+'/'+source.file;
 if(!sourceFiles[key])await read(dir,source.file);
 if(source.line<1||sourceFiles[key].lines<source.line)throw Error('Invalid source line '+key+':'+source.line);
}
const result={betaVersion,cnVersion,configs,preset,recipes,skipped,names,artworkIds,sourceFiles:Object.fromEntries(Object.entries(sourceFiles).sort())};
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
