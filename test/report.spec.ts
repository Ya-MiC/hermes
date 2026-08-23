import { describe, it, expect } from 'vitest'
import { renderReport } from '../src/lib/report.js'

const findings = [
  { area: 'payroll', risk: 'low' as const, observation: 'minor delay', recommendation: 'automate' },
  { area: 'procurement', risk: 'high' as const, observation: 'single sourcing', recommendation: 'tender' },
  { area: 'inventory', risk: 'medium' as const, observation: 'count gaps', recommendation: 'cycle counts' },
]

describe('renderReport', () => {
  it('sorts findings high -> low', () => {
    const md = renderReport({ entity: 'X', scope: 'ops', period: 'FY2026', findings })
    expect(md.indexOf('procurement')).toBeLessThan(md.indexOf('inventory'))
    expect(md.indexOf('inventory')).toBeLessThan(md.indexOf('payroll'))
  })

  it('counts high risks in the header', () => {
    const md = renderReport({ entity: 'X', scope: 'ops', period: 'FY2026', findings }, { locale: 'en' })
    expect(md).toContain('- Findings: 3 (1 high)')
  })

  it('localizes to Chinese and appends watermark', () => {
    const md = renderReport(
      { entity: '甲公司', scope: '运营', period: '2026财年', findings },
      { locale: 'zh', watermark: '人工复核' },
    )
    expect(md).toContain('# 审阅报告（草稿）')
    expect(md).toContain('[高] procurement'.replace('procurement', ''))
    expect(md.trim().endsWith('*人工复核*')).toBe(true)
  })

  it('handles empty findings with placeholder', () => {
    const md = renderReport({ entity: 'X', scope: 's', period: 'p', findings: [] }, { locale: 'en' })
    expect(md).toContain('No findings recorded')
  })

  it('rejects blank required fields', () => {
    expect(() => renderReport({ entity: '', scope: 's', period: 'p', findings })).toThrow(/entity/)
    expect(() => renderReport({ entity: 'x', scope: ' ', period: 'p', findings })).toThrow(/scope/)
  })

  it('deterministic: same input, same output', () => {
    const a = renderReport({ entity: 'X', scope: 's', period: 'p', findings }, { locale: 'en' })
    const b = renderReport({ entity: 'X', scope: 's', period: 'p', findings }, { locale: 'en' })
    expect(a).toBe(b)
  })
})
