import type { SiteConfig } from '@/utils/generic-site/types';

// 太原学院外语系
// 探测日期 2026-09-09：UTF-8，VSb 系列 CMS（vsb_content / _showDynClicks），模板统一
// 列表项 li.list_rone，日期在 h2 span（干净 ISO），标题 .ltrlb_tit 完整无截断
// 详情页标题 .contt_tit h1，正文 .v_news_content
// 坑：
//  - 通知公告 tzgg.htm、区域国别研究 qygbyj.htm 两栏目列表为空（无任何条目），不收
//  - 课程思政 kcsz.htm 停在 2023-03，属停更栏目，不收
//  - 全站目前处于暑假空窗：最新条目是全站最大值 2026-06-24（就业指导 jyzd），
//    并非单栏目停更陷阱——已合并全部 5 个活跃栏目，无更活跃栏目可换，
//    故 updateThresholdDays 放宽到 30 防假期误报
const site: SiteConfig = {
    id: 'tyu-wy',
    name: '太原学院外语系',
    url: 'https://www.tyu.edu.cn/wyux/index.htm',
    icon: 'https://present.zigzagyang.monster/rsshub-icons/college/tyu-wy.png',
    channels: [
        { name: '系部动态', listUrl: 'https://www.tyu.edu.cn/wyux/xbdt.htm' },
        { name: '教学科研', listUrl: 'https://www.tyu.edu.cn/wyux/jxky.htm' },
        { name: '党建工作', listUrl: 'https://www.tyu.edu.cn/wyux/djgz.htm' },
        { name: '团学工作', listUrl: 'https://www.tyu.edu.cn/wyux/txgz.htm' },
        { name: '就业指导', listUrl: 'https://www.tyu.edu.cn/wyux/jyzd.htm' },
    ],
    list: {
        item: 'li.list_rone',
        date: 'h2 span',
    },
    detail: {
        title: '.contt_tit h1',
        date: '.contt_tit span',
        content: '.v_news_content',
    },
    updateThresholdDays: 30,
};

export default site;
