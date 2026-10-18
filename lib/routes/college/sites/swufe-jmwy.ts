import type { SiteConfig } from '@/utils/generic-site/types';

// 西南财经大学外国语学院（https://jmwy.swufe.edu.cn，2022 年由经贸外语学院更名，域名沿用 jmwy）
// 探测日期 2026-10-14：UTF-8，博达 VSB。
// 栏目（首页 More 入口）：
//   学院新闻 index/xyxw.htm：15 条/页，li > a（title 属性完整标题，个别列表文本截断）
//     + a 内 span [YYYY-MM-DD]；页面前 5 条为头条推荐位（日期偏旧属正常）
//   重要通知 index/zytz.htm：同上结构，周级活跃
// 未并入栏目：学术讲座 index/xsjz.htm 停更（最新 2024-07-05），不收录
// 详情页：h1 标题 + .v_news_content 正文（详情页无可见日期，用列表日期）；
//   列表纯站内 info/ 链接（首页有一个缺协议的裸域名 href 属首页滑块，列表页无此问题）
// 更新节奏：两栏目均周级活跃；阈值 14
const site: SiteConfig = {
    id: 'swufe-jmwy',
    name: '西南财经大学外国语学院',
    url: 'https://jmwy.swufe.edu.cn',
    icon: 'https://present.zigzagyang.monster/rsshub-icons/college/swufe-jmwy.png',
    channels: [
        { name: '学院新闻', listUrl: 'https://jmwy.swufe.edu.cn/index/xyxw.htm' },
        { name: '重要通知', listUrl: 'https://jmwy.swufe.edu.cn/index/zytz.htm' },
    ],
    list: {
        item: 'li:has(a[href*="info/"])',
        titleAttr: 'title',
        date: 'a span',
    },
    detail: {
        content: '.v_news_content',
    },
    updateThresholdDays: 14,
};

export default site;
