/**
 * dsh-audit-draft — deterministic audit/review report drafts as a DSH tool.
 */
import type { Context } from '@deepseek-ai/cordis'
import { defineTool } from '@deepseek-ai/dsh-tools'
import Schema from '@deepseek-ai/schemastery'
import { renderReport, type DraftInput, type Locale } from '../lib/report.js'

export const name = 'dsh-audit-draft'
export const inject = ['tools']

export interface Config {
  locale: Locale
  watermark: string
}

export const Config: Schema<Config> = Schema.object({
  locale: Schema.union(['zh', 'en'] as const).default('zh').description('Report language'),
  watermark: Schema.string().default('草稿——发布前必须经人工复核。').description('Footer watermark'),
})

export function apply(ctx: Context, config: Config) {
  ctx.tools.register(defineTool({
    name: 'audit_draft',
    description: 'Render an audit/review report draft (markdown) from structured findings, sorted by risk (high first).',
    parameters: {
      entity: { type: 'string', required: true, description: 'Audited entity name' },
      scope: { type: 'string', required: true, description: 'Engagement scope' },
      period: { type: 'string', required: true, description: 'Reporting period, e.g. FY2026' },
      findings: { type: 'json', required: true, description: 'Array of {area, risk(high|medium|low), observation, recommendation}' },
    },
    output: {
      schema: { type: 'string' },
      render: (_args, value) => [{ type: 'text', text: String(value) }],
    },
    async execute(args: unknown): Promise<string> {
      return renderReport(args as DraftInput, { locale: config.locale, watermark: config.watermark })
    },
  }))
}
