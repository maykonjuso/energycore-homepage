// Plataforma: no computador a seção fica fixa e, conforme a rolagem, troca o módulo e a tela (scrub +
// pin). No celular vira uma lista de cartões. O assistente pode pedir um módulo (evento ec-demo).
import { useCallback, useRef, useState } from 'react'
import { Check } from 'lucide-react'
import { MODULES } from '../data/content.js'
import { reducedMotion, useMotion } from '../lib/motion.js'
import { useDemoEvent, useMediaQuery } from '../lib/site.js'
import Shot from './Shot.jsx'

export default function Platform() {
  const ref = useRef(null)
  const stRef = useRef(null)
  const [active, setActive] = useState(0)
  const wide = useMediaQuery('(min-width: 1024px)')
  useMotion(
    ref,
    (gsap, ST) => {
      if (!wide) return
      stRef.current = ST.create({
        trigger: ref.current,
        start: 'top top',
        end: `+=${MODULES.length * 70}%`,
        pin: '[data-pin]',
        scrub: true,
        onUpdate: (self) => setActive(Math.min(MODULES.length - 1, Math.floor(self.progress * MODULES.length))),
      })
    },
    [wide],
  )
  const goTo = useCallback((i) => {
    const st = stRef.current
    if (st && !reducedMotion()) window.scrollTo({ top: st.start + ((st.end - st.start) * (i + 0.5)) / MODULES.length, behavior: 'smooth' })
    setActive(i)
  }, [])
  useDemoEvent(
    useCallback(
      (id) => {
        const i = MODULES.findIndex((m) => m.id === id)
        if (i >= 0) setTimeout(() => goTo(i), 450)
      },
      [goTo],
    ),
  )
  const m = MODULES[active]
  return (
    <section id="plataforma" ref={ref} className="relative" aria-labelledby="plataforma-titulo">
      <div data-pin className="lg:flex lg:h-screen lg:items-center">
        <div className="page grid gap-10 py-20 lg:grid-cols-[400px_1fr] lg:gap-14 lg:py-0">
          <div>
            <span className="eyebrow">A plataforma</span>
            <h2 id="plataforma-titulo" className="h2 mt-4">
              Tudo o que a operação precisa, numa tela só.
            </h2>
            <ol className="mt-8 hidden space-y-1 lg:block" aria-label="Módulos">
              {MODULES.map((x, i) => (
                <li key={x.id}>
                  <button
                    aria-current={i === active ? 'true' : undefined}
                    onClick={() => goTo(i)}
                    className={`group flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition-all ${i === active ? 'bg-surface shadow-sm ring-1 ring-line' : 'opacity-60 hover:opacity-100'}`}
                  >
                    <span className={`mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg ${i === active ? 'bg-brandbtn text-white' : 'bg-elevated text-muted'}`}>
                      <x.icon size={16} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[15px] font-semibold">{x.title}</span>
                      {i === active && <span className="mt-1 block text-[14px] leading-relaxed text-muted">{x.text}</span>}
                    </span>
                  </button>
                </li>
              ))}
            </ol>
            <div className="mt-4 hidden h-1 overflow-hidden rounded-full bg-elevated lg:block" aria-hidden>
              <div className="h-full rounded-full bg-brand transition-all duration-500" style={{ width: `${((active + 1) / MODULES.length) * 100}%` }} />
            </div>
          </div>
          <div className="hidden lg:block" aria-live="polite">
            <div className="relative">
              {MODULES.map((x, i) => (
                <div key={x.id} className={`transition-all duration-700 ${i === active ? 'relative opacity-100' : 'pointer-events-none absolute inset-0 translate-y-4 scale-[0.98] opacity-0'}`} aria-hidden={i !== active}>
                  <Shot name={x.shot} alt={`Tela de ${x.title.toLowerCase()} da EnergyCore`} />
                </div>
              ))}
            </div>
            <ul className="mt-6 grid grid-cols-3 gap-3">
              {m.points.map((p) => (
                <li key={p} className="flex items-start gap-2 text-[14px] text-muted">
                  <Check size={16} className="mt-0.5 shrink-0 text-ok" /> {p}
                </li>
              ))}
            </ul>
          </div>
          {/* Celular e tablet: cartões empilhados */}
          <div className="space-y-6 lg:hidden">
            {MODULES.map((x) => (
              <article key={x.id} className="card overflow-hidden p-5" data-reveal>
                <div className="flex items-center gap-3">
                  <span className="grid size-9 place-items-center rounded-lg bg-brandbtn text-white">
                    <x.icon size={17} />
                  </span>
                  <h3 className="font-display text-[19px] font-bold">{x.title}</h3>
                </div>
                <p className="mt-3 text-[15px] leading-relaxed text-muted">{x.text}</p>
                <Shot name={x.shot} alt={`Tela de ${x.title.toLowerCase()} da EnergyCore`} className="mt-4" bar={false} />
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
