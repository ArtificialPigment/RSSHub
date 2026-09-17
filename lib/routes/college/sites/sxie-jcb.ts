import type { SiteConfig } from '@/utils/generic-site/types';

// 山西能源学院强基学院（主站子路径站，入口 https://www.sxie.edu.cn/jcb/ ）
// 探测日期 2026-09-17：UTF-8，博达 VSB CMS（详情页 #vsb_content/.v_news_content、
// wbnews 计数器，详情路径 info/<栏目id>/<文章id>.htm，列表链接为相对路径 ../info/...）。
// 栏目构成（导航「公告动态」下两个子栏目，模板完全一致）：
//   通知公告 ggdt/tzgg.htm：.txt-list ul li，15 条/页，标题在 a 的 title 属性
//     （完整无截断），日期在 li > span（YYYY-MM-DD）
//   系部动态 ggdt/xbdt.htm：同上结构
// 详情页：标题 h3.title，日期 .art-itro span:first-child（"发布时间：YYYY-MM-DD"，
//   第二个 span 是阅读数脚本，需用 first-child 避开），正文 #vsb_content（无噪声，
//   个别通知正文为公示图片+PDF 附件，附件由引擎自动挂 enclosure）
// 系部动态列表混有微信外链（mp.weixin.qq.com，人文知识竞赛获奖名单类），
//   detail 选择器逗号并联——站内页命中 h3.title/#vsb_content 组，微信页命中
//   #activity-name/#js_content 组，互不干扰（微信日期选择器不命中，回退列表日期）
// 未并入栏目：党建工作/工作动态 djgz/gzdt.htm 停更（最新 2024-11-06），非新闻公告类，不收录
// 更新节奏：系部动态学期内约 1 周~1 月一条，通知公告月级且偏采购/竞赛通知；
//   整站暑期空窗明显——xbdt 最新 2026-08-08（探测时已 40 天，验收第 2 条按暑期空窗处理，
//   保留配置），tzgg 最新 2026-05-28。阈值按暑期空窗站放宽取 30
const site: SiteConfig = {
    id: 'sxie-jcb',
    name: '山西能源学院强基学院',
    url: 'https://www.sxie.edu.cn/jcb/',
    icon: 'https://present.zigzagyang.monster/rsshub-icons/college/sxie-jcb.png',
    channels: [
        { name: '系部动态', listUrl: 'https://www.sxie.edu.cn/jcb/ggdt/xbdt.htm' },
        { name: '通知公告', listUrl: 'https://www.sxie.edu.cn/jcb/ggdt/tzgg.htm' },
    ],
    list: {
        item: '.txt-list ul li',
        titleAttr: 'title',
        date: 'span',
    },
    detail: {
        title: 'h3.title, #activity-name',
        date: '.art-itro span:first-child',
        content: '#vsb_content, #js_content',
    },
    updateThresholdDays: 30,
};

export default site;
