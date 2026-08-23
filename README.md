# 🧩 Hermes DSH Plugins

Plugins for [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness), written to the [official plugin spec](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/user/develop/basic/index.md).

## Plugins

| Plugin | Type | Description |
|---|---|---|
| [`dsh-yamic-repo-index`](./src/dsh-yamic-repo-index/index.ts) | Command | Adds `/yamic-index` command opening this index |
| [`dsh-turn-clock`](./src/dsh-turn-clock/index.ts) | UI | Elapsed-time counter per turn, with `ctx.effect()` cleanup |
| [`dsh-quant-links`](./src/dsh-quant-links/index.ts) | Tool | `quant_links` tool listing curated quant frameworks |

## Install / Usage

```sh
# From a DSH checkout, load via cordis.yml overlay:
pnpm dsh web --patch ./cordis.yml
```

Each plugin follows the spec: exports `name` + `apply(ctx: Context)`, declares services via `inject`, cleans up via `ctx.effect()`.

Docs: **[English](./README.md)** · **[中文](./README.zh.md)** ⬅ back to [main](https://github.com/Ya-MiC/hermes/tree/main)
