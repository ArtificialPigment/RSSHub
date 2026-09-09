import type { SiteConfig } from '@/utils/generic-site/types';

// 中北大学人文社会科学学院
// 探测日期 2026-09-09：UTF-8，维讯 CMS
const site: SiteConfig = {
    id: 'nuc-shss',
    name: '中北大学人文社会科学学院',
    url: 'https://shss.nuc.edu.cn',
    channels: [{ name: '学院新闻', listUrl: 'https://shss.nuc.edu.cn/xyxw.htm' }],
    list: {
        item: '.list .right ul li',
        date: 'span',
    },
    detail: {
        title: 'form h3',
        date: '.attribute',
        content: '.v_news_content',
    },
    updateThresholdDays: 14,
};

export default site;
