"""
tools/crypto/dca_backtest.py — Phase 1 deliverable #4
Dollar-cost-averaging simulator over Binance PUBLIC klines (read-only market data).
This is research/simulation only — it never places orders.

Run:
  python dca_backtest.py --symbol BTCUSDT --weekly 50 --years 3
"""
import argparse
import json
import urllib.request

BASE = "https://api.binance.com/api/v3/klines"


def _fetch_binance(symbol: str, start: int, end: int) -> list[float]:
    closes: list[float] = []
    cursor = start
    while cursor < end:
        url = (f"{BASE}?symbol={symbol}&interval=1w&startTime={cursor}"
               f"&endTime={end}&limit=1000")
        with urllib.request.urlopen(url, timeout=30) as r:
            rows = json.load(r)
        if not rows:
            break
        closes.extend(float(k[4]) for k in rows)
        cursor = rows[-1][6] + 1
        if len(rows) < 1000:
            break
    return closes


def _fetch_coinbase(symbol: str, years: int) -> list[float]:
    """Fallback via Coinbase public candles (works where Binance is geo-blocked)."""
    product = symbol.replace("USDT", "-USD").replace("USD", "-USD")
    step = 60 * 60 * 24 * 7  # weekly
    end = int(__import__("time").time())
    start = end - years * 365 * 24 * 3600
    closes: list[float] = []
    cursor = start
    while cursor < end:
        url = (f"https://api.exchange.coinbase.com/products/{product}/candles"
               f"?granularity={step}&start={cursor}&end={min(cursor + step*371*4, end)}")
        req_ = urllib.request.Request(url, headers={"User-Agent": "dca-research/1.0"})
        with urllib.request.urlopen(req_, timeout=30) as r:
            rows = json.load(r)  # [time, low, high, open, close, volume]
        if not rows:
            break
        closes.extend(float(c[4]) for c in rows)
        cursor += step * len(rows)
        if len(rows) < 300:
            break
    return sorted(closes)


def fetch_weekly(symbol: str, years: int) -> list[float]:
    """Weekly closes; Binance first, Coinbase fallback (read-only public data)."""
    end_ms = int(__import__("time").time() * 1000)
    start_ms = end_ms - years * 365 * 24 * 3600 * 1000
    try:
        return _fetch_binance(symbol, start_ms, end_ms)
    except Exception as e:
        print(f"  (binance unavailable: {e}; falling back to coinbase)")
        return _fetch_coinbase(symbol, years)


def simulate_dca(closes: list[float], amount_per_period: float) -> dict:
    """Invest a fixed amount every bar. Returns performance vs lump sum."""
    if not closes:
        raise ValueError("no data")
    coins = 0.0
    invested = 0.0
    for c in closes:
        coins += amount_per_period / c
        invested += amount_per_period
    final_value = coins * closes[-1]
    lump_coins = invested / closes[0]
    lump_value = lump_coins * closes[-1]
    return {
        "periods": len(closes),
        "invested": round(invested, 2),
        "final_value": round(final_value, 2),
        "dca_return_pct": round((final_value / invested - 1) * 100, 1),
        "lump_return_pct": round((lump_value / invested - 1) * 100, 1),
        "avg_cost": round(invested / coins, 2),
        "last_price": round(closes[-1], 2),
        "dca_beats_lump": final_value > lump_value,
    }


def main() -> None:
    p = argparse.ArgumentParser()
    p.add_argument("--symbol", default="BTCUSDT")
    p.add_argument("--weekly", type=float, default=50, help="USD per week")
    p.add_argument("--years", type=int, default=3)
    a = p.parse_args()
    closes = fetch_weekly(a.symbol, a.years)
    r = simulate_dca(closes, a.weekly)
    print(f"DCA {a.symbol}: ${a.weekly}/week for {a.years}y (Binance public data, read-only)")
    for k, v in r.items():
        print(f"  {k:>16}: {v}")


if __name__ == "__main__":
    main()
