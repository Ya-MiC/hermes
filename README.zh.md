# 🗺️ 五年主線路線圖

> 本分支是整個 `hermes` 倉庫的**脊柱**——其他每個分支都是為下面某個階段服務的工具。
> 半成品不再是散落的碎片，而是主線上待完成的節點。

**檔案**：2006 年 2 月生 · 商務數據分析專業大二 · 家庭會計審計背景。

**主線定位（2026-08 用戶校準）：審計智能體 = 全國統一大市場的中小企業審計作業系統**
- 剪映式訂閱制收費，對標四大八大品質、中小所買得起的價格
- 國家級縫隙：統一大市場+外貿雙戰略餵養，大疆模式苟住發展
- 詳見 ai-agents 分支 [AUDIT-SOFTWARE-MASTERPLAN.md](https://github.com/Ya-MiC/hermes/blob/ai-agents/AUDIT-SOFTWARE-MASTERPLAN.md)
- 時間壓力：2年萬人用戶，窗口正在關閉（金蝶/用友在下沉）

---

## 主線一覽

```
                    ┌─────────────── 複利飛輪（人是活的，線是循環的）───────────────┐
                    │                                                            │
   量化/工具收益 ↑        政策RAG·SaaS訂閱收入 ↑        收入+雅思6.5 = 簽證選項 ↑         │
        │                        │                          ↓                     │
  [Phase1 能力期] ────> [Phase2 收入期] ────> [Phase3 出海期] ────> [Phase4 身份期]     │
   quant-toolkit         小資金實盤              垂直SaaS全球收款        NZ綠卡(主目標)    │
   audit-agent           接單變現               policy-rag SaaS ⭐      每2年回紐保身份   │
   ielts-plan ─────────────────────────────────> 簽證門檻被收入墊高 ←──┘                │
        ↑                                                                                    │
        └────── AI 發展降低建造成本：同樣的工具明年更便宜更好做 ─────────────────────────────┘

⭐ policy-rag-saas：全球移民政策PDF→RAG→Skill封裝→訂閱制（見 ai-agents 分支產品規格書）
   與量化並行的雙引擎：量化吃行情波動，SaaS 吃政策焦慮——後者現金流更穩。
```

## 階段一 — 能力期（現在 → 2027 中）

**目標**：把每個半成品做成能跑的工具。先完成，再完美。

| 交付物 | 位置 | 狀態 |
|---|---|---|
| 量化入門工具箱（數據→信號→回測） | [`quant-trading`](https://github.com/Ya-MiC/hermes/tree/quant-trading) + 本分支 `tools/` | 🔨 建設中 |
| **審計智能體（主幹！）**: 全國統一大市場中小企業審計作業系統 | [ai-agents 分支規格書](https://github.com/Ya-MiC/hermes/blob/ai-agents/AUDIT-SOFTWARE-MASTERPLAN.md) | 🎯 主線衝刺中 |
| 雅思學習計劃（2028 前 ≥6.5） | `ielts-plan.md` | 📋 已起草 |
| DSH 插件作為公開作品集 | [`dsh-plugins`](https://github.com/Ya-MiC/hermes/tree/dsh-plugins) | ✅ v1.0 |

## 階段二 — 收入期（2027-2028）

**目標**：第一筆被動收入，金額小但必須是真錢。
- 用小資金跑量化策略（匯豐 One + 加密通道已備好 ✅）
- 審計/報告自動化先賣給家裡的行業人脈——溫暖市場起步
- 用階段一的工具箱接數據分析兼職

## 階段三 — 出海期（2028-2030）

**目標**：軟件產品賣向全球；語言和資金為移民就緒。
- 把審計 agent 產品化為垂直 SaaS（多語言、多司法轄區）
- 雅思成績到手 ✅（窗口約 2029 前關閉）
- 階段二的渠道積累資金

## 階段四 — 身份期（2031 前，30 歲前） 

**目標**：國外身份落地，詳見 [`identity-kit.md`](./identity-kit.md)。
- 主路線：新西蘭 Level 7 → 工簽 → 居民（[研究文檔](https://github.com/Ya-MiC/Global-Identity-Planning)）
- 通道已備：匯豐香港 One（銀行）、加密錢包（無國界結算）
- 備選路線見 identity-kit

---

## 分支與主線的關係

| 分支 | 服務於 |
|---|---|
| [`quant-trading`](https://github.com/Ya-MiC/hermes/tree/quant-trading) | 階段一→二 收入引擎 |
| [`ai-agents`](https://github.com/Ya-MiC/hermes/tree/ai-agents) | 階段一→三 產品引擎 |
| [`proxy-network`](https://github.com/Ya-MiC/hermes/tree/proxy-network) | 全階段基礎設施 |
| [`docs-notes`](https://github.com/Ya-MiC/hermes/tree/docs-notes) | 參考檔案庫 |
| [`dsh-plugins`](https://github.com/Ya-MiC/hermes/tree/dsh-plugins) | 公開作品集 / DSH 生態存在感 |

⬅ 返回[總索引](https://github.com/Ya-MiC/hermes/tree/main) · English: [README.md](./README.md)
