"""
tools/screeners/momentum_breakout.py — Phase 1 deliverable #2
Momentum/breakout screener: 52-week-high proximity + volatility contraction.
Zero mandatory dependencies (csv input); pandas only for pretty output.

Run:
  echo "AAPL,MSFT,NVDA" > watchlist.csv
  python momentum_breakout.py --csv watchlist.csv
"""
import argparse
import csv
import math


def load_symbols(csv_path: str | None) -> list[str]:
    if not csv_path:
        return ["AAPL", "MSFT", "NVDA", "TSLA", "AMZN"]  # demo default
    with open(csv_path) as f:
        rows = [r[0] for r in csv.reader(f) if r and r[0].strip()]
    return [s.strip().upper() for s in rows]


def score_symbol(bars: list[float]) -> dict | None:
    """bars: daily closes, oldest first (>= 250 preferred). Pure math, testable."""
    n = len(bars)
    if n < 60:
        return None
    hi52 = max(bars[-250:]) if n >= 250 else max(bars)
    last = bars[-1]
    if last <= 0 or hi52 <= 0:
        return None
    pct_of_high = last / hi52 * 100.0

    rets = [(bars[i] - bars[i - 1]) / bars[i - 1] for i in range(1, n)]
    mean = sum(rets) / len(rets)
    var = sum((r - mean) ** 2 for r in rets) / max(1, len(rets) - 1)
    vol_daily = math.sqrt(var)
    vol_annual = vol_daily * math.sqrt(252)

    # volatility contraction: recent-20d vol vs full-sample vol
    rec = rets[-20:]
    rmean = sum(rec) / len(rec)
    rvar = sum((x - rmean) ** 2 for x in rec) / max(1, len(rec) - 1)
    vol_recent = math.sqrt(rvar) * math.sqrt(252)
    squeeze = vol_recent / vol_annual if vol_annual else float("nan")

    mom90 = bars[-1] / bars[-91] - 1 if n > 91 else float("nan")
    return {
        "pct_of_52w_high": round(pct_of_high, 1),
        "mom_90d": round(mom90 * 100, 1) if mom90 == mom90 else None,
        "vol_annual_pct": round(vol_annual * 100, 1),
        "squeeze_ratio": round(squeeze, 2) if squeeze == squeeze else None,
        # composite: near high + positive momentum + contracting vol => higher score
        "score": round(
            max(0.0, pct_of_high - 80) * 2.0
            + (mom90 * 100 if mom90 == mom90 else 0) * 0.5
            - (squeeze * 10 if squeeze == squeeze else 10),
            1,
        ),
    }


def main() -> None:
    p = argparse.ArgumentParser()
    p.add_argument("--csv", help="csv file with one symbol per line")
    a = p.parse_args()
    symbols = load_symbols(a.csv)
    print(f"{'symbol':8}{'%of52wH':>9}{'mom90%':>8}{'volA%':>7}{'sqz':>6}{'score':>7}")
    for s in symbols:
        try:
            import yfinance as yf  # optional
            hist = yf.Ticker(s).history(period="1y")["Close"].tolist()
        except Exception:
            print(f"{s:8}  (no data source — pip install yfinance to fetch live)")
            continue
        r = score_symbol(hist)
        if not r:
            print(f"{s:8}  insufficient history")
            continue
        print(
            f"{s:8}{r['pct_of_52w_high']:>9}{str(r['mom_90d']):>8}"
            f"{r['vol_annual_pct']:>7}{str(r['squeeze_ratio']):>6}{r['score']:>7}"
        )


if __name__ == "__main__":
    main()
