import type { SiteConfig } from '@/utils/generic-site/types';

// 山西大学外国语学院
// 探测日期 2026-09-09：UTF-8，列表页标题被截断（"..."），完整标题取详情页
// 注意：xydt/index.htm（学院动态栏目页）已停止更新（最新停留在 2025-04），
// 活跃栏目是 xydt/wykx/（院系快讯），故只收这一个栏目
const site: SiteConfig = {
    id: 'sxu-wy',
    name: '山西大学外国语学院',
    url: 'https://wy.sxu.edu.cn',
    channels: [{ name: '院系快讯', listUrl: 'https://wy.sxu.edu.cn/xydt/wykx/index.htm' }],
    list: {
        item: '.wy-news li',
        date: '.d',
    },
    detail: {
        title: '.wcon .title h3',
        date: '.wcon .title p',
        content: '.wcon .con',
    },
    updateThresholdDays: 14,
};

export default site;
