import type { SiteConfig } from '@/utils/generic-site/types';

// 山西大同大学外国语学院
// 探测日期 2026-09-09：UTF-8，迅睿CMS(Dayrui，URL 形如 news-show-<id>.html、/hits、dr_show_hits)
// 坑 1：各栏目列表页（news-list-*.html）全部走 AJAX 动态加载
//       （POST api-ajax_list-<page>.html 返回 JSON，静态 HTML 里列表容器为空），
//       通用引擎抓不到，故改用服务端渲染的首页作为 listUrl。
// 坑 2：首页有多个 .oh > .fl/.fr 板块且类名大量重复（news1/news2 共用），
//       只能靠唯一锚点定位：学院新闻块内含 #slideBox（图片轮播）。
// 坑 3：列表标题文本被 ".." 截断，完整标题在 <a> 的 title 属性里 → 用 titleAttr: 'title'。
// 栏目取舍：通知公告（.news9）已探测但排除——最新停在 2026-01-24（停更近 8 个月），
//       且 9 条中 2 条为 PDF 内嵌 iframe（.neirong 无 HTML 正文）、2 条为极短述职报告，
//       不满足全文标准；学院新闻为唯一活跃全文栏目（最新 2026-09-02），故只收此栏。
//       寒暑假长空窗，阈值放宽到 30 天防误报。正文图片 HTTP/2 直连正常，无需 imageProxy。
const site: SiteConfig = {
    id: 'sxdtdx-wgy',
    name: '山西大同大学外国语学院',
    url: 'https://wgyxy.sxdtdx.edu.cn',
    icon: 'https://present.zigzagyang.monster/rsshub-icons/college/sxdtdx-wgy.png',
    channels: [
        {
            name: '学院新闻',
            listUrl: 'https://wgyxy.sxdtdx.edu.cn',
            list: {
                item: '.fl:has(#slideBox) ul.active li',
                titleAttr: 'title',
                date: 'span.fr',
            },
        },
    ],
    list: {
        item: '.fl:has(#slideBox) ul.active li',
        titleAttr: 'title',
        date: 'span.fr',
    },
    detail: {
        title: '.title',
        content: '.neirong',
    },
    updateThresholdDays: 30,
};

export default site;
