import type { Context } from '@deepseek-ai/cordis'
import { defineTool } from '@deepseek-ai/dsh-tools'
import Schema from '@deepseek-ai/schemastery'

/**
 * dsh-audit-draft — render an audit/review report draft from structured findings.
 * Deterministic template engine: zero hallucination in report structure.
 * The agent collects findings conversationally, then calls this tool.
 */
export const name = 'dsh-audit-draft'
export const inject = ['tools']

export interface Config {
  watermark: string
  locale: 'zh' | 'en'
}

export const Config: Schema<Config> = Schema.object({
  watermark: Schema.string().default('Draft — human reviewer must verify before release.'),
  locale: Schema.union(['zh', 'en'] as const).default('zh'),
})

const L = {
  zh: {
    title: '# 审阅报告（草稿）',
    entity: '- 被审阅对象', scope: '- 范围', period: '- 期间',
    findings: '- 发现数量', summary: '## 发现摘要',
    obs: '- 事实观察', rec: '- 建议', high: '高', medium: '中', low: '低',
  },
  en: {
    title: '# Review Report (Draft)',
    entity: '- Entity', scope: '- Scope', period: '- Period',
    findings: '- Findings', summary: '## Summary of Findings',
    obs: '- Observation', rec: '- Recommendation', high: 'HIGH', medium: 'MEDIUM', low: 'LOW',
  },
} as const

interface Finding { area: string; risk: 'high'|'medium'|'low'; observation: string; recommendation: string }
interface DraftArgs { entity: string; scope: string; period: string; findings: Finding[] }

export function apply(ctx: Context, config: Config) {
  const t = L[config.locale]
  ctx.tools.register(defineTool({
    name: 'audit_draft',
    description: 'Render an audit/review report draft (markdown) from structured findings, sorted by risk.',
    parameters: {
      entity: { type: 'string', required: true, description: 'Audited entity name' },
      scope: { type: 'string', required: true, description: 'Engagement scope' },
      period: { type: 'string', required: true, description: 'e.g. FY2026' },
      findings: { type: 'object', required: true, description: 'Array of {area, risk(high|medium|low), observation, recommendation}' },
    },
    output: {
      schema: { type: 'string' } as never,
      render: (_a, v) => [{ type: 'text', text: String(v) }],
    },
    async execute(args: unknown) {
      const a = args as DraftArgs
      const order = { high: 0, medium: 1, low: 2 } as const
      const sorted = [...a.findings].sort((x, y) => order[x.risk] - order[y.risk])
      const out = [
        t.title, ``,
        `${t.entity}: ${a.entity}`, `${t.scope}: ${a.scope}`, `${t.period}: ${a.period}`,
        `${t.findings}: ${sorted.length} (${sorted.filter(f=>f.risk==='high').length} ${t.high})`,
        ``, t.summary,
      ]
      for (const f of sorted) {
        out.push(``, `### [${t[f.risk]}] ${f.area}`, `${t.obs}: ${f.observation}`, `${t.rec}: ${f.recommendation}`)
      }
      out.push(``, `---`, `*${config.watermark}*`)
      return out.join('\n')
    },
  }))
}
