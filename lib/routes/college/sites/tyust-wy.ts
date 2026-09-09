import type { SiteConfig } from '@/utils/generic-site/types';

// 太原科技大学外国语学院（需求文档误作"太原科技学院"，域名 tyust.edu.cn 为太原科技大学，以 URL 为准）
// 探测日期 2026-09-09：UTF-8，博达 VSB 网站群 CMS（vsb-box / v_news_content / _showDynClicks 特征）
// 踩坑：
// 1. 全站自 2026-06-17 后进入暑假停更（各栏目逐一探测，全站最新即 2026-06-17），
//    非"停更栏目"陷阱——无更活跃的栏目可换，阈值按低频站放宽到 30 天
// 2. 列表项文本在部分栏目页被截断，完整标题在链接 title 属性里，故用 titleAttr
// 3. 详情页标题 H2 与导航 H2 混排，须限定在 form[name='_newscontent_fromname'] 内
// 4. 党务活动栏目最新停在 2025-09，仍收录（引擎按日期倒序合并，旧条目自然沉底）
const site: SiteConfig = {
    id: 'tyust-wy',
    name: '太原科技大学外国语学院',
    url: 'https://wy.tyust.edu.cn',
    channels: [
        { name: '学院新闻', listUrl: 'https://wy.tyust.edu.cn/index/xyxw.htm' },
        { name: '团学活动', listUrl: 'https://wy.tyust.edu.cn/txgz/txhd.htm' },
        { name: '就业考研', listUrl: 'https://wy.tyust.edu.cn/txgz/jyky.htm' },
        { name: '党务活动', listUrl: 'https://wy.tyust.edu.cn/djgz/dwhd.htm' },
    ],
    list: {
        item: 'ul.n_listxx1 li',
        titleAttr: 'title',
        date: 'span.time',
    },
    detail: {
        title: "form[name='_newscontent_fromname'] h2",
        date: "form[name='_newscontent_fromname'] h3 span",
        content: '.v_news_content',
    },
    updateThresholdDays: 30,
};

export default site;
