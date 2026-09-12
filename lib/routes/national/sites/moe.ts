import type { SiteConfig } from '@/utils/generic-site/types';

// 中华人民共和国教育部（http://www.moe.gov.cn ，仅 http 入站但详情页链接协议随列表）
// 探测日期 2026-09-12：UTF-8，TRS CMS（WAS 检索 + 静态详情页 tYYYYMMDD_<id>.html）
// 栏目构成（按需求文档指定入口），两栏目列表模板不同，各自做栏目级覆盖：
//   教育部文件：was5 检索页 channelid=239993，裸参访问即按日期倒序输出全部文件（无需 searchword），
//     每页 15 条；个别标题列表内截断（"..."），无 title 属性，靠 detail.title 补全
//   教育要闻：/jyb_sy/sy_jyyw/ 静态列表 #list li，完整标题在 title 属性（titleAttr），
//     偶发新闻发布会 /fbh/live/ 直播页条目——无正文容器，引擎自动降级为标题+链接条目
// 详情页两套模板，逗号并联选择器各命中一组（同 njupco-news 手法）：
//   srcsite 文件页：#downloadContent（.details-policy-box，内含 h1 + 发文字号 + 正文 + PDF 附件链接），
//     无独立日期元素，日期沿用列表页 span
//   jyb_ 要闻页（含 s6052 新华社转载）：div.TRS_Editor 正文，.moe-detail-shuxing 含 日期+来源
// 更新节奏：两栏目均活跃（要闻日更、文件周更），阈值取 7
const site: SiteConfig = {
    id: 'moe',
    name: '中华人民共和国教育部',
    url: 'http://www.moe.gov.cn',
    icon: 'https://present.zigzagyang.monster/rsshub-icons/national/moe.png',
    channels: [
        {
            name: '教育部文件',
            listUrl: 'http://www.moe.gov.cn/was5/web/search?channelid=239993',
            list: {
                item: '.scy_lbsj-right-nr ul li',
                date: 'span',
            },
        },
        {
            name: '教育要闻',
            listUrl: 'http://www.moe.gov.cn/jyb_sy/sy_jyyw/',
            list: {
                item: '#list li',
                titleAttr: 'title',
                date: 'span',
            },
        },
    ],
    // 站点级 list 仅为满足类型必填，实际两栏目均有栏目级覆盖
    list: {
        item: '#list li',
        date: 'span',
    },
    detail: {
        title: 'h1',
        date: '.moe-detail-shuxing',
        content: '#downloadContent, .TRS_Editor',
        remove: 'h1',
    },
    updateThresholdDays: 7,
};

export default site;
