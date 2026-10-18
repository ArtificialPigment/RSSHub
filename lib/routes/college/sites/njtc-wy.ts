import type { SiteConfig } from '@/utils/generic-site/types';

// 内江师范学院外国语学院（https://wy.njtc.edu.cn/index.htm）
// 探测日期 2026-10-14：UTF-8。CMS 为维博（VSB）高校站群系统（winstyle 列表 table、
// pb_sys 分页、_showDynClickBatch 点击统计为典型特征），详情页路径 info/<栏目id>/<文章id>.htm。
//
// 栏目构成（首页新闻区块「更多>>」入口）：
// - 学院要闻 index/xyyw.htm：活跃（最新 2026-10-12），本路由时效来源
// - 通知公告 index/tzgg.htm：活跃（最新 2026-10-12），奖助学金公示/赛事通知为主
// 两栏目列表/详情模板一致，共用站点级选择器。
// 「重要通知」index/kxyw.htm 实为站内检索页（"当前共检索到 N 条记录"），不收录。
//
// 踩到的坑：
// 1. 列表 <a> 有重复 title 属性，第一个是无效值（"标题：[领导联系班级讲党课]…"），
//    按 HTML 规范首个生效，titleAttr 会取到垃圾值；链接文本完整，不用 titleAttr，
//    完整标题由 detail.title 兜底。
// 2. 列表容器 table 的 class 带随机数字后缀（winstyle1253），日期 td 同理
//    （timestyle52a930…），选择器用 class^="winstyle" / class^="timestyle" 前缀匹配。
// 3. 列表日期是纯文本 td（YYYY-MM-DD），date 直接配 td[class^="timestyle"]。
// 4. 详情页 .news_conent_two_js 内含多个 span（日期/来源/编辑/查看），配 span
//    取文本后日期正则命中首个（YYYY-MM-DD）即可。
const site: SiteConfig = {
    id: 'njtc-wy',
    name: '内江师范学院外国语学院',
    url: 'https://wy.njtc.edu.cn/index.htm',
    channels: [
        { name: '学院要闻', listUrl: 'https://wy.njtc.edu.cn/index/xyyw.htm' },
        { name: '通知公告', listUrl: 'https://wy.njtc.edu.cn/index/tzgg.htm' },
    ],
    list: {
        item: 'table[class^="winstyle"] > tbody > tr:has(a)',
        date: 'td[class^="timestyle"]',
    },
    detail: {
        title: '.news_conent_two_title',
        date: '.news_conent_two_js span',
        content: '.v_news_content',
    },
    limit: 30,
    minPerChannel: 3,
    // 学院要闻相邻间隔典型 5~16 天，寒暑假有空窗风险，阈值取 30
    updateThresholdDays: 30,
};

export default site;
