/**
 * dsh-identity-checklist — migration-route milestone tracker as DSH tools.
 */
import type { Context } from '@deepseek-ai/cordis'
import { defineTool } from '@deepseek-ai/dsh-tools'
import Schema from '@deepseek-ai/schemastery'
import { Tracker, NZ_LEVEL7, type Route } from '../lib/identity.js'

export const name = 'dsh-identity-checklist'
export const inject = ['tools']

export interface Config {
  routeName: string
  deadlineYear: number
  /** Comma-separated milestone list; defaults to the NZ Level7 route. */
  milestones: string
}

export const Config: Schema<Config> = Schema.object({
  routeName: Schema.string().default(NZ_LEVEL7.name).description('Route description'),
  deadlineYear: Schema.number().min(2026).max(2060).default(2031).description('Hard deadline year'),
  milestones: Schema.string()
    .default(NZ_LEVEL7.milestones.join(' | '))
    .description("Milestones separated by ' | '"),
})

function routeFromConfig(config: Config): Route {
  const milestones = config.milestones.split('|').map(s => s.trim()).filter(Boolean)
  if (!milestones.length) throw new Error('milestones config must not be empty')
  return { name: config.routeName, deadlineYear: config.deadlineYear, milestones }
}

export function apply(ctx: Context, config: Config) {
  const tracker = new Tracker(routeFromConfig(config))

  ctx.tools.register(defineTool({
    name: 'identity_status',
    description: `Show migration-route milestones (deadline ${config.deadlineYear}) with done/pending marks.`,
    parameters: {},
    output: { schema: { type: 'string' }, render: (_a, v) => [{ type: 'text', text: String(v) }] },
    async execute(): Promise<string> {
      return tracker.format()
    },
  }))

  ctx.tools.register(defineTool({
    name: 'identity_done',
    description: 'Mark a migration milestone complete by substring match.',
    parameters: {
      milestone: { type: 'string', required: true, description: 'Substring of the milestone name, e.g. "IELTS"' },
    },
    output: { schema: { type: 'string' }, render: (_a, v) => [{ type: 'text', text: String(v) }] },
    async execute(args: unknown): Promise<string> {
      const { milestone } = args as { milestone: string }
      const hit = tracker.complete(milestone)
      if (!hit) return `No milestone matching "${milestone}".`
      return `Marked done: ${hit}\n\n${tracker.format()}`
    },
  }))
}
