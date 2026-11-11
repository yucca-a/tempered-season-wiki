import fs from 'node:fs';

// Keep game names, mod names and player nicknames distinct. Never translate prefab IDs.
export const terminology = JSON.parse(fs.readFileSync(new URL('./data/terminology.json', import.meta.url), 'utf8'));
const byPrefab = new Map(terminology.terms.map(term => [term.prefab, term]));
const replacements = new Map(terminology.corrections.map(({from, to}) => [from, to]));
const tokens = [...new Set([
  ...replacements.keys(), ...terminology.protectedNames,
  ...terminology.terms.map(term => term.zh),
])].filter(Boolean).sort((a, b) => b.length - a.length);
const escapeRegex = text => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const expression = new RegExp(tokens.map(escapeRegex).join('|'), 'gu');

export function canonicalText(text) {
  return typeof text === 'string' ? text.replace(expression, token => replacements.get(token) ?? token) : text;
}

// IDs, citations, raw configuration keys, URLs and searchable former names stay intact.
const rawKeys = new Set(['id', 'prefab', 'prefabs', 'icon', 'source', 'sources', 'configKeys', 'configs', 'key', 'value', 'default', 'aliases', 'keywords', 'href', 'url', 'file', 'variantPrefabs', 'rowAnchors']);
export function canonicalDocument(value) {
  if (typeof value === 'string') return canonicalText(value);
  if (Array.isArray(value)) return value.map(canonicalDocument);
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(Object.entries(value).map(([key, content]) => [key, rawKeys.has(key) ? content : canonicalDocument(content)]));
}

export function localizedName(prefab, fallback, branch = 'tempered') {
  return terminology.branchNames[branch]?.[prefab] ?? byPrefab.get(prefab)?.zh ?? canonicalText(fallback);
}

export function applyArticleTerminology(articles, branch = 'tempered') {
  for (const article of articles) {
    const formerTitle = article.title;
    Object.assign(article, canonicalDocument(article));
    const ids = terminology.articleEntities[branch]?.[article.id] ?? [];
    const terms = ids.map(id => byPrefab.get(id)).filter(Boolean);
    const aliases = [...(article.aliases ?? [])];
    for (const term of terms) aliases.push(term.zh, ...(term.aliases ?? []), term.en);
    article.aliases = [...new Set(aliases)].filter(alias => alias && !article.title.includes(alias));
    article.keywords = [...new Set([article.keywords, formerTitle !== article.title ? formerTitle : '',
      ...terms.flatMap(term => [term.prefab, term.zh, term.en, ...(term.searchTerms ?? [])])].filter(Boolean).flatMap(text => text.split(/\s+/u)))].join(' ');
  }
}
