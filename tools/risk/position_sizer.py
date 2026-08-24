"""
tools/risk/position_sizer.py — Phase 1 deliverable #3
Position sizing: fixed-fractional risk model with portfolio heat cap.
Pure functions — unit-testable, no I/O.
"""


class SizerError(Exception):
    pass


def kelly_fraction(win_rate: float, avg_win: float, avg_loss: float, kelly_mult: float = 0.5) -> float:
    """Half-Kelly by default. win_rate in [0,1]; avg_win/avg_loss are payoff magnitudes."""
    if not 0 < win_rate < 1:
        raise SizerError(f"win_rate must be in (0,1), got {win_rate}")
    if avg_win <= 0 or avg_loss <= 0:
        raise SizerError("avg_win and avg_loss must be positive")
    b = avg_win / avg_loss
    f = win_rate - (1 - win_rate) / b
    return max(0.0, round(f * kelly_mult, 4))


def atr_position(equity: float, risk_pct: float, entry: float, stop: float) -> int:
    """Shares such that hitting the stop loses exactly equity*risk_pct."""
    if equity <= 0:
        raise SizerError("equity must be positive")
    if not 0 < risk_pct <= 5:
        raise SizerError("risk_pct per trade must be in (0, 5]")
    risk_per_share = abs(entry - stop)
    if risk_per_share <= 0:
        raise SizerError("entry and stop must differ")
    shares = int(equity * risk_pct / 100 / risk_per_share)
    return max(0, shares)


def portfolio_heat(positions: list[tuple[float, float]], equity: float, max_heat: float = 6.0) -> dict:
    """positions: list of (risk_amount, current_value). Returns heat % and whether a new trade fits."""
    total_risk = sum(r for r, _ in positions)
    heat = total_risk / equity * 100
    return {
        "heat_pct": round(heat, 2),
        "max_heat_pct": max_heat,
        "room_for_new_trade": heat < max_heat,
        "remaining_risk_budget": round(max(0.0, equity * max_heat / 100 - total_risk), 2),
    }
