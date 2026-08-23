import type { Context } from '@deepseek-ai/cordis'
import { defineTool } from '@deepseek-ai/dsh-tools'
import Schema from '@deepseek-ai/schemastery'

/**
 * dsh-identity-checklist — NZ Level7 migration milestone tracker.
 * Persists state via ctx effect-scoped storage; agent can query/update milestones.
 */
export const name = 'dsh-identity-checklist'
export const inject = ['tools']

export interface Config {
  route: string
  deadlineYear: number
}
export const Config: Schema<Config> = Schema.object({
  route: Schema.string().default('NZ Level7 -> work visa -> residence'),
  deadlineYear: Schema.number().default(2031),
})

const MILESTONES = [
  'IELTS 6.5 certificate',
  'Funds proof 300-400k CNY',
  'Level7 school application',
  'Student visa granted',
  'Post-study work visa',
  'Residence (SMV)',
]

export function apply(ctx: Context, config: Config) {
  const done = new Set<string>()

  ctx.tools.register(defineTool({
    name: 'identity_status',
    description: `Show ${config.route} milestones (deadline ${config.deadlineYear}) with done/pending marks.`,
    parameters: {},
    output: { schema: { type: 'string' } as never, render: (_a, v) => [{ type: 'text', text: String(v) }] },
    async execute() {
      const lines = [`Route: ${config.route} | Deadline: ${config.deadlineYear}`, '']
      for (const m of MILESTONES) lines.push(`[${done.has(m) ? 'x' : ' '}] ${m}`)
      lines.push('', `${done.size}/${MILESTONES.length} complete`)
      return lines.join('\n')
    },
  }))

  ctx.tools.register(defineTool({
    name: 'identity_done',
    description: 'Mark a milestone as complete.',
    parameters: {
      milestone: { type: 'string', required: true, description: 'Substring of the milestone name' },
    },
    output: { schema: { type: 'string' } as never, render: (_a, v) => [{ type: 'text', text: String(v) }] },
    async execute(args: unknown) {
      const { milestone } = args as { milestone: string }
      const hit = MILESTONES.find(m => m.toLowerCase().includes(milestone.toLowerCase()))
      if (!hit) return `No milestone matching "${milestone}". Options:\n` + MILESTONES.join('\n')
      done.add(hit)
      return `Marked done: ${hit} (${done.size}/${MILESTONES.length})`
    },
  }))
}
