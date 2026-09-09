import type { SiteConfig } from '@/utils/generic-site/types';

import jytGgtz from './jyt-ggtz';

/**
 * 山西省教育部门站点注册表。
 * 每接入一个新站：在本目录新增一个 <site-id>.ts（默认导出 SiteConfig），
 * 并在此登记。接入流程见仓库根目录 SITES.md。
 */
export const sites: Record<string, SiteConfig> = Object.fromEntries([jytGgtz].map((site) => [site.id, site]));
