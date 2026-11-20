// Post-build pass: 404 page, canonical/share metadata, asset versions, sitemap, robots and cache headers.
import {createHash} from 'node:crypto';
import {readdir,readFile,writeFile} from 'node:fs/promises';
import {join,relative,dirname,posix} from 'node:path';
import {fileURLToPath} from 'node:url';
import {wikiStylesFilename} from './ui.mjs';

export const siteOrigin='https://wiki.yucca-a.com';
const out=fileURLToPath(new URL('./dist/',import.meta.url));
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// Pages that only forward old links: keep them reachable but out of search results.
const forwardingPages=new Set(['um-beta/items.html']);

// Served for every missing path at any depth, so every URL here is root-absolute.
const notFound=`<!doctype html>
<html lang="zh-CN">
<head>
 <meta charset="utf-8">
 <meta name="viewport" content="width=device-width,initial-scale=1">
 <meta name="color-scheme" content="light dark">
 <meta name="robots" content="noindex">
 <title>页面不存在 · 饥荒联机版模组 Wiki</title>
 <link rel="icon" type="image/svg+xml" href="/assets/wiki-favicon.svg">
 <link rel="stylesheet" href="/${wikiStylesFilename}">
 <link rel="stylesheet" href="/hub.css">
 <script src="/theme.js"></script>
</head>
<body data-wiki="hub">
 <main class="hub-main not-found" id="main">
  <div class="hub-intro">
   <h1>这一页走丢了</h1>
   <p>链接可能写错了，也可能是词条改过名。换个入口找找：</p>
  </div>
  <nav class="hub-library-links not-found-links" aria-label="常用入口">
   <a href="/index.html">Wiki 总览</a>
   <a href="/tempered-home.html">淬炼之季主页</a>
   <a href="/tempered.html#encyclopedia">淬炼之季全部词条</a>
   <a href="/settings.html">淬炼之季配置大全</a>
   <a href="/um-beta/index.html">永不妥协测试版</a>
  </nav>
 </main>
</body>
</html>`;
await writeFile(join(out,'404.html'),notFound);

const files=(await readdir(out,{recursive:true})).map(f=>f.replaceAll('\\','/'));
const hashes=new Map();
async function versionOf(target){
 if(!hashes.has(target)){
  try{hashes.set(target,createHash('sha256').update(await readFile(join(out,target))).digest('hex').slice(0,10));}
  catch{hashes.set(target,null);}
 }
 return hashes.get(target);
}
// Append ?v=<content hash> to every local script, stylesheet and search index reference.
async function versionAssets(file,html){
 const replacements=[];
 for(const match of html.matchAll(/\b(src|href|data-index)="([^"?#]+\.(?:js|css))(?:\?v=[^"]*)?"/g)){
  const [whole,attr,url]=match;
  if(/^[a-z]+:|^\/\//i.test(url))continue;
  const target=url.startsWith('/')?url.slice(1):posix.normalize(posix.join(posix.dirname(file),url));
  const version=await versionOf(target);
  if(version)replacements.push([whole,`${attr}="${url}?v=${version}"`]);
 }
 for(const [from,to] of replacements)html=html.replace(from,to);
 return html;
}
const pageUrl=file=>siteOrigin+'/'+file.replace(/(^|\/)index\.html$/,'$1').replace(/\.html$/,'');
const meta=(html,name)=>html.match(new RegExp(`<meta name="${name}" content="([^"]*)"`))?.[1];

const sitemap=[];
for(const file of files.filter(f=>f.endsWith('.html'))){
 let html=await readFile(join(out,file),'utf8');
 if(file!=='404.html'){
  const url=pageUrl(file);
  const title=html.match(/<title>([^<]*)<\/title>/)?.[1]??'';
  const description=meta(html,'description')??'';
  const image=siteOrigin+(file.startsWith('um-beta/')?'/assets/um-beta/cover.png':'/assets/workshop-cover.png');
  const tags=[
   `<link rel="canonical" href="${url}">`,
   `<meta property="og:type" content="${file.endsWith('index.html')?'website':'article'}">`,
   `<meta property="og:site_name" content="饥荒联机版模组 Wiki">`,
   `<meta property="og:title" content="${title}">`,
   description?`<meta property="og:description" content="${description}">`:'',
   `<meta property="og:url" content="${url}">`,
   `<meta property="og:image" content="${image}">`,
   `<meta property="og:locale" content="zh_CN">`,
   `<meta name="twitter:card" content="summary">`,
  ];
  if(forwardingPages.has(file))tags.push('<meta name="robots" content="noindex">');
  else sitemap.push(url);
  if(!html.includes('rel="canonical"'))html=html.replace('</head>',tags.join('')+'</head>');
 }
 await writeFile(join(out,file),await versionAssets(file,html));
}

await writeFile(join(out,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemap.sort().map(url=>` <url><loc>${esc(url)}</loc></url>`).join('\n')}\n</urlset>\n`);
await writeFile(join(out,'robots.txt'),`User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${siteOrigin}/sitemap.xml\n`);
// Every local script and stylesheet reference carries ?v=, so they can be cached for a long time.
await writeFile(join(out,'_headers'),`/*.js
  Cache-Control: public, max-age=31536000, immutable
/*.css
  Cache-Control: public, max-age=31536000, immutable
/assets/*
  Cache-Control: public, max-age=604800
/*.html
  Cache-Control: public, max-age=0, must-revalidate
/
  Cache-Control: public, max-age=0, must-revalidate
`);
console.log(`Site metadata: ${sitemap.length} pages in sitemap, ${[...hashes.values()].filter(Boolean).length} versioned assets, 404 page.`);
