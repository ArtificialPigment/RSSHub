import type { SiteConfig } from '@/utils/generic-site/types';

// 山西省教育厅 - 公告通知
// 探测日期 2026-09-09：UTF-8，TRS CMS。列表多为 PDF 附件直链（引擎自动挂为 enclosure），
// 少数为 HTML 详情页；完整标题在链接 title 属性中
const site: SiteConfig = {
    id: 'jyt-ggtz',
    name: '山西省教育厅 - 公告通知',
    url: 'https://jyt.shanxi.gov.cn/xwzx/ggtz/',
    channels: [{ name: '公告通知', listUrl: 'https://jyt.shanxi.gov.cn/xwzx/ggtz/' }],
    list: {
        item: '.xwzx_ggtz ul.fl li',
        titleAttr: 'title',
        date: 'span',
    },
    detail: {
        date: '.ly_zj span',
        content: '#contents',
    },
    updateThresholdDays: 7,
};

export default site;
