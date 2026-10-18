import type { SiteConfig } from '@/utils/generic-site/types';

// 宜宾学院外国语学院（https://gjjy.yibinu.edu.cn/index.htm）
// 探测日期 2026-10-14：UTF-8。CMS 为维博（VSB）高校站群系统（_showDynClickBatch、
// v_news_content、vsb_content_* 为典型特征），详情页路径 info/<栏目id>/<文章id>.htm。
//
// 栏目构成（首页导航 + 探测确认）：
// - 教研动态 jxky/jydt.htm：活跃（最新 2026-10-11），本路由时效来源
// - 学科竞赛 jxky/xkjs.htm：活跃（最新 2026-09-20）
// - 教学运行 jxky/jxyx.htm：活跃（最新 2026-09-15），教学检查/考试安排为主
// 三栏目同属「教学科研」板块，列表/详情模板一致（ul.n_listxx1 / .contain h2+h3），共用站点级选择器。
// 未选栏目：党建动态（最新 2026-07-02）、学生活动（最新 2026-07-06）、科研动态（最新
// 2026-06-11）偏 stale；学工动态 xsgz/xgdt.htm 顶部长期置顶「领导信箱」条目并混入
// 微信公众号外链，噪音大，不收录。
//
// 踩到的坑：
// 1. 列表标题文本被截断（尾部「...」），完整标题在 <a> 的 title 属性，用 titleAttr。
// 2. 列表条目 li 内含摘要 <p>（带「[详细]」链接），date 用 span.time（YYYY-MM-DD）。
// 3. 详情页标题/元信息是大写标签 <H2>/<H3>（htmlparser2 解析时标签名小写），包在
//    div.contain 内，用 .contain h2 / .contain h3 定位（页面其他小写 h2 在页脚导航）。
// 4. 详情 .contain h3 文本为「发布时间：2026-10-11 文章来源： 浏览次数：…」，
//    引擎清洗后命中首个日期。
const site: SiteConfig = {
    id: 'yibinu-wy',
    name: '宜宾学院外国语学院',
    url: 'https://gjjy.yibinu.edu.cn/index.htm',
    channels: [
        { name: '教研动态', listUrl: 'https://gjjy.yibinu.edu.cn/jxky/jydt.htm' },
        { name: '学科竞赛', listUrl: 'https://gjjy.yibinu.edu.cn/jxky/xkjs.htm' },
        { name: '教学运行', listUrl: 'https://gjjy.yibinu.edu.cn/jxky/jxyx.htm' },
    ],
    list: {
        item: 'ul.n_listxx1 li',
        titleAttr: 'title',
        date: 'span.time',
    },
    detail: {
        title: '.contain h2',
        date: '.contain h3',
        content: '.v_news_content',
    },
    limit: 30,
    minPerChannel: 3,
    // 教研动态相邻间隔 1 天~1 个月，寒暑假有空窗风险，阈值取 30
    updateThresholdDays: 30,
};

export default site;
