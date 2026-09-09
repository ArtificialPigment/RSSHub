import type { SiteConfig } from '@/utils/generic-site/types';

import jczyWy from './jczy-wy';
import llzyJcb from './llzy-jcb';
import nucShss from './nuc-shss';
import sxauJcb from './sxau-jcb';
import sxdtdxWgy from './sxdtdx-wgy';
import sxistWlky from './sxist-wlky';
import sxtcmGj from './sxtcm-gj';
import sxuWy from './sxu-wy';
import sxufeJmwy from './sxufe-jmwy';
import tyuWy from './tyu-wy';
import tyustWy from './tyust-wy';

/**
 * 高校学院站点注册表。一个学校 = 一条路由（多栏目在站点配置内合并）。
 * 每接入一个新站：在本目录新增一个 <site-id>.ts（默认导出 SiteConfig），
 * 并在此登记。接入流程见仓库根目录 SITES.md。
 */
export const sites: Record<string, SiteConfig> = Object.fromEntries([sxuWy, sxauJcb, sxufeJmwy, nucShss, sxistWlky, sxtcmGj, tyuWy, tyustWy, llzyJcb, sxdtdxWgy, jczyWy].map((site) => [site.id, site]));
