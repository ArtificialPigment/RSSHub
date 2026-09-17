import type { SiteConfig } from '@/utils/generic-site/types';
import { parseDate } from '@/utils/parse-date';
import timezone from '@/utils/timezone';

// 吕梁幼儿师范高等专科学校·旅游管理系（独立子站 https://lyglx.llsz.edu.cn ，与主站模板不同）
// 探测日期 2026-09-17：UTF-8，MetInfo 5.3.19（/html/web/<栏目>/<id>.html 静态详情页、
// ul.met-page-ajax 列表、met_pager 分页 list-N.html）
//
// 栏目构成（信息公告类按需求收录；教学科研/文化生活各栏实测均停更于 2024-07，不收）：
// - 最新消息：首页 .met-index-notice 块（"更多 >"指向系部新闻栏目，条目全是【系部新闻】），
//   日期在 <time>（YYYY-MM-DD 完整）。这是全站时效来源——最新 2026-07-05，
//   而系部新闻栏目静态列表页竟停更在 2026-01-08（MetInfo 静态页未重新生成，
//   首页块比栏目页新半年），故把首页块单列为一个栏目
// - 系部新闻 /xinxigonggao/xibuxinwen/：列表 10 条/页共 4 页，条目全部直链微信公众号
//   （"且文章有外链接"注释），站内不存正文。最新 2026-01-08（静态页停更，见上）
// - 系部公告 /xinxigonggao/xibugonggao/：站内详情页，停更（最新 2024-07，附幼招生），
//   作历史公告并入，minPerChannel 保底防挤出
//
// 踩到的坑：
// 1. 栏目列表日期拆成两个 <p>（.day "08" + .year-month "2026-01"），.updatetime 文本为
//    "08\n2026-01"，默认解析不认。dateParser 锚定 "^日 + 年-月" 模式命中栏目列表；
//    首页 <time> 的完整日期不命中该模式，返回 undefined 走引擎默认解析
// 2. 详情页两套模板，逗号并联各命中一组（同 njupco-news 手法）：
//    站内页 .met-shownews-header h1 / .met-editor；微信页 #activity-name / #js_content
//    （应用内请求经 request-rewriter 带浏览器 UA，微信不拦截）。
//    两类详情页均无静态日期元素，日期沿用列表页
// 3. 列表条目标题为 <a> 文本，完整无截断，无需 titleAttr
//
// 更新节奏：学期内约 1–2 周一条（2026-05-14 → 05-28 → 06-30 → 07-05），
//   最新条目 2026-07-05 后进入暑假空窗（探测日 2026-09-17 已 74 天无更新，整站性假期停更），
//   阈值按假期空窗站放宽取 30，开学后若持续告警再人工复核
const site: SiteConfig = {
    id: 'llsz-lygl',
    name: '吕梁幼儿师范高等专科学校旅游管理系',
    url: 'https://lyglx.llsz.edu.cn',
    icon: 'https://present.zigzagyang.monster/rsshub-icons/college/llsz-lygl.png',
    channels: [
        {
            name: '最新消息',
            listUrl: 'https://lyglx.llsz.edu.cn',
            // 首页"最新消息"块：全站唯一含 2026-07 新条目的列表，日期在 <time>
            list: {
                item: '.met-index-notice .news-list li',
                date: 'time',
            },
        },
        { name: '系部新闻', listUrl: 'https://lyglx.llsz.edu.cn/html/web/xinxigonggao/xibuxinwen/index.html' },
        { name: '系部公告', listUrl: 'https://lyglx.llsz.edu.cn/html/web/xinxigonggao/xibugonggao/index.html' },
    ],
    list: {
        item: 'ul.met-page-ajax div.widget',
        date: '.updatetime',
    },
    // 栏目列表日期为 "日\n年-月" 拼接（.day + .year-month），锚定开头避免误吞完整日期；
    // 不匹配时返回 undefined，引擎回退默认解析（首页 <time> 的 YYYY-MM-DD）
    dateParser: (text) => {
        const split = text.trim().match(/^(\d{1,2})\s+(\d{4})-(\d{1,2})/);
        if (split) {
            return timezone(parseDate(`${split[2]}-${split[3]}-${split[1]}`), 8);
        }
        return;
    },
    detail: {
        // 站内详情命中 .met-* 组，微信外链命中 #activity-name/#js_content 组，互不干扰
        title: '.met-shownews-header h1, #activity-name',
        content: '.met-editor, #js_content',
    },
    // 系部公告停更于 2024-07，保底 2 条防止被活跃栏目挤出 limit
    minPerChannel: 2,
    updateThresholdDays: 30,
};

export default site;
