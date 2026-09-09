# DEPLOY.md — Mac Mini 生产部署

读者：在 Mac Mini 上执行的 agent。文中 `<尖括号>` 是待替换的占位符，两处 👤 标记的步骤需要人类交互完成，agent 做到那里时停下叫人。所有路径用 `$HOME` 推导，不写死用户名。

目标状态：RSSHub 生产实例常驻 Mac Mini（launchd 守护），经 frp 暴露到公网（带 ACCESS_KEY 访问控制），监控脚本每 2 小时巡检并邮件告警。

## 前置条件（开始前先确认，缺则停下叫人）

- frps 已在云服务器运行，从人类处取得 `<FRPS_IP>`（云服务器公网 IP）与 `<FRP_TOKEN>`。若 frps 未部署，见附录 A
- 云服务器安全组/防火墙放行 TCP 7000（frp 控制通道）与 `<PUBLIC_PORT>`（对外服务端口，本文用 1200）
- 人类提供 ACCESS_KEY 或授权 agent 自行生成（第 4 步）

## 1. 环境准备

```bash
node -v   # 需 ≥ v22.22.2（RSSHub engines 要求），不足则用 nvm 或 brew 安装
corepack enable && corepack prepare pnpm@latest --activate
git --version
```

完成标准：`node -v` ≥ v22.22.2，`pnpm -v` 有版本输出。

## 2. 拉取代码

```bash
git clone https://github.com/ArtificialPigment/RSSHub.git ~/rsshub
cd ~/rsshub && git log --oneline -1
```

完成标准：最新 commit 含 DEPLOY.md（即本文档）。

## 3. 安装与构建

```bash
cd ~/rsshub
pnpm i
pnpm build
```

注意：生产模式必须构建——`pnpm start` 读的是 `dist/index.mjs` 和 `assets/build/routes.js`，跳过构建则所有路由 404。

完成标准：`dist/index.mjs` 与 `assets/build/routes.js` 均存在。

## 4. 访问控制（必须做）

实例将暴露公网，不设 ACCESS_KEY 等于开放代理。生成密钥并写入 .env：

```bash
echo "ACCESS_KEY=$(openssl rand -hex 16)" >> ~/rsshub/.env
cat ~/rsshub/.env   # 记下这个 key，订阅 URL 要用
```

## 5. 冒烟测试

```bash
cd ~/rsshub && pnpm start &
sleep 5
curl -s "http://127.0.0.1:1200/college/sxu-wy?key=<ACCESS_KEY>" | grep -c "<item>"
curl -s -o /dev/null -w "%{http_code}" "http://127.0.0.1:1200/college/sxu-wy"   # 不带 key 应被拒绝
```

完成标准：带 key 的 feed 返回 ≥5 个 `<item>`；不带 key 返回 403。通过后停掉前台进程。

## 6. launchd 常驻 RSSHub

launchd 环境没有 nvm 的 PATH，必须用 node 绝对路径：

```bash
NODE_BIN=$(which node)   # 例如 $HOME/.nvm/versions/node/v22.x.x/bin/node
```

写 `~/Library/LaunchAgents/com.hamletstich.rsshub.plist`（`<NODE_BIN>` 替换为上一步输出，`$HOME` 替换为实际家目录绝对路径——plist 不支持环境变量）：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.hamletstich.rsshub</string>
    <key>ProgramArguments</key>
    <array>
        <string><NODE_BIN></string>
        <string>dist/index.mjs</string>
    </array>
    <key>WorkingDirectory</key>
    <string><HOME>/rsshub</string>
    <key>EnvironmentVariables</key>
    <dict>
        <key>NODE_ENV</key><string>production</string>
        <key>NODE_OPTIONS</key><string>--max-http-header-size=32768</string>
    </dict>
    <key>KeepAlive</key><true/>
    <key>RunAtLoad</key><true/>
    <key>StandardOutPath</key><string>/tmp/rsshub.log</string>
    <key>StandardErrorPath</key><string>/tmp/rsshub.log</string>
</dict>
</plist>
```

```bash
launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/com.hamletstich.rsshub.plist
curl -s "http://127.0.0.1:1200/college/sxu-wy?key=<ACCESS_KEY>" | grep -c "<item>"
```

完成标准：grep 计数 ≥5。ACCESS_KEY 由 `<HOME>/rsshub/.env` 加载，无需写进 plist。

## 7. frpc 内网穿透

```bash
brew install frp   # frpc 与 frps 同包
```

写 `~/.frpc.toml`：

```toml
serverAddr = "<FRPS_IP>"
serverPort = 7000
auth.token = "<FRP_TOKEN>"

[[proxies]]
name = "rsshub"
type = "tcp"
localIP = "127.0.0.1"
localPort = 1200
remotePort = 1200
```

launchd 常驻，写 `~/Library/LaunchAgents/com.hamletstich.frpc.plist`（`<FRPC_BIN>` = `which frpc` 的输出，brew 安装通常为 `/opt/homebrew/bin/frpc`）：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.hamletstich.frpc</string>
    <key>ProgramArguments</key>
    <array>
        <string><FRPC_BIN></string>
        <string>-c</string>
        <string><HOME>/.frpc.toml</string>
    </array>
    <key>KeepAlive</key><true/>
    <key>RunAtLoad</key><true/>
    <key>StandardOutPath</key><string>/tmp/frpc.log</string>
    <key>StandardErrorPath</key><string>/tmp/frpc.log</string>
</dict>
</plist>
```

```bash
launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/com.hamletstich.frpc.plist
curl -s "http://<FRPS_IP>:1200/college/sxu-wy?key=<ACCESS_KEY>" | grep -c "<item>"
```

完成标准：经公网地址 curl 计数 ≥5。

## 8. 监控（👤 含一步人类操作）

监控依赖 agently-cli 发邮件，登录是浏览器交互流程，agent 装好后叫人：

```bash
npm i -g agently-cli
# 👤 人类执行：agently-cli auth login
```

然后装定时任务。仓库里的 `scripts/com.hamletstich.rsshub-monitor.plist` 是开发机模板，把其中 `ProgramArguments` 里的仓库路径改为 `<HOME>/rsshub` 后安装：

```bash
# 手动编辑路径后：
launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/com.hamletstich.rsshub-monitor.plist
launchctl kickstart gui/$(id -u)/com.hamletstich.rsshub-monitor
sleep 30 && cat /tmp/rsshub-monitor.log
```

完成标准：日志中 6 条路由全 `OK`。若 agently-cli 未登录，此处会报错——回到 👤 步骤。

## 9. 验收——回传人类以下信息

1. 公网订阅地址格式：`http://<FRPS_IP>:1200/<路由>?key=<ACCESS_KEY>`（路由清单见下表）
2. `launchctl print gui/$(id -u)/com.hamletstich.rsshub | grep state` 与 frpc 同名命令的输出
3. `/tmp/rsshub-monitor.log` 最近一次巡检结果
4. `git log --oneline -1`

一期路由清单：`college/sxu-wy`、`college/sxau-jcb`、`college/sxufe-jmwy`、`college/nuc-shss`、`college/sxist-wlky`、`gov/shanxi/jyt-ggtz`

## 附录 A：云服务器 frps（如未部署）

在云服务器上以 root 或有 sudo 的用户执行：

```bash
# 下载 frp（https://github.com/fatedier/frp/releases，linux_amd64），解压后：
cat > /etc/frp/frps.toml <<'EOF'
bindPort = 7000
auth.token = "<FRP_TOKEN>"
EOF
```

systemd 常驻 `/etc/systemd/system/frps.service`：

```ini
[Unit]
Description=frps
After=network.target

[Service]
ExecStart=/usr/local/bin/frps -c /etc/frp/frps.toml
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
systemctl enable --now frps
ss -tlnp | grep 7000   # 完成标准：7000 在监听
```

安全组放行：TCP 7000、TCP 1200。

## 运维速查

| 操作           | 命令                                                                                                              |
| -------------- | ----------------------------------------------------------------------------------------------------------------- |
| 更新代码       | `cd ~/rsshub && git pull && pnpm i && pnpm build` 后 `launchctl kickstart -k gui/$(id -u)/com.hamletstich.rsshub` |
| 看 RSSHub 日志 | `tail -f /tmp/rsshub.log`                                                                                         |
| 看监控日志     | `cat /tmp/rsshub-monitor.log`                                                                                     |
| 看 frpc 日志   | `tail -f /tmp/frpc.log`                                                                                           |
| 手动巡检       | `cd ~/rsshub && pnpm exec tsx scripts/monitor.ts`                                                                 |
