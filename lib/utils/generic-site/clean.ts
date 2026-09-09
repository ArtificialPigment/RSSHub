import type { Cheerio, CheerioAPI } from 'cheerio';
import type { AnyNode } from 'domhandler';

/**
 * 正文清洗：
 * - 移除 script/style/iframe 等噪声元素
 * - 懒加载图片的 data-src/data-original 还原为 src
 * - 所有相对链接（a[href]、img[src]）转为绝对 URL
 * - imageProxyBase 存在时，img src 改写为代理路由（绕过站方对 HTTP/2 的拦截）
 */
export function cleanContent($: CheerioAPI, $content: Cheerio<AnyNode>, baseUrl: string, imageProxyBase?: string): string {
    $content.find('script, style, iframe, noscript').remove();

    $content.find('img').each((_, img) => {
        const $img = $(img);
        const src = $img.attr('data-src') ?? $img.attr('data-original') ?? $img.attr('src');
        if (src) {
            const absolute = new URL(src, baseUrl).href;
            $img.attr('src', imageProxyBase ? `${imageProxyBase}?u=${encodeURIComponent(absolute)}` : absolute);
        }
        $img.removeAttr('data-src');
        $img.removeAttr('data-original');
        $img.removeAttr('srcset');
    });

    $content.find('a').each((_, a) => {
        const href = $(a).attr('href');
        if (href && !href.startsWith('javascript:') && !href.startsWith('#')) {
            $(a).attr('href', new URL(href, baseUrl).href);
        }
    });

    return $content.html() ?? '';
}
