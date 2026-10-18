import type { SiteConfig } from '@/utils/generic-site/types';

// 四川轻化工大学外语学院（https://webadm.suse.edu.cn/_s49/main.psp，WebPlus 站群）
// 探测日期 2026-10-14：UTF-8。CMS 为维网 WebPlus（wp-menu 导航、list.psp/page.psp、
// portletmode="simpleList" 配置串、WP_VisitCount 浏览计数）。
//
// 栏目（首页导航 + 首页区块「更多」遍历，列表模板完全一致：ul.news_list li，
// <span class="news_title"><a title="完整标题">（文本即完整，title 属性兜底）
// + <span class="news_meta">YYYY-MM-DD</span>，每页 14 条）：
// - 学院新闻 /_s49/xyxw/list.psp（c2806）：活跃，最新 2026-10-13，时效来源
// - 通知公告 /_s49/tzgg/list.psp（c2807）：活跃，奖学金/助学金公示为主，最新 2026-10-13
// - 教学动态 /_s49/jxdt/list.psp（c3944）：活跃，最新 2026-09-15
// - 学工动态 /_s49/1887/list.psp（c1887）：活跃，最新 2026-09-17
// - 科研动态 /_s49/1882/list.psp（c1882）：低频，最新 2026-09-15
// - 党建动态 /_s49/1871/list.psp（c1871）：低频，最新 2026-10-13
// 详情：h1.arti_title / span.arti_update（"发布时间：YYYY-MM-DD"）/ div.wp_articlecontent
// （正文容器干净，发布者/浏览次数在容器外，无需 remove）。
// 需求给的入口是 WebPlus 深层链接 _s49/main.psp，即学院站首页，结构如上。
const site: SiteConfig = {
    id: 'suse-wy',
    name: '四川轻化工大学外语学院',
    url: 'https://webadm.suse.edu.cn/_s49/main.psp',
    icon: 'https://present.zigzagyang.monster/rsshub-icons/college/suse-wy.png',
    channels: [
        { name: '学院新闻', listUrl: 'https://webadm.suse.edu.cn/_s49/xyxw/list.psp' },
        { name: '通知公告', listUrl: 'https://webadm.suse.edu.cn/_s49/tzgg/list.psp' },
        { name: '教学动态', listUrl: 'https://webadm.suse.edu.cn/_s49/jxdt/list.psp' },
        { name: '学工动态', listUrl: 'https://webadm.suse.edu.cn/_s49/1887/list.psp' },
        { name: '科研动态', listUrl: 'https://webadm.suse.edu.cn/_s49/1882/list.psp' },
        { name: '党建动态', listUrl: 'https://webadm.suse.edu.cn/_s49/1871/list.psp' },
    ],
    list: {
        item: 'ul.news_list li',
        titleAttr: 'title',
        date: 'span.news_meta',
    },
    detail: {
        title: 'h1.arti_title',
        date: 'span.arti_update',
        content: 'div.wp_articlecontent',
    },
    limit: 30,
    minPerChannel: 2,
    updateThresholdDays: 14,
};

export default site;
