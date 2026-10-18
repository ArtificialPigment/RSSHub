import type { SiteConfig } from '@/utils/generic-site/types';

// 山西工程科技职业大学外国语学院（独立子站 https://wgyxy.sxgkd.edu.cn ）
// 探测日期 2026-10-14：UTF-8，维网 WebPlus CMS（与 sxdzkj-ggjxb 同族：
// 详情 #vsb_content/.v_news_content、.new_list3 dd 列表、_showDynClickBatch 计数器）。
//
// 栏目构成（导航 + 首页区块）：
//   学院新闻 xyxw.htm（info/1122）：最新 2026-09-28（活跃，时效来源）
//   团学工作 txgz.htm（info/113x）：最新 2026-09-28（活跃）
//   党务工作 dqgz/dwgz.htm：最新 2026-07-01（低频，minPerChannel 保底）
// 不收录：教学工作 jxky/jxgz.htm（最新 2025-06-27）、科研工作 jxky/kygz.htm
//   （最新 2025-05-30）均停更 1 年+。
// 列表：div.new_list3 dd（探测脚本同 sxdzkj 认不出该容器，服务端 HTML 完整）；
//   a.fl 文本即为完整标题（本站模板无截断、无 title 属性，故不配 titleAttr），
//   日期 span.fr.gray（YYYY-MM-DD），10 条/页。
// 详情：标题/日期 .container_right_title2 的 h3 / p（"发布日期：YYYY-MM-DD 浏览次数："），
//   正文 #vsb_content，容器干净无需 remove。
// 阈值：活跃栏目学期内约 2~4 周一条，叠加暑期空窗（党务 07-01 后未更），取 30。
const site: SiteConfig = {
    id: 'sxgkd-wgyxy',
    name: '山西工程科技职业大学外国语学院',
    url: 'https://wgyxy.sxgkd.edu.cn',
    icon: 'https://present.zigzagyang.monster/rsshub-icons/college/sxgkd-wgyxy.png',
    channels: [
        { name: '学院新闻', listUrl: 'https://wgyxy.sxgkd.edu.cn/xyxw.htm' },
        { name: '团学工作', listUrl: 'https://wgyxy.sxgkd.edu.cn/txgz.htm' },
        { name: '党务工作', listUrl: 'https://wgyxy.sxgkd.edu.cn/dqgz/dwgz.htm' },
    ],
    list: {
        item: '.new_list3 dd',
        date: 'span.fr.gray',
    },
    detail: {
        title: '.container_right_title2 h3',
        date: '.container_right_title2 p',
        content: '#vsb_content',
    },
    limit: 30,
    minPerChannel: 2,
    updateThresholdDays: 30,
};

export default site;
