import type { SiteConfig } from '@/utils/generic-site/types';

// 攀枝花学院外国语学院（https://wgyxy.pzhu.cn）
// 探测日期 2026-10-14：UTF-8。CMS 为维博 VSB9（详情页 #vsb_content/.v_news_content、
// _showDynClickBatch 点击统计、列表分页 pb_sys_common，栏目页路径 <col>/<page>.htm）。
//
// 栏目构成（首页导航「更多>>」+ 首页区块遍历）：
// - 团委工作（首页 acade 块）：主站最活跃栏目（info/1381，详情页面包屑确认为「团委工作」），
//   但首页区块标题误写为「学生工作」、更多链接指向 xsgz/xshd.htm——CMS 配置张冠李戴，
//   该栏目没有独立列表页（学院新闻块 more 链接为 #），只能收首页 acade-c 块（7 条，无日期，
//   靠详情页日期兜底）。条目 <a> 裸列表，标题在 h2，link 用 ':scope'。
// - 学生活动 index/../xsgz/xshd.htm（info/1391）：活跃，最新 2026-09-25
// - 人才培养 rcpy/bkpy.htm（info/1321）：活跃，共 77 条 8 页，最新 2026-09-22
// - 党建工作 djgh/djgz.htm（info/1251）：低频，最新 2026-07-04
// - 科研动态 jxky/kydt.htm（info/1351）：学术低频，最新 2026-05-27
// 公告 index/gg.htm 只有 1 条且停在 2023-06，死栏目不收。
// 五个栏目列表/详情模板一致：栏目页 div.list li（<a>+<em>日期</em>），
// 详情 .detail-tit h4 / .detail-tit p（"作者：… 日期：YYYY-MM-DD …"）/ .v_news_content。
const site: SiteConfig = {
    id: 'pzhu-wgyxy',
    name: '攀枝花学院外国语学院',
    url: 'https://wgyxy.pzhu.cn',
    icon: 'https://present.zigzagyang.monster/rsshub-icons/college/pzhu-wgyxy.png',
    channels: [
        {
            name: '团委工作',
            listUrl: 'https://wgyxy.pzhu.cn/index.htm',
            list: { item: 'div.acade-c a', link: ':scope', title: 'h2' },
        },
        { name: '学生活动', listUrl: 'https://wgyxy.pzhu.cn/xsgz/xshd.htm' },
        { name: '人才培养', listUrl: 'https://wgyxy.pzhu.cn/rcpy/bkpy.htm' },
        { name: '党建工作', listUrl: 'https://wgyxy.pzhu.cn/djgh/djgz.htm' },
        { name: '科研动态', listUrl: 'https://wgyxy.pzhu.cn/jxky/kydt.htm' },
    ],
    list: {
        item: 'div.list li',
        date: 'em',
    },
    detail: {
        title: '.detail-tit h4',
        date: '.detail-tit p',
        content: 'div.v_news_content',
    },
    limit: 30,
    minPerChannel: 2,
    updateThresholdDays: 30,
};

export default site;
