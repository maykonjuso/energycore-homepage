// Demo de causa raiz: a propagação toca em sequência ao abrir a aba (ou quando o assistente pede).
import { useCallback, useEffect, useRef, useState } from 'react'
import { Play } from 'lucide-react'
import { useContent } from '../data/content.js'
import { motionOff } from '../lib/a11y.js'
import { useDemoEvent } from '../lib/site.js'

const KIND = { root: 'bg-signal', hop: 'bg-warn', end: 'bg-ink' }

export default function DemoRCA() {
  const t = useContent().rca
  const [step, setStep] = useState(-1)
  const timers = useRef([])
  const play = useCallback(() => {
    timers.current.forEach(clearTimeout)
    if (motionOff()) return setStep(t.steps.length - 1)
    setStep(-1)
    timers.current = t.steps.map((_, i) => setTimeout(() => setStep(i), 400 + i * 1000))
  }, [t.steps])
  useEffect(() => {
    play()
    return () => timers.current.forEach(clearTimeout)
  }, [play])
  useDemoEvent(useCallback((id) => id === 'causa-raiz' && setTimeout(play, 500), [play]))
  const done = step >= t.steps.length - 1
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <div>
        <div className="flex items-center justify-between gap-3">
          <p className="label">{t.title}</p>
          <button type="button" className="btn-line min-h-11 px-3 text-[0.8125rem]" onClick={play}>
            <Play size={14} aria-hidden /> {t.replay}
          </button>
        </div>
        <ol className="mt-6 border-t-[1.5px] border-ink">
          {t.steps.map((s, i) => (
            <li key={s.t} className={`grid grid-cols-[4.5rem_1rem_1fr] items-start gap-3 border-b border-ink/20 py-4 transition-all duration-500 ${i <= step ? 'opacity-100' : 'opacity-0'}`}>
              <span className="num font-mono text-[0.875rem] font-semibold">{s.t}</span>
              <span className={`mt-1.5 size-3 ${KIND[s.kind]}`} aria-hidden />
              <span>
                <span className="block font-semibold">{s.node}</span>
                <span className="mt-0.5 block text-[0.9375rem] text-ink-2">{s.text}</span>
              </span>
            </li>
          ))}
        </ol>
        <p className="mt-4 text-[0.8125rem] text-ink-2">{t.note}</p>
      </div>
      <div className={`border-[1.5px] border-ink p-5 transition-opacity duration-700 ${done ? 'opacity-100' : 'opacity-40'}`}>
        <p className="label">{t.evidence}</p>
        <ul className="mt-4 border-t border-ink/20">
          {t.layers.map(([name, grain, what]) => (
            <li key={name} className="flex items-center gap-3 border-b border-ink/20 py-3">
              <span className="grid size-10 shrink-0 place-items-center border-[1.5px] border-ink font-mono text-[0.875rem] font-semibold">{name[0]}</span>
              <span>
                <span className="block text-[0.9375rem] font-semibold">
                  {name} <span className="font-normal text-ink-2">· {grain}</span>
                </span>
                <span className="block text-[0.8125rem] text-ink-2">{what}</span>
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-[0.875rem]">
          <span className="font-semibold">{t.confidence}</span> <span className="text-ink-2">{t.confidenceNote}</span>
        </p>
      </div>
    </div>
  )
}
