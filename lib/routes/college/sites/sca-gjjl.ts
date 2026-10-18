import type { SiteConfig } from '@/utils/generic-site/types';

// 四川文化艺术学院国际交流学院（多语言中心挂靠，https://cicc.sca.edu.cn）
// 探测日期 2026-10-14：UTF-8。CMS 为苏迪 SiteCM 系（单引号属性、/_rest/st/ 接口、
// /p/<栏目id>/ 页面）。主站 www.sca.edu.cn 有 WAF（裸 curl 首页被「访问被拒绝」），
// cicc 子站正常。注意列表属性用单引号， cheerio 无影响。
//
// 栏目（子站导航，列表模板一致：div.div_item，标题在 .div_title a 的 title 属性
// （列表文本尾部 "..." 截断），日期在 div.date）：
// - 学院新闻 /p/2/：活跃，最新 2026-09-30，共 12 页——几乎全部条目直链微信公众号
// - 通知公告 /p/10/：活跃，微信链接与原生 /p/10/?StId=... 通知混排
// - 党建工作 /p/3/：低频
// 多语言中心 /p/24/ 只有 3 条静态介绍（未来愿景/制度/介绍），不是新闻流，不收。
//
// 详情两套模板逗号并联（sflep/njupco 先例）：
// - 微信文章 #js_content 出全文（应用内请求自带浏览器 UA）
// - 原生通知 div.div_content——注意该站原生通知正文多为空壳（只有「编辑：某某」，
//   真实内容走微信/附件），能抓到多少算多少；日期 .div_title .box div（"时间：…"），
//   微信页不命中则回退列表页日期
const site: SiteConfig = {
    id: 'sca-gjjl',
    name: '四川文化艺术学院国际交流学院',
    url: 'https://cicc.sca.edu.cn',
    icon: 'https://present.zigzagyang.monster/rsshub-icons/college/sca-gjjl.png',
    channels: [
        { name: '学院新闻', listUrl: 'https://cicc.sca.edu.cn/p/2/' },
        { name: '通知公告', listUrl: 'https://cicc.sca.edu.cn/p/10/' },
        { name: '党建工作', listUrl: 'https://cicc.sca.edu.cn/p/3/' },
    ],
    list: {
        item: 'div.div_item',
        link: 'div.div_title a',
        titleAttr: 'title',
        date: 'div.date',
    },
    detail: {
        date: 'div.div_title .box div',
        content: 'div.div_content, #js_content',
    },
    limit: 30,
    minPerChannel: 2,
    updateThresholdDays: 14,
};

export default site;
