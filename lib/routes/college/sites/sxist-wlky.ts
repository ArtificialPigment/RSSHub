import type { SiteConfig } from '@/utils/generic-site/types';

// 山西科技学院文旅康养学院
// 探测日期 2026-09-09：UTF-8，维讯 CMS，两栏目同模板（.fy-list 列表 / .v_news_content 正文）。
// 注意：站方对 HTTP/2 请求直接协议错误（h2 图片必挂），已启用 imageProxy 走 HTTP/1.1 回源
const site: SiteConfig = {
    id: 'sxist-wlky',
    name: '山西科技学院文旅康养学院',
    url: 'https://wlkyxy.sxist.edu.cn',
    icon: 'https://present.zigzagyang.monster/rsshub-icons/college/sxist-wlky.png',
    channels: [
        { name: '新闻动态', listUrl: 'https://wlkyxy.sxist.edu.cn/xwdt.htm' },
        { name: '通知公告', listUrl: 'https://wlkyxy.sxist.edu.cn/tzgg.htm' },
    ],
    list: {
        item: '.fy-list ul li',
        date: 'span',
    },
    detail: {
        title: 'h1.c-title',
        date: '.other-s',
        content: '.v_news_content',
    },
    updateThresholdDays: 14,
    imageProxy: true,
};

export default site;
