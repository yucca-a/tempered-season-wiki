// node editorial-cli.mjs export <id>…  writes a starting draft from the current patched article.
// node editorial-cli.mjs basis <id>… [--write]  prints (or writes) the current basis after merging new facts.
// node editorial-cli.mjs status        lists rewritten, stale and remaining articles.
import fs from 'node:fs';
import {exportEditorial,editorialDir,parseEditorial} from './editorial.mjs';
globalThis.WIKI_EDITORIAL_SKIP=true;
const {articles,editorialState}=await import('./catalog.mjs');
// Basis is taken before terminology normalisation, exactly where the build applies editorials.
const basisOf=a=>editorialState.bases[a.id];
const [command,...ids]=process.argv.slice(2).filter(a=>a!=='--write');
const existing=id=>fs.existsSync(new URL(id+'.md',editorialDir));
if(command==='status'){
 const done=articles.filter(a=>existing(a.id));
 const stale=done.filter(a=>parseEditorial(fs.readFileSync(new URL(a.id+'.md',editorialDir),'utf8'),a.id).basis!==basisOf(a));
 console.log(`rewritten ${done.length}/${articles.length}; stale: ${stale.map(a=>a.id).join(' ')||'none'}`);
 console.log('remaining:',articles.filter(a=>!existing(a.id)).map(a=>a.id).join(' '));
}else for(const id of ids){
 const article=articles.find(a=>a.id===id);if(!article)throw Error('No article '+id);
 if(command==='export'){
  if(existing(id))throw Error(`editorial/${id}.md exists; edit it instead`);
  fs.mkdirSync(editorialDir,{recursive:true});
  fs.writeFileSync(new URL(id+'.md',editorialDir),exportEditorial(article,basisOf(article)));console.log('wrote editorial/'+id+'.md');
 }else if(command==='basis'){
  const file=new URL(id+'.md',editorialDir);
  if(process.argv.includes('--write')&&fs.existsSync(file)){fs.writeFileSync(file,fs.readFileSync(file,'utf8').replace(/<!--\s*basis:\s*[0-9a-f]+\s*-->/,`<!-- basis: ${basisOf(article)} -->`));console.log('updated',id);}
  else console.log(id,basisOf(article));
 }
 else throw Error('usage: node editorial-cli.mjs export|basis <id>… | status');
}
