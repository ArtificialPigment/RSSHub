/**
 * 新站接入探测脚本
 *
 * 用法：pnpm exec tsx scripts/probe-site.ts <列表页 URL>
 *
 * 输出：
 * 1. HTTP 状态、Content-Type、meta 声明的编码（判断是否需要 encoding: 'gbk'）
 * 2. 页面中所有"包含 ≥5 个链接的容器"，给出 CSS 选择器路径、链接数、前几条样例
 * 3. 列表项附近疑似日期的文本片段
 *
 * 根据输出人工选定 SiteConfig 的 list.item / list.link / list.date，
 * 详情页选择器需再对某一篇文章页运行本脚本确认。
 */
import { load } from 'cheerio';
import iconv from 'iconv-lite';

// CLI 输出辅助（oxlint no-console 规则下 CLI 脚本用 process.stdout 输出）
const out = (...args: unknown[]) => process.stdout.write(args.map(String).join(' ') + '\n');
const err = (...args: unknown[]) => process.stderr.write(args.map(String).join(' ') + '\n');

const url = process.argv[2];
if (!url) {
    err('用法: pnpm exec tsx scripts/probe-site.ts <url>');
    process.exit(1);
}

const response = await fetch(url, {
    headers: { 'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36' },
});
out(`HTTP ${response.status} ${response.statusText}`);
const contentType = response.headers.get('content-type') ?? '';
out(`Content-Type: ${contentType}`);

const buffer = Buffer.from(await response.arrayBuffer());

// 编码检测：headers 优先，其次 <meta charset>，默认 utf-8
let encoding = contentType.match(/charset=([\w-]+)/i)?.[1]?.toLowerCase();
if (!encoding) {
    const head = buffer.subarray(0, 4096).toString('latin1');
    encoding = head.match(/<meta[^>]+charset=["']?([\w-]+)/i)?.[1]?.toLowerCase();
}
out(`编码: ${encoding ?? '未声明（按 utf-8 处理）'}`);

const html = iconv.decode(buffer, encoding ?? 'utf-8');
const $ = load(html);
out(`标题: ${$('title').text().trim()}\n`);

// 构造元素的简洁 CSS 路径（tag + 第一个 class 或 id）
function selectorOf(el: cheerio.Element): string {
    const parts: string[] = [];
    let current: cheerio.Element | null = el;
    while (current && current.type === 'tag' && current.name !== 'body') {
        const $el = $(current);
        const id = $el.attr('id');
        const cls = ($el.attr('class') ?? '').trim().split(/\s+/, 1)[0];
        parts.unshift(id ? `#${id}` : cls ? `${current.name}.${cls}` : current.name);
        current = current.parent as cheerio.Element | null;
    }
    return parts.join(' > ');
}

// 找"链接容器"：直接包含 ≥5 个带文本链接的元素
const seen = new Set<string>();
const containers: Array<{ selector: string; count: number; samples: string[]; dates: string[] }> = [];

$('ul, table, div, section').each((_, el) => {
    const $el = $(el);
    const links = $el.children().find('a[href]').addBack('a[href]');
    // 统计"直接子元素中的链接"，避免嵌套容器重复计算
    const directLinks = $el.children().filter((_, child) => $(child).find('a[href]').length > 0 || child.name === 'a');
    if (directLinks.length < 5 || links.length < 5) {
        return;
    }
    const selector = selectorOf(el);
    if (seen.has(selector)) {
        return;
    }
    seen.add(selector);

    const samples: string[] = [];
    const dates: string[] = [];
    directLinks.slice(0, 3).each((_, child) => {
        const $child = $(child);
        const $a = child.name === 'a' ? $child : $child.find('a[href]').first();
        samples.push(`"${$a.text().trim().slice(0, 30)}" → ${$a.attr('href')}`);
        const dateMatch = $child.text().match(/\d{4}[-年/.]\d{1,2}[-月/.]\d{1,2}/);
        if (dateMatch) {
            dates.push(dateMatch[0]);
        }
    });

    containers.push({ selector, count: directLinks.length, samples, dates });
});

containers.sort((a, b) => b.count - a.count);
out(`=== 候选列表容器（共 ${containers.length} 个，按链接数排序，最多显示 5 个）===`);
for (const c of containers.slice(0, 5)) {
    out(`\n[${c.count} 项] ${c.selector}`);
    for (const s of c.samples) {
        out(`  ${s}`);
    }
    if (c.dates.length > 0) {
        out(`  日期样例: ${c.dates.join(', ')}`);
    }
}

if (containers.length === 0) {
    out('未找到明显的列表容器——可能需要 JS 渲染（考虑 playwright-fetch）或站点结构特殊。');
    out('正文中链接总数:', $('a[href]').length);
}
