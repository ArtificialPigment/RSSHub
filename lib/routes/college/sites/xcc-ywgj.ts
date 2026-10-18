import type { SiteConfig } from '@/utils/generic-site/types';

// 西昌学院语言文化与国际传播学院（https://www.xcc.edu.cn/wgyxy/index.html）
// 探测日期 2026-10-14：UTF-8。CMS 为 Easysite（easysite-* class 为典型特征）。
// 学院 2026 年 7 月由外国语学院整合组建，本站为原 wgyxy 站群目录。
//
// 栏目构成（首页新闻区块标题 + 左侧导航双重确认）：
// - 院系新闻 /wgyxy/366414/366418/index.html：活跃（最新 2026-09-22），本路由时效来源
// - 通知公告 /wgyxy/366414/366422/index.html：低频（最新 2026-09-20，往前 2026-08-31），
//   公示/报名通知为主，并入同一路由
// 两栏目列表/详情模板一致（ul.easysite-list-modelone / .easysite-news-*），共用站点级选择器。
//
// 踩到的坑：
// 1. 任务给定的深层 URL（…/366387/366383/index.html）是「学院简介」单页，需先回学院
//    首页找新闻栏目。
// 2. 列表条目 li 内 .article-con 是摘要（含截断「...」），标题取 <a> 文本（完整，
//    无需 titleAttr——<a> 的 title 属性虽存在但与文本一致）。
// 3. 列表日期在 .tit_date p.day（YYYY-MM-DD）；下方 year/month span 为空壳，勿用。
// 4. 详情页 .easysite-news-describe 文本为「发布时间：2026年09月22日 作者：… 字体：…」，
//    引擎日期清洗后命中首个日期即可。
const site: SiteConfig = {
    id: 'xcc-ywgj',
    name: '西昌学院语言文化与国际传播学院',
    url: 'https://www.xcc.edu.cn/wgyxy/index.html',
    channels: [
        { name: '院系新闻', listUrl: 'https://www.xcc.edu.cn/wgyxy/366414/366418/index.html' },
        { name: '通知公告', listUrl: 'https://www.xcc.edu.cn/wgyxy/366414/366422/index.html' },
    ],
    list: {
        item: 'ul.easysite-list-modelone li.easysite-article-li',
        date: '.tit_date p.day',
    },
    detail: {
        title: '.easysite-news-title h2',
        date: '.easysite-news-describe',
        content: '#easysiteText',
    },
    limit: 30,
    minPerChannel: 3,
    // 院系新闻相邻间隔 3~10 天，通知公告低频且非季节性，阈值按活跃栏目定 30
    updateThresholdDays: 30,
};

export default site;
