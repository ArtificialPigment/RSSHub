import type { SiteConfig } from '@/utils/generic-site/types';

// 成都东软学院外国语学院（https://english.nsu.edu.cn）
// 探测日期 2026-10-14：UTF-8。站点为静态生成（列表页与详情页均 UUID 路径），
// 列表 div.list-list > ul 的直接子级是裸 <a>，详情页 /2026/UUID.html。
//
// 栏目构成（首页导航）：
// - 学院新闻 317554ae-3538-…：活跃（最新 2026-10-13），20 条/页，本路由时效来源
// - 党团建设 56e85577-e5e4-…：活跃（最新 2026-10-08），20 条/页
//
// 踩到的坑：
// 1. 列表条目是无包裹的裸 <a>（ul 直接子级，无 li/div 套层），引擎 $item.find('a')
//    只找后代、对根 <a> 返回空，故 link 用 ':scope' 取元素自身（同 jczy-wy）。
// 2. <a> 的 title 属性为完整标题，.newsTitle 文本亦完整，用 titleAttr 兜底。
// 3. 详情页 .h-1 标题 / .h-2 日期（"发布时间：2026年10月13日 文/… 阅读：…"，
//    默认清洗可解析）/ .text_ 正文（注意类名带下划线，勿写成 .text）。
//
// 更新节奏：两栏目均日更（间隔 1~3 天），阈值取典型间隔 2~3 倍余量。
const site: SiteConfig = {
    id: 'nsu-wy',
    name: '成都东软学院外国语学院',
    url: 'https://english.nsu.edu.cn',
    channels: [
        { name: '学院新闻', listUrl: 'https://english.nsu.edu.cn/317554ae-3538-477a-a709-072aed90c90b.html' },
        { name: '党团建设', listUrl: 'https://english.nsu.edu.cn/56e85577-e5e4-4bec-9841-0cd82520eb36.html' },
    ],
    list: {
        item: 'div.list-list ul a',
        link: ':scope',
        titleAttr: 'title',
        date: '.newsTime',
    },
    detail: {
        title: '.h-1',
        date: '.h-2',
        content: '.text_',
    },
    limit: 30,
    minPerChannel: 5,
    updateThresholdDays: 10,
};

export default site;
