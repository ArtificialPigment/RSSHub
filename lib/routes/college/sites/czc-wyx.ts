import type { SiteConfig } from '@/utils/generic-site/types';

// 长治学院外语系（https://wyx.czc.edu.cn/）
// 探测日期 2026-10-14：UTF-8，维博 VSB9（详情页 id=vsb_content/_showDynClicks，
// 与 tit-wyx 同模板族）。
//
// 栏目构成（首页导航「MORE+」入口，均 UL.ss 静态列表）：
// - 最新资讯 zxzx.htm（栏目 1043）：活跃（最新 2026-10-08，多栏目中更新最密），时效来源
// - 通知公告 tzgg.htm（栏目 1044）：活跃（最新 2026-10-09）
// - 党建工作 dtgz/djgz.htm（栏目 1077）：低频（最新 2026-09-23，前一条 06-06），
//   minPerChannel 保底
// 教学科研（1083/1084）等其余栏目内容已并入首页上述三块，不重复收。
//
// 踩到的坑：
// 1. 列表 a 的 title 属性是内容摘要（不是标题！），长标题文本截断带 "..."，
//    不能用 titleAttr，靠 detail.title（div.title h3）补全。
// 2. 日期在 div.time01（完整 ISO），引擎默认解析即可。
// 3. 详情日期在 div.title 内的 align=center 行（"发布者：[发表时间]：YYYY-MM-DD"），
//    默认解析可提取。
const site: SiteConfig = {
    id: 'czc-wyx',
    name: '长治学院外语系',
    url: 'https://wyx.czc.edu.cn/index.htm',
    icon: 'https://present.zigzagyang.monster/rsshub-icons/college/czc-wyx.png',
    channels: [
        { name: '最新资讯', listUrl: 'https://wyx.czc.edu.cn/zxzx.htm' },
        { name: '通知公告', listUrl: 'https://wyx.czc.edu.cn/tzgg.htm' },
        { name: '党建工作', listUrl: 'https://wyx.czc.edu.cn/dtgz/djgz.htm' },
    ],
    list: {
        item: 'ul.ss li',
        date: 'div.time01',
    },
    detail: {
        title: 'div.title h3',
        date: 'div.title > div',
        content: '#vsb_content .v_news_content',
    },
    minPerChannel: 2,
    updateThresholdDays: 30,
};

export default site;
