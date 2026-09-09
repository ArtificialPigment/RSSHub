import { load } from 'cheerio';
import type { Context } from 'hono';

import { config } from '@/config';
import type { Data, DataItem } from '@/types';
import cache from '@/utils/cache';
import logger from '@/utils/logger';
import { parseDate } from '@/utils/parse-date';
import timezone from '@/utils/timezone';

import { fetchPage } from './charset';
import { cleanContent } from './clean';
import type { ChannelConfig, SiteConfig } from './types';

/**
 * 简易并发池，避免详情页抓取打爆目标站点
 */
async function mapPool<T, R>(items: T[], size: number, fn: (item: T) => Promise<R>): Promise<R[]> {
    const results = Array.from({ length: items.length }) as R[];
    let index = 0;
    const workers = Array.from({ length: Math.min(size, items.length) }, async () => {
        while (index < items.length) {
            const current = index++;
            // eslint-disable-next-line no-await-in-loop -- 并发池刻意在 worker 内串行，靠多 worker 实现并发
            results[current] = await fn(items[current]);
        }
    });
    await Promise.all(workers);
    return results;
}

/**
 * 默认日期解析：清理高校站点常见的日期噪音（"发布时间："、"2024年1月1日" 等），
 * 统一按北京时间处理
 */
function defaultParseDate(text: string): Date | undefined {
    const cleaned = text
        .replaceAll(/[年月]/g, '/')
        .replaceAll('日', '')
        .replaceAll(/发布(?:时间|日期|于)[:：]?/g, '')
        .replaceAll(/时间[:：]/g, '')
        .replaceAll(/来源[:：].*/g, '')
        .trim();
    const match = cleaned.match(/\d{4}[/\-.]\d{1,2}[/\-.]\d{1,2}/);
    if (!match) {
        return undefined;
    }
    return timezone(parseDate(match[0]), 8);
}

function parseSiteDate(site: SiteConfig, text: string): Date | undefined {
    if (!text.trim()) {
        return undefined;
    }
    return site.dateParser?.(text) ?? defaultParseDate(text);
}

interface ListEntry {
    title: string;
    link: string;
    channel: ChannelConfig;
    pubDate?: Date;
}

/**
 * 抓一个栏目的列表页，返回条目骨架（未抓详情）。
 * 整栏失败只丢该栏目，不影响同站其他栏目。
 */
async function fetchChannelEntries(site: SiteConfig, channel: ChannelConfig, limit: number): Promise<ListEntry[]> {
    const list = channel.list ?? site.list;
    const encoding = channel.encoding ?? site.encoding;

    const listHtml = await fetchPage(channel.listUrl, encoding);
    const $list = load(listHtml);

    return $list(list.item)
        .toArray()
        .slice(0, limit)
        .map((el) => {
            const $item = $list(el);
            const $link = $item.find(list.link ?? 'a').first();
            const href = $link.attr('href');
            if (!href) {
                return;
            }
            const rawTitle = list.titleAttr ? ($link.attr(list.titleAttr) ?? '') : list.title ? $item.find(list.title).text() : $link.text();
            return {
                title: rawTitle.trim(),
                link: new URL(href, channel.listUrl).href,
                channel,
                pubDate: list.date ? parseSiteDate(site, $item.find(list.date).text()) : undefined,
            };
        })
        .filter((entry) => entry !== undefined);
}

/**
 * 附件扩展名 → MIME 类型（RSS enclosure 用）
 */
const attachmentMime: Record<string, string> = {
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    zip: 'application/zip',
};

function attachmentType(link: string): string | undefined {
    const ext = link.match(/\.(pdf|doc|docx|xls|xlsx|zip)$/i)?.[1]?.toLowerCase();
    return ext ? attachmentMime[ext] : undefined;
}

/**
 * 通用站点抓取引擎：多栏目列表 → 合并排序去重 → 详情页 → RSS Data。
 * 单篇详情失败只降级该条目（保留标题+链接），不拖垮整个 feed。
 */
export function makeSiteHandler(site: SiteConfig) {
    return async (ctx: Context): Promise<Data> => {
        const limit = site.limit ?? 20;
        // 实例开启 ACCESS_KEY 时，代理 URL 必须携带 key，否则正文图片被访问控制拦截
        const keyQuery = config.accessKey ? `?key=${config.accessKey}&` : '?';
        const imageProxyBase = site.imageProxy ? `${new URL('/college/image-proxy', ctx.req.url).href}${keyQuery}` : undefined;

        const perChannel = await mapPool(site.channels, 2, async (channel) => {
            try {
                return await fetchChannelEntries(site, channel, limit);
            } catch (error) {
                logger.warn(`[generic-site] ${site.id} 栏目「${channel.name}」列表抓取失败: ${error}`);
                return [];
            }
        });

        // 合并栏目 → 按链接去重（嵌套 table 布局的老站，父行可能被选择器重复匹配）→ 按日期倒序 → 截断
        const seenLinks = new Set<string>();
        const entries = perChannel
            .flat()
            .filter((entry) => {
                if (seenLinks.has(entry.link)) {
                    return false;
                }
                seenLinks.add(entry.link);
                return true;
            })
            .toSorted((a, b) => (b.pubDate?.getTime() ?? 0) - (a.pubDate?.getTime() ?? 0))
            .slice(0, limit);

        const items = await mapPool(entries, 4, async (entry): Promise<DataItem> => {
            const base: DataItem = {
                title: entry.title,
                link: entry.link,
                category: [entry.channel.name],
            };
            if (entry.pubDate) {
                base.pubDate = entry.pubDate;
            }

            // PDF 等附件直链：作为 RSS enclosure 挂载，同时把附件链接写进正文兜底
            // （部分阅读器不渲染 enclosure），教育厅公告常见
            const mime = attachmentType(entry.link);
            if (mime) {
                return {
                    ...base,
                    description: `<p>📎 <a href="${entry.link}">附件：${entry.title}</a></p>`,
                    enclosure_url: entry.link,
                    enclosure_type: mime,
                    enclosure_title: entry.title,
                };
            }

            // PDF 等非 HTML 附件无法走详情页清洗，直接降级为摘要条目（教育厅公告常见）
            const detail = entry.channel.detail ?? site.detail;
            const encoding = entry.channel.encoding ?? site.encoding;
            if (!detail) {
                return base;
            }

            return await cache.tryGet(entry.link, async () => {
                try {
                    const detailHtml = await fetchPage(entry.link, encoding);
                    const $ = load(detailHtml);

                    const detailDate = detail.date ? parseSiteDate(site, $(detail.date).text()) : undefined;

                    return {
                        ...base,
                        title: (detail.title ? $(detail.title).text().trim() : '') || base.title,
                        description: cleanContent($, $(detail.content).first(), entry.link, imageProxyBase),
                        pubDate: detailDate ?? base.pubDate,
                    };
                } catch {
                    return base;
                }
            });
        });

        return {
            title: site.name,
            link: site.url,
            description: `${site.name} - 新闻公告`,
            item: items,
        };
    };
}
