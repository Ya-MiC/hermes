# 🧩 Hermes DSH Plugins v2.1 — production engineering

Four tool plugins for [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (“everything is a plugin”), built to engineering standard:

- ✅ **Strict TypeScript** (`tsc --noEmit` clean) against the real `@deepseek-ai/dsh-tools` types
- ✅ **20 unit tests** (vitest) over the pure logic cores
- ✅ **End-to-end smoke test**: every plugin is loaded into a live Cordis context and its tools are executed
- ✅ **GitHub Actions CI**: type-check → tests → build → smoke, on Node 20 & 22
- ✅ Official spec compliance: `defineTool`, Schemastery `Config`, `inject = ['tools']`

## Architecture

```
src/
├── lib/                    # pure logic — zero DSH deps, 100% unit-testable
│   ├── backtest.ts         # dual-MA crossover engine + input validation
│   ├── report.ts           # deterministic audit report renderer (zh/en)
│   ├── study.ts            # IELTS session tracking + readiness scoring
│   └── identity.ts         # migration milestone tracker
├── plugins/               # DSH wrappers: defineTool + Schemastery Config
├── index.ts               # public API
test/                       # vitest specs for every lib module
smoke.ts                    # loads all plugins into Cordis, executes all tools
```

## The plugins

| Plugin | Tools | Serves roadmap phase |
|---|---|---|
| `dsh-quant-backtest` | `quant_backtest` — MA crossover backtest with Sharpe/MDD, validated inputs | Phase 1→2 income |
| `dsh-audit-draft` | `audit_draft` — risk-sorted audit report drafts, zh/en, watermark | Phase 1→3 product |
| `dsh-ielts-coach` | `ielts_log`, `ielts_progress` — study tracker vs band target | Phase 1 language |
| `dsh-identity-checklist` | `identity_status`, `identity_done` — NZ Level7 milestones | Phase 4 identity |

## Verify locally

```sh
npm install
npx tsc --noEmit      # strict type check
npx vitest run        # 20 unit tests
npm run build         # emit dist/
npx tsx smoke.ts      # load into Cordis + execute all tools
```


## v2.2 — Quant expansion (2026-08)

Two new plugins (still **no order execution, no keys**):

| Plugin | Tools | What it does |
|---|---|---|
| `dsh-momentum-screen` | `momentum_screen` | Breakout-readiness score: 52w-high proximity, 90d momentum, vol-contraction |
| `dsh-risk-size` | `position_size_atr`, `portfolio_heat`, `kelly_fraction` | Half-Kelly fraction, ATR stop sizing, portfolio heat cap |

**Now 6 plugins / 10 tools.** 26 unit tests, CI green.

## Install into DSH

```sh
pnpm dsh web --patch ./cordis.yml
```

Docs: **[English](./README.md)** · **[中文](./README.zh.md)** · Roadmap: [roadmap branch](https://github.com/Ya-MiC/hermes/tree/roadmap) · ⬅ [main](https://github.com/Ya-MiC/hermes/tree/main)
