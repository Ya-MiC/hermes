import type { Context } from '@deepseek-ai/cordis'
import { defineTool } from '@deepseek-ai/dsh-tools'
import Schema from '@deepseek-ai/schemastery'

/**
 * dsh-quant-backtest — dual moving-average crossover backtester as a DSH tool.
 * Ask the agent: "Backtest MA20/60 on this closes array."
 */
export const name = 'dsh-quant-backtest'
export const inject = ['tools']

export interface Config {
  defaultFast: number
  defaultSlow: number
  feeBps: number
}

export const Config: Schema<Config> = Schema.object({
  defaultFast: Schema.number().default(20).description('Fast MA window'),
  defaultSlow: Schema.number().default(60).description('Slow MA window'),
  feeBps: Schema.number().default(5).description('Round-trip fee in basis points'),
})

interface BtArgs {
  closes: number[]
  fast?: number
  slow?: number
}
interface BtResult {
  trades: number
  strategyTotalReturn: number
  buyHoldTotalReturn: number
  sharpe: number
  maxDrawdown: number
}

function backtest(closes: number[], fast: number, slow: number, feeBps: number): BtResult {
  const n = closes.length
  if (n < slow + 2) throw new Error(`need at least ${slow + 2} closes, got ${n}`)
  const sma = (w: number) =>
    closes.map((_, i) =>
      i < w - 1 ? NaN : closes.slice(i - w + 1, i + 1).reduce((a, b) => a + b, 0) / w
    )
  const maF = sma(fast)
  const maS = sma(slow)

  // position[i] held during bar i+1's return (signal shifted by one)
  let pos = 0
  const rets: number[] = []
  const eq: number[] = [1]
  let trades = 0
  for (let i = 1; i < n; i++) {
    const want = !Number.isNaN(maF[i]) && !Number.isNaN(maS[i]) ? (maF[i] > maS[i] ? 1 : 0) : 0
    if (want !== pos) {
      trades++
      eq.push(eq[eq.length - 1] * (1 - (feeBps / 10_000))) // pay fee on switch
    }
    pos = want
    const r = (closes[i] - closes[i - 1]) / closes[i - 1]
    rets.push(pos * r)
    eq.push(eq[eq.length - 1] * (1 + pos * r))
  }
  const total = eq[eq.length - 1] - 1
  const bh = closes[n - 1] / closes[0] - 1
  const mean = rets.reduce((a, b) => a + b, 0) / rets.length
  const sd = Math.sqrt(rets.reduce((a, b) => a + (b - mean) ** 2, 0) / rets.length) * Math.sqrt(252)
  let peak = eq[0], mdd = 0
  for (const v of eq) { if (v > peak) peak = v; mdd = Math.min(mdd, v / peak - 1) }
  return {
    trades,
    strategyTotalReturn: +total.toFixed(4),
    buyHoldTotalReturn: +bh.toFixed(4),
    sharpe: sd ? +(mean * 252 / sd).toFixed(2) : 0,
    maxDrawdown: +mdd.toFixed(4),
  }
}

export function apply(ctx: Context, config: Config) {
  ctx.tools.register(defineTool({
    name: 'quant_backtest',
    description: 'Run a dual moving-average crossover backtest on a series of closing prices.',
    parameters: {
      closes: { type: 'number', required: true, description: 'Closing prices, oldest first' },
      fast: { type: 'number', description: `Fast MA window (default ${config.defaultFast})` },
      slow: { type: 'number', description: `Slow MA window (default ${config.defaultSlow})` },
    },
    output: {
      schema: { type: 'object' } as never,
      render: (_a, v) => [{ type: 'text', text: JSON.stringify(v, null, 2) }],
    },
    async execute(args: unknown) {
      const a = args as BtArgs
      return backtest(
        a.closes,
        a.fast ?? config.defaultFast,
        a.slow ?? config.defaultSlow,
        config.feeBps,
      )
    },
  }))
}
