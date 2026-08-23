# 🧩 Hermes DSH 插件 v2.1 —— 工程化标准

四个 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)（一切皆插件）工具插件，按工程标准构建：

- ✅ **严格 TypeScript**（`tsc --noEmit` 零错误）—— 对接真实的 `@deepseek-ai/dsh-tools` 类型
- ✅ **20 个单元测试**（vitest），覆盖全部纯逻辑核心
- ✅ **端到端烟雾测试**：所有插件加载进真实 Cordis 环境，每个工具实际执行一遍
- ✅ **GitHub Actions CI**：类型检查 → 测试 → 构建 → 烟雾测试，Node 20/22 双版本矩阵
- ✅ 官方规范合规：`defineTool`、Schemastery `Config`、`inject = ['tools']`

## 架构

```
src/
├── lib/                    # 纯逻辑层——零 DSH 依赖，100% 可单元测试
│   ├── backtest.ts         # 双均线交叉回测引擎 + 输入校验
│   ├── report.ts           # 确定性审计报告渲染器（中/英）
│   ├── study.ts            # 雅思学习追踪 + 达标判定
│   └── identity.ts         # 移民里程碑追踪器
├── plugins/                # DSH 封装层：defineTool + Schemastery 配置
├── index.ts                # 公共 API
test/                       # 每个 lib 模块对应的 vitest 测试
smoke.ts                    # 把全部插件装进 Cordis，逐个执行工具
```

## 插件一览

| 插件 | 工具 | 对应路线图阶段 |
|---|---|---|
| `dsh-quant-backtest` | `quant_backtest` —— 双均线回测，含夏普/最大回撤，输入严格校验 | 阶段一→二 收入 |
| `dsh-audit-draft` | `audit_draft` —— 按风险排序的审计报告草稿，中英文，水印 | 阶段一→三 产品 |
| `dsh-ielts-coach` | `ielts_log`、`ielts_progress` —— 对照目标分数的学习追踪 | 阶段一 语言 |
| `dsh-identity-checklist` | `identity_status`、`identity_done` —— 新西兰 Level7 里程碑 | 阶段四 身份 |

## 本地验证

```sh
npm install
npx tsc --noEmit      # 严格类型检查
npx vitest run        # 20 个单元测试
npm run build         # 输出 dist/
npx tsx smoke.ts      # 装进 Cordis 并执行所有工具
```

## 装进 DSH

```sh
pnpm dsh web --patch ./cordis.yml
```

文档：**[中文](./README.zh.md)** · **[English](./README.md)** · 路线图：[roadmap 分支](https://github.com/Ya-MiC/hermes/tree/roadmap) · ⬅ 返回[总索引](https://github.com/Ya-MiC/hermes/tree/main)
