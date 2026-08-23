import type { Context } from '@deepseek-ai/cordis'

/**
 * dsh-yamic-repo-index — DSH Web UI plugin
 * Adds a sidebar command that opens Ya-MiC's curated GitHub index (the `hermes` repo).
 */
export const name = 'dsh-yamic-repo-index'

export const inject = ['commands']

export function apply(ctx: Context) {
  ctx.commands.register({
    name: 'yamic-index',
    description: "Open Ya-MiC's GitHub index (hermes repo)",
    action() {
      if (typeof window !== 'undefined') {
        window.open('https://github.com/Ya-MiC/hermes', '_blank')
      }
      return 'Opened https://github.com/Ya-MiC/hermes'
    },
  })
}
