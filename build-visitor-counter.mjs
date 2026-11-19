import { copyFile, readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const output = fileURLToPath(new URL('./dist/', import.meta.url));
const counter = '<div data-wiki-visitor-count hidden title="按浏览器统计，每日按北京时间划分"></div>';
const script = '<script src="/visitor-counter.js" defer></script>';
const stylesheet = '<link rel="stylesheet" href="/visitor-counter.css">';

for (const entry of await readdir(output, { recursive: true, withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith('.html')) continue;
    const filename = join(entry.parentPath, entry.name);
    const html = await readFile(filename, 'utf8');
    const withCounter = html.includes('</footer>')
        ? html.replace('</footer>', counter + '</footer>')
        : html.replace('</body>', '<footer class="site-footer">' + counter + '</footer></body>');
    await writeFile(filename, withCounter
        .replace('</head>', stylesheet + '</head>')
        .replace('</body>', script + '</body>'));
}

await copyFile(new URL('./src/visitor-counter.js', import.meta.url), join(output, 'visitor-counter.js'));
await copyFile(new URL('./src/visitor-counter.css', import.meta.url), join(output, 'visitor-counter.css'));
