import type { SiteConfig } from '@/utils/generic-site/types';

// 山西师范大学外国语学院（独立子站 https://wgy.sxnu.edu.cn ）
// 探测日期 2026-10-14：UTF-8，VSB9 CMS（list.vsb.css、winstyle 列表表格、
// _showDynClickBatch 计数器，详情路径 info/<栏目id>/<文章id>.htm）。
//
// 栏目取舍（导航 + 首页区块全遍历，本站列页同名栏目新旧模板混排严重）：
//   学院动态 xxzx/xydt.htm（info/1038，共 2208 条）：最新 2026-10-12（活跃，时效来源）
//   学院公告 xxzx/xygg.htm（info/1039，共 182 条）：最新 2026-08-31（公告类低频）
// 不收录：教学科研 jxky.htm（info/1020，共 2 条停在 2013 年的死档）、学生管理
//   dtgz/xsgl.htm（2022）、就业创业 rcpy/jycy.htm（2022）——同名栏目均为旧模板弃档，
//   活跃内容全部在信息中心/xxzx 下。首页 info/1041 就业区块条目与 jycy 死档一致。
// 列表：table.winstyle55347 tr[height="25"]（VSB9 静态翻页表格，15 条/页；
//   探测脚本对 table 行容器不识别，须手选）；标题 a.c55347 的 title 属性完整，
//   日期 span.timestyle55347（[YYYY/MM/DD]）；链接为 ../info/...htm 相对路径。
// 详情：标题 div.right_nr h1，正文 #vsb_content；日期列表已带，detail.date 不配
//   （详情日期在 "[YYYY/MM/DD 浏览：N]" 的内联 div 里，无稳定选择器）。
// 阈值：学院动态学期内约 1~2 周一条，取 7。
const site: SiteConfig = {
    id: 'sxnu-wgy',
    name: '山西师范大学外国语学院',
    url: 'https://wgy.sxnu.edu.cn/',
    icon: 'https://present.zigzagyang.monster/rsshub-icons/college/sxnu-wgy.png',
    channels: [
        { name: '学院动态', listUrl: 'https://wgy.sxnu.edu.cn/xxzx/xydt.htm' },
        { name: '学院公告', listUrl: 'https://wgy.sxnu.edu.cn/xxzx/xygg.htm' },
    ],
    list: {
        item: 'table.winstyle55347 tr[height="25"]',
        link: 'a.c55347',
        titleAttr: 'title',
        date: 'span.timestyle55347',
    },
    detail: {
        title: 'div.right_nr h1',
        content: '#vsb_content',
    },
    limit: 30,
    updateThresholdDays: 7,
};

export default site;
