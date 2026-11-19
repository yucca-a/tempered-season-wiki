const hostname = 'wiki.yucca-a.com';
const visitorId = /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/;
const beijingDay = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Shanghai', dateStyle: 'short' });
const headers = { 'Cache-Control': 'no-store' };

export async function onRequestPost({ request, env }) {
    const url = new URL(request.url);
    if (url.hostname !== hostname || request.headers.get('Origin') !== url.origin) {
        return new Response(null, { status: 403, headers });
    }

    let visitor;
    try {
        const body = await request.json();
        visitor = body?.visitor;
    } catch {
        return new Response(null, { status: 400, headers });
    }
    if (typeof visitor !== 'string' || !visitorId.test(visitor)) {
        return new Response(null, { status: 400, headers });
    }

    const day = beijingDay.format(new Date());
    const db = env.WIKI_VISITORS;
    const [, counts] = await db.batch([
        db.prepare(`
            INSERT INTO wiki_visitors (id, last_day) VALUES (?, ?)
            ON CONFLICT (id) DO UPDATE SET last_day = excluded.last_day
            WHERE excluded.last_day > wiki_visitors.last_day
        `).bind(visitor, day),
        db.prepare(`
            SELECT
                COALESCE((SELECT count FROM wiki_visitor_counts WHERE bucket = ?), 0) AS today,
                COALESCE((SELECT count FROM wiki_visitor_counts WHERE bucket = 'total'), 0) AS total
        `).bind(day),
    ]);
    return Response.json(counts.results[0], { headers });
}
