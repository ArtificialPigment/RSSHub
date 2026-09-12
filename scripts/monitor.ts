/**
 * 自建路由监控脚本
 *
 * 用法：
 *   pnpm exec tsx scripts/monitor.ts            # 巡检所有自制路由
 *   pnpm exec tsx scripts/monitor.ts --test     # 发一封测试邮件后退出
 *
 * 逻辑：逐个拉取自建路由的 RSS 输出，检查两条：
 *   1. HTTP 200 且含条目
 *   2. 最新条目日期未超过站点配置的 updateThresholdDays
 * 异常时经 agently-cli 发邮件告警。状态迁移才发信（正常→异常告警、异常→恢复通知），
 * 持续异常不重复轰炸。状态存于 .monitor-state.json。
 *
 * 部署：launchd 每 2 小时跑一次（见 scripts/com.hamletstich.rsshub-monitor.plist）
 */
import { execFile } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { promisify } from 'node:util';

import { sites as collegeSites } from '../lib/routes/college/sites';
import { sites as govShanxiSites } from '../lib/routes/gov/shanxi/sites';
import { sites as nationalSites } from '../lib/routes/national/sites';
import { sites as publisherSites } from '../lib/routes/publisher/sites';
import type { SiteConfig } from '../lib/utils/generic-site/types';

const execFileAsync = promisify(execFile);

const BASE_URL = process.env.MONITOR_BASE ?? 'http://127.0.0.1:1200';
const ALERT_TO = 'hamlet.stich@gmail.com';
const STATE_FILE = path.join(import.meta.dirname, '..', '.monitor-state.json');
const FETCH_TIMEOUT_MS = 30000;

interface FeedTarget {
    id: string;
    name: string;
    path: string;
    thresholdDays: number;
}

interface State {
    [feedId: string]: { failingSince?: string };
}

const targets: FeedTarget[] = [
    ...Object.values(collegeSites).map((s: SiteConfig) => ({ id: s.id, name: s.name, path: `/college/${s.id}`, thresholdDays: s.updateThresholdDays ?? 14 })),
    ...Object.values(govShanxiSites).map((s: SiteConfig) => ({ id: s.id, name: s.name, path: `/gov/shanxi/${s.id}`, thresholdDays: s.updateThresholdDays ?? 14 })),
    ...Object.values(publisherSites).map((s: SiteConfig) => ({ id: s.id, name: s.name, path: `/publisher/${s.id}`, thresholdDays: s.updateThresholdDays ?? 14 })),
    ...Object.values(nationalSites).map((s: SiteConfig) => ({ id: s.id, name: s.name, path: `/national/${s.id}`, thresholdDays: s.updateThresholdDays ?? 14 })),
];

async function sendMail(subject: string, body: string) {
    await execFileAsync('agently-cli', ['message', '+send', '--to', ALERT_TO, '--subject', subject, '--body', body]);
}

function loadState(): State {
    try {
        return JSON.parse(fs.readFileSync(STATE_FILE, 'utf-8'));
    } catch {
        return {};
    }
}

async function checkFeed(target: FeedTarget): Promise<string | undefined> {
    let response: Response;
    try {
        response = await fetch(`${BASE_URL}${target.path}`, { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) });
    } catch (error) {
        return `无法连接（${(error as Error).message}）——RSSHub 实例可能没在运行`;
    }
    if (!response.ok) {
        return `HTTP ${response.status}`;
    }
    const xml = await response.text();
    const dates = xml
        .matchAll(/<pubDate>(.*?)<\/pubDate>/g)
        .toArray()
        .map((m) => new Date(m[1]).getTime())
        .filter((t) => !Number.isNaN(t));
    if (dates.length === 0) {
        return '无条目或全部条目无日期';
    }
    const ageDays = Math.floor((Date.now() - Math.max(...dates)) / 86_400_000);
    if (ageDays > target.thresholdDays) {
        return `最新条目距今 ${ageDays} 天，超过阈值 ${target.thresholdDays} 天`;
    }
    return undefined;
}

async function main() {
    if (process.argv.includes('--test')) {
        await sendMail('【RSSHub 监控】测试邮件', `这是一封测试邮件，证明监控告警链路可用。\n监控目标 ${targets.length} 个：\n${targets.map((t) => `- ${t.name}（${t.path}）`).join('\n')}`);
        process.stdout.write(`测试邮件已发送至 ${ALERT_TO}\n`);
        return;
    }

    const state = loadState();
    const events: string[] = [];

    const results = await Promise.all(targets.map(async (target) => ({ target, failure: await checkFeed(target) })));

    for (const { target, failure } of results) {
        const wasFailing = Boolean(state[target.id]?.failingSince);

        if (failure && !wasFailing) {
            state[target.id] = { failingSince: new Date().toISOString() };
            events.push(`❌ ${target.name}（${target.path}）：${failure}`);
        } else if (!failure && wasFailing) {
            const days = Math.round((Date.now() - new Date(state[target.id].failingSince!).getTime()) / 3_600_000);
            delete state[target.id].failingSince;
            events.push(`✅ ${target.name}（${target.path}）：已恢复（故障持续约 ${days} 小时）`);
        }
        process.stdout.write(`${failure ? 'FAIL' : 'OK  '} ${target.path} ${failure ?? ''}\n`);
    }

    fs.writeFileSync(STATE_FILE, JSON.stringify(state, undefined, 2));

    if (events.length > 0) {
        const hasFailure = events.some((e) => e.startsWith('❌'));
        await sendMail(`【RSSHub 监控】${hasFailure ? '路由异常' : '路由恢复'} ${events.length} 项`, events.join('\n\n'));
        process.stdout.write('已发送告警邮件\n');
    } else {
        process.stdout.write('全部正常，无状态变化\n');
    }
}

await main();
