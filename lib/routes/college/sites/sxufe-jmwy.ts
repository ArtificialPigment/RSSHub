import type { SiteConfig } from '@/utils/generic-site/types';

// 山西财经大学经贸外语学院
// 探测日期 2026-09-09：UTF-8，维讯 CMS 老式 table 布局（大写标签）。
// 列表选择器必须锚定 table[width="640"]，否则嵌套 table 的祖先行被 :has 重复匹配；
// 列表链接有重复 title 属性（第一个是垃圾值"经"），完整标题取详情页；
// 通知公告为低频栏目（最新条目曾停在 2025-11），合并后阈值按学院新闻定
const site: SiteConfig = {
    id: 'sxufe-jmwy',
    name: '山西财经大学经贸外语学院',
    url: 'https://jmwy.sxufe.edu.cn',
    icon: 'https://present.zigzagyang.monster/rsshub-icons/college/sxufe-jmwy.png',
    channels: [
        { name: '学院新闻', listUrl: 'https://jmwy.sxufe.edu.cn/index/xyxw.htm' },
        { name: '通知公告', listUrl: 'https://jmwy.sxufe.edu.cn/index/tzgg.htm' },
    ],
    list: {
        item: 'table[width="640"] > tbody > tr:has(a.lianxi2)',
        link: 'a.lianxi2',
        date: 'td[width="80"]',
    },
    detail: {
        title: 'table.unname3 td.lian b',
        date: 'table.unname3 td.lian2',
        content: '.v_news_content',
    },
    // 寒暑假常有 2-3 周空窗（2026 年 8 月曾触发 18 天空窗告警），阈值放宽避免误报
    updateThresholdDays: 30,
};

export default site;
