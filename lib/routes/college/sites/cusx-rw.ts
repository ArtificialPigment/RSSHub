import type { SiteConfig } from '@/utils/generic-site/types';

// 山西传媒学院人文学院（基础课教学部，https://jcb.cusx.edu.cn，站点标题「人文学院」）
// 探测日期 2026-10-14：UTF-8。CMS 为维博（VSB）高校站群系统（info/<栏目id>/<文章id>.htm）。
//
// 栏目构成（首页导航）：
// - 部门动态 bmdt.htm：低频（最新 2025-12-01），含大学英语教研室教研活动
// - 通知公告 tzgg.htm：慢性低频（最新 2026-06-23，再前 2025-10-28），征文/竞赛通知为主
// 两栏目列表模板一致（div.fy-list），详情模板一致。
//
// 踩到的坑：
// 1. 全站慢性低频（活跃栏目间隔以季度计），阈值按典型间隔 2~3 倍放宽到 120，
//    参照 SITES.md 低频站定阈原则（实例：sxtcm-gj 取 90）。
// 2. 详情页日期 .other-s（"发布日期：2026-06-23 作者： 来源："），正文
//    #vsb_content.nr-info > .v_news_content 干净。
// 3. 站点域名 jcb（基础课教学部），导航/标题均为「人文学院」，feed 名用机构公开名。
const site: SiteConfig = {
    id: 'cusx-rw',
    name: '山西传媒学院人文学院',
    url: 'https://jcb.cusx.edu.cn/',
    icon: 'https://present.zigzagyang.monster/rsshub-icons/college/cusx-rw.png',
    channels: [
        { name: '部门动态', listUrl: 'https://jcb.cusx.edu.cn/bmdt.htm' },
        { name: '通知公告', listUrl: 'https://jcb.cusx.edu.cn/tzgg.htm' },
    ],
    list: {
        item: 'div.fy-list ul li',
        date: 'span',
    },
    detail: {
        title: 'h1.c-title',
        date: '.other-s',
        content: '.v_news_content',
    },
    limit: 20,
    minPerChannel: 5,
    updateThresholdDays: 120,
};

export default site;
