/**
 * Pure quant math — no DSH dependencies, fully unit-testable.
 * Dual moving-average crossover backtest with fee handling.
 */

export interface BacktestConfig {
  /** Fast moving-average window (bars). */
  fast: number
  /** Slow moving-average window (bars). */
  slow: number
  /** Round-trip transaction cost in basis points, charged on every position change. */
  feeBps: number
}

export interface BacktestResult {
  /** Number of position switches. */
  trades: number
  strategyTotalReturn: number
  buyHoldTotalReturn: number
  /** Annualized Sharpe ratio (252 trading days), rf = 0. */
  sharpe: number
  maxDrawdown: number
  /** Strategy equity curve, starting at 1.0. */
  equity: number[]
}

export class ValidationError extends Error {}

export function validateCloses(closes: readonly number[], cfg: BacktestConfig): void {
  if (!Array.isArray(closes) || closes.length < cfg.slow + 2) {
    throw new ValidationError(`need at least ${cfg.slow + 2} closes, got ${closes?.length ?? 0}`)
  }
  if (!(cfg.fast > 0) || !(cfg.slow > cfg.fast)) {
    throw new ValidationError(`require 0 < fast(${cfg.fast}) < slow(${cfg.slow})`)
  }
  for (const [i, c] of closes.entries()) {
    if (!Number.isFinite(c) || c <= 0) {
      throw new ValidationError(`closes[${i}] must be a finite positive number, got ${c}`)
    }
  }
  if (cfg.feeBps < 0 || cfg.feeBps > 1000) {
    throw new ValidationError(`feeBps out of range [0, 1000]: ${cfg.feeBps}`)
  }
}

/** Simple moving average over a rolling window; NaN before the window fills. */
function sma(values: readonly number[], window: number): number[] {
  const out: number[] = []
  let sum = 0
  for (let i = 0; i < values.length; i++) {
    sum += values[i]
    if (i >= window) sum -= values[i - window]
    out.push(i >= window - 1 ? sum / window : Number.NaN)
  }
  return out
}

export function backtest(closes: readonly number[], cfg: BacktestConfig): BacktestResult {
  validateCloses(closes, cfg)
  const n = closes.length
  const maF = sma(closes, cfg.fast)
  const maS = sma(closes, cfg.slow)
  const fee = cfg.feeBps / 10_000

  let pos = 0
  let trades = 0
  const rets: number[] = []
  const equity: number[] = [1]
  for (let i = 1; i < n; i++) {
    const want = Number.isNaN(maF[i]) || Number.isNaN(maS[i]) ? 0 : maF[i]! > maS[i]! ? 1 : 0
    if (want !== pos) {
      trades++
      equity.push(equity[equity.length - 1] * (1 - fee))
    }
    pos = want
    const r = (closes[i] - closes[i - 1]) / closes[i - 1]
    rets.push(pos * r)
    equity.push(equity[equity.length - 1] * (1 + pos * r))
  }

  const total = equity[equity.length - 1] - 1
  const bh = closes[n - 1] / closes[0] - 1
  const mean = rets.reduce((a, b) => a + b, 0) / rets.length
  const variance = rets.reduce((a, b) => a + (b - mean) ** 2, 0) / Math.max(1, rets.length - 1)
  const annVol = Math.sqrt(variance) * Math.sqrt(252)
  const annRet = (1 + total) ** (252 / n) - 1
  let peak = equity[0]
  let mdd = 0
  for (const v of equity) {
    if (v > peak) peak = v
    mdd = Math.min(mdd, v / peak - 1)
  }

  return {
    trades,
    strategyTotalReturn: round4(total),
    buyHoldTotalReturn: round4(bh),
    sharpe: annVol ? round2(annRet / annVol) : 0,
    maxDrawdown: round4(mdd),
    equity,
  }
}

const round4 = (x: number) => Math.round(x * 10_000) / 10_000
const round2 = (x: number) => Math.round(x * 100) / 100
