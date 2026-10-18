import type { SiteConfig } from '@/utils/generic-site/types';

// 成都轻工职业技术大学外语与文化旅游学院（https://wyxy.cdqg.edu.cn）
// ⚠️ 机构沿革：任务书「基础教学部（外语教研室）」已不存在——该校原 www.cdtc.edu.cn
//   整体迁移至 www.cdqg.edu.cn，原基础教学部更名为「人文与通识教育学院」
//   （jcb.cdqg.edu.cn，下设中文/数学/物理/军事/传统文化教研室，已无外语教研室），
//   外语教学现归外语与文化旅游学院，故本配置对应该院（site-id 沿用任务书命名）。
// 探测日期 2026-10-14：UTF-8，博达 VSB。栏目两列表均 5 条/页（单页静态列表，无翻页收录）：
//   学院动态 index/xydtmyl.htm：li > a（title 属性完整标题）+ a 内灰色 span [YYYY/MM/DD]
//     + li 内独立 span【摘要】（date 选择器用 'a span' 避开摘要）
//   通知公告 tzgg/tzgg.htm：同上结构，低频（最新 2026-09-24）
// 详情页：h1 标题 + 「YYYY年M月D日 hh:mm 撰稿…」div 日期行 + .v_news_content 正文
// 列表纯站内 info/ 链接，无外链混排；阈值 30
const site: SiteConfig = {
    id: 'cdtc-jcjxb',
    name: '成都轻工职业技术大学外语与文化旅游学院',
    url: 'https://wyxy.cdqg.edu.cn',
    icon: 'https://present.zigzagyang.monster/rsshub-icons/college/cdtc-jcjxb.png',
    channels: [
        { name: '学院动态', listUrl: 'https://wyxy.cdqg.edu.cn/index/xydtmyl.htm' },
        { name: '通知公告', listUrl: 'https://wyxy.cdqg.edu.cn/tzgg/tzgg.htm' },
    ],
    list: {
        item: 'li:has(a[href*="info/"])',
        titleAttr: 'title',
        date: 'a span',
    },
    detail: {
        content: '.v_news_content',
    },
    updateThresholdDays: 30,
};

export default site;
