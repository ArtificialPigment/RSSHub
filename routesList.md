# routesList.md — 自制路由台账

读者：为本仓库接入新站点的 Claude 与维护者本人。接入流程见 SITES.md，本文不重复。
用途：跨期跟踪所有自制路由的接入状态与源站 URL。站点配置的权威注册表是 `lib/routes/*/sites/index.ts`，本文记录进度与来源，不复制配置细节。

更新协议：**每接入一个站，先把本表对应行改为 🚧，验收通过（SITES.md 第 4 步四条全过）后改为 ✅ 并填编码/阈值；新一期开工时先把整期站点以 ⬜ 列入。**

状态值：⬜ 待接入 ｜ 🚧 接入中 ｜ ✅ 已接入 ｜ ⚠️ 特殊处理（备注说明）

## 第一期（2026-09 完成）

| 站点 ID       | 名称                     | 路由                        | 源 URL                         | 状态                    |
| ------------- | ------------------------ | --------------------------- | ------------------------------ | ----------------------- |
| sxu-wy        | 山西大学外国语学院       | `/college/sxu-wy`           | https://wy.sxu.edu.cn          | ✅                      |
| sxau-jcb      | 山西农业大学基础部       | `/college/sxau-jcb`         | https://jcb.sxau.edu.cn        | ✅                      |
| sxufe-jmwy    | 山西财经大学经贸外语学院 | `/college/sxufe-jmwy`       | —（见站点配置）                | ✅                      |
| nuc-shss      | 中北大学人文社会科学学院 | `/college/nuc-shss`         | —（见站点配置）                | ✅                      |
| sxist-wlky    | 山西工程技术学院（wlky） | `/college/sxist-wlky`       | —（见站点配置）                | ✅                      |
| jyt-ggtz      | 山西省教育厅公告通知     | `/gov/shanxi/jyt-ggtz`      | —（见站点配置）                | ✅                      |
| rst（多分类） | 山西人事考试专栏         | `/gov/shanxi/rst/:category` | http://rst.shanxi.gov.cn/rsks/ | ✅ 独立路由，非通用引擎 |

## 第二期（2026-09-09 完成）

| 站点 ID    | 名称                       | 路由                  | 源 URL                                                   | 状态 | 备注                                                                                                                                                                  |
| ---------- | -------------------------- | --------------------- | -------------------------------------------------------- | ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| tyu-wy     | 太原学院外语系             | `/college/tyu-wy`     | https://www.tyu.edu.cn/wyux/index.htm                    | ✅   | UTF-8，VSB CMS，5 栏目，阈值 30。⚠️ 全站暑期空窗（最新 2026-06-24），非配置问题，开学后复查时效                                                                       |
| sxdtdx-wgy | 山西大同大学外国语学院     | `/college/sxdtdx-wgy` | https://wgyxy.sxdtdx.edu.cn                              | ✅   | UTF-8，迅睿CMS。栏目列表页全部 AJAX 化不可用，改收首页"学院新闻"块（唯一活跃全文栏目）；列表标题截断用 titleAttr 解决；阈值 30。其余栏目需独立路由（POST AJAX）才能收 |
| jczy-wy    | 晋城职业技术学院外语系     | `/college/jczy-wy`    | https://www.sxjczy.cn/jczy/thtl/jgsz/jxbm/wyx/index.html | ✅   | UTF-8，3 栏目：xygg 学院公告（活跃）+ xytz 学院通知、系部新闻（停更存档，按需求并入）。裸 `<a>` 列表须 `link: ':scope'`；阈值 14                                      |
| llzy-jcb   | 吕梁职业技术学院基础部     | `/college/llzy-jcb`   | https://www.llzy.edu.cn/jichubu/                         | ✅   | UTF-8，帝国CMS。入口 wap 页弃用，改 PC 版 /jichubu/，收最新动态+通知公告。⚠️ 暑期空窗（最新 2026-06-04），阈值 30，开学后复查                                         |
| sxtcm-gj   | 山西中医药大学国际教育学院 | `/college/sxtcm-gj`   | https://gjzx.sxtcm.edu.cn                                | ✅   | UTF-8，VSB9，4 栏目。慢性低频站（合并后间隔 1–1.5 月），阈值 90                                                                                                       |
| tyust-wy   | 太原科技大学外国语学院     | `/college/tyust-wy`   | https://wy.tyust.edu.cn/index.htm                        | ✅   | UTF-8，博达VSB，4 栏目。需求文档误写"太原科技学院"，实为太原科技大学。⚠️ 暑期停更（最新 2026-06-17），阈值 30，开学后复查                                             |
