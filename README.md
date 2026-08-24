# 📈 Quant Trading / 量化交易

> Research-grade tools + curated resources. All code is read-only market data & simulation — **no order execution, no keys**.
> Part of the [hermes system](https://github.com/Ya-MiC/hermes/blob/main/SYSTEM.md) — serves Phase 1→2 (skill → first income) of the [roadmap](https://github.com/Ya-MiC/hermes/tree/roadmap).

## 🧰 Toolkit (built, tested)

| Tool | What it does | Status |
|---|---|---|
| [`tools/screeners/momentum_breakout.py`](./tools/screeners/momentum_breakout.py) | Momentum screener: 52w-high proximity, 90d momentum, vol-contraction "squeeze" composite score | ✅ verified |
| [`tools/risk/position_sizer.py`](./tools/risk/position_sizer.py) | Half-Kelly fraction, ATR stop-based share sizing, portfolio heat cap | ✅ verified ($10k/1%/entry100-stop95 → 20 shares) |
| [`tools/crypto/dca_backtest.py`](./tools/crypto/dca_backtest.py) | DCA simulator on real public klines (Binance→Coinbase auto-fallback) | ✅ live-tested (BTCUSDT 2y) |
| [`tools/journal/trade_journal.py`](./tools/journal/trade_journal.py) | Trade journal CLI: log plans, R:R tracking, discipline stats | ✅ ready |
| `tools/quant-toolkit/starter_backtest.py` (on [roadmap branch](https://github.com/Ya-MiC/hermes/tree/roadmap)) | MA-crossover backtester with Sharpe/MDD | ✅ bug-fixed |

All pure-Python, zero mandatory deps. Optional: `yfinance` for stock screening.

## 📚 Curated resources

### Owned
- (none yet — first target: a paper-trading harness wrapping the tools above)

### Forked
- [Ya-MiC/awesome-systematic-trading](https://github.com/Ya-MiC/awesome-systematic-trading) - A curated list of systematic trading libraries and resources ★0
- [Ya-MiC/nautilus_trader](https://github.com/Ya-MiC/nautilus_trader) - Rust-native event-driven backtesting/live trading engine ★0
- [Ya-MiC/FinceptTerminal](https://github.com/Ya-MiC/FinceptTerminal) - Modern finance terminal app ★0
- [Ya-MiC/trading-second-brain_needchange](https://github.com/Ya-MiC/trading-second-brain_needchange) - Multimodal trading knowledge system ★0

### Starred
- [TauricResearch/TradingAgents](https://github.com/TauricResearch/TradingAgents) (Star) - Multi-Agent LLM Financial Trading Framework `Python` ★99375
- [microsoft/qlib](https://github.com/microsoft/qlib) (Star) - AI-oriented Quant investment platform `Python` ★47860
- [nautechsystems/nautilus_trader](https://github.com/nautechsystems/nautilus_trader) (Star) - Production-grade Rust-native trading engine `Rust` ★27409
- [OpenByteInc/QuantDinger](https://github.com/OpenByteInc/QuantDinger) (Star) - AI quant platform for crypto/stocks/forex `Python` ★10985
- [wangzhe3224/awesome-systematic-trading](https://github.com/wangzhe3224/awesome-systematic-trading) (Star) - The systematic trading list `HTML` ★5002
- [simonlin1212/Vibe-Research](https://github.com/simonlin1212/Vibe-Research) (Star) - A股/美股/港股 personal research agent `Python` ★2167
- [discountry/ritmex-bot](https://github.com/discountry/ritmex-bot) (Star) - Perp DEX trading bot `TypeScript` ★564
- [kain26/trading-second-brain](https://github.com/kain26/trading-second-brain) (Star) - Multimodal trading memory system ★41
- [lyogavin/airllm](https://github.com/lyogavin/airllm) (Star) - 70B inference on single 4GB GPU `Jupyter` ★32216

---
⬅ Back to [main index](https://github.com/Ya-MiC/hermes/tree/main) · 中文：[README.zh.md](./README.zh.md)
