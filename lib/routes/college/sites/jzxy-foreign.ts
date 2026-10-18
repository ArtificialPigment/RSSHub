import type { SiteConfig } from '@/utils/generic-site/types';
import { parseDate } from '@/utils/parse-date';
import timezone from '@/utils/timezone';

// 晋中学院外语系（https://foreign.jzxy.edu.cn/ ，https 证书正常可用）
// 探测日期 2026-10-14：UTF-8。学校自研模板（templates/foreign/ersinianshiyiyue），
// 列表/详情均为静态页，详情路径 <栏目>/content_<id>.html。注意：学校另设公共外语教学部，
// 本系是 foreign 子域（页面标题「外语系」），与公外部无关。
//
// 栏目取舍：
// - 新闻动态 xwdt.html：活跃（最新 2026-10-13，291 条/30 页），本路由唯一栏目。
// - 通知公告 tzgg.html：内容与新闻动态高度重合（同批文章换路径交叉发布，如
//   xwdt/content_104010.html 与 tzgg/content_104010.html 为同一篇），按链接去重会
//   留下成对重复条目，故不并入；独有通知极少。
//
// 踩到的坑：
// 1. 列表条目是裸 <a class="list-item">（无 li 包裹），引擎 find('a') 只查后代，
//    须 link: ':scope' 取元素自身。
// 2. 日期拆两个 div（.year-mouth "2026-10" + .day "13"），date 选 .date-box 后
//    text 带换行。dateParser 同时兼容列表文本 "2026-10\n13" 与详情页 ISO "2026-10-13"。
//    月份组必须写成 (1[0-2]|0[1-9]) 消除回溯歧义：用 (\d{1,2})\s*(\d{1,2}) 时，
//    "2026-10-13" 会回溯成 m[2]="1"、m[3]="0"（day 0 向前滚一天），
//    详情日期被解析成 2025-12-30 / 2025-12-09 这类错误值。
// 3. 列表标题在 div.list-title，原文完整（ellipsis 是 CSS 截断，文本未截断）。
const site: SiteConfig = {
    id: 'jzxy-foreign',
    name: '晋中学院外语系',
    url: 'https://foreign.jzxy.edu.cn/',
    icon: 'https://present.zigzagyang.monster/rsshub-icons/college/jzxy-foreign.png',
    channels: [{ name: '新闻动态', listUrl: 'https://foreign.jzxy.edu.cn/xwdt.html' }],
    list: {
        item: 'div.right-list a.list-item',
        link: ':scope',
        title: 'div.list-title',
        date: 'div.date-box',
    },
    dateParser: (text) => {
        // 列表: "2026-10\n13"；详情: "2026-10-13"。月份限定 1[0-2]|0[1-9] 防回溯。
        const m = text.match(/(\d{4})-(1[0-2]|0[1-9])(?:\s+|-)(\d{1,2})/);
        if (m) {
            return timezone(parseDate(`${m[1]}-${m[2]}-${m[3]}`), 8);
        }
        return;
    },
    detail: {
        title: 'div.detail-title',
        date: 'div.detail-time',
        content: 'div.detail-content',
    },
    updateThresholdDays: 30,
};

export default site;
