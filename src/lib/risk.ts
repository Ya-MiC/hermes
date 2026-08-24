/**
 * Pure position-sizing math — no DSH deps.
 */

export function kellyFraction(winRate: number, avgWin: number, avgLoss: number, kellyMult = 0.5): number {
  if (!(winRate > 0 && winRate < 1)) throw new RangeError(`winRate must be in (0,1), got ${winRate}`)
  if (avgWin <= 0 || avgLoss <= 0) throw new RangeError('avgWin and avgLoss must be positive')
  const b = avgWin / avgLoss
  return Math.max(0, Math.round((winRate - (1 - winRate) / b) * kellyMult * 10_000) / 10_000)
}

export function atrShares(equity: number, riskPct: number, entry: number, stop: number): number {
  if (equity <= 0) throw new RangeError('equity must be positive')
  if (!(riskPct > 0 && riskPct <= 5)) throw new RangeError(`riskPct per trade must be in (0,5], got ${riskPct}`)
  const risk = Math.abs(entry - stop)
  if (risk === 0) throw new RangeError('entry and stop must differ')
  return Math.max(0, Math.floor((equity * riskPct) / 100 / risk))
}

export interface Heat {
  heatPct: number
  maxHeatPct: number
  roomForNewTrade: boolean
  remainingBudget: number
}

export function portfolioHeat(risks: readonly number[], equity: number, maxHeatPct = 6): Heat {
  const total = risks.reduce((a, b) => a + b, 0)
  const heat = (total / equity) * 100
  return {
    heatPct: Math.round(heat * 100) / 100,
    maxHeatPct,
    roomForNewTrade: heat < maxHeatPct,
    remainingBudget: Math.round(Math.max(0, (equity * maxHeatPct) / 100 - total) * 100) / 100,
  }
}
