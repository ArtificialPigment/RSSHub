import type { SiteConfig } from '@/utils/generic-site/types';

// 吕梁学院外语系（https://wyx.llu.edu.cn）
// 探测日期 2026-10-14：UTF-8。CMS 为维博（VSB）高校站群系统（info/<栏目id>/<文章id>.htm）。
//
// 栏目构成（首页导航）：
// - 工作动态 gzdt.htm：活跃（最新 2026-09-29），本路由时效来源
// - 学生工作 xsgz.htm：低频（最新 2026-06-09），暑期仍有更新，并入同一路由
// 两栏目同为 table 行布局但 class 编号不同（VSB 按栏目生成 cXXXXX/timestyleXXXXX），
// 学生工作在栏目级覆盖 list 选择器；详情页模板一致（同为 format4.css 内容组件）。
//
// 踩到的坑：
// 1. 列表条目行为 <tr>（a.cXXXXX + span.timestyleXXXXX 日期），分隔行无链接由引擎过滤。
// 2. 详情页标题在 td.titlestyle67389（无内层标题标签，直接取 td 文本），
//    日期 span.timestyle67389（"2026-09-29 16:23"），正文 .v_news_content 干净。
const site: SiteConfig = {
    id: 'llu-wyx',
    name: '吕梁学院外语系',
    url: 'https://wyx.llu.edu.cn/',
    icon: 'https://present.zigzagyang.monster/rsshub-icons/college/llu-wyx.png',
    channels: [
        { name: '工作动态', listUrl: 'https://wyx.llu.edu.cn/gzdt.htm' },
        {
            name: '学生工作',
            listUrl: 'https://wyx.llu.edu.cn/xsgz.htm',
            list: {
                item: 'tr:has(a.c67392)',
                link: 'a.c67392',
                titleAttr: 'title',
                date: 'span.timestyle67392',
            },
        },
    ],
    list: {
        item: 'tr:has(a.c67384)',
        link: 'a.c67384',
        titleAttr: 'title',
        date: 'span.timestyle67384',
    },
    detail: {
        title: 'td.titlestyle67389',
        date: 'span.timestyle67389',
        content: '.v_news_content',
    },
    limit: 20,
    minPerChannel: 3,
    updateThresholdDays: 30,
};

export default site;
