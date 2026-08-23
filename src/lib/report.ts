/**
 * Pure report rendering — no DSH dependencies, fully unit-testable.
 * Deterministic audit/review report drafts: zero hallucination in structure.
 */

export type Risk = 'high' | 'medium' | 'low'

export interface Finding {
  area: string
  risk: Risk
  observation: string
  recommendation: string
}

export interface DraftInput {
  entity: string
  scope: string
  period: string
  findings: readonly Finding[]
}

export type Locale = 'zh' | 'en'

const LABELS = {
  zh: {
    title: '# 审阅报告（草稿）',
    entity: '被审阅对象', scope: '范围', period: '期间',
    findings: '发现数量',
    highCount: '高',
    summary: '## 发现摘要',
    obs: '- 事实观察：', rec: '- 建议：',
    riskLabel: { high: '高', medium: '中', low: '低' } as Record<Risk, string>,
    empty: '_本期间未记录任何发现。_',
  },
  en: {
    title: '# Review Report (Draft)',
    entity: 'Entity', scope: 'Scope', period: 'Period',
    findings: 'Findings',
    highCount: 'high',
    summary: '## Summary of Findings',
    obs: '- Observation: ', rec: '- Recommendation: ',
    riskLabel: { high: 'HIGH', medium: 'MEDIUM', low: 'LOW' } as Record<Risk, string>,
    empty: '_No findings recorded for this period._',
  },
} as const

const RISK_ORDER: Record<Risk, number> = { high: 0, medium: 1, low: 2 }

export interface DraftOptions {
  locale?: Locale
  watermark?: string
}

export function renderReport(input: DraftInput, opts: DraftOptions = {}): string {
  const locale = opts.locale ?? 'zh'
  const watermark = opts.watermark ?? ''
  const t = LABELS[locale]

  if (!input.entity?.trim()) throw new Error('entity is required')
  if (!input.scope?.trim()) throw new Error('scope is required')
  if (!input.period?.trim()) throw new Error('period is required')
  if (!Array.isArray(input.findings)) throw new Error('findings must be an array')

  const sorted = [...(input.findings as Finding[])].sort((a, b) => RISK_ORDER[a.risk] - RISK_ORDER[b.risk])
  const high = sorted.filter(f => f.risk === 'high').length

  const out: string[] = [
    t.title, '',
    `- ${t.entity}: ${input.entity}`,
    `- ${t.scope}: ${input.scope}`,
    `- ${t.period}: ${input.period}`,
    `- ${t.findings}: ${sorted.length} (${high} ${t.highCount})`,
    '', t.summary,
  ]

  if (!sorted.length) {
    out.push('', t.empty)
  }
  for (const f of sorted) {
    out.push('', `### [${t.riskLabel[f.risk]}] ${f.area}`, `${t.obs}${f.observation}`, `${t.rec}${f.recommendation}`)
  }

  out.push('', '---')
  if (watermark) out.push(`*${watermark}*`)
  return out.join('\n')
}
