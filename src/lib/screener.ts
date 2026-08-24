/**
 * Pure momentum-screener math — no DSH deps.
 */
export interface ScreenerResult {
  pctOf52wHigh: number
  mom90d: number | null
  volAnnualPct: number
  squeezeRatio: number | null
  score: number
}

export function screen(bars: readonly number[]): ScreenerResult {
  const n = bars.length
  if (n < 91) throw new Error(`need at least 91 bars for 90d momentum, got ${n}`)
  for (const [i, b] of bars.entries()) {
    if (!Number.isFinite(b) || b <= 0) throw new Error(`bars[${i}] must be finite positive`)
  }
  const hi = n >= 250 ? Math.max(...bars.slice(-250)) : Math.max(...bars)
  const last = bars[n - 1]
  const rets: number[] = []
  for (let i = 1; i < n; i++) rets.push((bars[i] - bars[i - 1]) / bars[i - 1])
  const mean = rets.reduce((a, b) => a + b, 0) / rets.length
  const variance = rets.reduce((a, b) => a + (b - mean) ** 2, 0) / (rets.length - 1)
  const volAnn = Math.sqrt(variance) * Math.sqrt(252)
  const rec = rets.slice(-20)
  const rmean = rec.reduce((a, b) => a + b, 0) / rec.length
  const rvar = rec.reduce((a, b) => a + (b - rmean) ** 2, 0) / (rec.length - 1)
  const squeeze = (Math.sqrt(rvar) * Math.sqrt(252)) / volAnn
  const mom90 = last / bars[n - 91] - 1
  return {
    pctOf52wHigh: Math.round((last / hi) * 1000) / 10,
    mom90d: Math.round(mom90 * 1000) / 10,
    volAnnualPct: Math.round(volAnn * 1000) / 10,
    squeezeRatio: Math.round(squeeze * 100) / 100,
    score:
      Math.round(
        (Math.max(0, (last / hi) * 100 - 80) * 2.0 +
          mom90 * 100 * 0.5 -
          squeeze * 10) *
          10,
      ) / 10,
  }
}
