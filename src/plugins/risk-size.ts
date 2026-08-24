/**
 * dsh-risk-size — position sizing & portfolio heat as DSH tools.
 */
import type { Context } from '@deepseek-ai/cordis'
import { defineTool } from '@deepseek-ai/dsh-tools'
import Schema from '@deepseek-ai/schemastery'
import { kellyFraction, atrShares, portfolioHeat } from '../lib/risk.js'

type JsonValue = null | boolean | number | string | JsonValue[] | { [key: string]: JsonValue }

export const name = 'dsh-risk-size'
export const inject = ['tools']

export interface Config { defaultRiskPct: number; maxHeatPct: number }
export const Config: Schema<Config> = Schema.object({
  defaultRiskPct: Schema.number().min(0.1).max(5).default(1).description('Default risk per trade, % of equity'),
  maxHeatPct: Schema.number().min(1).max(20).default(6).description('Portfolio heat cap, %'),
})

export function apply(ctx: Context, config: Config) {
  ctx.tools.register(defineTool({
    name: 'position_size_atr',
    description: `How many shares to buy so that hitting the stop loses exactly the risk budget (${config.defaultRiskPct}% default).`,
    parameters: {
      equity: { type: 'number', required: true, description: 'Account equity' },
      entry: { type: 'number', required: true, description: 'Planned entry price' },
      stop: { type: 'number', required: true, description: 'Stop-loss price' },
      riskPct: { type: 'number', description: `Risk %% of equity (default ${config.defaultRiskPct})` },
    },
    output: { schema: { type: 'json' }, render: (_a, v) => [{ type: 'text', text: JSON.stringify(v, null, 2) }] },
    async execute(args, _exec) {
      const a = args as unknown as { equity: number; entry: number; stop: number; riskPct?: number }
      const shares = atrShares(a.equity, a.riskPct ?? config.defaultRiskPct, a.entry, a.stop)
      const riskAmt = Math.abs(a.entry - a.stop) * shares
      return {
        shares,
        riskAmount: Math.round(riskAmt * 100) / 100,
        positionValue: Math.round(shares * a.entry * 100) / 100,
      } as unknown as JsonValue
    },
  }))

  ctx.tools.register(defineTool({
    name: 'portfolio_heat',
    description: `Check open-trade risk against the ${config.maxHeatPct}% portfolio heat cap.`,
    parameters: {
      equity: { type: 'number', required: true, description: 'Account equity' },
      tradeRisks: { type: 'array', required: true, description: 'Dollar risk amount of each open position' },
    },
    output: { schema: { type: 'json' }, render: (_a, v) => [{ type: 'text', text: JSON.stringify(v, null, 2) }] },
    async execute(args, _exec) {
      const a = args as unknown as { equity: number; tradeRisks: number[] }
      return portfolioHeat(a.tradeRisks, a.equity, config.maxHeatPct) as unknown as JsonValue
    },
  }))

  ctx.tools.register(defineTool({
    name: 'kelly_fraction',
    description: 'Half-Kelly position fraction from win-rate statistics.',
    parameters: {
      winRate: { type: 'number', required: true, description: 'Historical win rate, 0-1' },
      avgWin: { type: 'number', required: true, description: 'Average winning trade size' },
      avgLoss: { type: 'number', required: true, description: 'Average losing trade size' },
    },
    output: { schema: { type: 'string' }, render: (_a, v) => [{ type: 'text', text: String(v) }] },
    async execute(args, _exec) {
      const a = args as unknown as { winRate: number; avgWin: number; avgLoss: number }
      const f = kellyFraction(a.winRate, a.avgWin, a.avgLoss)
      return `Kelly fraction (half-Kelly applied): ${(f * 100).toFixed(2)}% of equity`
    },
  }))
}
