import type { SiteConfig } from '@/utils/generic-site/types';

// 运城学院外语系（https://www.ycu.edu.cn/wyx/）
// 探测日期 2026-10-14：UTF-8。学校主站子路径站（非独立子域——调研时试 wyx/fl
// 子域均未响应，实为 /wyx/ 路径；主站 ycu.edu.cn 院系设置页链接确认）。
// CMS 自研：栏目页 C<id>.html、文章 A<id>.html，静态渲染。
//
// 栏目取舍（两栏目同取自系首页，首页两块列表结构对称、条目充足）：
// - 系部新闻：首页 div.mainclr.newlist（左栏「系内新闻」，最新 2026-09-29，8 条）
// - 通知公告：首页 div.maincr.newlist（右栏，最新 2026-09-16，20 条；含 PDF 直链，
//   引擎自动挂 enclosure）
// 学术研究/党建工作/学生工作等栏目页（C....html）内容均并入首页两块，不重复收。
//
// 踩到的坑：
// 1. 列表 a 的 title 属性与文本一样被截断（"..."),不能用 titleAttr，靠 detail.title
//    补全（div.newstitle 原文完整）。
// 2. 日期在 li > span，形如 "(2026-09-29)"，引擎默认解析可提取。
// 3. 左右两块 class 只差一个字母（mainclr/maincr），选择器勿简写。
const site: SiteConfig = {
    id: 'ycu-wyx',
    name: '运城学院外语系',
    url: 'https://www.ycu.edu.cn/wyx/index.html',
    icon: 'https://present.zigzagyang.monster/rsshub-icons/college/ycu-wyx.png',
    channels: [
        { name: '系部新闻', listUrl: 'https://www.ycu.edu.cn/wyx/index.html' },
        {
            name: '通知公告',
            listUrl: 'https://www.ycu.edu.cn/wyx/index.html',
            list: {
                item: 'div.maincr.newlist ul li',
                date: 'span',
            },
        },
    ],
    list: {
        item: 'div.mainclr.newlist ul li',
        date: 'span',
    },
    detail: {
        title: 'div.newstitle',
        date: 'div.newstime',
        content: 'div.content',
    },
    updateThresholdDays: 30,
};

export default site;
