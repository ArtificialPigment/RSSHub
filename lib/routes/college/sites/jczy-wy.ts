import type { SiteConfig } from '@/utils/generic-site/types';

// 晋城职业技术学院外语系
// 探测日期 2026-09-09：UTF-8。CMS 为学院统一直接发布系统（内容页为 UUID 路径，
// 列表页 PC/移动双模板，showMobile 由 JS `$("#showMobile").html($("#showPc").html())` 复制
// showPc 而来，服务端 HTML 里只需读 #showPc）。
//
// 踩到的坑：
// 1. 列表条目是无包裹的裸 <a>（#showPc 的直接子元素，无 li/div 套层），引擎
//    `$item.find('a')` 只找后代、对根 <a> 返回空，故 link 用 ':scope' 取元素自身。
//    标题/日期分别在条目的第 1/2 个 <div>，用 div:first-child / div:last-child。
// 2. xygg/xytz 详情页正文容器写成 <p class="text">，其内又嵌套 <p>，触发 HTML 自动
//    闭合——.text 变成空段落，真正的正文 <p>/<table> 全是 .show.detail 的散装子元素，
//    唯一单元素包裹是 .show.detail（会带 title/name 元数据前缀，但全文完整）。
//    故详情只配 content，title 用列表页完整标题（#showPc 标题未截断），date 用列表日期。
// 3. 外语系（jgsz/jxbm/wyx）是另一套模板：列表 .list-box a.list-item、详情正文 .text
//    （此处 .text 为正常容器，非空），需栏目级覆盖。
//
// 栏目取舍（需求方要求把 xygg/xytz 并入同一条路由，外语系主页已几乎停更）：
// - 学院公告 xygg：活跃（最新 2026-09-09），站点级模板，本路由的时效来源。
// - 学院通知 xytz：停更（最新 2023-04-05），需求方明确要求并入，保留作历史公告。
// - 外语系部门新闻 bmxw：停更（最新 2023-02-24），系部自身历史新闻，栏目级覆盖收录。
// 阈值按活跃栏目 xygg 定：近期相邻条目间隔约 1~5 天，取 2~3 倍并留余量。
const site: SiteConfig = {
    id: 'jczy-wy',
    name: '晋城职业技术学院外语系',
    url: 'https://www.sxjczy.cn/jczy/thtl/jgsz/jxbm/wyx/index.html',
    channels: [
        { name: '学院公告', listUrl: 'https://www.sxjczy.cn/jczy/thtl/xyxw/xygg/index.html' },
        { name: '学院通知', listUrl: 'https://www.sxjczy.cn/jczy/thtl/xyxw/xytz/index.html' },
        {
            name: '外语系部门新闻',
            listUrl: 'https://www.sxjczy.cn/jczy/thtl/jgsz/jxbm/wyx/bmxw/index.html',
            list: {
                item: '.list-box a.list-item',
                link: ':scope',
                title: 'div:first-child',
                date: 'div:last-child',
            },
            detail: {
                content: '.text',
            },
        },
    ],
    list: {
        item: '#showPc a.tab-content-item',
        link: ':scope',
        title: 'div:first-child',
        date: 'div:last-child',
    },
    detail: {
        content: '.show.detail',
    },
    updateThresholdDays: 14,
};

export default site;
