/**
 * dsh-momentum-screen — momentum/breakout screener as a DSH tool.
 */
import type { Context } from '@deepseek-ai/cordis'
import { defineTool } from '@deepseek-ai/dsh-tools'
import Schema from '@deepseek-ai/schemastery'
import { screen } from '../lib/screener.js'

export const name = 'dsh-momentum-screen'
export const inject = ['tools']

export interface Config { minBars: number }
export const Config: Schema<Config> = Schema.object({
  minBars: Schema.number().min(91).default(120).description('Minimum history length accepted'),
})

type JsonValue = null | boolean | number | string | JsonValue[] | { [key: string]: JsonValue }

export function apply(ctx: Context, config: Config) {
  ctx.tools.register(defineTool({
    name: 'momentum_screen',
    description: 'Score one price series for breakout readiness: proximity to 52-week high, 90-day momentum, volatility contraction. Research only — no order execution.',
    parameters: {
      closes: { type: 'array', required: true, description: `Daily closes oldest-first (>= ${config.minBars} points)` },
    },
    output: { schema: { type: 'json' }, render: (_a, v) => [{ type: 'text', text: JSON.stringify(v, null, 2) }] },
    async execute(args, _exec) {
      const { closes } = args as unknown as { closes: number[] }
      try {
        const r = screen(closes)
        return r as unknown as JsonValue
      } catch (e) {
        throw new Error(`invalid input: ${(e as Error).message}`)
      }
    },
  }))
}
