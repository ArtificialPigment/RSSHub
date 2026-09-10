import type { SiteConfig } from '@/utils/generic-site/types';

// 外语教学与研究出版社（外研社）· 外研动态
// 探测日期 2026-09-10：UTF-8，自研模板（com-list / detail-page）
// 列表页 ul.com-new-list：li > a + span（日期），标题完整无截断
// /xwdt/ 为「外研动态」汇总页（新闻资讯 qyxw / 活动赛事 hdss / 学术科研 xsky 的最新在此合并展示），故收汇总页；
// 外研公告 wygg、党建工作 djzl、出版融合实验室 cbrhsys 三个栏目页模板相同，一并并入
// 注意：出版融合实验室为慢性低频栏目（条目间隔以月/年计，最新 2026-06-24），按 SITES.md 不拉宽阈值，阈值按活跃栏目（外研公告，间隔约 1–3 天）定
// 详情页：h1.detail-tit / .detail-date / .detail-con（抽查 djzl、cbrhsys 各一篇确认模板一致）
const site: SiteConfig = {
    id: 'fltrp-xwdt',
    name: '外研社·外研动态',
    url: 'https://www.fltrp.com/xwdt/',
    icon: 'https://present.zigzagyang.monster/rsshub-icons/publisher/fltrp-xwdt.png',
    channels: [
        { name: '外研动态', listUrl: 'https://www.fltrp.com/xwdt/' },
        { name: '外研公告', listUrl: 'https://www.fltrp.com/xwdt/wygg/' },
        { name: '党建工作', listUrl: 'https://www.fltrp.com/xwdt/djzl/' },
        { name: '出版融合实验室', listUrl: 'https://www.fltrp.com/xwdt/cbrhsys/' },
    ],
    list: {
        item: 'ul.com-new-list li',
        date: 'span',
    },
    detail: {
        title: 'h1.detail-tit',
        date: '.detail-date',
        content: '.detail-con',
    },
    // 出版融合实验室为慢性低频栏目，纯按日期截断会被挤出：每栏目保底 2 条，总量 30
    limit: 30,
    minPerChannel: 2,
    updateThresholdDays: 14,
};

export default site;
