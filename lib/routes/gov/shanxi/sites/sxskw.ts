import type { SiteConfig } from '@/utils/generic-site/types';

// 山西省社会科学界联合会（http://www.sxskw.org.cn ，仅 http）
// 探测日期 2026-09-17：UTF-8，开普云 jpaas CMS。
//
// 坑（核心）：全站栏目页都是 JS 壳——列表由 unitbuild.js 在客户端 GET
//   /api-gateway/jpaas-publish-server/front/page/build/unit 拉取（返回 JSON，data.html 为列表片段），
//   服务端 HTML 里没有任何列表链接；Baiduspider UA 也不触发服务端渲染；无 sitemap / jsearch。
//   通用引擎只抓静态 HTML、无法消费该 JSON API。唯一静态列表来源是首页——每次发布时各栏目
//   最新单元被烘焙进首页 HTML，且比栏目页 API 还新（2026-09-17 新条目已在首页，API 仍停在 08-17）。
//   故四个栏目 listUrl 全部指向首页，各用栏目级 list 选择器取自己的静态单元：
//     通知公告   ul.sklNotice li（8 条，title 属性完整标题 + em 日期）
//     社科联课题 ul#ul1 li（5 条，title 属性完整标题，列表无日期 → 详情页取）
//     社科评奖单元 ul#ul2 混排 yxskcgpj/bbpgcpj 两个子栏目（共 5 条），用 :has + href 子串拆分；
//       链接文本截断带 "..." 且无 title 属性 → detail.title 补全，日期也由详情页取
// 详情页为静态页，全站统一模板：#TitleDiv 标题、#LoadtimeDv p 日期行（"2026-08-17 来源："，
//   引擎默认解析剔除"来源："后段）、#ContentDiv.infotxt 正文（无噪声包裹，无需 remove）。
// 更新节奏：通知公告学期内约 1~10 天一条，课题/评奖月级低频（评奖 2026 年新条目 3 条、
//   百部工程最新停在 2025-03）。暑期实测空窗 31 天（2026-08-17 → 09-17），
//   按 SITES.md 寒暑假空窗规则阈值取 30，假期超阈告警由人工判断。
const site: SiteConfig = {
    id: 'sxskw',
    name: '山西省社会科学界联合会',
    url: 'http://www.sxskw.org.cn/',
    icon: 'https://present.zigzagyang.monster/rsshub-icons/gov/shanxi/sxskw.png',
    channels: [
        {
            name: '通知公告',
            listUrl: 'http://www.sxskw.org.cn/index.html',
            list: {
                item: 'ul.sklNotice li',
                titleAttr: 'title',
                date: 'em',
            },
        },
        {
            name: '优秀社科成果评奖',
            listUrl: 'http://www.sxskw.org.cn/index.html',
            list: {
                item: 'ul#ul2 li:has(a[href*="/skpj/yxskcgpj/"])',
            },
        },
        {
            name: '百部工程评价',
            listUrl: 'http://www.sxskw.org.cn/index.html',
            list: {
                item: 'ul#ul2 li:has(a[href*="/skpj/bbpgcpj/"])',
            },
        },
        {
            name: '社科联课题',
            listUrl: 'http://www.sxskw.org.cn/index.html',
            list: {
                item: 'ul#ul1 li',
                titleAttr: 'title',
            },
        },
    ],
    // 站点级 list 仅为满足类型必填，实际四栏目均有栏目级覆盖
    list: {
        item: 'ul.sklNotice li',
        titleAttr: 'title',
        date: 'em',
    },
    detail: {
        title: '#TitleDiv',
        date: '#LoadtimeDv p',
        content: '#ContentDiv',
    },
    updateThresholdDays: 30,
};

export default site;
