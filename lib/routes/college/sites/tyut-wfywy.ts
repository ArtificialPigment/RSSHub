import type { SiteConfig } from '@/utils/generic-site/types';

// 太原理工大学文法与外语学院（https://wfywy.tyut.edu.cn，原文法学院与外国语学院合并）
// 探测日期 2026-10-14：UTF-8。CMS 为维博（VSB）高校站群系统（info/<栏目id>/<文章id>.htm）。
//
// 栏目构成（首页版块 MORE 入口）：
// - 学院新闻 index/xyxw.htm：活跃（最新 2026-10-14），本路由时效来源
// - 通知公告 index/tzgg.htm：活跃（最新 2026-09-17），赛事/推免通知为主
// 两栏目列表模板一致（div.txt-list），详情模板一致。
//
// 踩到的坑：
// 1. 列表标题长标题被 CSS 截断（部分显示 "...党支"），完整标题在 <a> 的 title
//    属性，配 titleAttr: 'title'。
// 2. 列表条目 li.flex 内 a.line1 + span 日期，link 配 'a.line1'（栏内另有
//    「更多」类外链 a，限定 line1 防误配——实测栏内仅 line1 是条目链接）。
// 3. 详情页标题 h3.title、日期 .art-itro（"发布时间：2026-10-14 阅读数：…"），
//    正文 #vsb_content_2 > .v_news_content 干净。
// 更新节奏：学院新闻相邻间隔典型 1~4 周（暑期空窗），通知公告赛事季密集，
// 寒暑假有低频风险，阈值取 30，minPerChannel 保底通知公告不被挤出。
const site: SiteConfig = {
    id: 'tyut-wfywy',
    name: '太原理工大学文法与外语学院',
    url: 'https://wfywy.tyut.edu.cn/',
    icon: 'https://present.zigzagyang.monster/rsshub-icons/college/tyut-wfywy.png',
    channels: [
        { name: '学院新闻', listUrl: 'https://wfywy.tyut.edu.cn/index/xyxw.htm' },
        { name: '通知公告', listUrl: 'https://wfywy.tyut.edu.cn/index/tzgg.htm' },
    ],
    list: {
        item: 'div.txt-list ul li',
        link: 'a.line1',
        titleAttr: 'title',
        date: 'span',
    },
    detail: {
        title: 'h3.title',
        date: '.art-itro',
        content: '.v_news_content',
    },
    limit: 20,
    minPerChannel: 5,
    updateThresholdDays: 30,
};

export default site;
