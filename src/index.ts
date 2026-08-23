/** Public API: all plugins + pure libs. */
export { name as quantBacktestName, apply as quantBacktest, Config as QuantBacktestConfig } from './plugins/quant-backtest.js'
export { name as auditDraftName, apply as auditDraft, Config as AuditDraftConfig } from './plugins/audit-draft.js'
export { name as ieltsCoachName, apply as ieltsCoach, Config as IeltsCoachConfig } from './plugins/ielts-coach.js'
export { name as identityChecklistName, apply as identityChecklist, Config as IdentityChecklistConfig } from './plugins/identity-checklist.js'

export * from './lib/backtest.js'
export * from './lib/report.js'
export * from './lib/study.js'
export * from './lib/identity.js'
