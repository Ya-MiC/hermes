import { describe, it, expect } from 'vitest'
import { screen } from '../src/lib/screener.js'

const ramp = Array.from({ length: 300 }, (_, i) => 100 * (1 + 0.003 * i))
describe('screen', () => {
  it('flags a clean ramp near its high with positive momentum', () => {
    const r = screen(ramp)
    expect(r.pctOf52wHigh).toBe(100)
    expect(r.mom90d).toBeGreaterThan(0)
    expect(r.score).toBeGreaterThan(0)
  })
  it('rejects short series and bad prices', () => {
    expect(() => screen([1, 2, 3])).toThrow(/91 bars/)
    expect(() => screen(Array.from({ length: 120 }, () => -5))).toThrow(/finite positive/)
  })
})
