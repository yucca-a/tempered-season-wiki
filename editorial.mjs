// Hand-edited article text. Each editorial/<id>.md replaces the summary and sections that the
// research and release patches produced, so player-facing prose is written in one readable place.
//
// File format (see editorial/README.md):
//   <!-- basis: <hash> -->      fingerprint of the patched article this text was written from
//   First paragraph             summary shown under the title and in search
//   ## Section title
//   ### Sub-heading              smaller heading inside a section
//   > Callout text               highlighted tip at the top of the section
//   Paragraphs                   separated by blank lines
//   | table | rows |             header row, separator row, body rows
//   - list item
//   ※ Note                      collapsed "考据备注" for source details players rarely need
//   @相关 article-id …           related article buttons
//   @站内 [label](url)           links into the other wiki
//   @外链 [label](url)           external links
import fs from 'node:fs';
import {createHash} from 'node:crypto';

const dir=new URL('./editorial/',import.meta.url);
export const basisOf=article=>createHash('sha256').update(JSON.stringify({summary:article.summary,sections:article.sections})).digest('hex').slice(0,12);

export function parseEditorial(text,id){
 const fail=message=>{throw Error(`editorial/${id}.md: ${message}`);};
 const basis=text.match(/<!--\s*basis:\s*([0-9a-f]+)\s*-->/)?.[1]??fail('missing basis comment');
 const blocks=text.replace(/<!--[\s\S]*?-->/g,'').replace(/\r/g,'').split(/\n{2,}/).map(b=>b.trim()).filter(Boolean);
 let summary='',section=null;const sections=[];
 const links=raw=>[...raw.matchAll(/\[([^\]]+)\]\(([^)\s]+)\)/g)].map(([,label,url])=>({label,url}));
 const cells=line=>line.trim().replace(/^\||\|$/g,'').split('|').map(c=>c.trim());
 for(const block of blocks){
  if(block.startsWith('## ')){
   const [heading,...rest]=block.split('\n');
   section={title:heading.slice(3).trim()};sections.push(section);
   if(rest.length)fail(`put a blank line after "${heading}"`);
   continue;
  }
  if(!section){if(summary)fail('only one summary paragraph is allowed before the first section');summary=block.replace(/\n/g,'');continue;}
  const body=block.split('\n').filter(l=>!l.startsWith('@'));
  for(const line of block.split('\n').filter(l=>l.startsWith('@'))){
   const [, kind, rest]=line.match(/^@(\S+)\s+(.*)$/)??fail('bad directive '+line);
   if(kind==='相关')section.links=[...(section.links??[]),...rest.split(/\s+/).filter(Boolean)];
   else if(kind==='站内')section.wikiLinks=[...(section.wikiLinks??[]),...links(rest)];
   else if(kind==='外链')section.externalLinks=[...(section.externalLinks??[]),...links(rest)];
   else fail('unknown directive @'+kind);
  }
  if(!body.length)continue;
  section.body??=[];
  if(body.every(l=>l.startsWith('※'))){section.notes=[...(section.notes??[]),...body.map(l=>l.slice(1).trim())];continue;}
  if(body[0].startsWith('> ')){if(section.callout||section.body.length)fail(`callout must open section "${section.title}"`);section.callout=body.map(l=>l.replace(/^>\s?/,'')).join('');continue;}
  if(body.length===1&&body[0].startsWith('### ')){section.body.push({heading:body[0].slice(4).trim()});continue;}
  if(body[0].startsWith('|')){
   if(body.length<3||!/^\|?\s*:?-{3,}/.test(body[1]))fail(`table in "${section.title}" needs a header and separator row`);
   const headers=cells(body[0]),rows=body.slice(2).map(cells);
   if(rows.some(r=>r.length!==headers.length))fail(`table row width differs from header in "${section.title}"`);
   section.body.push({headers,rows});section.table??={headers,rows};continue;
  }
  if(body[0].startsWith('- ')){
   const items=[];for(const l of body){if(l.startsWith('- '))items.push(l.slice(2).trim());else items[items.length-1]+=l.trim();}
   section.body.push({items});section.list=[...(section.list??[]),...items];continue;
  }
  const text=body.join('');
  section.body.push({text});section.paragraphs=[...(section.paragraphs??[]),text];
 }
 if(!summary)fail('missing summary paragraph');
 if(!sections.length)fail('no sections');
 return {basis,summary,sections};
}

export const editorialDir=dir;
export function exportEditorial(article,basis=basisOf(article)){
 const out=[`<!-- basis: ${basis} -->`,'',article.summary,''];
 for(const s of article.sections){
  out.push('## '+s.title,'');
  if(s.callout)out.push('> '+s.callout,'');
  for(const p of s.paragraphs??[])out.push(p,'');
  if(s.table)out.push('| '+s.table.headers.join(' | ')+' |','|'+s.table.headers.map(()=>' --- |').join(''),...s.table.rows.map(r=>'| '+r.map(c=>String(c).replace(/\|/g,'／')).join(' | ')+' |'),'');
  if(s.list?.length)out.push(...s.list.map(i=>'- '+i),'');
  if(s.notes?.length)out.push(...s.notes.map(n=>'※ '+n),'');
  const directives=[s.links?.length&&'@相关 '+s.links.join(' '),s.wikiLinks?.length&&'@站内 '+s.wikiLinks.map(l=>`[${l.label}](${l.url})`).join(' '),s.externalLinks?.length&&'@外链 '+s.externalLinks.map(l=>`[${l.label}](${l.url})`).join(' ')].filter(Boolean);
  if(directives.length)out.push(...directives,'');
 }
 return out.join('\n');
}

// Returns ids whose editorial text was written against different patched content.
export function applyEditorials(articles){
 const stale=[],applied=[];
 let files=[];try{files=fs.readdirSync(dir).filter(f=>f.endsWith('.md')&&f!=='README.md');}catch(e){if(e.code!=='ENOENT')throw e;}
 for(const file of files){
  const id=file.slice(0,-3),article=articles.find(a=>a.id===id);
  if(!article)throw Error(`editorial/${file}: no article with id ${id}`);
  const edit=parseEditorial(fs.readFileSync(new URL(file,dir),'utf8'),id);
  if(edit.basis!==basisOf(article))stale.push(id);
  article.summary=edit.summary;article.sections=edit.sections;article.editorial=true;
  applied.push(id);
 }
 return {applied,stale};
}
