import { describe, it, expect } from 'vitest'
import { backtest, validateCloses, ValidationError } from '../src/lib/backtest.js'

const uptrend = Array.from({ length: 120 }, (_, i) => 100 + i * 0.5)
const downtrend = Array.from({ length: 120 }, (_, i) => 160 - i * 0.5)

describe('validateCloses', () => {
  it('rejects too-short series', () => {
    expect(() => validateCloses([1, 2], { fast: 5, slow: 10, feeBps: 0 })).toThrow(ValidationError)
  })
  it('rejects fast >= slow', () => {
    expect(() => validateCloses(uptrend, { fast: 60, slow: 20, feeBps: 0 })).toThrow(/fast/)
  })
  it('rejects non-positive or non-finite prices', () => {
    expect(() => validateCloses([5, 1, 0, 3, 4, 6], { fast: 2, slow: 3, feeBps: 0 })).toThrow(/closes\[2\]/)
    expect(() => validateCloses([5, 1, Number.NaN, 3, 4, 6], { fast: 2, slow: 3, feeBps: 0 })).toThrow(ValidationError)
  })
  it('rejects absurd fees', () => {
    expect(() => validateCloses(uptrend, { fast: 5, slow: 20, feeBps: -1 })).toThrow(/feeBps/)
  })
})

describe('backtest', () => {
  const cfg = { fast: 5, slow: 20, feeBps: 0 }

  it('captures a clean uptrend (no whipsaw after warmup)', () => {
    const r = backtest(uptrend, cfg)
    // In a monotonic uptrend the strategy should be long most of the time and beat cash.
    expect(r.strategyTotalReturn).toBeGreaterThan(0.3)
    expect(r.trades).toBeLessThanOrEqual(3)
    expect(r.maxDrawdown).toBeGreaterThanOrEqual(-0.05) // tiny drawdown in a pure ramp
  })

  it('stays in cash through a pure downtrend after first signal flips', () => {
    const r = backtest(downtrend, cfg)
    expect(r.maxDrawdown).toBeGreaterThan(-0.35)
    // buy&hold loses badly; strategy should lose less
    expect(r.strategyTotalReturn).toBeGreaterThan(r.buyHoldTotalReturn)
  })

  it('fees reduce returns monotonically', () => {
    const free = backtest(uptrend, cfg)
    const costly = backtest(uptrend, { ...cfg, feeBps: 50 })
    expect(costly.strategyTotalReturn).toBeLessThan(free.strategyTotalReturn)
  })

  it('equity curve starts at 1 and never goes negative', () => {
    const r = backtest(uptrend, cfg)
    expect(r.equity[0]).toBe(1)
    for (const v of r.equity) expect(v).toBeGreaterThan(0)
  })
})
