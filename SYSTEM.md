# 🏗️ Hermes System Architecture / 體系架構

> 這個倉庫不是雜物間，是一套**個人成長操作系統**。每個分支是一個子系統，`roadmap` 是調度內核。

## 系統分層

```
┌─────────────────────────────────────────────────────┐
│  roadmap (內核) — 五年路線圖，四個階段                 │
│   Phase1 能力 → Phase2 收入 → Phase3 出海 → Phase4 身份 │
├──────────────┬──────────────┬───────────────────────┤
│  執行子系統    │   工具子系統   │    檔案子系統           │
├──────────────┼──────────────┼───────────────────────┤
│ quant-trading │ dsh-plugins  │ docs-notes            │
│ ai-agents     │ (4個工程化插件) │ proxy-network         │
└──────────────┴──────────────┴───────────────────────┘
          ↓ 敏感數據流（單向）
   hermes-private (私庫) — 身份策略/國家評分（僅本人可見）
```

## 分支職責

| 分支 | 角色 | 完成度 |
|---|---|---|
| [`roadmap`](https://github.com/Ya-MiC/hermes/tree/roadmap) | 內核：主線路線圖、雅思計劃、身份框架 | 🟢 v1 |
| [`dsh-plugins`](https://github.com/Ya-MiC/hermes/tree/dsh-plugins) | 工具層：4 個工程化 DSH 插件（CI ✅） | 🟢 v2.1 |
| [`quant-trading`](https://github.com/Ya-MiC/hermes/tree/quant-trading) | 收入引擎研究檔案 | 🟡 持續收錄 |
| [`ai-agents`](https://github.com/Ya-MiC/hermes/tree/ai-agents) | 產品引擎研究檔案 | 🟡 持續收錄 |
| [`proxy-network`](https://github.com/Ya-MiC/hermes/tree/proxy-network) | 全系統基建 | 🟡 持續收錄 |
| [`docs-notes`](https://github.com/Ya-MiC/hermes/tree/docs-notes) | 參考檔案庫 | 🟡 持續收錄 |

## 配套私庫

| 倉庫 | 內容 | 訪問 |
|---|---|---|
| [hermes-private](https://github.com/Ya-MiC/hermes-private) | 國家推薦報告、個人身份評分 | 🔒 私有 |

## 運行節奏

- **每次開發**：從 `roadmap` 找當前階段 → 在對應分支幹活
- **每月**：更新 roadmap 的交付物狀態表
- **每年**：複核 identity-kit 清單 + 私庫推薦排序

⬅ [總索引 README](./README.md) · 中文：[README.zh.md](./README.zh.md)
