import type { SiteConfig } from '@/utils/generic-site/types';
import { parseDate } from '@/utils/parse-date';
import timezone from '@/utils/timezone';

// 吕梁幼儿师范高等专科学校·消息中心-学校公告（校级通知公告栏目）
// 探测日期 2026-09-17：UTF-8。MetInfo（米拓）CMS——met-* 类名、/cms/content/<id>/hit.do
// 点击统计、/html/web/<栏目路径>/<雪花id>.html 静态详情路径。站点 TLS 不支持 ALPN/h2，
// 客户端自动回退 HTTP/1.1，图片无需代理（实测 h1 200，非 WAF 拦截）。
//
// 列表页结构（坑）：
// 1. 条目不是 li，是 ul.met-page-ajax 的直接子元素 div.widget；
//    标题在 .widget-title a 文本（完整无截断，title 属性同文），链接默认取 'a' 即可。
// 2. 日期拆成两个元素：.updatetime 内 p.day（"09"）+ p.year-month（"2026-09"），
//    单个选择器取不到完整日期，故 date 选 .updatetime 并用 dateParser 拼合
//    （text 形如 "092026-09" 或 "09 2026-09"，正则同时兼容）。
// 3. 列表页首屏仅 10 条（met-page-ajax 下拉 ajax 翻页，引擎只抓首屏），≥5 达标。
//
// 详情页：标题 .met-shownews-header h1；日期在 .info 首个 span（"发布日期：YYYY-MM-DD"，
// 引擎默认解析可提取）；正文 .met-editor。注意部分公告正文是整幅扫描图（询价公示常见），
// description 以 img 标签为主，属正常形态；#metinfo_additional 为空壳 div，顺手剔除。
//
// 栏目取舍：需求指定只收学校公告本栏目；消息中心下另有院系动态等栏目，未并入。
// 更新节奏：开学季密集（09-01~09-09 四条，间隔 1~5 天），暑期空窗实测约 3 周
// （2026-07-17 → 08-07 → 08-10），采购公告类栏目假期低频，阈值取 30 兜底寒暑假。
const site: SiteConfig = {
    id: 'llsz-xxzx',
    name: '吕梁幼儿师范高等专科学校通知公告',
    url: 'https://llsz.edu.cn/html/web/xiaoxizhongxin/xuexiaogonggao/index.html',
    icon: 'https://present.zigzagyang.monster/rsshub-icons/college/llsz-xxzx.png',
    channels: [{ name: '通知公告', listUrl: 'https://llsz.edu.cn/html/web/xiaoxizhongxin/xuexiaogonggao/index.html' }],
    list: {
        item: 'ul.met-page-ajax > div.widget',
        title: '.widget-title a',
        date: '.updatetime',
    },
    // 列表日期由 p.day（日）+ p.year-month（年-月）拼接，顺序为日在前：
    // 文本形如 "092026-09"（无空白）或 "09 2026-09"，两种都命中
    dateParser: (text) => {
        const m = text.match(/(\d{1,2})\s*(\d{4})-(\d{1,2})/);
        if (m) {
            return timezone(parseDate(`${m[2]}-${m[3]}-${m[1]}`), 8);
        }
        return;
    },
    detail: {
        title: '.met-shownews-header h1',
        date: '.met-shownews-header .info span:first-of-type',
        content: '.met-editor',
        remove: '#metinfo_additional',
    },
    updateThresholdDays: 30,
};

export default site;
