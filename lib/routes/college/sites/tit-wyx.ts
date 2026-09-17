import type { SiteConfig } from '@/utils/generic-site/types';

// 太原工业学院外语部（https://wyx.tit.edu.cn/index.htm ）
// 探测日期 2026-09-17：UTF-8。CMS 为维博（VSB）高校站群系统（详情页 id=vsb_content、
// _showDynClicks 点击统计脚本为典型特征），详情页路径 info/<栏目id>/<文章id>.htm。
//
// 栏目构成（首页导航「更多>>」入口）：
// - 最新动态 index/zxdt.htm：活跃，暑期仍持续更新（最新 2026-09-14），本路由时效来源
// - 通知公告 index/yysl.htm：低频（最新 2026-05-18），赛事/评选通知存档，并入同一路由
// 两栏目列表/详情模板完全一致，共用站点级选择器。
//
// 踩到的坑：
// 1. 列表页标题文本部分截断（ul 宽度限制，无 "..." 但尾部缺字，如
//    "外语部教师参加"），完整标题在 <a> 的 title 属性，用 titleAttr 解决。
// 2. 列表日期在条目的 <p> 元素（li.clearfix 内 a + p），date 配 'p'。
// 3. 详情页 .other-s 为「发布日期：YYYY-MM-DD  点击：<script>」行，可作日期源；
//    正文 .v_news_content 干净（嵌套于 #vsb_content 内，无需 remove）。
//
// 更新节奏：最新动态相邻间隔典型 5~10 天、偶发 16~23 天（暑期低频但未停更），
// 寒暑假空窗风险存在，阈值取 30。minPerChannel 保底通知公告不被活跃栏目挤出 limit。
const site: SiteConfig = {
    id: 'tit-wyx',
    name: '太原工业学院外语部',
    url: 'https://wyx.tit.edu.cn/index.htm',
    icon: 'https://present.zigzagyang.monster/rsshub-icons/college/tit-wyx.png',
    channels: [
        { name: '最新动态', listUrl: 'https://wyx.tit.edu.cn/index/zxdt.htm' },
        { name: '通知公告', listUrl: 'https://wyx.tit.edu.cn/index/yysl.htm' },
    ],
    list: {
        item: 'div.listmain .lm_list ul li',
        titleAttr: 'title',
        date: 'p',
    },
    detail: {
        title: 'h1.c-title',
        date: '.other-s',
        content: '.v_news_content',
    },
    limit: 30,
    minPerChannel: 5,
    updateThresholdDays: 30,
};

export default site;
