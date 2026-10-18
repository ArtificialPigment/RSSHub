import type { SiteConfig } from '@/utils/generic-site/types';
import { parseDate } from '@/utils/parse-date';
import timezone from '@/utils/timezone';

// 山西工学院通识教育学院（https://tsjy.sxct.edu.cn/ ，加挂「鄯阳书院」牌子）
// 探测日期 2026-10-14：UTF-8。学校官网 www.sxct.edu.cn（2021 年转设自太原理工大学
// 现代科技学院，校本部朔州），机构设置/教学单位导航确认通识教育学院子域 tsjy。
// CMS 为维博 VSB9（_showDynClicks 点击统计、info/<栏目id>/<文章id>.htm）。
//
// 栏目构成：
// - 学院新闻：站首页 div.news-list（栏目 id 1034，无独立列表页/「更多」入口），
//   活跃（最新 2026-09-30），本路由时效来源。li.headline 是头条块（无日期 span），
//   故 item 只取 li.flex。
// - 党建工作-工作动态 djgz/gzdt.htm（栏目 1045）：慢性低频（相邻间隔 3 天~3.5 月）。
// - 教学科研 jxky.htm（栏目 1431 等）：低频（最新 2026-06-07），minPerChannel 保底。
//
// 踩到的坑：
// 1. 两个列表模板并存：栏目页是 div.txt-list li.flex（span 含完整 ISO 日期），
//    首页新闻块是 div.news-list li.flex（span 只有 "MM-DD" 无年份），栏目级覆盖 item。
// 2. dateParser 先放行完整日期（走引擎默认解析），仅对无年份的 MM-DD 按当前年补全，
//    跨年修正（未来日期回退一年）。
// 3. 列表 a 的 title 属性是完整标题（text 亦完整），titleAttr 可用。
const site: SiteConfig = {
    id: 'sxgxy-tsjy',
    name: '山西工学院通识教育学院',
    url: 'https://tsjy.sxct.edu.cn/',
    icon: 'https://present.zigzagyang.monster/rsshub-icons/college/sxgxy-tsjy.png',
    channels: [
        {
            name: '学院新闻',
            listUrl: 'https://tsjy.sxct.edu.cn/index.htm',
            list: {
                item: 'div.news-list li.flex',
                titleAttr: 'title',
                date: 'span',
            },
        },
        { name: '党建动态', listUrl: 'https://tsjy.sxct.edu.cn/djgz/gzdt.htm' },
        { name: '教学科研', listUrl: 'https://tsjy.sxct.edu.cn/jxky.htm' },
    ],
    list: {
        item: 'div.txt-list li.flex',
        titleAttr: 'title',
        date: 'span',
    },
    dateParser: (text) => {
        // 完整日期（栏目页 "2026-09-23"）交回引擎默认解析
        if (/\d{4}-\d{1,2}-\d{1,2}/.test(text)) {
            return;
        }
        // 首页新闻块 "MM-DD"：按当前年补全，落在未来则回退一年（跨年修正）
        const m = text.match(/(\d{1,2})-(\d{1,2})/);
        if (!m) {
            return;
        }
        const year = new Date().getFullYear();
        const candidate = timezone(parseDate(`${year}-${m[1]}-${m[2]}`), 8);
        if (candidate.getTime() > Date.now()) {
            return timezone(parseDate(`${year - 1}-${m[1]}-${m[2]}`), 8);
        }
        return candidate;
    },
    detail: {
        title: 'h3.title',
        date: 'div.art-itro',
        content: '#vsb_content .v_news_content',
    },
    minPerChannel: 2,
    updateThresholdDays: 30,
};

export default site;
