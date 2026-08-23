/**
 * dsh-ielts-coach — IELTS study tracker as DSH tools (ielts_log / ielts_progress).
 * Session history is scoped to the plugin lifetime via ctx.effect() cleanup semantics.
 */
import type { Context } from '@deepseek-ai/cordis'
import { defineTool } from '@deepseek-ai/dsh-tools'
import Schema from '@deepseek-ai/schemastery'
import { logSession, progress, formatProgress, isValidSkill, type Session } from '../lib/study.js'

export const name = 'dsh-ielts-coach'
export const inject = ['tools']

export interface Config {
  targetBand: number
  examDate: string // yyyy-mm-dd
}

export const Config: Schema<Config> = Schema.object({
  targetBand: Schema.number().min(4).max(9).step(0.5).default(6.5).description('Target overall band'),
  examDate: Schema.string().pattern(/^\d{4}-\d{2}-\d{2}$/).default('2028-06-30').description('Exam date yyyy-mm-dd'),
})

export function apply(ctx: Context, config: Config) {
  const history: Session[] = []

  ctx.tools.register(defineTool({
    name: 'ielts_log',
    description: 'Log an IELTS practice session. skill: L=Listening R=Reading W=Writing S=Speaking.',
    parameters: {
      skill: { type: 'string', required: true, description: 'L | R | W | S' },
      minutes: { type: 'number', required: true, description: 'Minutes practiced (1-1440)' },
      score: { type: 'number', description: 'Band score if from a mock or exam (0-9)' },
    },
    output: { schema: { type: 'string' }, render: (_a, v) => [{ type: 'text', text: String(v) }] },
    async execute(args: unknown): Promise<string> {
      const a = args as { skill: string; minutes: number; score?: number }
      if (!isValidSkill(a.skill)) throw new Error(`skill must be one of L/R/W/S, got "${a.skill}"`)
      const s = logSession(history, { skill: a.skill, minutes: a.minutes, score: a.score })
      return `Logged ${s.date} ${s.skill} ${s.minutes}min${s.score !== undefined ? ` (band ${s.score})` : ''}. Total sessions: ${history.length}.`
    },
  }))

  ctx.tools.register(defineTool({
    name: 'ielts_progress',
    description: `Show IELTS progress vs target band ${config.targetBand}, exam ${config.examDate}.`,
    parameters: {},
    output: { schema: { type: 'string' }, render: (_a, v) => [{ type: 'text', text: String(v) }] },
    async execute(): Promise<string> {
      return formatProgress(progress(history, config.targetBand, config.examDate))
    },
  }))
}
