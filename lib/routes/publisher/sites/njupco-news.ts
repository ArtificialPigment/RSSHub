import type { SiteConfig } from '@/utils/generic-site/types';

// 南京大学出版社 · 新闻中心（入口 http://www.njupco.com/news/ ，注意整站仅 http）
// 探测日期 2026-09-10：UTF-8（虽为老站但非 GBK），帝国CMS（/d/file/ 附件路径、/e/tool/ 反馈入口）
// 踩坑：本社新闻 /news/press/ 与媒体聚焦 /news/media/ 两个栏目的列表均混合外链
//   —— 社方自稿发站内 /news/{press,media}/NNNN.html，转载稿直链微信公众号 / 澎湃 / 上观等站外页。
//   站内 + 微信两类都收（微信详情由应用内浏览器 UA 正常出全文，同 sflep-xwzx），澎湃/上观等
//   DOM 各异的站外链接仍舍弃。detail 选择器用逗号并联（.ny_con ... / #activity-name / #js_content），
//   每类页面只命中其中一组；微信页无静态日期元素，日期沿用列表页 span。
// 列表页 li 内另有摘要 div，引擎无摘要字段、无法利用；li > b > a 文本有截断，完整标题在 title 属性
// 详情页：.ny_con h1 / .ny_con h2（时间：YYYY-MM-DD HH:mm:ss 来源：… 作者：…）/ .ny_con .content
// 栏目构成：本社新闻（press，站内条目 6 条）+ 媒体聚焦（media，站内条目 1 条，慢性低频）；
//   /news/ 汇总页与两栏目首页的站内条目完全重合，去重后无增量，不单列
// 站内条目间隔实测约 6–27 天（2026-07-30 → 08-26 → 09-01），阈值取 45 天
const site: SiteConfig = {
    id: 'njupco-news',
    name: '南京大学出版社·新闻中心',
    url: 'http://www.njupco.com/news/',
    icon: 'https://present.zigzagyang.monster/rsshub-icons/publisher/njupco-news.png',
    channels: [
        { name: '本社新闻', listUrl: 'http://www.njupco.com/news/press/' },
        { name: '媒体聚焦', listUrl: 'http://www.njupco.com/news/media/' },
    ],
    list: {
        // 列表混合外链，收站内自稿 + 微信公众号两类，其余站外（澎湃/上观等）舍弃
        item: 'div.left_con ul li:has(> b > a[href^="/news/"], > b > a[href*="mp.weixin.qq.com"])',
        titleAttr: 'title',
        date: 'span',
    },
    detail: {
        // 站内页命中 .ny_con 组，微信页命中 #activity-name/#js_content 组，互不干扰
        title: '.ny_con h1, #activity-name',
        date: '.ny_con h2',
        content: '.ny_con .content, #js_content',
    },
    // 媒体聚焦的站内条目稀少（首页仅 1 条），保底 2 条防止被本社新闻挤出
    minPerChannel: 2,
    updateThresholdDays: 45,
};

export default site;
