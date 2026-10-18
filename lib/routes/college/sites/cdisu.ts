import type { SiteConfig } from '@/utils/generic-site/types';

// 成都外国语学院（https://www.cdisu.edu.cn，民办外语类本科，学校即外语类院校，
// 收全校主站新闻/公告）
// 探测日期 2026-10-14：UTF-8。自研 CMS（/pages-news/ 等列表、/pages-view/<hash> 详情，
// hash 无规律，详情页无语义标题标签）。
//
// 栏目构成（首页各板块「更多」入口）：
// - 学校要闻 /pages-news/：15 条/页，活跃（头条为 10-12 党委中心组学习会）
// - 学校公告 /pages-announcements/：15 条/页，活跃（秋季双选会、网络文明公约等）
//
// 踩到的坑（重要）：
// 1. 全站列表页与详情页均不显示发布日期，条目没有 pubDate——监控会按「无条目或全部
//    条目无日期」告警，updateThresholdDays 无从生效；时效只能凭首页排序与正文内容
//    人工确认（2026-10-14 探测时两栏目内容均为当周/近期事项）。若告警噪音不可接受，
//    需在监控侧豁免或撤下本站。
// 2. 详情正文 .webpage-content-text 首段是站方手排的居中标题/供稿行（无更细正文包装，
//    不宜用 detail.remove 剔除——会误删正文），故 detail 只配 content；
//    标题沿用列表页链接文本（完整不截断，主列表 <a> 无 title 属性）。
const site: SiteConfig = {
    id: 'cdisu',
    name: '成都外国语学院',
    url: 'https://www.cdisu.edu.cn',
    channels: [
        { name: '学校要闻', listUrl: 'https://www.cdisu.edu.cn/pages-news/' },
        { name: '学校公告', listUrl: 'https://www.cdisu.edu.cn/pages-announcements/' },
    ],
    list: {
        item: 'div.card-content-list li.list-group-item',
    },
    detail: {
        content: '.webpage-content-text',
    },
    limit: 30,
    minPerChannel: 5,
    updateThresholdDays: 30,
    noDate: true,
};

export default site;
