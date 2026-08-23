/**
 * Smoke test: load each plugin into a minimal Cordis context and invoke its tools.
 * Proves the plugins actually load and execute — not just compile.
 */
import { Context, Service } from '@deepseek-ai/cordis'
import { quantBacktest, auditDraft, ieltsCoach, identityChecklist } from './src/index.js'

class ToolsService extends Service {
  tools = new Map<string, { execute: (args: unknown) => Promise<unknown> }>()
  register(t: { name: string; execute: (args: unknown) => Promise<unknown> }) {
    this.tools.set(t.name, t)
  }
  get(name: string) {
    return this.tools.get(name)
  }
  constructor(ctx: Context) {
    super(ctx, 'tools')
  }
}

async function main() {
  const ctx = new Context()
  ctx.tools = new ToolsService(ctx)

  // Load all four tool plugins with their default configs
  const configs = {
    quant: { defaultFast: 20, defaultSlow: 60, feeBps: 5 },
    audit: { locale: 'en' as const, watermark: 'DRAFT — human review required.' },
    ielts: { targetBand: 6.5, examDate: '2028-06-30' },
    identity: {
      routeName: 'NZ Level7 -> work visa -> residence',
      deadlineYear: 2031,
      milestones: 'IELTS 6.5 certificate | Funds proof | School application | Student visa | Work visa | Residence',
    },
  }
  // @ts-expect-error test harness assignment
  ctx.quantBacktest?.()
  quantBacktest(ctx as never, configs.quant)
  auditDraft(ctx as never, configs.audit)
  ieltsCoach(ctx as never, configs.ielts)
  identityChecklist(ctx as never, configs.identity)

  console.log('registered tools:', [...ctx.tools.tools.keys()].join(', '))
  if (ctx.tools.tools.size !== 6) throw new Error(`expected 6 tools, got ${ctx.tools.tools.size}`)

  // 1. backtest on a synthetic ramp
  const closes = Array.from({ length: 130 }, (_, i) => 100 * Math.exp(0.004 * i))
  const bt = (await ctx.tools.get('quant_backtest')!.execute({ closes })) as any
  console.log('quant_backtest →', JSON.stringify(bt))
  if (!(bt.strategyTotalReturn > 0)) throw new Error('backtest should profit in an uptrend')

  // 2. audit draft
  const md = await ctx.tools.get('audit_draft')!.execute({
    entity: 'ACME Ltd',
    scope: 'procurement',
    period: 'FY2026',
    findings: [
      { area: 'payroll', risk: 'low', observation: 'minor delay', recommendation: 'automate' },
      { area: 'sourcing', risk: 'high', observation: 'single supplier', recommendation: 'tender' },
    ],
  })
  console.log('audit_draft →\n' + md)
  if (!String(md).includes('# Review Report (Draft)')) throw new Error('bad report header')

  // 3. IELTS coach roundtrip
  await ctx.tools.get('ielts_log')!.execute({ skill: 'W', minutes: 60, score: 6.0 })
  await ctx.tools.get('ielts_log')!.execute({ skill: 'S', minutes: 45, score: 6.5 })
  const prog = await ctx.tools.get('ielts_progress')!.execute({})
  console.log('ielts_progress →\n' + prog)

  // 4. identity checklist roundtrip
  await ctx.tools.get('identity_done')!.execute({ milestone: 'ielts' })
  const st = await ctx.tools.get('identity_status')!.execute({})
  console.log('identity_status →\n' + st)
  if (!String(st).includes('[x] IELTS')) throw new Error('milestone not marked')

  console.log('\n✅ SMOKE TEST PASSED: all 4 plugins load & execute end-to-end')
  process.exit(0)
}

main().catch(e => {
  console.error('❌ SMOKE FAILED:', e)
  process.exit(1)
})
