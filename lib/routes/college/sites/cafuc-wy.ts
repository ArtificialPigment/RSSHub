import type { SiteConfig } from '@/utils/generic-site/types';

// 中国民用航空飞行学院外国语学院（https://sfl.cafuc.edu.cn/index.htm）
// 探测日期 2026-10-14：UTF-8。CMS 为维博（VSB）高校站群系统（_showDynClicks、
// v_news_content、photoswipe 为典型特征），详情页路径 info/<栏目id>/<文章id>.htm。
//
// 栏目构成（首页区块 + 探测确认；本站无独立「学院新闻」栏目，新闻散落于板块栏目）：
// - 学术动态 kxyj/xsdt.htm：活跃（最新 2026-09-28），讲座/科研为主，本路由时效来源
// - 团学动态 xsgz/txdt.htm：活跃（最新 2026-10-13，含置顶条目），学生活动为主
// - 通知公告（科研） kxyj/tzgg.htm：活跃（最新 2026-09-20），学术讲座通知为主
// 三栏目列表/详情模板一致（ul.lb-list / .article-tt+.article-sm），共用站点级选择器。
// 未选栏目：本科教学通知公告 bkjx/tzgg.htm 最新 2026-06-23 偏 stale；工会动态低频。
//
// 踩到的坑：
// 1. 列表标题自带【学术动态】【通知公告】等栏目前缀，属站方风格，保留原样。
// 2. 团学动态列表有置顶条目（时间序非严格倒序），引擎按列表顺序抓取后按日期倒序
//    合并，不受影响。
// 3. 列表日期是纯文本 span（YYYY-MM-DD），li 内 a+span 结构简单。
// 4. 详情页 .article-sm 文本为「发布时间：2026-10-13点击数：…」，引擎清洗后命中
//    首个日期；正文 #vsb_content 内 .v_news_content 干净。
const site: SiteConfig = {
    id: 'cafuc-wy',
    name: '中国民用航空飞行学院外国语学院',
    url: 'https://sfl.cafuc.edu.cn/index.htm',
    channels: [
        { name: '学术动态', listUrl: 'https://sfl.cafuc.edu.cn/kxyj/xsdt.htm' },
        { name: '团学动态', listUrl: 'https://sfl.cafuc.edu.cn/xsgz/txdt.htm' },
        { name: '通知公告', listUrl: 'https://sfl.cafuc.edu.cn/kxyj/tzgg.htm' },
    ],
    list: {
        item: 'ul.lb-list li.txt-elise',
        date: 'span',
    },
    detail: {
        title: '.article-tt',
        date: '.article-sm',
        content: '.v_news_content',
    },
    limit: 30,
    minPerChannel: 3,
    // 学术动态相邻间隔 1~4 周，非季节性低频，阈值取 30（约 2 倍典型间隔）
    updateThresholdDays: 30,
};

export default site;
