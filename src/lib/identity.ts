/**
 * Milestone tracker for the identity/migration route — pure logic, unit-testable.
 */

export interface Route {
  name: string
  deadlineYear: number
  milestones: readonly string[]
}

export const NZ_LEVEL7: Route = {
  name: 'NZ Level7 -> work visa -> residence',
  deadlineYear: 2031,
  milestones: [
    'IELTS 6.5 certificate',
    'Funds proof 300-400k CNY',
    'Level7 school application',
    'Student visa granted',
    'Post-study work visa',
    'Residence (SMV)',
  ],
}

export class Tracker {
  private done = new Set<string>()

  constructor(private route: Route = NZ_LEVEL7) {}

  /** Mark a milestone complete by case-insensitive substring match. Returns the matched milestone. */
  complete(substr: string): string | null {
    const hit = this.route.milestones.find(m => m.toLowerCase().includes(substr.toLowerCase()))
    if (hit) this.done.add(hit)
    return hit ?? null
  }

  reset(substr: string): string | null {
    const hit = this.route.milestones.find(m => m.toLowerCase().includes(substr.toLowerCase()))
    if (hit) this.done.delete(hit)
    return hit ?? null
  }

  isComplete(): boolean {
    return this.done.size >= this.route.milestones.length
  }

  format(): string {
    const lines = [`Route: ${this.route.name} | Deadline: ${this.route.deadlineYear}`, '']
    for (const m of this.route.milestones) lines.push(`[${this.done.has(m) ? 'x' : ' '}] ${m}`)
    lines.push('', `${this.done.size}/${this.route.milestones.length} complete`)
    return lines.join('\n')
  }
}
