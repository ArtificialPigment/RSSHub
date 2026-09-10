# icons/ — 订阅图标

按 feed 路由组织：`icons/<路由路径>.<ext>`，路由路径的每段对应一级目录，文件名取路由最后一段。
如 `/college/sxu-wy` → `college/sxu-wy.png`，`/gov/shanxi/rst/:category` → `gov/shanxi/rst.png`。

本地保留原始格式（ico/gif/jpeg 等）作为源文件；**OSS 上统一为 PNG**，已接入路由的 `icon` 字段：
`https://present.zigzagyang.monster/rsshub-icons/<路由路径>.png`（study-base 桶，2026-09-10 上传）。
换图流程：替换本地文件 → 转 PNG（`sips -s format png`）→ `ossutil cp` 覆盖同名对象。

## 订阅图标（按路由）

| 路由                  | 文件                     | 尺寸    | 来源                                                |
| --------------------- | ------------------------ | ------- | --------------------------------------------------- |
| /college/sxu-wy       | college/sxu-wy.png       | 316×316 | 官网校徽，手动替换版                                |
| /college/sxau-jcb     | college/sxau-jcb.jpeg    | 317×315 | 山西农大校徽，手动替换版（⚠️ 扩展名为 .jpeg）       |
| /college/sxufe-jmwy   | college/sxufe-jmwy.ico   | 256×256 | https://jmwy.sxufe.edu.cn/favicon.ico               |
| /college/nuc-shss     | college/nuc-shss.ico     | 128×128 | https://www.nuc.edu.cn/favicon.ico                  |
| /college/sxist-wlky   | college/sxist-wlky.png   | 512×512 | 官网标识页原图缩至 512                              |
| /college/tyu-wy       | college/tyu-wy.png       | 942×943 | 太原学院校徽，手动替换版                            |
| /college/sxdtdx-wgy   | college/sxdtdx-wgy.png   | 605×605 | https://wgyxy.sxdtdx.edu.cn/favicon.ico（实为 PNG） |
| /college/jczy-wy      | college/jczy-wy.ico      | 48×48   | https://www.sxjczy.cn/favicon.ico                   |
| /college/llzy-jcb     | college/llzy-jcb.ico     | 128×128 | https://www.llzy.edu.cn/favicon.ico                 |
| /college/sxtcm-gj     | college/sxtcm-gj.gif     | 300×301 | https://www.sxtcm.edu.cn/favicon.ico（实为 GIF）    |
| /college/tyust-wy     | college/tyust-wy.png     | 260×260 | 裁自官网标识页蓝白双版图的左半                      |
| /gov/shanxi/jyt-ggtz  | gov/shanxi/jyt-ggtz.png  | 273×295 | 国徽：https://www.shanxi.gov.cn/images/sxszf-gh.png |
| /publisher/fltrp-xwdt | publisher/fltrp-xwdt.png | 292×300 | 外研社社徽（红底圆形徽章），用户提供原图            |
