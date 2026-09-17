import type { SiteConfig } from '@/utils/generic-site/types';

// 山西电子科技学院公共教学部
// 探测日期 2026-09-17：UTF-8。CMS 为维网 WebPlus（详情页 #vsb_content / .v_news_content，
// 列表分页 pb_sys_common、_showDynClickBatch 点击统计，内容页路径 info/<栏目id>/<文章id>.htm）。
//
// 踩到的坑：
// 1. 探测脚本对栏目列表页报"未找到列表容器"——列表容器 div.new_list3 > dl > dd 未被脚本
//    识别，但服务端 HTML 完整，curl 直取即可，无需 JS 渲染。
// 2. 列表条目标题文本部分被截断（尾部 "..."），完整标题在 <a> 的 title 属性里，
//    故 list 配 titleAttr: 'title'。
// 3. 教学动态列表不是严格按日期排序（07-07 的 1281 排在 06-10 的 1274 之后），
//    日期以 span.fr.gray 文本为准，引擎合并后统一按日期倒序。
// 4. 详情页标题/日期在 .container_right_title2 的 h3 / p（"发布日期：YYYY-MM-DD 浏览次数："），
//    与正文 #vsb_content 分离，正文容器干净，无需 remove。
//
// 栏目取舍（首页导航 + 首页区块遍历）：
// - 通知公告 index/tzgg（info/1004）：停更，共 5 条、最新 2024-05-09。属需求指定的
//   通知公告类栏目，保留收录，新通知发布时会自动浮到合并列表顶部。
// - 教学动态 jxgl/jxdt（info/1308）：全站最活跃，共 29 条，2026 年内 01→07 月约 2–6 周一条，
//   最新 2026-07-07，本路由的时效来源。
// - 党建动态 djgz/djdt（info/1305）：低频，共 17 条，最新 2025-11-24，模板一致一并并入。
// - 不收录：科学研究 kxyj 仅 2 条且停在 2025-09-24；师生风采 index/ssfc 是图片画廊模板
//   （li > .imgbox > a，无日期、无文字摘要）；首页轮播"新闻"（info/1301）无对应列表页，
//   条目与教学动态等重叠。
// minPerChannel 取 2：停更的通知公告（2024 年）纯按日期合并会被挤出 limit，
//   保底 2 条让订阅者能看到该栏目的存在与新条目。
// 阈值：活跃栏目教学动态学期内间隔约 2–6 周，叠加寒暑假空窗（2026 年暑期 07-07 后
//   至探测日 09-17 无更新，新学期刚开始），按空窗站放宽取 30。
const site: SiteConfig = {
    id: 'sxdzkj-ggjxb',
    name: '山西电子科技学院公共教学部',
    url: 'https://ggjxb.sxdzkj.edu.cn',
    icon: 'https://present.zigzagyang.monster/rsshub-icons/college/sxdzkj-ggjxb.png',
    channels: [
        { name: '通知公告', listUrl: 'https://ggjxb.sxdzkj.edu.cn/index/tzgg.htm' },
        { name: '教学动态', listUrl: 'https://ggjxb.sxdzkj.edu.cn/jxgl/jxdt.htm' },
        { name: '党建动态', listUrl: 'https://ggjxb.sxdzkj.edu.cn/djgz/djdt.htm' },
    ],
    list: {
        item: '.new_list3 dd',
        titleAttr: 'title',
        date: 'span.fr.gray',
    },
    detail: {
        title: '.container_right_title2 h3',
        date: '.container_right_title2 p',
        content: '#vsb_content',
    },
    limit: 30,
    minPerChannel: 2,
    updateThresholdDays: 30,
};

export default site;
