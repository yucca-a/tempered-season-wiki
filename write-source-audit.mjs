// Records which mod source files the current release-refreshed articles were checked against.
// Run after `node build.mjs` once the articles have been reviewed against the local source:
//   node write-source-audit.mjs [--mod-root <content dir>]
// check.mjs (with WIKI_TEMPERED_SOURCE set) then reports any source file that changed since.
import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';

const wiki=path.dirname(fileURLToPath(import.meta.url));
const repo=path.resolve(wiki,'..');
const flag=process.argv.indexOf('--mod-root');
const modRoot=flag>0?path.resolve(process.argv[flag+1]):path.join(repo,'content');
const provenance=JSON.parse(await fs.readFile(path.join(wiki,'content-sources.json'),'utf8'));
const configs=JSON.parse(await fs.readFile(path.join(wiki,'data/configs.json'),'utf8'));
if(provenance.version!==configs.version)throw Error(`Build first: content-sources.json is ${provenance.version}, configuration snapshot is ${configs.version}`);
const targeted=new Set(provenance.targetedRefresh);
const articles=provenance.articles.filter(a=>targeted.has(a.id));
const files={};
for(const file of [...new Set(articles.flatMap(a=>a.source))].filter(f=>f.startsWith('content/')).sort()){
  try{
    const data=await fs.readFile(path.join(modRoot,file.slice('content/'.length)));
    files[file]={sha256:createHash('sha256').update(data).digest('hex'),bytes:data.length};
  }catch(e){if(e.code!=='ENOENT')throw e;}
}
const audit={version:configs.version,checkedAt:provenance.checkedAt,
  method:`Cumulative targeted articles and their source fingerprints in the ${configs.version} source. Each article retains its own review version.`,
  articles,files};
await fs.writeFile(path.join(wiki,'data/release-sources.json'),JSON.stringify(audit,null,2)+'\n');
console.log(`Recorded ${articles.length} articles and ${Object.keys(files).length} source files for ${configs.version}.`);
