import type { SiteConfig } from '@/utils/generic-site/types';
import { parseDate } from '@/utils/parse-date';
import timezone from '@/utils/timezone';

// 成都航空职业技术大学基础教学部（https://www.cap.edu.cn/jcjxb/index.htm，主站子路径站）
// 探测日期 2026-10-14：UTF-8，博达 VSB（详情路径 info/<栏目id>/<文章id>.htm，
//   详情页 td.blod14 标题 + td[bgcolor="#eeeeee"] 日期行 + #vsb_content 正文）。
// 栏目构成（导航 5 项中 3 项为新闻列表）：
//   基础部新闻 jcbxw.htm：15 条/页，tr > td[width="889"] 标题（列表文本截断、无 title 属性，
//     靠 detail.title 补全）+ td[width="71"] 日期（奇葩「YY-MM-DD」两位年格式，dateParser 处理）
//   党建工作 djgz.htm：同上结构，暑期停更（最新 2026-06-26），minPerChannel 保底 2 条
// 未并入栏目：工会工作 ghgz.htm 停更（最新 2025-07-15），不收录
// 更新节奏：基础部新闻学期内 1~2 周一更，暑期空窗；阈值取 30
const site: SiteConfig = {
    id: 'cap-jcjxb',
    name: '成都航空职业技术大学基础教学部',
    url: 'https://www.cap.edu.cn/jcjxb/index.htm',
    icon: 'https://present.zigzagyang.monster/rsshub-icons/college/cap-jcjxb.png',
    channels: [
        { name: '基础部新闻', listUrl: 'https://www.cap.edu.cn/jcjxb/jcbxw.htm' },
        { name: '党建工作', listUrl: 'https://www.cap.edu.cn/jcjxb/djgz.htm' },
    ],
    list: {
        item: 'tr:has(> td[width="889"])',
        date: 'td[width="71"]',
    },
    dateParser: (text) => {
        // 列表日期是两位年「26-09-20」；负向环视防止把详情页的 2026-09-20 尾段误配成 2020 年
        const m = text.match(/(?<!\d)(\d{2})-(\d{1,2})-(\d{1,2})(?!\d)/);
        if (m) {
            return timezone(parseDate(`20${m[1]}-${m[2]}-${m[3]}`), 8);
        }
        return;
    },
    detail: {
        title: 'td.blod14',
        date: 'td[bgcolor="#eeeeee"]',
        content: '#vsb_content',
    },
    minPerChannel: 2,
    updateThresholdDays: 30,
};

export default site;
