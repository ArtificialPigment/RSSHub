import { load } from 'cheerio';

import type { Data, DataItem, Route } from '@/types';
import cache from '@/utils/cache';
import { cleanContent } from '@/utils/generic-site/clean';
import ofetch from '@/utils/ofetch';

// 四川大学锦江学院外国语学院（https://wgy.scujj.edu.cn，民办独立学院子站）
// 探测日期 2026-10-14：UTF-8。ASP.NET WebForms 站（__VIEWSTATE），列表和详情全是
// JS 空壳（content.aspx 的 .nr 容器服务端为空），真实数据走 ASHX 接口——
// 通用引擎的「列表页 URL + 详情页选择器」模型不适配，故走本定制路由（SITES.md 特殊站处理）。
//
// 接口（GET 即可，与页面内 $.load POST 等价）：
// - 列表 /Ashx/StudentAffairs.ashx?parm=txdt&classid=<id>&size=N&index=1
//   返回 div.newsbox（<a href="/content.aspx?classid=X&id=N"><div class="tt">标题（尾部截断））
// - 标题 /Ashx/content.ashx?parm=title&id=N → <p>完整标题</p>
// - 正文 /Ashx/NewsServer.ashx?opt=content&id=N → 正文 HTML
// classid：1 学院新闻（219 条）/ 55 学生动态（第二课堂）/ 42 学子获奖；
// 5 学术讲座（低频）与 9 视觉院系（图库）不收。
//
// 该站所有条目均无发布日期（列表/详情/接口都不提供），按 AGENTS 规则 pubDate 留空。
export const route: Route = {
    path: '/scujj-wy',
    categories: ['university'],
    example: '/college/scujj-wy',
    name: '四川大学锦江学院外国语学院',
    maintainers: ['ArtificialPigment'],
    handler,
};

const baseUrl = 'https://wgy.scujj.edu.cn';

const channels = [
    { name: '学院新闻', classid: 1 },
    { name: '学生动态', classid: 55 },
    { name: '学子获奖', classid: 42 },
];

interface Entry {
    id: string;
    channel: string;
    listTitle: string;
}

async function fetchChannelEntries(channel: (typeof channels)[number]): Promise<Entry[]> {
    const listHtml = await ofetch(`${baseUrl}/Ashx/StudentAffairs.ashx`, {
        query: { parm: 'txdt', classid: channel.classid, size: 10, index: 1 },
    });
    const $ = load(listHtml);
    return $('div.newsbox a')
        .toArray()
        .map((el) => {
            const href = $(el).attr('href') ?? '';
            const id = /[?&]id=(\d+)/.exec(href)?.[1];
            if (!id) {
                return;
            }
            return { id, channel: channel.name, listTitle: $('div.tt', el).first().text().trim() };
        })
        .filter((entry): entry is Entry => entry !== undefined);
}

async function fetchDetail(entry: Entry): Promise<DataItem> {
    const base: DataItem = {
        title: entry.listTitle,
        link: `${baseUrl}/content.aspx?classid=1&id=${entry.id}`,
        category: [entry.channel],
    };
    try {
        return await cache.tryGet(`scujj-wy:${entry.id}`, async () => {
            const [titleHtml, contentHtml] = await Promise.all([
                ofetch(`${baseUrl}/Ashx/content.ashx`, { query: { parm: 'title', id: entry.id } }),
                ofetch(`${baseUrl}/Ashx/NewsServer.ashx`, { query: { opt: 'content', id: entry.id } }),
            ]);
            const $title = load(titleHtml);
            const title = $title('p').first().text().trim();
            const $content = load(`<div id="scujj-content">${contentHtml}</div>`);
            const description = cleanContent($content, $content('#scujj-content'), baseUrl);
            if (!description.trim()) {
                throw new Error(`正文为空（id=${entry.id}）`);
            }
            return { ...base, title: title || base.title, description };
        });
    } catch {
        // 详情失败降级为摘要条目（与通用引擎同策略）
        return base;
    }
}

async function handler(): Promise<Data> {
    const perChannel = await Promise.all(channels.map((channel) => fetchChannelEntries(channel)));

    const seen = new Set<string>();
    const entries = perChannel.flat().filter((entry) => {
        if (seen.has(entry.id)) {
            return false;
        }
        seen.add(entry.id);
        return true;
    });

    return {
        title: '四川大学锦江学院外国语学院',
        link: baseUrl,
        description: '四川大学锦江学院外国语学院 - 新闻动态',
        item: await Promise.all(entries.map((entry) => fetchDetail(entry))),
    };
}
