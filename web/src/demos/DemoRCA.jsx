// Demo de causa raiz: a propagação toca em sequência quando a seção aparece (ou quando o assistente pede).
import { useCallback, useEffect, useRef, useState } from 'react'
import { Database, Play, Search } from 'lucide-react'
import { RCA_STEPS } from '../data/content.js'
import { reducedMotion } from '../lib/motion.js'
import { useDemoEvent } from '../lib/site.js'

const LAYERS = [
  ['Bronze', 'bruto · 5 min', 'eventos de telemetria'],
  ['Silver', 'hora a hora', 'métricas por interface'],
  ['Gold', 'estado atual', 'saúde do nó'],
]

export default function DemoRCA() {
  const ref = useRef(null)
  const [step, setStep] = useState(-1)
  const timers = useRef([])
  const play = useCallback(() => {
    timers.current.forEach(clearTimeout)
    if (reducedMotion()) return setStep(RCA_STEPS.length - 1)
    setStep(-1)
    timers.current = RCA_STEPS.map((_, i) => setTimeout(() => setStep(i), 500 + i * 1100))
  }, [])
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (play(), io.disconnect()), { threshold: 0.4 })
    io.observe(ref.current)
    return () => (io.disconnect(), timers.current.forEach(clearTimeout))
  }, [play])
  useDemoEvent(useCallback((id) => id === 'causa-raiz' && setTimeout(play, 600), [play]))
  const done = step >= RCA_STEPS.length - 1
  return (
    <div ref={ref} className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <div className="card p-5 sm:p-7">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[13px] font-semibold uppercase tracking-wider text-faint">
            <Search size={15} className="text-brand" /> Como o problema se propagou
          </div>
          <button className="btn-ghost h-9 px-3 text-[13px]" onClick={play}>
            <Play size={14} /> Repetir
          </button>
        </div>
        <ol className="relative mt-6 space-y-5 pl-8">
          <span className="absolute left-[11px] top-2 w-0.5 rounded bg-line" style={{ height: 'calc(100% - 16px)' }} aria-hidden />
          <span
            className="absolute left-[11px] top-2 w-0.5 rounded bg-gradient-to-b from-crit via-warn to-brand transition-all duration-1000"
            style={{ height: step < 0 ? 0 : `calc(${((step + 0.4) / RCA_STEPS.length) * 100}% - 8px)` }}
            aria-hidden
          />
          {RCA_STEPS.map((s, i) => (
            <li key={s.t} className={`relative transition-all duration-500 ${i <= step ? 'translate-x-0 opacity-100' : 'translate-x-3 opacity-0'}`}>
              <span
                className={`absolute -left-8 top-1 grid size-6 place-items-center rounded-full border-2 ${s.kind === 'root' ? 'border-crit bg-crit/15' : s.kind === 'end' ? 'border-brand bg-brand/15' : 'border-warn bg-warn/15'}`}
                aria-hidden
              >
                <span className={`size-2 rounded-full ${s.kind === 'root' ? 'bg-crit' : s.kind === 'end' ? 'bg-brand' : 'bg-warn'}`} />
              </span>
              <div className="flex flex-wrap items-baseline gap-x-3">
                <span className="num font-mono text-[13px] text-faint">{s.t}</span>
                <span className="font-semibold">{s.node}</span>
              </div>
              <p className="mt-0.5 text-[15px] text-muted">{s.text}</p>
            </li>
          ))}
        </ol>
        <p className="mt-6 text-[12px] text-faint">Exemplo com a rede simulada da demonstração.</p>
      </div>
      <div className={`card p-5 transition-all duration-700 ${done ? 'opacity-100' : 'opacity-50'}`}>
        <div className="flex items-center gap-2 text-[13px] font-semibold uppercase tracking-wider text-faint">
          <Database size={15} className="text-accent" /> Evidência por camada
        </div>
        <ul className="mt-5 space-y-3">
          {LAYERS.map(([name, grain, what], i) => (
            <li key={name} className={`flex items-center gap-3 rounded-xl border border-line p-3 transition-all duration-500 ${done ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`} style={{ transitionDelay: `${i * 150}ms` }}>
              <span className={`grid size-10 shrink-0 place-items-center rounded-lg font-display text-[13px] font-bold ${['bg-[#b45309]/15 text-[#d97706]', 'bg-faint/15 text-muted', 'bg-warn/15 text-warn'][i]}`}>{name[0]}</span>
              <span>
                <span className="block text-[14px] font-semibold">
                  {name} <span className="font-normal text-faint">· {grain}</span>
                </span>
                <span className="block text-[13px] text-muted">{what}</span>
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-5 rounded-xl bg-brand/10 p-3 text-[14px]">
          <span className="font-semibold text-brand-strong">Confiança alta.</span> <span className="text-muted">Cada salto tem horário, atraso e a leitura que comprova.</span>
        </div>
      </div>
    </div>
  )
}
