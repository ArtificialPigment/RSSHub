import type { SiteConfig } from '@/utils/generic-site/types';

// 山西医科大学外语系（主站子路径站，入口 https://www.sxmu.edu.cn/wyx/ ）
// 探测日期 2026-10-14：UTF-8，博达 VSB CMS。调研时只定位到主站，实际无独立子域——
// wy.sxmu.edu.cn 对外 403（WAF/未启用），机构真实页面是主站 /wyx/ 子路径
// （主站「学校院系」页 https://www.sxmu.edu.cn/jxdw.htm 链接确认）。
//
// 栏目构成（导航 + 首页区块）：
//   系部新闻 xbxw.htm（info/1009，列表混排 mp.weixin.qq.com 外链的学校级通知转载）
//   科学研究 kxyj.htm（info/1008，同左）
//   新医科英语 xykyy.htm（info/1011，低频）
//   学科竞赛 xkjs.htm（info/1021，低频）
// 列表：div.main3_22 li，标题在 a 的 title 属性（文本带 "· " 前缀），日期 div.time（YYYY-MM-DD）。
// 详情：标题 div.main3_2 .title，日期 .infos li:first-child p（"更新时间" 是第一个 li），
//   正文 div[id^="vsb_content"]（id 带随机后缀，如 vsb_content_1366）。
// 微信外链处理同 sxie-jcb：detail 选择器逗号并联，站内页命中 .title/vsb_content 组，
//   微信页命中 #activity-name/#js_content 组。
// ⚠️ 整站暑期空窗：全部栏目最新条目停在 2026-05-29（探测日 10-14 已 4.5 个月），
//   结构完好但内容断更，验收按暑期空窗处理并在开学后复查；阈值 30。
const site: SiteConfig = {
    id: 'sxmu-wy',
    name: '山西医科大学外语系',
    url: 'https://www.sxmu.edu.cn/wyx/',
    icon: 'https://present.zigzagyang.monster/rsshub-icons/college/sxmu-wy.png',
    channels: [
        { name: '系部新闻', listUrl: 'https://www.sxmu.edu.cn/wyx/xbxw.htm' },
        { name: '科学研究', listUrl: 'https://www.sxmu.edu.cn/wyx/kxyj.htm' },
        { name: '新医科英语', listUrl: 'https://www.sxmu.edu.cn/wyx/xykyy.htm' },
        { name: '学科竞赛', listUrl: 'https://www.sxmu.edu.cn/wyx/xkjs.htm' },
    ],
    list: {
        item: 'div.main3_22 li',
        titleAttr: 'title',
        date: 'div.time',
    },
    detail: {
        title: 'div.main3_2 .title, #activity-name',
        date: '.infos li:first-child p',
        content: 'div[id^="vsb_content"], #js_content',
    },
    limit: 30,
    minPerChannel: 2,
    updateThresholdDays: 30,
};

export default site;
