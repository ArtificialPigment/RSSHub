# SITES.md — 新站接入流程

读者：为本仓库 `college/`、`gov/shanxi/`、`publisher/`、`national/` 四个自制 namespace 接入新站点的 Claude。
路由代码风格与 PR 规范遵循上游 AGENTS.md 与 CONTRIBUTING.md，本文不重复。

## 布局

- 通用引擎：`lib/utils/generic-site/`（fetchPage 编码感知抓取 / cleanContent 正文清洗 / makeSiteHandler 引擎）
- 站点配置：`lib/routes/<namespace>/sites/<site-id>.ts`，字段语义以 `lib/utils/generic-site/types.ts` 的 JSDoc 为唯一权威
- 探测脚本：`scripts/probe-site.ts`

## 路由模型

**一个站点（学校/部门）= 一条路由**，站点的多个栏目（学院新闻/通知公告等）收进同一份配置的 `channels` 数组，引擎合并后按日期倒序输出，栏目名写入条目 `category`。
栏目共用站点级 `list`/`detail`/`encoding`；个别栏目模板不同时在该栏目内覆盖。
监控按站点粒度告警（单栏目停更但站点仍在更新时不报），低频栏目并入后阈值按活跃栏目定。

## 接入步骤

### 1. 探测

对站点首页跑探测脚本，从导航找到各新闻/公告栏目页，再对**每个栏目页**各跑一次：

```
pnpm exec tsx scripts/probe-site.ts <列表页 URL>
```

输出候选容器（按链接数排序）、编码、日期样例。
完成标准：每个栏目都找到条目数 ≥5 且样例链接确为新闻详情页的候选容器。记录编码——非 UTF-8（GBK/GB2312 老站常见）时配置 `encoding`。
若无可行容器，转「特殊站处理」。

### 2. 探测详情页

从步骤 1 样例中挑**最新一篇**，curl 抓 HTML，定位标题/日期/正文容器。
完成标准：定出 `detail.content`（必填），`detail.title` / `detail.date` 尽量给出。
各栏目模板一致时只探一篇；模板不同则逐栏目确认，并在配置里做栏目级覆盖。

### 3. 写配置

新建 `lib/routes/<namespace>/sites/<site-id>.ts`（默认导出 SiteConfig），并在同目录 `sites/index.ts` 登记。

site-id 命名（一个站点一个 id，不带栏目后缀）：

- 高校：`<学校缩写>-<院系缩写>`，如 `sxu-wy`（山西大学外国语学院）
- 政府：`<机构缩写>-<栏目缩写>`，如 `jyt-ggtz`（教育厅公告通知）

配置头部注释写明：探测日期、编码、CMS 类型、踩到的坑（如停更栏目、嵌套 table、截断标题）。

### 4. 验证

dev server 运行中直接 `curl -s http://127.0.0.1:1200/<namespace>/<site-id>`（已有目录内热载生效）。
**以下四条全过才算接入完成**：

1. HTTP 200 且条目 ≥5
2. **最新条目日期在近 30 天内**——防"停更栏目"陷阱：列表页结构完好但内容是旧的（真实案例：`wy.sxu.edu.cn/xydt/index.htm` 停在 2025-04，活跃栏目是 `xydt/wykx/`）。发现过期就换真正的活跃栏目 URL 重测
3. 全文站：条目 `description` 长度 > 200
4. 标题完整、无 "..." 截断——截断时在 `list` 加 `titleAttr: 'title'`（政府站常见）或配 `detail.title`

### 5. 定监控阈值

`updateThresholdDays` 取该站活跃栏目相邻条目典型间隔的 2–3 倍（合并后的低频栏目不拉宽阈值——否则活跃栏目坏了也发现不了）。

## 特殊站处理

- **PDF/附件直链**（教育厅公告常见）：引擎按扩展名自动挂为 RSS enclosure，并在正文写附件链接兜底（部分阅读器不渲染 enclosure）；同站混有 HTML 详情页时照常配 `detail`
- **需 JS 渲染**（探测脚本报"未找到列表容器"且正文链接数极少）：该站单独定制，用 `@/utils/playwright-fetch`
- **图片在阅读器里全挂、但 curl 能下到**：站方 WAF 拦截 HTTP/2 的特征（真实案例：wlxy.sxau.edu.cn 对 h2 请求返回空响应，h1 正常）。给站点配置加 `imageProxy: true`，正文图片改经 `/college/image-proxy` 用 HTTP/1.1 回源。验证方法：`node` 的 `http2` 模块请求图片 URL，0 字节即中招
- **详情页外链微信公众号**（出版社站常见，官网只存标题+摘要）：`detail` 直接配微信文章选择器 `{ title: '#activity-name', content: '#js_content' }` 即可出全文——应用内请求经 request-rewriter 统一带浏览器 UA，微信不拦截。注意独立脚本裸跑 `fetchPage` 不带该 UA，会拿到「环境异常」验证页，探测详情页时应换浏览器 UA 的 curl 验证，勿误判为路由失效（实例：sflep-xwzx）
- **结构不适配通用引擎**：在 namespace 下写独立路由文件，仍可复用 `fetchPage` / `cleanContent`
- **正文容器混入标题/日期/责编等噪声**（政府站常见，容器内无更细正文包装）：用 `detail.remove` 逗号并联选择器在清洗前剔除（实例：nopss 的 `.text_con` 内含 h1/h5/.edit；moe 的 `#downloadContent` 内含 h1）

## 运维备注

- **新增顶层 namespace 目录**（如首次创建 `lib/routes/xxx/`）必须重启 dev server 才会注册；已有目录内增改文件 tsx watch 自动热载
- 详情页抓取并发上限 4、栏目抓取并发上限 2，引擎内置
- 降级设计：单篇详情失败只降级该条目；单栏目列表失败只丢该栏目；PDF/附件直链自动挂为 enclosure 并在正文写附件链接
- 监控：`scripts/monitor.ts` 巡检全部自制路由（HTTP 状态 + 最新条目时效，阈值取各站 `updateThresholdDays`），launchd 每 2 小时执行，异常经 agently-cli 发邮件至 hamlet.stich@gmail.com；状态迁移才发信，持续异常不重复。新站接入后无需改动监控——注册表登记即自动纳入巡检
- 低频站点（寒暑假空窗超 2 周的）`updateThresholdDays` 放宽到 30，防止假期误报；慢性低频站（非季节性，活跃栏目间隔以月计）按典型间隔 2–3 倍定，可超过 30（实例：sxtcm-gj 取 90）
