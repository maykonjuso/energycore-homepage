// Menu de acessibilidade (símbolo da ONU): tamanho do texto, alto contraste, animações e Libras (VLibras).
import { useEffect, useRef, useState } from 'react'
import { useContent } from '../data/content.js'
import { STEPS, openVlibras, resetA11y, step, useA11y } from '../lib/a11y.js'
import AccessibilityIcon from './AccessibilityIcon.jsx'

function Switch({ checked, onChange, label }) {
  return (
    <button type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)} className="flex min-h-11 w-full items-center justify-between gap-4 text-left text-[0.9375rem]">
      <span>{label}</span>
      <span className={`relative h-6 w-11 shrink-0 border-[1.5px] border-ink transition-colors ${checked ? 'bg-ink' : 'bg-transparent'}`} aria-hidden>
        <span className={`absolute top-[2px] size-4 transition-all ${checked ? 'left-[22px] bg-paper' : 'left-[2px] bg-ink'}`} />
      </span>
    </button>
  )
}

export default function A11yMenu() {
  const t = useContent().a11y
  const [a, set] = useA11y()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => e.key === 'Escape' && (setOpen(false), ref.current?.querySelector('button')?.focus())
    const onClick = (e) => !ref.current?.contains(e.target) && setOpen(false)
    window.addEventListener('keydown', onKey)
    window.addEventListener('pointerdown', onClick)
    return () => (window.removeEventListener('keydown', onKey), window.removeEventListener('pointerdown', onClick))
  }, [open])
  const i = STEPS.indexOf(a.text)
  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="painel-acessibilidade" aria-label={t.open} title={t.open} className="grid size-11 place-items-center text-ink hover:text-signal-text">
        <AccessibilityIcon size={24} />
      </button>
      {open && (
        <div id="painel-acessibilidade" role="dialog" aria-label={t.title} className="absolute right-0 top-full z-50 mt-2 w-[min(20rem,calc(100vw-2rem))] border-[1.5px] border-ink bg-panel p-4 shadow-[6px_6px_0_rgb(var(--ink))]">
          <p className="label mb-3">{t.title}</p>
          <div className="flex min-h-11 items-center justify-between gap-3">
            <span className="text-[0.9375rem]" id="a11y-text">
              {t.text}
            </span>
            <div className="flex items-center" role="group" aria-labelledby="a11y-text">
              <button type="button" onClick={() => step(-1)} disabled={i <= 0} aria-label={t.smaller} className="grid size-11 place-items-center border-[1.5px] border-ink font-semibold disabled:opacity-40">
                A−
              </button>
              <output className="num w-16 text-center font-mono text-[0.875rem]" aria-live="polite">
                {String(a.text).replace('.', ',')}%
              </output>
              <button type="button" onClick={() => step(1)} disabled={i >= STEPS.length - 1} aria-label={t.larger} className="grid size-11 place-items-center border-[1.5px] border-ink text-[1.125rem] font-semibold disabled:opacity-40">
                A+
              </button>
            </div>
          </div>
          <div className="mt-1 divide-y divide-ink/15 border-t border-ink/15">
            <Switch checked={a.contrast} onChange={(v) => set({ contrast: v })} label={t.contrast} />
            <Switch checked={a.motion !== false} onChange={(v) => set({ motion: v })} label={t.motion} />
            <div className="flex min-h-11 items-center justify-between gap-3 text-[0.9375rem]">
              <span>{t.libras}</span>
              <button type="button" onClick={openVlibras} className="btn-line min-h-10 px-3 text-[0.8125rem]">
                {t.librasOpen}
              </button>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between gap-3 border-t border-ink/15 pt-3">
            <button type="button" onClick={resetA11y} className="min-h-11 text-[0.8125rem] font-medium underline underline-offset-4">
              {t.reset}
            </button>
            <span className="text-right text-[0.75rem] text-ink-2">{t.keys}</span>
          </div>
        </div>
      )}
    </div>
  )
}
