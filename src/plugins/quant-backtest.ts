/**
 * dsh-quant-backtest — dual MA crossover backtester exposed as a DSH tool.
 * Official spec: defineTool + Schemastery Config (no hardcoded tunables).
 */
import type { Context } from '@deepseek-ai/cordis'
import { defineTool } from '@deepseek-ai/dsh-tools'
import Schema from '@deepseek-ai/schemastery'
import { backtest, ValidationError, type BacktestResult } from '../lib/backtest.js'

export const name = 'dsh-quant-backtest'
export const inject = ['tools']

export interface Config {
  defaultFast: number
  defaultSlow: number
  feeBps: number
}

export const Config: Schema<Config> = Schema.object({
  defaultFast: Schema.number().min(1).default(20).description('Fast MA window'),
  defaultSlow: Schema.number().min(2).default(60).description('Slow MA window'),
  feeBps: Schema.number().min(0).max(1000).default(5).description('Round-trip fee in basis points'),
})

type JsonValue = null | boolean | number | string | JsonValue[] | { [key: string]: JsonValue }

export function apply(ctx: Context, config: Config) {
  ctx.tools.register(defineTool({
    name: 'quant_backtest',
    description: 'Run a dual moving-average crossover backtest on a series of closing prices. Returns trades, total return vs buy&hold, Sharpe and max drawdown.',
    parameters: {
      closes: { type: 'array', required: true, description: 'Closing prices, oldest first' },
      fast: { type: 'number', description: `Fast MA window (default ${config.defaultFast})` },
      slow: { type: 'number', description: `Slow MA window (default ${config.defaultSlow})` },
    },
    output: {
      schema: { type: 'json' },
      render: (_args, value) => [{ type: 'text', text: JSON.stringify(value, null, 2) }],
    },
    async execute(args, _exec) {
      const a = args as unknown as { closes: number[]; fast?: number; slow?: number }
      try {
        const r = backtest(a.closes, {
          fast: a.fast ?? config.defaultFast,
          slow: a.slow ?? config.defaultSlow,
          feeBps: config.feeBps,
        })
        return { ...r } as JsonValue
      } catch (e) {
        if (e instanceof ValidationError) throw new Error(`invalid input: ${e.message}`)
        throw e
      }
    },
  }))
}
