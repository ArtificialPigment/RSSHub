import type { SiteConfig } from '@/utils/generic-site/types';

// 四川文理学院外国语学院（https://wgyxy.sasu.edu.cn）
// 探测日期 2026-10-14：UTF-8。CMS 为维博（VSB）高校站群系统（详情页 v_news_content、
// _showDynClicks 点击统计为典型特征），详情页路径 info/<栏目id>/<文章id>.htm。
//
// 栏目构成（首页导航「新闻动态」下拉）：
// - 学院动态 xwdt/xydt.htm：活跃（最新 2026-10-13）
// - 通知公告 xwdt/tzgg.htm：活跃（最新 2026-10-13），公示/工作要点为主
// 两栏目列表/详情模板一致，共用站点级选择器。
//
// 踩到的坑：
// 1. 列表是嵌套 table 行布局，条目行为 <tr>（a.biaoti + span.biaoti2 日期），
//    分隔行无链接会被引擎自动过滤；引擎按链接去重也兜底父行重复匹配。
// 2. 列表/详情完整标题均在 <a> 的 title 属性与详情 h1，列表文本即全文（不截断），
//    仍配 titleAttr 防御 CSS 省略。
// 3. 详情页日期在 <h2>（"作者： 来源： 发表于：2026-10-13 16:58:05 文章点击数：[...]"），
//    默认解析器能提取首个日期串；正文 .v_news_content 干净。
const site: SiteConfig = {
    id: 'sasu-wgyxy',
    name: '四川文理学院外国语学院',
    url: 'https://wgyxy.sasu.edu.cn',
    icon: 'https://present.zigzagyang.monster/rsshub-icons/college/sasu-wgyxy.png',
    channels: [
        { name: '学院动态', listUrl: 'https://wgyxy.sasu.edu.cn/xwdt/xydt.htm' },
        { name: '通知公告', listUrl: 'https://wgyxy.sasu.edu.cn/xwdt/tzgg.htm' },
    ],
    list: {
        // tr 会命中页头布局行，slice 先截断会漏条目；:has 限定含条目的真实行
        item: 'tr:has(a.biaoti)',
        link: 'a.biaoti',
        titleAttr: 'title',
        date: 'span.biaoti2',
    },
    detail: {
        title: 'h1',
        date: 'h2',
        content: '.v_news_content',
    },
    limit: 20,
    minPerChannel: 5,
    updateThresholdDays: 14,
};

export default site;
