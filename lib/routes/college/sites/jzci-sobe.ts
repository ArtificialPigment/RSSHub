import type { SiteConfig } from '@/utils/generic-site/types';

// 晋中信息学院商务英语学院
// 探测日期 2026-09-17：UTF-8。CMS 为维博 VSB（高校常见，详情页 #vsb_content/
// .v_news_content、_showDynClicks 浏览量脚本为其特征，详情路径 info/<栏目id>/<文章id>.htm）。
//
// 栏目构成（首页导航 xygk 学院概况 / jcjs 教材建设 为纯介绍页，无新闻列表，不收）：
// - 学院动态 xydt：活跃（最新 2026-09-06），需求指定的学院新闻类栏目
// - 完满教育 wmjy：最活跃（课周内 1~7 天一条，最新 2026-09-10），同模板一并并入
// - 党建工作 djgz：低频（间隔以月计，最新 2026-08-31），同模板并入
// - 教研活动 jyhd：活跃（最新 2026-09-10），同模板并入
// 四栏目列表模板一致：.new_list3 dl dd，a.fl 为标题、span.fr.gray 为日期（YYYY-MM-DD）。
//
// 踩到的坑：列表页长标题被截断成 "..."（如 info/1037/18081.htm），a 标签无 title 属性，
// 必须靠 detail.title（.container_right_title2 h3）取完整标题。
// 详情页日期在 .container_right_title2 p（"发布日期：YYYY-MM-DD 浏览次数：<script>..."），
// 引擎默认日期解析可从中提取日期部分。
//
// 阈值：活跃栏目课周内间隔 1~7 天，但暑期空窗实测 45~91 天（xydt 45 天、jyhd 91 天），
// 按寒暑假空窗站放宽到 30。
const site: SiteConfig = {
    id: 'jzci-sobe',
    name: '晋中信息学院商务英语学院',
    url: 'https://sobe.jzci.edu.cn',
    icon: 'https://present.zigzagyang.monster/rsshub-icons/college/jzci-sobe.png',
    channels: [
        { name: '学院动态', listUrl: 'https://sobe.jzci.edu.cn/xydt.htm' },
        { name: '完满教育', listUrl: 'https://sobe.jzci.edu.cn/wmjy.htm' },
        { name: '党建工作', listUrl: 'https://sobe.jzci.edu.cn/djgz.htm' },
        { name: '教研活动', listUrl: 'https://sobe.jzci.edu.cn/jyhd.htm' },
    ],
    list: {
        item: '.new_list3 dl dd',
        date: 'span.fr.gray',
    },
    detail: {
        title: '.container_right_title2 h3',
        date: '.container_right_title2 p',
        content: '.v_news_content',
    },
    minPerChannel: 2,
    updateThresholdDays: 30,
};

export default site;
