/**
 * tools/audit-agent/report-agent.ts — Phase 1 deliverable (roadmap branch)
 * Vertical agent for audit/review report drafting.
 * Family-trade advantage: accountants/auditors review; the agent drafts.
 *
 * DSH plugin form per docs/user/develop/basic/index.md:
 *   exports name + apply(ctx), declares deps via inject.
 *
 * Usage sketch (inside DeepSeek Harness):
 *   ctx.tools -> agent calls draft_report({entity, scope, findings})
 */
import type { Context } from '@deepseek-ai/cordis'

export const name = 'audit-report-agent'
export const inject = ['tools']

interface Finding {
  area: string          // e.g. "procurement", "payroll"
  risk: 'low' | 'medium' | 'high'
  observation: string   // what was found
  recommendation: string
}

export interface AuditDraftInput {
  entity: string                 // audited entity name (anonymized in output)
  scope: string                  // engagement scope
  period: string                 // e.g. "FY2026"
  findings: Finding[]
}

const RISK_ORDER = { high: 0, medium: 1, low: 2 } as const

/** Deterministic template engine — no LLM needed for structure. */
export function renderReport(input: AuditDraftInput): string {
  const sorted = [...input.findings].sort(
    (a, b) => RISK_ORDER[a.risk] - RISK_ORDER[b.risk]
  )
  const lines: string[] = [
    `# Review Report Draft`,
    ``,
    `- Entity: ${input.entity}`,
    `- Scope: ${input.scope}`,
    `- Period: ${input.period}`,
    `- Findings: ${sorted.length} (${sorted.filter(f => f.risk === 'high').length} high)`,
    ``,
    `## Summary of Findings`,
  ]
  for (const f of sorted) {
    lines.push(
      ``,
      `### [${f.risk.toUpperCase()}] ${f.area}`,
      `- Observation: ${f.observation}`,
      `- Recommendation: ${f.recommendation}`
    )
  }
  lines.push(``, `---`, `*Drafted by audit-report-agent. Human reviewer must verify before release.*`)
  return lines.join('\n')
}

export function apply(ctx: Context) {
  ctx.tools.register({
    name: 'draft_report',
    description: 'Render an audit/review report draft from structured findings',
    parameters: {} as never,
    execute(_args: unknown) {
      const input = _args as AuditDraftInput
      return renderReport(input)
    },
  })
}
