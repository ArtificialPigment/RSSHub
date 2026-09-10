import type { SiteConfig } from '@/utils/generic-site/types';

// 山西农业大学基础部
// 探测日期 2026-09-09：UTF-8，维讯 CMS（v_news_content），两栏目同模板。
// 通知公告为低频栏目（首页曾见 2023 年条目），合并后阈值按学院新闻定。
// 注意：站方 WAF 静默丢弃 HTTP/2 请求（阅读器图片必挂），已启用 imageProxy 走 HTTP/1.1 回源
const site: SiteConfig = {
    id: 'sxau-jcb',
    name: '山西农业大学基础部',
    url: 'https://wlxy.sxau.edu.cn',
    icon: 'https://present.zigzagyang.monster/rsshub-icons/college/sxau-jcb.png',
    channels: [
        { name: '学院新闻', listUrl: 'https://wlxy.sxau.edu.cn/index/xyxw.htm' },
        { name: '通知公告', listUrl: 'https://wlxy.sxau.edu.cn/index/tzgg.htm' },
    ],
    list: {
        item: '.list .right ul li',
        date: '.span_li',
    },
    detail: {
        title: '.nry h3',
        date: '.nry .attribute',
        content: '.v_news_content',
    },
    updateThresholdDays: 14,
    imageProxy: true,
};

export default site;
