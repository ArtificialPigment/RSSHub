import type { SiteConfig } from '@/utils/generic-site/types';

// 太原师范学院外国语学院（https://wyx.tynu.edu.cn）
// 探测日期 2026-10-14：UTF-8。CMS 为维博（VSB）高校站群系统（info/<栏目id>/<文章id>.htm），
// 站点套自定义 Bootstrap 主题（VSB 内容模板仍是 v_news_content 体系）。
//
// 栏目构成（首页版块「更多」入口）：
// - 院系新闻 index/yxxw.htm：活跃（最新 2026-10-12），本路由时效来源。
//   首页列表首条「外语系宣传片」(2022-06-30) 为置顶条目，保留无害（日期旧、排序沉底）
// - 学生工作 xsgz/gzdt.htm：慢性低频（最新 2026-03-20），并入同一路由
// 两栏目列表模板一致（ul.widget_categories），详情模板一致。
//
// 踩到的坑：
// 1. 列表标题文本被截断（"...“田家炳杯”全国师范院..."），且无 title 属性——
//    必须靠 detail.title（h1.content_title）在详情页补全。
// 2. 详情页日期在「时间：2026年10月12日」一行（div，h1.content_title 的相邻兄弟），
//    date 配 'h1.content_title + div' 精确定位；默认解析器处理「时间：」前缀。
// 3. 通知公告栏目 index/tzgg.htm 自 2020 年停更（内容停在疫情期间），是典型
//    「停更栏目陷阱」，不收录。
const site: SiteConfig = {
    id: 'tynu-wyx',
    name: '太原师范学院外国语学院',
    url: 'https://wyx.tynu.edu.cn',
    icon: 'https://present.zigzagyang.monster/rsshub-icons/college/tynu-wyx.png',
    channels: [
        { name: '院系新闻', listUrl: 'https://wyx.tynu.edu.cn/index/yxxw.htm' },
        { name: '学生工作', listUrl: 'https://wyx.tynu.edu.cn/xsgz/gzdt.htm' },
    ],
    list: {
        item: 'ul.widget_categories li',
        title: 'span.news_title',
        date: 'span.categories_num',
    },
    detail: {
        title: 'h1.content_title',
        date: 'h1.content_title + div',
        content: '.v_news_content',
    },
    limit: 20,
    minPerChannel: 3,
    updateThresholdDays: 30,
};

export default site;
