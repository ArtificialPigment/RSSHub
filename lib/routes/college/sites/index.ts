import type { SiteConfig } from '@/utils/generic-site/types';

import cafucWy from './cafuc-wy';
import capJcjxb from './cap-jcjxb';
import cdisuSite from './cdisu';
import cdtcJcjxb from './cdtc-jcjxb';
import cusxRw from './cusx-rw';
import cwnuWy from './cwnu-wy';
import czcWyx from './czc-wyx';
import czmcWyb from './czmc-wyb';
import jczyWy from './jczy-wy';
import jzciSobe from './jzci-sobe';
import jzxyForeign from './jzxy-foreign';
import llszLygl from './llsz-lygl';
import llszXxzx from './llsz-xxzx';
import lluWyx from './llu-wyx';
import llzyJcb from './llzy-jcb';
import njtcWy from './njtc-wy';
import nsuWy from './nsu-wy';
import nucShss from './nuc-shss';
import pzhuWgyxy from './pzhu-wgyxy';
import sasuWgyxy from './sasu-wgyxy';
import scaGjjl from './sca-gjjl';
import sicauRwy from './sicau-rwy';
import sicnuWy from './sicnu-wy';
import suseWy from './suse-wy';
import swjtuSfl from './swjtu-sfl';
import swmuGjjy from './swmu-gjjy';
import swufeJmwy from './swufe-jmwy';
import sxauJcb from './sxau-jcb';
import sxdtdxWgy from './sxdtdx-wgy';
import sxdzkjGgjxb from './sxdzkj-ggjxb';
import sxgkdWgyxy from './sxgkd-wgyxy';
import sxgxyTsjy from './sxgxy-tsjy';
import sxieJcb from './sxie-jcb';
import sxistWlky from './sxist-wlky';
import sxmuWy from './sxmu-wy';
import sxnuWgy from './sxnu-wgy';
import sxtbuWy from './sxtbu-wy';
import sxtcmGj from './sxtcm-gj';
import sxuWy from './sxu-wy';
import sxufeJmwy from './sxufe-jmwy';
import titWyx from './tit-wyx';
import tynuWyx from './tynu-wyx';
import tyuWy from './tyu-wy';
import tyustWy from './tyust-wy';
import tyutWfywy from './tyut-wfywy';
import xccYwgj from './xcc-ywgj';
import xztuForeign from './xztu-foreign';
import ycuWyx from './ycu-wyx';
import yibinuWy from './yibinu-wy';

/**
 * 高校学院站点注册表。一个学校 = 一条路由（多栏目在站点配置内合并）。
 * 每接入一个新站：在本目录新增一个 <site-id>.ts（默认导出 SiteConfig），
 * 并在此登记。接入流程见仓库根目录 SITES.md。
 */
export const sites: Record<string, SiteConfig> = Object.fromEntries(
    [
        sxuWy,
        sxauJcb,
        sxufeJmwy,
        nucShss,
        sxistWlky,
        sxtcmGj,
        tyuWy,
        tyustWy,
        llzyJcb,
        sxdtdxWgy,
        jczyWy,
        titWyx,
        llszXxzx,
        llszLygl,
        jzciSobe,
        sxdzkjGgjxb,
        sxieJcb,
        sxmuWy,
        sxtbuWy,
        sxgkdWgyxy,
        sxnuWgy,
        xztuForeign,
        sasuWgyxy,
        sicauRwy,
        lluWyx,
        tynuWyx,
        tyutWfywy,
        cusxRw,
        capJcjxb,
        cdtcJcjxb,
        swjtuSfl,
        swufeJmwy,
        jzxyForeign,
        sxgxyTsjy,
        ycuWyx,
        czmcWyb,
        czcWyx,
        pzhuWgyxy,
        scaGjjl,
        suseWy,
        swmuGjjy,
        njtcWy,
        xccYwgj,
        cwnuWy,
        yibinuWy,
        cafucWy,
        sicnuWy,
        nsuWy,
        cdisuSite,
    ].map((site) => [site.id, site])
);
