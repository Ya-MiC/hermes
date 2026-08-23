# 🧩 Hermes DSH 插件 v2.0

六个 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 插件——一切皆插件。
严格遵循官方规范：[`defineTool`](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/user/develop/basic/tool.zh.md) + Schemastery `Config`（[配置文档](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/user/develop/basic/config.zh.md)）。

## 六个插件

| 插件 | 类型 | 功能 | 对应路线图阶段 |
|---|---|---|---|
| `dsh-yamic-repo-index` | 命令 | `/yamic-index` 一键打开本索引 | 全部 |
| `dsh-turn-clock` | 界面 | 回合耗时计时器（演示 `ctx.effect()` 清理） | 全部 |
| **`dsh-quant-backtest`** | 工具 | `quant_backtest` —— 双均线交叉回测，含夏普/最大回撤；快慢窗口与费率走 Config 可配 | 阶段一→二 收入 |
| **`dsh-audit-draft`** | 工具 | `audit_draft` —— 结构化 findings 渲染审计报告草稿，按风险排序，支持中英文 | 阶段一→三 产品 |
| **`dsh-ielts-coach`** | 工具组 | `ielts_log` / `ielts_progress` —— 学习打卡与进度对照（目标 6.5） | 阶段一 语言 |
| **`dsh-identity-checklist`** | 工具组 | `identity_status` / `identity_done` —— 新西兰 Level7 里程碑追踪 | 阶段四 身份 |

加粗为 v2 新增。每个工具插件导出 `name`、`inject = ['tools']`、Schemastery `Config` 模式（可调项全部走配置、零硬编码），并以带类型的参数注册工具。

## 安装

```sh
pnpm dsh web --patch ./cordis.yml
```

然后直接对 agent 说：

> 用 quant_backtest 回测这组收盘价：[100, 101.5, ...]
> 记录一次雅思写作练习 45 分钟，模考 5.5 分
> 显示我的身份清单进度

文档：**[中文](./README.zh.md)** · **[English](./README.md)** · 路线图：[roadmap 分支](https://github.com/Ya-MiC/hermes/tree/roadmap) · ⬅ 返回[总索引](https://github.com/Ya-MiC/hermes/tree/main)
