import type { Context } from '@deepseek-ai/cordis'

/**
 * dsh-quant-links — DSH tool plugin
 * Registers a tool that returns the quant-trading resources indexed in the hermes repo,
 * so the agent can recommend libraries on demand.
 */
export const name = 'dsh-quant-links'

export interface QuantLink { name: string; url: string; stars: number; desc: string }

const LINKS: QuantLink[] = [
  { name: 'TauricResearch/TradingAgents', url: 'https://github.com/TauricResearch/TradingAgents', stars: 99375, desc: 'Multi-Agents LLM Financial Trading Framework' },
  { name: 'microsoft/qlib', url: 'https://github.com/microsoft/qlib', stars: 47860, desc: 'AI-oriented Quant investment platform' },
  { name: 'nautechsystems/nautilus_trader', url: 'https://github.com/nautechsystems/nautilus_trader', stars: 27409, desc: 'Rust-native trading engine' },
  { name: 'OpenByteInc/QuantDinger', url: 'https://github.com/OpenByteInc/QuantDinger', stars: 10985, desc: 'AI quantitative trading platform for crypto/stocks/forex' },
  { name: 'wangzhe3224/awesome-systematic-trading', url: 'https://github.com/wangzhe3224/awesome-systematic-trading', stars: 5002, desc: 'Curated list of systematic trading resources' },
]

export const inject = ['tools']

export function apply(ctx: Context) {
  ctx.tools.register({
    name: 'quant_links',
    description: 'List top open-source quantitative trading frameworks curated by Ya-MiC',
    parameters: {} as never,
    async execute() {
      return LINKS.map(l => `${l.name} ★${l.stars} — ${l.desc} (${l.url})`).join('\n')
    },
  })
}
