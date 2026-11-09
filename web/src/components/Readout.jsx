// Faixa de leituras, como o letreiro de um painel de operação. Pausa ao passar o mouse, ao focar ou no botão.
import { useState } from 'react'
import { Pause, Play } from 'lucide-react'
import { useContent } from '../data/content.js'
import { motionOff } from '../lib/a11y.js'

export default function Readout() {
  const t = useContent().readout
  const [paused, setPaused] = useState(() => motionOff())
  const row = (hidden) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {t.items.map(([k, v]) => (
        <li key={k} className="flex items-baseline gap-3 whitespace-nowrap px-7">
          <span className="font-mono text-[0.75rem] uppercase tracking-[0.12em] text-paper/75">{k}</span>
          <span className="font-mono text-[1rem] font-semibold text-paper">{v}</span>
          <span className="ml-7 size-1.5 bg-signal" aria-hidden />
        </li>
      ))}
    </ul>
  )
  return (
    <section className="readout bg-ink" aria-label={t.label} data-paused={paused}>
      <div className="flex items-stretch">
        <div className="flex shrink-0 items-center gap-2 border-r border-paper/25 px-4">
          <span className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-paper/75">{t.label}</span>
          <button type="button" onClick={() => setPaused((p) => !p)} aria-label={paused ? t.play : t.pause} aria-pressed={paused} className="grid size-11 place-items-center text-paper hover:text-signal">
            {paused ? <Play size={15} aria-hidden /> : <Pause size={15} aria-hidden />}
          </button>
        </div>
        <div className="overflow-hidden py-4">
          <div className="readout-track flex w-max">
            {row(false)}
            {row(true)}
          </div>
        </div>
      </div>
    </section>
  )
}
