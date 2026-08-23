import { describe, it, expect } from 'vitest'
import { logSession, progress, formatProgress, isValidSkill } from '../src/lib/study.js'
import { Tracker, NZ_LEVEL7 } from '../src/lib/identity.js'

describe('study tracker', () => {
  it('validates skills', () => {
    expect(isValidSkill('W')).toBe(true)
    expect(isValidSkill('X')).toBe(false)
  })

  it('rejects bad minutes and scores', () => {
    const h = []
    expect(() => logSession(h, { skill: 'L', minutes: 0 })).toThrow(/minutes/)
    expect(() => logSession(h, { skill: 'L', minutes: 5000 })).toThrow(/minutes/)
    expect(() => logSession(h, { skill: 'L', minutes: 30, score: 11 })).toThrow(/band score/)
  })

  it('accumulates progress and flags readiness', () => {
    const h = []
    logSession(h, { skill: 'W', minutes: 60, score: 6.5 })
    logSession(h, { skill: 'S', minutes: 45, score: 7.0 })
    const p = progress(h, 6.5, '2030-01-01')
    expect(p.totalSessions).toBe(2)
    expect(p.totalMinutes).toBe(105)
    expect(p.readyForExam).toBe(true)
    expect(formatProgress(p)).toContain('✅')
  })

  it('flags not-ready below target', () => {
    const h = []
    logSession(h, { skill: 'R', minutes: 30, score: 5.0 })
    expect(progress(h, 6.5, '2030-01-01').readyForExam).toBe(false)
  })
})

describe('identity tracker', () => {
  it('completes milestones by substring, case-insensitive', () => {
    const t = new Tracker()
    expect(t.complete('ielts')).toBe(NZ_LEVEL7.milestones[0])
    expect(t.format()).toContain('[x] IELTS 6.5 certificate')
    expect(t.format()).toContain('1/6 complete')
  })

  it('returns null for unknown milestone and supports reset', () => {
    const t = new Tracker()
    expect(t.complete('nonexistent')).toBeNull()
    t.complete('visa granted')
    expect(t.reset('visa')).toContain('Student visa granted')
    expect(t.format()).toContain('0/6 complete')
  })
})
