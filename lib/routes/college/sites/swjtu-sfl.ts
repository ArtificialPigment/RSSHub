import type { SiteConfig } from '@/utils/generic-site/types';

// 西南交通大学外国语学院（https://sfl.swjtu.edu.cn）
// 探测日期 2026-10-14：UTF-8，博达 VSB，站外域名 sfl.swjtu.edu.cn。
// 栏目（导航学院新闻/通知公告两个活跃列表，各 20 条/页，首条为置顶条目日期偏旧属正常）：
//   学院新闻 xyxw.htm、通知公告 tzgg.htm：ul.list-group.rightnew > li >
//     a（title 属性完整标题，列表文本截断靠 titleAttr）+ span.tim [YYYY-MM-DD]
//   各系所 xwgg.htm 子栏目（工程英语系/英语系/日语系…）为系内新闻，不收录
// 详情页：h1.newtitle2 标题 + #vsb_content 正文（详情页无可见日期，用列表日期）；
//   部分老文章无 #vsb_content 包装、直接裸 .v_news_content，逗号并联兜底；
//   列表纯站内 info/ 链接，无外链混排
// 更新节奏：两栏目均周级活跃；阈值 14
const site: SiteConfig = {
    id: 'swjtu-sfl',
    name: '西南交通大学外国语学院',
    url: 'https://sfl.swjtu.edu.cn',
    icon: 'https://present.zigzagyang.monster/rsshub-icons/college/swjtu-sfl.png',
    channels: [
        { name: '学院新闻', listUrl: 'https://sfl.swjtu.edu.cn/xyxw.htm' },
        { name: '通知公告', listUrl: 'https://sfl.swjtu.edu.cn/tzgg.htm' },
    ],
    list: {
        item: 'ul.list-group.rightnew li',
        titleAttr: 'title',
        date: 'span.tim',
    },
    detail: {
        title: 'h1.newtitle2',
        content: '#vsb_content, .v_news_content',
    },
    updateThresholdDays: 14,
};

export default site;
