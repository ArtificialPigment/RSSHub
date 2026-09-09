import type { Context } from 'hono';

import InvalidParameterError from '@/errors/types/invalid-parameter';
import type { Data, Route } from '@/types';
import { makeSiteHandler } from '@/utils/generic-site/engine';

import { sites } from './sites';

export const route: Route = {
    path: '/:site',
    categories: ['government'],
    example: '/gov/shanxi/jyt-ggtz',
    parameters: { site: '站点 ID，见 sites/ 目录下各站点配置' },
    name: '部门公告通知',
    maintainers: ['ArtificialPigment'],
    handler,
};

async function handler(ctx: Context): Promise<Data> {
    const { site } = ctx.req.param();
    const siteConfig = sites[site];
    if (!siteConfig) {
        throw new InvalidParameterError(`未知站点 ID: ${site}，可用站点见 lib/routes/gov/shanxi/sites/ 目录`);
    }
    return await makeSiteHandler(siteConfig)(ctx);
}
