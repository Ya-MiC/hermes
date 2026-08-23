import type { Context } from '@deepseek-ai/cordis'

/**
 * dsh-turn-clock — DSH Web UI plugin
 * Shows elapsed time of the current turn next to the status label.
 * Demonstrates ctx.effect() lifecycle cleanup per the official plugin spec.
 */
export const name = 'dsh-turn-clock'
export const inject = ['ui']

export function apply(ctx: Context) {
  let el: HTMLElement | null = null
  let timer: ReturnType<typeof setInterval> | undefined

  const start = () => {
    const t0 = Date.now()
    el = document.createElement('span')
    el.id = 'dsh-turn-clock'
    el.style.cssText = 'margin-left:8px;font-size:12px;opacity:.6;font-variant-numeric:tabular-nums;'
    document.querySelector('.status-label')?.appendChild(el)
    timer = setInterval(() => {
      const s = Math.floor((Date.now() - t0) / 1000)
      if (el) el.textContent = `${Math.floor(s / 60)}m${(s % 60).toString().padStart(2, '0')}s`
    }, 1000)
  }
  const stop = () => {
    if (timer) clearInterval(timer)
    el?.remove()
    el = null
  }

  ctx.on('turn:start', start)
  ctx.on('turn:end', stop)

  // Explicit cleanup (runs on plugin unload) — per docs/user/develop/basic/index.md
  ctx.effect(() => () => stop())
}
