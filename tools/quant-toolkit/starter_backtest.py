"""
quant-toolkit/starter_backtest.py — Phase 1 deliverable (roadmap branch)
A ~100-line dual moving-average backtester. Zero dependencies beyond pandas.
Run:  python starter_backtest.py            # demo with synthetic data
      python starter_backtest.py --csv my.csv --fast 20 --slow 60
Next step (Phase 2): swap yfinance loader for your broker/crypto feed.
"""
import argparse
import numpy as np
import pandas as pd


def load_data(csv: str | None) -> pd.DataFrame:
    if csv:
        df = pd.read_csv(csv, parse_dates=[0], index_col=0)
        return df[["Close"]].rename(columns={"Close": "close"})
    # synthetic random-walk demo data so the script always runs
    rng = np.random.default_rng(42)
    n = 750
    close = 100 * np.exp(np.cumsum(rng.normal(0.0003, 0.015, n)))
    idx = pd.bdate_range("2023-01-02", periods=n)
    return pd.DataFrame({"close": close}, index=idx)


def backtest(df: pd.DataFrame, fast: int, slow: int, fee_bps: float = 5.0) -> dict:
    df = df.copy()
    df["ma_fast"] = df["close"].rolling(fast).mean()
    df["ma_slow"] = df["close"].rolling(slow).mean()
    df["signal"] = (df["ma_fast"] > df["ma_slow"]).astype(int)
    df["position"] = df["signal"].shift(1).fillna(0)
    df["ret"] = df["close"].pct_change().fillna(0)
    trade_cost = df["position"].diff().abs().fillna(0) * fee_bps / 10_000
    df["strategy_ret"] = df["position"] * df["ret"] - trade_cost

    total_days = len(df)
    equity = (1 + df["strategy_ret"]).prod()
    bh_equity = (1 + df["ret"]).prod()
    ann = lambda r: (1 + r) ** (252 / total_days) - 1
    vol = df["strategy_ret"].std() * np.sqrt(252)
    sharpe = ann(df["strategy_ret"]) / vol if vol else 0.0
    dd = ((1 + df["strategy_ret"]).cumprod() /
          (1 + df["strategy_ret"]).cumprod().cummax() - 1).min()
    return {
        "trades": int(df["position"].diff().abs().gt(0).sum()),
        "strategy_total_return": round(equity - 1, 4),
        "buyhold_total_return": round(bh_equity - 1, 4),
        "strategy_ann_return": round(ann(df["strategy_ret"]), 4),
        "sharpe": round(sharpe, 2),
        "max_drawdown": round(dd, 4),
    }


if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("--csv"); p.add_argument("--fast", type=int, default=20)
    p.add_argument("--slow", type=int, default=60)
    a = p.parse_args()
    stats = backtest(load_data(a.csv), a.fast, a.slow)
    print(f"MA({a.fast}/{a.slow}) crossover backtest")
    for k, v in stats.items():
        print(f"  {k:>24}: {v}")
