/**
 * Pure study-tracker logic — no DSH dependencies, fully unit-testable.
 */

export type Skill = 'L' | 'R' | 'W' | 'S'

export interface Session {
  date: string // ISO yyyy-mm-dd
  skill: Skill
  minutes: number
  score?: number
}

export interface ProgressReport {
  totalSessions: number
  totalMinutes: number
  daysUntilExam: number
  perSkill: Array<{ skill: Skill; minutes: number; sessions: number; avgBand: number | null }>
  targetBand: number
  readyForExam: boolean
}

export function isValidSkill(s: string): s is Skill {
  return s === 'L' || s === 'R' || s === 'W' || s === 'S'
}

export function logSession(
  history: Session[],
  input: { skill: Skill; minutes: number; score?: number; date?: string },
): Session {
  if (!(input.minutes > 0) || input.minutes > 24 * 60) {
    throw new Error(`minutes must be in (0, 1440], got ${input.minutes}`)
  }
  if (input.score !== undefined && !(input.score >= 0 && input.score <= 9)) {
    throw new Error(`band score must be within [0, 9], got ${input.score}`)
  }
  const s: Session = {
    date: input.date ?? new Date().toISOString().slice(0, 10),
    skill: input.skill,
    minutes: input.minutes,
    ...(input.score !== undefined ? { score: input.score } : {}),
  }
  history.push(s)
  return s
}

export function progress(history: readonly Session[], targetBand: number, examDate: string): ProgressReport {
  const bySkill = new Map<Skill, { minutes: number; sessions: number; scores: number[] }>()
  for (const s of history) {
    const b = bySkill.get(s.skill) ?? { minutes: 0, sessions: 0, scores: [] }
    b.minutes += s.minutes
    b.sessions += 1
    if (s.score !== undefined) b.scores.push(s.score)
    bySkill.set(s.skill, b)
  }
  const days = Math.max(0, Math.round((Date.parse(examDate + 'T00:00:00Z') - Date.now()) / 86_400_000))
  const scored = [...bySkill.values()].filter(b => b.scores.length)
  const avgAll =
    scored.length
      ? scored.reduce((a, b) => a + b.scores.reduce((x, y) => x + y, 0) / b.scores.length, 0) / scored.length
      : null
  return {
    totalSessions: history.length,
    totalMinutes: history.reduce((a, b) => a + b.minutes, 0),
    daysUntilExam: days,
    perSkill: [...bySkill.entries()].map(([skill, b]) => ({
      skill,
      minutes: b.minutes,
      sessions: b.sessions,
      avgBand: b.scores.length ? round1(b.scores.reduce((a, c) => a + c, 0) / b.scores.length) : null,
    })),
    targetBand,
    readyForExam: avgAll !== null && avgAll >= targetBand,
  }
}

const round1 = (x: number) => Math.round(x * 10) / 10

/** Render the progress report as plain text for the model/user. */
export function formatProgress(r: ProgressReport): string {
  if (!r.totalSessions) return 'No sessions logged yet.'
  const lines = [
    `Sessions: ${r.totalSessions} (${r.totalMinutes} min) | Exam in ${r.daysUntilExam} days | Target band: ${r.targetBand}`,
    '',
  ]
  for (const p of r.perSkill) {
    lines.push(`${p.skill}: ${p.sessions} sessions, ${p.minutes} min, avg band ${p.avgBand ?? '-'}`)
  }
  lines.push('', r.readyForExam ? `✅ Averages meet the ${r.targetBand} target.` : `⚠️ Keep training — averages below ${r.targetBand} yet.`)
  return lines.join('\n')
}
