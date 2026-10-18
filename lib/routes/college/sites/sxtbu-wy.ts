import type { SiteConfig } from '@/utils/generic-site/types';

// 山西工商学院外国语学院（主站栏目型站点，无独立子域）
// 探测日期 2026-10-14：GB2312（须 encoding: 'gbk'），自研 ASP CMS。
// 调研给的院系总览页 /college/xueyuan/ 裸访问 500（IIS 默认文档未配），
// 加 index.html 可访问；该页是壳模板（title 用 if id=1..14 判断学院名，id=13=外国语学院），
// 真实列表页为 xueyuan_list.asp?cn=13&um=<栏目id>。
//
// 栏目构成（cn=13 为外国语学院；um 来自导航）：
//   学院动态 um=69：最新 2026-10-12（活跃）
//   教学科研 um=74：最新 2026-10-11（活跃）
//   学科竞赛 um=112：最新 2026-10-13（活跃）
//   党建工作 um=87：最新 2025-06-22（停更 1 年+，不收录）
// 列表：table 布局，每行 tr:has(a.yc_zi)；标题在 a 的 title 属性（完整无截断），
//   日期在行尾 td（[YYYY-MM-DD]，注意有 [2026-6-10] 单位数月份，默认解析可处理）；
//   详情链接为相对路径 xueyuan_show/?<id>.html，20 条/页。
// 详情：标题 td.tit，日期行 td 内含 "发布时间：YYYY-MM-DD"（列表已带日期，detail.date 不配），
//   正文 td.content。
const site: SiteConfig = {
    id: 'sxtbu-wy',
    name: '山西工商学院外国语学院',
    url: 'https://www.sxtbu.edu.cn/college/xueyuan/xueyuan_list.asp?cn=13&um=69',
    icon: 'https://present.zigzagyang.monster/rsshub-icons/college/sxtbu-wy.png',
    encoding: 'gbk',
    channels: [
        { name: '学院动态', listUrl: 'https://www.sxtbu.edu.cn/college/xueyuan/xueyuan_list.asp?cn=13&um=69' },
        { name: '教学科研', listUrl: 'https://www.sxtbu.edu.cn/college/xueyuan/xueyuan_list.asp?cn=13&um=74' },
        { name: '学科竞赛', listUrl: 'https://www.sxtbu.edu.cn/college/xueyuan/xueyuan_list.asp?cn=13&um=112' },
    ],
    list: {
        item: 'tr:has(a.yc_zi)',
        link: 'a.yc_zi',
        titleAttr: 'title',
        date: 'td:last-child',
    },
    detail: {
        title: 'td.tit',
        content: 'td.content',
    },
    limit: 30,
    updateThresholdDays: 30,
};

export default site;
