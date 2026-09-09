import type { Context } from 'hono';

import InvalidParameterError from '@/errors/types/invalid-parameter';
import type { Route } from '@/types';
import cache from '@/utils/cache';
import ofetch from '@/utils/ofetch';

import { sites as govShanxiSites } from '../gov/shanxi/sites';
import { sites as collegeSites } from './sites';

/**
 * 图片代理路由（供 generic-site 引擎的 imageProxy 选项使用）。
 *
 * 背景：部分高校站方 WAF 会静默丢弃 HTTP/2 请求（Chromium/WebKit 均走 h2），
 * 导致阅读器里图片加载失败（ERR_EMPTY_RESPONSE），而 HTTP/1.1 回源正常。
 * 本路由用 Node fetch（HTTP/1.1）回源取图并转发。
 *
 * 安全：只允许代理已配置站点的域名，不是开放代理。
 */
export const route: Route = {
    path: '/image-proxy',
    categories: ['other'],
    example: '/college/image-proxy',
    parameters: { u: '图片绝对 URL（URL 编码）' },
    name: '图片代理',
    maintainers: ['ArtificialPigment'],
    handler,
};

const allowedHosts = new Set([...Object.values(collegeSites), ...Object.values(govShanxiSites)].flatMap((site) => [site.url, ...site.channels.map((c) => c.listUrl)].map((u) => new URL(u).host)));

async function handler(ctx: Context) {
    const u = ctx.req.query('u');
    if (!u) {
        throw new InvalidParameterError('缺少参数 u');
    }

    let target: URL;
    try {
        target = new URL(u);
    } catch {
        throw new InvalidParameterError('参数 u 不是合法 URL');
    }
    if (!allowedHosts.has(target.host)) {
        throw new InvalidParameterError(`域名 ${target.host} 不在允许代理的站点清单内`);
    }

    const { contentType, data } = await cache.tryGet(`image-proxy:${u}`, async () => {
        const response = await ofetch.raw(u, { responseType: 'arrayBuffer' });
        return {
            contentType: response.headers.get('content-type') ?? 'application/octet-stream',
            data: Buffer.from(response._data as ArrayBuffer).toString('base64'),
        };
    });

    ctx.header('Content-Type', contentType);
    ctx.header('Cache-Control', 'public, max-age=86400');
    return ctx.body(Buffer.from(data, 'base64'));
}
