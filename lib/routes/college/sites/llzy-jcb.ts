import type { SiteConfig } from '@/utils/generic-site/types';

// 吕梁职业技术学院基础部
// 探测日期 2026-09-09：UTF-8，帝国CMS（入口为 e/wap/list.php?classid=889 wap 页，
// 已改用 PC 列表页，结构更清晰）。院系子站 /jichubu/。
// 坑1：首页小部件（textnews / right content）标题被截断，但栏目列表页 li 的
//      title 属性是完整标题，故用 titleAttr: 'title'。
// 坑2：详情页 span.title 下有两个 h3（第二个为空），取第一个即完整标题。
// 坑3：全站最新内容为 2026-06-04（最新动态栏目），通知公告最新 2026-01-09，
//      教学科研/学生工作/学习园地更旧（2021~2025）——暑期空窗，非选错栏目。
//      已逐一核对无更活跃栏目，属寒暑假低频站点，阈值放宽到 30。
//      暑期空窗超 30 天，假期中监控可能误报，开学后自愈。
const site: SiteConfig = {
    id: 'llzy-jcb',
    name: '吕梁职业技术学院基础部',
    url: 'https://www.llzy.edu.cn/jichubu/',
    icon: 'https://present.zigzagyang.monster/rsshub-icons/college/llzy-jcb.png',
    channels: [
        { name: '最新动态', listUrl: 'https://www.llzy.edu.cn/jichubu/zuixindongtai/' },
        { name: '通知公告', listUrl: 'https://www.llzy.edu.cn/jichubu/tongzhigonggao/' },
    ],
    list: {
        item: '.list-r .content ul li',
        titleAttr: 'title',
        date: 'span',
    },
    detail: {
        title: '.info .content .title h3',
        date: '.info .content .items',
        content: '.info .content .text-justify',
    },
    updateThresholdDays: 30,
};

export default site;
