import type { SiteConfig } from '@/utils/generic-site/types';

// 西华师范大学外国语学院（https://fl.cwnu.edu.cn）
// 探测日期 2026-10-14：UTF-8。CMS 为维博（VSB）高校站群系统（_showDynClicks、
// v_news_content、.vsbcontent_start 为典型特征），详情页路径 info/<栏目id>/<文章id>.htm。
//
// 栏目构成（首页导航 + 探测确认）：
// - 外院动态 wydt.htm：活跃（最新 2026-10-13），单页 25 条，本路由时效来源
// - 通知公告 wydt/tzgg.htm：活跃（最新 2026-10-12），奖助学金评审公示为主
// 两栏目列表/详情模板一致（#ctn-data li），共用站点级选择器。
//
// 踩到的坑：
// 1. 列表 <a> 的 title 属性是模板占位垃圾值「v.Title」，不能用 titleAttr；
//    列表页链接文本完整（首页 topicList 的截断标题才是表象），完整标题由 detail.title 兜底。
// 2. 列表条目 li 的 id 为 line_u5_N，li 之间穿插 span#section 分隔线，item 用 '#ctn-data li'
//    只命中 li；日期在 li 内 span.date（YYYY-MM-DD，含尾随空格，引擎正则无碍）。
// 3. 详情页 .property 内多 span（作者/摄影/审核/来源/日期/阅读）——不配 detail.date：
//    引擎日期清洗会按「来源:」截断删掉其后的日期，配了反而取不到；列表日期已可靠。
// 4. 正文 .v_news_content 干净，但部分文章图多，图片为相对路径，引擎会补全。
const site: SiteConfig = {
    id: 'cwnu-wy',
    name: '西华师范大学外国语学院',
    url: 'https://fl.cwnu.edu.cn',
    channels: [
        { name: '外院动态', listUrl: 'https://fl.cwnu.edu.cn/wydt.htm' },
        { name: '通知公告', listUrl: 'https://fl.cwnu.edu.cn/wydt/tzgg.htm' },
    ],
    list: {
        item: '#ctn-data li',
        date: 'span.date',
    },
    detail: {
        title: '.title',
        content: '.v_news_content',
    },
    limit: 30,
    minPerChannel: 3,
    // 外院动态相邻间隔 1~7 天，寒暑假有空窗风险，阈值取 30
    updateThresholdDays: 30,
};

export default site;
