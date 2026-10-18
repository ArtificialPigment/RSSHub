import type { SiteConfig } from '@/utils/generic-site/types';

// 忻州师范学院外语系（独立子站，仅 http：http://foreign.xztu.edu.cn ）
// 探测日期 2026-10-14：UTF-8，VSB CMS（静态翻页列表、newscontent.js 详情，info/<栏目id> 路径）。
//
// 栏目构成：
//   新闻动态 xwdt1.htm（info/1005）：最新 2026-07-09（微信外链），站内最新 2026-05-14。
//     列表混排 mp.weixin.qq.com 外链（党建/毕业季类系部新闻只发公众号），
//     detail 并联微信选择器出全文（同 sxie-jcb/sxmu-wy 模式）
//   通知公告 tzgg.htm（info/1006，共 5 条）：最新 2025-06-27，停更存档，需求指定类栏目，
//     minPerChannel 保底
// 列表：div.list_box li（li id="line_u6_N"），标题 a 的 title 属性，日期 .list_date
//   （YYYY-MM-DD），10 条/页，3 页共 22 条。
// 详情：标题 div.nr h4，日期 .source .time（"2026年05月14日 09:27"），
//   正文 #vsb_content（容器内嵌 vsb_content_2 嵌套 div，引擎取首个匹配即可）。
// ⚠️ 暑期空窗：新闻动态 07-09 后未更（探测日 10-14 已 3 个月），开学后复查；阈值 30。
const site: SiteConfig = {
    id: 'xztu-foreign',
    name: '忻州师范学院外语系',
    url: 'http://foreign.xztu.edu.cn/',
    icon: 'https://present.zigzagyang.monster/rsshub-icons/college/xztu-foreign.png',
    channels: [
        { name: '新闻动态', listUrl: 'http://foreign.xztu.edu.cn/xwdt1.htm' },
        { name: '通知公告', listUrl: 'http://foreign.xztu.edu.cn/tzgg.htm' },
    ],
    list: {
        item: 'div.list_box li',
        titleAttr: 'title',
        date: 'div.list_date',
    },
    detail: {
        title: 'div.nr h4, #activity-name',
        date: '.source .time',
        content: '#vsb_content, #js_content',
    },
    limit: 30,
    minPerChannel: 2,
    updateThresholdDays: 30,
};

export default site;
