import type { SiteConfig } from '@/utils/generic-site/types';

// 山西中医药大学国际教育学院
// 探测日期 2026-09-09：UTF-8，VSB9（苏迪）CMS（vsb_content / _showDynClicks / wbnews 特征）
// 四个栏目（学院要闻/通知公告/教育教学/党的建设）列表页共用同一模板 div.lm_list > ul > li，
// 列表页标题完整无截断，日期在 li 下的 <span>（格式 2026/09/03）。
// 详情页：标题 h1.c-title，日期在 .other-s（"发布日期：2026-09-03 ..."），正文 .v_news_content。
// 站点整体低频：学院要闻相邻条目间隔约 2-3 个月（2026/09/03 ← 2026/06/22 ← 2026/01/18），
// 四栏目合并后近期条目 2026/09/03、2026/07/02、2026/06/22，阈值放宽到 90 天防寒暑假误报。
const site: SiteConfig = {
    id: 'sxtcm-gj',
    name: '山西中医药大学国际教育学院',
    url: 'https://gjzx.sxtcm.edu.cn',
    icon: 'https://present.zigzagyang.monster/rsshub-icons/college/sxtcm-gj.png',
    channels: [
        { name: '学院要闻', listUrl: 'https://gjzx.sxtcm.edu.cn/xyyw.htm' },
        { name: '通知公告', listUrl: 'https://gjzx.sxtcm.edu.cn/tzgg.htm' },
        { name: '教育教学', listUrl: 'https://gjzx.sxtcm.edu.cn/jyjx.htm' },
        { name: '党的建设', listUrl: 'https://gjzx.sxtcm.edu.cn/ddjs.htm' },
    ],
    list: {
        item: '.lm_list ul li',
        date: 'span',
    },
    detail: {
        title: 'h1.c-title',
        date: '.other-s',
        content: '.v_news_content',
    },
    updateThresholdDays: 90,
};

export default site;
