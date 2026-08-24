# 插件路线图：按仓库大类全覆盖（PLUGIN_ROADMAP）

> 逻辑：Ya-MiC 的仓库按 hermes 索引分五大类，每类至少一个 DSH 插件把该类能力挂上 Harness——「一切皆插件」。
> 状态：✅ 已有 · 🔄 本轮补齐 · 📋 规划中

## 类别 × 插件矩阵

| 大类（hermes 分支） | 代表仓库 | 插件 | 状态 | 命令空间 |
|---|---|---|---|---|
| 🐙 审计业务 | zhanzhen / audit-os / audit-os-mobile / invoice-ocr-system | **zhanzhen-audit**（独立仓 dsh-plugin/，凭证→OCR→分录→规则→报告） | 🔄 已写于 zhanzhen 仓库 | `zz.*` |
| 🐙 审计业务·规格 | action-tree（私有） | audit-draft（底稿草拟助手） | ✅ 已在 dsh-plugins 分支 | — |
| 📈 量化交易 | nautilus_trader / awesome-systematic-trading / FinceptTerminal / ai_quant_trade | quant-backtest + momentum-screen + risk-size + dsh-stock-watch | ✅ 已有四个 | — |
| 🌐 代理网络 | BPB-Worker-Panel / CF-Workers-SUB / sublink-worker / serv00-play / dingyuebaohu | **proxy-toolkit**（订阅转换/节点测活/优选线路批量生成） | 📋 规划 | `px.*` |
| 🤖 AI 智能体 | invoice-ocr-system / openclaw-* / nie-grassroots-logic / economics | **invoice-ocr**（独立小插件，单图发票→JSON）+ **agent-skillbox** | 📋 规划 | `ocr.*` / `skill.*` |
| 📚 文档笔记 | docformat-gui / MarkWrite / my-report-site | **doc-tools**（公文格式处理/Markdown 助写） | 📋 规划 | `doc.*` |

## 本轮动作（2026-08-24）

1. ✅ zhanzhen/dsh-plugin/ —— 审计全管线七命令（zz.vouchers/ocr/review/journal/rules/report/integrity）
2. ✅ 本文件：类别×插件矩阵定稿
3. 🔄 待子agent回传 dsh-plugins 分支真实插件模式后，把 zhanzhen 插件改造成完全同构（name/apply/ctx.effect/bundle manifest/CI）
4. 📋 proxy-toolkit / invoice-ocr / doc-tools 三个插件按同一模式补齐（每类一插件，命令前缀见矩阵）

## 规范要点（所有插件共同遵守）

- TS 文件导出 `name` + `apply(ctx, config)`；资源用 `ctx.effect()` 注册与清理
- 命令用 `ctx.command('ns.action <arg>', '描述')`；不碰 UI
- 每插件独立 README + package.json（keywords 含 `deepseek-harness` `dsh` `dsh-plugin`）
- dsh.bundle.json manifest 声明；CI 跑 smoke（逐插件加载校验）
- 业务插件不内嵌业务引擎——调对应服务的 HTTP API（保持单一权威）
