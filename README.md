# 🧩 Hermes DSH Plugins v2.0

Six plugins for [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) — everything is a plugin.
Written strictly to the official spec: [`defineTool`](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/user/develop/basic/tool.md) + Schemastery `Config` ([config docs](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/user/develop/basic/config.md)).

## The six plugins

| Plugin | Type | What it does | Serves roadmap phase |
|---|---|---|---|
| `dsh-yamic-repo-index` | Command | `/yamic-index` opens this index | all |
| `dsh-turn-clock` | UI | Elapsed-time counter per turn (`ctx.effect()` cleanup demo) | all |
| **`dsh-quant-backtest`** | Tool | `quant_backtest` — dual MA crossover backtester with Sharpe/MDD; configurable fast/slow windows & fees via Config | Phase 1→2 income |
| **`dsh-audit-draft`** | Tool | `audit_draft` — renders audit report drafts from structured findings, risk-sorted, zh/en locale | Phase 1→3 product |
| **`dsh-ielts-coach`** | Tools | `ielts_log` / `ielts_progress` — study tracker vs the 6.5 target & exam date | Phase 1 language |
| **`dsh-identity-checklist`** | Tools | `identity_status` / `identity_done` — NZ Level7 milestone tracker to the deadline year | Phase 4 identity |

Bold = new in v2. Each tool plugin exports `name`, `inject = ['tools']`, a Schemastery `Config` schema (all tunables are config, nothing hardcoded), and registers tools with typed parameters.

## Install

```sh
pnpm dsh web --patch ./cordis.yml
```

Then ask the agent, e.g.:

> Backtest MA20/60 on these closes: [100, 101.5, ...]
> Log an IELTS writing session of 45 minutes, mock band 5.5
> Show my identity checklist status

Docs: **[English](./README.md)** · **[中文](./README.zh.md)** · Roadmap: [roadmap branch](https://github.com/Ya-MiC/hermes/tree/roadmap) · ⬅ [main](https://github.com/Ya-MiC/hermes/tree/main)
