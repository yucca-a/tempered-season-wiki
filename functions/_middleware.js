const legacyHosts = new Set(['cuilian-wiki.pages.dev', 'yuccawiki.pages.dev']);

export function onRequest({ request, next }) {
    const url = new URL(request.url);
    if (!legacyHosts.has(url.hostname)) return next();

    url.protocol = 'https:';
    url.hostname = 'wiki.yucca-a.com';
    url.port = '';
    return Response.redirect(url, 301);
}
