import type { SiteConfig } from '@/utils/generic-site/types';

// 上海外语教育出版社（外教社）· 新闻资讯
// 探测日期 2026-09-10：UTF-8，PHPCMS（index.php?m=content&c=index&a=lists&catid=20）
// 列表页 div.news_cell li：a > span.sp1(日期) + span.sp2(标题，完整无截断) + span.sp3(摘要) + span.sp4(查看详情)
// 踩坑：本站新闻详情全部外链到微信公众号（mp.weixin.qq.com），官网只存标题+日期+摘要，无站内详情页。
//   detail 直接配微信文章页选择器（#activity-name / #js_content）即可出全文——应用内请求经
//   request-rewriter 统一带浏览器 UA，微信不拦截；注意裸跑 fetchPage 的独立脚本（不带该 UA）会拿到
//   「环境异常」验证页（~18KB 无正文），属正常现象，不代表路由失效。
//   微信正文图片为 mmbiz.qpic.cn 外链，cleanContent 已还原 data-src；正文容器无 visibility:hidden 问题。
//   微信文章页无静态日期元素，日期沿用列表页 sp1。
// 栏目：官网仅「新闻资讯」一个活跃新闻栏目（list-36=友情链接、list-37=网站地图，均非新闻），单栏目即整站
const site: SiteConfig = {
    id: 'sflep-xwzx',
    name: '外教社·新闻资讯',
    url: 'https://www.sflep.com/list-20-1.html',
    icon: 'https://present.zigzagyang.monster/rsshub-icons/publisher/sflep-xwzx.png',
    channels: [{ name: '新闻资讯', listUrl: 'https://www.sflep.com/list-20-1.html' }],
    list: {
        item: '.news_cell li',
        title: '.sp2',
        date: '.sp1',
    },
    detail: {
        title: '#activity-name',
        content: '#js_content',
    },
    updateThresholdDays: 14,
};

export default site;
