import type { SiteConfig } from '@/utils/generic-site/types';

// 四川农业大学人文学院（https://rwy.sicau.edu.cn，外语教学挂靠：英语系、翻译系、公共外语）
// 探测日期 2026-10-14：UTF-8。CMS 为维博（VSB）高校站群系统（info/<栏目id>/<文章id>.htm）。
//
// 栏目构成（首页版块「更多」入口）：
// - 学院要闻 index/xyxw.htm：活跃（最新 2026-10-14），本路由时效来源
// - 通知公告 index/tz.htm：活跃（最新 2026-09-23），辅修招生/奖助学金公示为主。
//   注意列表页是 index/tz.htm 而非直觉的 tzgg.htm（tzgg.htm 404）
// 两栏目列表模板一致（div.title 行内日期绝对定位），详情模板一致。
//
// 踩到的坑：
// 1. 列表标题 CSS 省略号截断（text-overflow: ellipsis），完整标题在 <a> 的 title
//    属性，必须 titleAttr: 'title'。
// 2. 列表日期在无 class 的绝对定位 <div> 内，date 配 'div'（条目内唯一 div）。
// 3. 详情页标题在非标标签 <P2>（div.article-title 内），日期在 .borde 灰框
//    （"作者:… 发布于:2026年10月14日 15:00 点击数：…"），默认解析器提取首个日期串；
//    正文 #vsb_content > .v_news_content 干净。
const site: SiteConfig = {
    id: 'sicau-rwy',
    name: '四川农业大学人文学院',
    url: 'https://rwy.sicau.edu.cn',
    icon: 'https://present.zigzagyang.monster/rsshub-icons/college/sicau-rwy.png',
    channels: [
        { name: '学院要闻', listUrl: 'https://rwy.sicau.edu.cn/index/xyxw.htm' },
        { name: '通知公告', listUrl: 'https://rwy.sicau.edu.cn/index/tz.htm' },
    ],
    list: {
        item: 'div.center-body div.title',
        titleAttr: 'title',
        date: 'div',
    },
    detail: {
        // 标题在非标标签 <p2> 内；取 .article-title 整体会混入 .borde 的作者/日期/点击统计
        title: '.article-title p2',
        date: '.borde',
        content: '.v_news_content',
    },
    limit: 20,
    minPerChannel: 5,
    updateThresholdDays: 14,
};

export default site;
