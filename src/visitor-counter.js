async function showWikiVisitorCount() {
    const counter = document.querySelector('[data-wiki-visitor-count]');
    if (!counter || location.hostname !== 'wiki.yucca-a.com') return;

    const storageKey = 'wiki-visitor-id';
    let visitor = localStorage.getItem(storageKey);
    if (!visitor) {
        visitor = crypto.randomUUID();
        localStorage.setItem(storageKey, visitor);
    }

    const response = await fetch('/api/visitors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visitor }),
    });
    if (!response.ok) return;

    const { today, total } = await response.json();
    if (!Number.isSafeInteger(today) || !Number.isSafeInteger(total)) return;
    const number = new Intl.NumberFormat('zh-CN');
    counter.textContent = `今日访客 ${number.format(today)} · 累计访客 ${number.format(total)}`;
    counter.hidden = false;
}

showWikiVisitorCount().catch(() => {
    // The Wiki remains readable if storage or the counter is unavailable.
});
