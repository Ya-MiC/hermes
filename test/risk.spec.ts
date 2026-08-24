import { describe, it, expect } from 'vitest'
import { kellyFraction, atrShares, portfolioHeat } from '../src/lib/risk.js'

describe('risk sizing', () => {
  it('half-kelly: 55% win at 2:1 payoff -> 16.25%', () => {
    expect(kellyFraction(0.55, 2, 1)).toBe(0.1625)
  })
  it('atr sizing matches manual math', () => {
    expect(atrShares(10_000, 1, 100, 95)).toBe(20)
    expect(atrShares(10_000, 1, 95, 100)).toBe(20) // symmetric stop side
  })
  it('heat cap logic', () => {
    const h = portfolioHeat([150, 200], 10_000, 6)
    expect(h.heatPct).toBe(3.5)
    expect(h.roomForNewTrade).toBe(true)
    expect(portfolioHeat([700], 10_000, 6).roomForNewTrade).toBe(false)
  })
  it('rejects invalid inputs', () => {
    expect(() => kellyFraction(1.2, 2, 1)).toThrow(RangeError)
    expect(() => atrShares(-1, 1, 100, 95)).toThrow(RangeError)
    expect(() => atrShares(10_000, 1, 100, 100)).toThrow(/differ/)
  })
})
