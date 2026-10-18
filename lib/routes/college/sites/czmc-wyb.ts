import type { SiteConfig } from '@/utils/generic-site/types';
import { parseDate } from '@/utils/parse-date';
import timezone from '@/utils/timezone';

// 长治医学院外语教学部（http://wyx.czmc.edu.cn/ ）
// 探测日期 2026-10-14：UTF-8，维博 VSB9（详情页 id=vsb_content/_showDynClicks）。
//
// ⚠️ 站点定位更正（site-id 沿用任务分配的 czmc-wyb）：调研档案记的 wyb.czmc.edu.cn
// 子域已改挂药学院（title「长治医学院药学院」）；外语教学部真实站点是
// wyx.czmc.edu.cn——学校机构设置页（www.czmc.edu.cn/jgsz.htm）链接确认。
//
// ⚠️ 仅 http：https 证书 CN=czmc.edu.cn、不覆盖 wyx 子域（SAN 缺失），
// TLS 握手被客户端拒绝；http 服务正常。全站按 http 配置（nopss/njupco 先例）。
//
// 栏目取舍：
// - 工作动态 gzdt.htm（栏目 1076）：活跃（最新 2026-10-12），本路由时效来源。
// - 通知公告 tzgg.htm（栏目 1079）：低频（最新 2026-05-13，竞赛/考试通知），
//   minPerChannel 保底 2 条。党建工作（1075，停更 2024-12）、外语教学（1077，
//   停更 2024-09）为存档栏目，不并入。
//
// 踩到的坑：
// 1. 列表 li > span 日期拆分：<i>12</i>2026-10（日 + 年-月），text 粘连为
//    "122026-10"，dateParser 正则拼合。
// 2. 标题在 li a > h2（a 内还含 p 摘要，不能取 a 文本），部分标题截断带 "…"，
//    靠 detail.title（h1.c-title）补全。
// 3. 通知公告部分条目正文只有附件/微信外链说明，正文偏短属正常形态。
const site: SiteConfig = {
    id: 'czmc-wyb',
    name: '长治医学院外语教学部',
    url: 'http://wyx.czmc.edu.cn/',
    icon: 'https://present.zigzagyang.monster/rsshub-icons/college/czmc-wyb.png',
    channels: [
        { name: '工作动态', listUrl: 'http://wyx.czmc.edu.cn/gzdt.htm' },
        { name: '通知公告', listUrl: 'http://wyx.czmc.edu.cn/tzgg.htm' },
    ],
    list: {
        item: 'div.ilistfy li',
        title: 'h2',
        date: 'span',
    },
    dateParser: (text) => {
        // span 文本形如 "122026-10"（<i>日</i>年-月 粘连）
        const m = text.match(/(\d{1,2})\s*(\d{4})-(\d{1,2})/);
        if (m) {
            return timezone(parseDate(`${m[2]}-${m[3]}-${m[1]}`), 8);
        }
        return;
    },
    detail: {
        title: 'h1.c-title',
        date: 'div.other-s',
        content: '#vsb_content .v_news_content',
    },
    minPerChannel: 2,
    updateThresholdDays: 90,
};

export default site;
