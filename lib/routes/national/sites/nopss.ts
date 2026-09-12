import type { SiteConfig } from '@/utils/generic-site/types';

// 全国哲学社会科学工作办公室（人民网承办，入口 http://www.nopss.gov.cn/GB/index.html ，仅 http）
// 探测日期 2026-09-12：UTF-8，人民网 CMS（/n1/YYYY/MMDD/c<栏目id>-<文章id>.html 详情路径）
// 栏目构成：
//   通知公告（/GB/219469/）为聚合页——.list_con_2j 下按 年度项目/重大项目/专项工程/中华学术外译项目 等
//     13 个 h2 分组各 ~5 条共 58 条，覆盖全部子栏目最新；子栏目深层列表在 /GB/219469/4310xx/
//   社团工作（/GB/430803/）同结构平铺列表，40 条
// 两栏目列表模板一致：.list_con_2j ul li，标题在 a 文本（完整无截断），日期在 em（[YYYY-MM-DD HH:mm]）
// limit 取 100：默认 20 会把通知公告第 5 个分组起（中华学术外译项目等 9 组）整体切掉，
//   100 保证两栏目列表页全量条目进入合并；含少量停更存档分组（智库建设 2017 等），按日期自然沉底
// 详情页 .text_con 内含 h1 标题 + h5 日期行 + 空 .box_pic + 正文 p + .edit 责编尾巴，
//   用 detail.remove 剔除噪声只留正文（引擎新增字段，首个用例）
// 更新节奏：社团工作活跃（课周内 3–5 天一条），通知公告周至月级；暑期空窗实测 36 天
//   （2026-08-03 → 09-08），阈值取 30 兜底学期内、假期超阈告警由人工判断
const site: SiteConfig = {
    id: 'nopss',
    name: '全国哲学社会科学工作办公室',
    url: 'http://www.nopss.gov.cn/GB/index.html',
    icon: 'https://present.zigzagyang.monster/rsshub-icons/national/nopss.png',
    channels: [
        { name: '通知公告', listUrl: 'http://www.nopss.gov.cn/GB/219469/index.html' },
        { name: '社团工作', listUrl: 'http://www.nopss.gov.cn/GB/430803/index.html' },
    ],
    list: {
        item: '.list_con_2j ul li',
        date: 'em',
    },
    detail: {
        title: '.text_con h1',
        date: '.text_con h5',
        content: '.text_con',
        remove: 'h1, h3, h4, h5, .box_pic, .edit, .zdfy, center',
    },
    limit: 100,
    updateThresholdDays: 30,
};

export default site;
