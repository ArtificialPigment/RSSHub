import type { SiteConfig } from '@/utils/generic-site/types';

/**
 * 国家机构站点注册表。一个机构 = 一条路由（多栏目在站点配置内合并）。
 * 每接入一个新站：在本目录新增一个 <site-id>.ts（默认导出 SiteConfig），
 * 并在此登记。接入流程见仓库根目录 SITES.md。
 */
import moe from './moe';
import nopss from './nopss';

export const sites: Record<string, SiteConfig> = Object.fromEntries([moe, nopss].map((site) => [site.id, site]));
