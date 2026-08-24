"""
tools/journal/trade_journal.py — Phase 1 deliverable #5
Trade journaling: append trades to CSV, compute discipline stats.
Your edge dies without a journal — this makes the habit cheap.

Run:
  python trade_journal.py add --symbol BTCUSDT --side long --entry 60000 --stop 58000 --target 66000 --note "breakout"
  python trade_journal.py stats
"""
import argparse
import csv
import os
from datetime import date

CSV_PATH = "journal.csv"
FIELDS = ["date", "symbol", "side", "entry", "stop", "target", "exit", "result_r", "note"]


def add_trade(args) -> None:
    new = not os.path.exists(CSV_PATH)
    risk = abs(args.entry - args.stop)
    reward = abs(args.target - args.entry)
    rr = reward / risk if risk else 0
    with open(CSV_PATH, "a", newline="") as f:
        w = csv.DictWriter(f, fieldnames=FIELDS)
        if new:
            w.writeheader()
        w.writerow({
            "date": date.today().isoformat(), "symbol": args.symbol.upper(),
            "side": args.side, "entry": args.entry, "stop": args.stop,
            "target": args.target, "exit": "", "result_r": "",
            "note": f"[planned R:R 1:{rr:.1f}] {args.note or ''}",
        })
    print(f"logged plan {args.symbol.upper()} {args.side} entry={args.entry} stop={args.stop} R:R 1:{rr:.1f}")


def stats() -> None:
    if not os.path.exists(CSV_PATH):
        print("journal empty"); return
    with open(CSV_PATH) as f:
        rows = list(csv.DictReader(f))
    closed = [r for r in rows if r["exit"]]
    wins = [r for r in closed if float(r["result_r"]) > 0]
    total_r = sum(float(r["result_r"]) for r in closed)
    planned_rr = [float(r["note"].split("1:")[1].split("]")[0]) for r in rows if "1:" in r["note"]]
    avg_rr = sum(planned_rr) / len(planned_rr) if planned_rr else 0
    print(f"trades logged : {len(rows)} ({len(closed)} closed)")
    if closed:
        print(f"win rate      : {len(wins)/len(closed)*100:.0f}%")
        print(f"total R       : {total_r:+.1f}")
    print(f"avg planned R:R: 1:{avg_rr:.1f}")
    unclosed = len(rows) - len(closed)
    if unclosed:
        print(f"open plans    : {unclosed} (review stops!)")


if __name__ == "__main__":
    p = argparse.ArgumentParser()
    sub = p.add_subparsers(dest="cmd", required=True)
    a = sub.add_parser("add")
    a.add_argument("--symbol", required=True); a.add_argument("--side", choices=["long","short"], required=True)
    a.add_argument("--entry", type=float, required=True); a.add_argument("--stop", type=float, required=True)
    a.add_argument("--target", type=float, required=True); a.add_argument("--note", default="")
    s = sub.add_parser("stats")
    args = p.parse_args()
    add_trade(args) if args.cmd == "add" else stats()
