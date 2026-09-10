/**
 * 通用站点抓取引擎的配置类型定义。
 * 结构标准的高校/政府站点只需提供一份 SiteConfig，无需编写路由代码。
 */

export interface ListSelectors {
    /**
     * 列表项选择器，匹配列表页中的每一条新闻
     */
    item: string;

    /**
     * 链接元素选择器（相对于列表项），默认 'a'
     */
    link?: string;

    /**
     * 标题选择器（相对于列表项）。缺省时取链接元素的文本
     */
    title?: string;

    /**
     * 从链接元素的属性读取标题（如 'title'）。
     * 适用于列表文本被截断、完整标题在 title 属性里的站点（政府站常见）
     */
    titleAttr?: string;

    /**
     * 日期选择器（相对于列表项）。可选，列表页无日期时留空
     */
    date?: string;
}

export interface DetailSelectors {
    /**
     * 详情页标题选择器。缺省时沿用列表页标题
     */
    title?: string;

    /**
     * 详情页日期选择器。可选
     */
    date?: string;

    /**
     * 详情页正文选择器（必填，抓全文的核心）
     */
    content: string;
}

export interface ChannelConfig {
    /**
     * 栏目名，如 '学院新闻'。会写入条目的 category 字段
     */
    name: string;

    /**
     * 栏目列表页 URL
     */
    listUrl: string;

    /**
     * 栏目级选择器覆盖（同站新老模板混排时用），缺省用站点级配置
     */
    list?: ListSelectors;

    /**
     * 栏目级详情选择器覆盖，缺省用站点级配置
     */
    detail?: DetailSelectors;

    /**
     * 栏目级编码覆盖，缺省用站点级配置
     */
    encoding?: string;
}

export interface SiteConfig {
    /**
     * 站点 ID，即路由参数，如 'sxufe-jmwy'
     */
    id: string;

    /**
     * 站点显示名，如 '山西财经大学经贸外语学院'
     */
    name: string;

    /**
     * 站点首页 URL，用于 feed 的 link 字段
     */
    url: string;

    /**
     * 订阅图标 URL（写入 feed 的 icon/logo 字段）。
     * 自制站点的图标统一放 OSS：https://present.zigzagyang.monster/rsshub-icons/<路由路径>.png
     */
    icon?: string;

    /**
     * 栏目列表。一个站点（一条路由）可含多个栏目，引擎合并后按日期倒序输出。
     * 单栏目站点也用这个字段（只写一个栏目）
     */
    channels: ChannelConfig[];

    /**
     * 页面编码，默认 'utf-8'；老旧站点常见 'gbk' / 'gb2312'。可被栏目级覆盖
     */
    encoding?: string;

    /**
     * 站点级列表选择器（各栏目共用，可被栏目级覆盖）
     */
    list: ListSelectors;

    /**
     * 站点级详情选择器（可被栏目级覆盖）。
     * 缺省时整站摘要模式（不抓详情页，item 只有标题+链接+列表页日期）
     */
    detail?: DetailSelectors;

    /**
     * 图片代理：把正文 img 的 src 改写为本实例的代理路由（/college/image-proxy）。
     * 用于站方 WAF 拦截 HTTP/2 导致阅读器（WebKit/Chromium）图片加载失败的站点，
     * 代理用 HTTP/1.1 回源绕过。仅代理已配置站点域名，非开放代理
     */
    imageProxy?: boolean;

    /**
     * 抓取条数上限，默认 20
     */
    limit?: number;

    /**
     * 每栏目保底条数：合并截断时每个栏目至少保留其最新 N 条，其余名额按日期倒序填满。
     * 用于活跃栏目与慢性低频栏目合并的站点——纯按日期截断会把低频栏目（如停更存档栏目）
     * 永远挤出 limit，订阅者收不到它的新条目。默认 0（不保底，纯按日期）
     */
    minPerChannel?: number;

    /**
     * 自定义日期解析器，处理站点特有的奇葩日期格式。
     * 返回 undefined 时引擎回退到默认解析逻辑
     */
    dateParser?: (text: string) => Date | undefined;

    /**
     * 监控阈值：该站预期更新周期（天）。超过此天数无新条目视为异常，供监控脚本读取
     */
    updateThresholdDays?: number;
}
