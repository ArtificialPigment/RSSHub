import type { SiteConfig } from '@/utils/generic-site/types';

// 西南医科大学外国语学院（与国际教育学院合署，https://gjjy.swmu.edu.cn）
// 探测日期 2026-10-14：UTF-8。CMS 为维博 VSB9（详情页 #vsb_content/.v_news_content、
// _showDynClicks 点击统计），但用的是 VSB 老模板：栏目页 div.main_conRCb li
// （<span>日期</span><a>标题</a>），详情 div.main_contit h2 / div.main_contit p
// （"作者： 时间：YYYY-MM-DD 点击数："）/ div.v_news_content。
//
// 栏目（导航 5 个，列表模板完全一致）：
// - 学院动态 xydt.htm（info/1065）：全站最活跃，2026-10 一周内 4 条，时效来源
// - 党建工作 djzs.htm（info/1071）：活跃，最新 2026-10-09
// - 教学工作 jxgz.htm（info/1074）：活跃，最新 2026-10-13
// - 科研工作 kygz.htm（info/1073）：低频，最新 2026-09-02
// - 学生工作 xsgz1/bkxsgz.htm（info/1075）：活跃，最新 2026-09-25（相对路径 ../info/，
//   引擎 new URL 自动归一，无需处理）
//
// 踩到的坑：列表标题尾部截断（"...拟获奖人…"），列表 <a> 无 title 属性，
// 靠 detail.title 补全。
const site: SiteConfig = {
    id: 'swmu-gjjy',
    name: '西南医科大学外国语学院',
    url: 'https://gjjy.swmu.edu.cn',
    icon: 'https://present.zigzagyang.monster/rsshub-icons/college/swmu-gjjy.png',
    channels: [
        { name: '学院动态', listUrl: 'https://gjjy.swmu.edu.cn/xydt.htm' },
        { name: '党建工作', listUrl: 'https://gjjy.swmu.edu.cn/djzs.htm' },
        { name: '教学工作', listUrl: 'https://gjjy.swmu.edu.cn/jxgz.htm' },
        { name: '科研工作', listUrl: 'https://gjjy.swmu.edu.cn/kygz.htm' },
        { name: '学生工作', listUrl: 'https://gjjy.swmu.edu.cn/xsgz1/bkxsgz.htm' },
    ],
    list: {
        item: 'div.main_conRCb li',
        date: 'span',
    },
    detail: {
        title: 'div.main_contit h2',
        date: 'div.main_contit p',
        content: 'div.v_news_content',
    },
    limit: 30,
    minPerChannel: 2,
    updateThresholdDays: 14,
};

export default site;
