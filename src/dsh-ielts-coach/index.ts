import type { Context } from '@deepseek-ai/cordis'
import { defineTool } from '@deepseek-ai/dsh-tools'
import Schema from '@deepseek-ai/schemastery'

/**
 * dsh-ielts-coach — IELTS study tracker as a DSH tool set.
 * Logs vocabulary/practice sessions and reports progress against the 2028 6.5 target.
 */
export const name = 'dsh-ielts-coach'
export const inject = ['tools']

export interface Config {
  targetBand: number
  examDate: string
}

export const Config: Schema<Config> = Schema.object({
  targetBand: Schema.number().default(6.5),
  examDate: Schema.string().default('2028-06-30'),
})

interface Session { date: string; skill: 'L'|'R'|'W'|'S'; minutes: number; score?: number }
const HISTORY: Session[] = []

export function apply(ctx: Context, config: Config) {
  ctx.tools.register(defineTool({
    name: 'ielts_log',
    description: 'Log an IELTS practice session (skill L/R/W/S, minutes, optional band score).',
    parameters: {
      skill: { type: 'string', required: true, description: 'L=Listening R=Reading W=Writing S=Speaking' },
      minutes: { type: 'number', required: true, description: 'Minutes practiced' },
      score: { type: 'number', description: 'Band score if from a mock/exam' },
    },
    output: { schema: { type: 'string' } as never, render: (_a, v) => [{ type: 'text', text: String(v) }] },
    async execute(args: unknown) {
      const a = args as { skill: Session['skill']; minutes: number; score?: number }
      const s: Session = { date: new Date().toISOString().slice(0, 10), skill: a.skill, minutes: a.minutes, score: a.score }
      HISTORY.push(s)
      return `Logged ${s.skill} ${s.minutes}min${s.score ? ` (band ${s.score})` : ''}. Total sessions: ${HISTORY.length}.`
    },
  }))

  ctx.tools.register(defineTool({
    name: 'ielts_progress',
    description: `Show IELTS progress vs the target band ${config.targetBand} (exam ${config.examDate}).`,
    parameters: {},
    output: { schema: { type: 'string' } as never, render: (_a, v) => [{ type: 'text', text: String(v) }] },
    async execute() {
      if (!HISTORY.length) return 'No sessions logged yet.'
      const bySkill: Record<string, { min: number; scores: number[] }> = {}
      for (const s of HISTORY) {
        bySkill[s.skill] ??= { min: 0, scores: [] }
        bySkill[s.skill].min += s.minutes
        if (s.score) bySkill[s.skill].scores.push(s.score)
      }
      const daysLeft = Math.max(0, Math.round((+new Date(config.examDate) - Date.now()) / 86_400_000))
      const lines = [`Exam in ${daysLeft} days. Target: ${config.targetBand}.`, '']
      for (const [k, v] of Object.entries(bySkill)) {
        const avg = v.scores.length ? (v.scores.reduce((a,b)=>a+b)/v.scores.length).toFixed(1) : '-'
        lines.push(`${k}: ${v.min} min practiced, latest avg band ${avg}`)
      }
      return lines.join('\n')
    },
  }))
}
