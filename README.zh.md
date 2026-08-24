# 📈 量化交易

> 研究级工具 + 精选资源。所有代码只读公开行情、纯本地模拟——**不下单、不碰 API key**。
> 属于 [hermes 體系](https://github.com/Ya-MiC/hermes/blob/main/SYSTEM.md)，服务[路线图](https://github.com/Ya-MiC/hermes/tree/roadmap)的阶段一→二（能力→第一笔收入）。

## 🧰 工具箱（已建成，实测通过）

| 工具 | 功能 | 状态 |
|---|---|---|
| [`tools/screeners/momentum_breakout.py`](./tools/screeners/momentum_breakout.py) | 动量筛选器：52周新高接近度+90日动量+波动收缩综合评分 | ✅ 已验证 |
| [`tools/risk/position_sizer.py`](./tools/risk/position_sizer.py) | 半凯利公式、ATR止损仓位计算、组合热度上限 | ✅ 实测（$1万/1%风险/入场100止损95 → 20股）|
| [`tools/crypto/dca_backtest.py`](./tools/crypto/dca_backtest.py) | 定投模拟器，真实公开K线（币安被墙自动切 Coinbase）| ✅ 实测 BTCUSDT 两年数据 |
| [`tools/journal/trade_journal.py`](./tools/journal/trade_journal.py) | 交易日志 CLI：记录计划、R:R 追踪、纪律统计 | ✅ 就绪 |
| `tools/quant-toolkit/starter_backtest.py`（在 [roadmap 分支](https://github.com/Ya-MiC/hermes/tree/roadmap)）| 双均线回测器，含夏普/最大回撤 | ✅ 已修bug |

全部纯 Python 零必装依赖。可选装 `yfinance` 抓股票数据。

## 📚 收录资源

### 自有
- （暂无——第一个目标：给上面的工具包一个纸面交易外壳）

### Fork
- [Ya-MiC/awesome-systematic-trading](https://github.com/Ya-MiC/awesome-systematic-trading)（Fork）- 系统化交易资源大全 ★0
- [Ya-MiC/nautilus_trader](https://github.com/Ya-MiC/nautilus_trader)（Fork）- Rust 事件驱动回测/实盘引擎 ★0
- [Ya-MiC/FinceptTerminal](https://github.com/Ya-MiC/FinceptTerminal)（Fork）- 现代金融终端 ★0

### 星标
- [TauricResearch/TradingAgents](https://github.com/TauricResearch/TradingAgents)（星标）- 多 Agent LLM 金融交易框架 `Python` ★99375
- [microsoft/qlib](https://github.com/microsoft/qlib)（星标）- AI 量化投研平台 `Python` ★47860
- [nautechsystems/nautilus_trader](https://github.com/nautechsystems/nautilus_trader)（星标）- 生产级 Rust 交易引擎 `Rust` ★27409
- [OpenByteInc/QuantDinger](https://github.com/OpenByteInc/QuantDinger)（星标）- 加密/股票/外汇 AI 量化平台 `Python` ★10985
- [wangzhe3224/awesome-systematic-trading](https://github.com/wangzhe3224/awesome-systematic-trading)（星标）- 系统化交易清单 `HTML` ★5002
- [simonlin1212/Vibe-Research](https://github.com/simonlin1212/Vibe-Research)（星标）- A股/美股/港股个人投研 Agent `Python` ★2167
- [lyogavin/airllm](https://github.com/lyogavin/airllm)（星标）- 单卡4G跑70B推理 `Jupyter` ★32216
- [kain26/trading-second-brain](https://github.com/kain26/trading-second-brain)（星标）- 交易第二大脑 ★41

---
⬅ 返回[总索引](https://github.com/Ya-MiC/hermes/tree/main) · English: [README.md](./README.md)
