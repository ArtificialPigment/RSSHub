import type { Context } from 'hono';

import InvalidParameterError from '@/errors/types/invalid-parameter';
import type { Data, Route } from '@/types';
import { makeSiteHandler } from '@/utils/generic-site/engine';

import { sites } from './sites';

export const route: Route = {
    path: '/:site',
    categories: ['government'],
    example: '/national/nopss',
    parameters: { site: '站点 ID，见 sites/ 目录下各站点配置' },
    name: '国家机构资讯',
    maintainers: ['ArtificialPigment'],
    handler,
};

async function handler(ctx: Context): Promise<Data> {
    const { site } = ctx.req.param();
    const siteConfig = sites[site];
    if (!siteConfig) {
        throw new InvalidParameterError(`未知站点 ID: ${site}，可用站点见 lib/routes/national/sites/ 目录`);
    }
    return await makeSiteHandler(siteConfig)(ctx);
}
