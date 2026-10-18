import type { SiteConfig } from '@/utils/generic-site/types';

// 四川师范大学外国语学院（https://fl.sicnu.edu.cn）
// 探测日期 2026-10-14：UTF-8。CMS 为 myp2c 门户建站系统（table 深嵌套 + 动态 id，
// 稳定类名是 .div_items / .table_item / .div_item_date），详情页为 /p/0/?StId=st_app_news_i_x…。
//
// 栏目构成（首页导航「学院动态」入口）：
// - 学院动态 /p/73/：活跃（最新 2026-10-09），16 条/页，本路由时效来源
// 首页「党建工作」「科学研究」等板块的 More 指向检索页（?StId=st_app_news_search_…），
// 模板与列表页不同（无 .table_item），不作栏目收录。
//
// 踩到的坑：
// 1. 首页各模块标题文本截断（尾部「...」），完整标题在 <a> 的 title 属性，用 titleAttr。
//    栏目页文本虽不截断，title 属性同样完整，统一用 titleAttr。
// 2. 详情页 .div_title 内含 .box（时间/来源/查看行），detail.title 取它会带入噪声，
//    故不配 detail.title，沿用列表页完整标题。
// 3. 详情日期在 .div_title .box（"时间：YYYY-MM-DD HH:mm:ss 来源：… 查看：…"），
//    引擎默认清洗（去"时间："前缀）后可解析。
//
// 更新节奏：暑期有 2 个月空窗（07-02 → 09-14），寒假类似，按 SITES.md 寒暑假放宽到 30。
const site: SiteConfig = {
    id: 'sicnu-wy',
    name: '四川师范大学外国语学院',
    url: 'https://fl.sicnu.edu.cn',
    channels: [{ name: '学院动态', listUrl: 'https://fl.sicnu.edu.cn/p/73/' }],
    list: {
        item: 'table.table_item',
        titleAttr: 'title',
        date: '.div_item_date',
    },
    detail: {
        date: '.div_title .box',
        content: '.div_content',
    },
    updateThresholdDays: 30,
};

export default site;
