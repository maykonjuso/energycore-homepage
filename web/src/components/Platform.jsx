// § 02 · Módulos: lista numerada (abas verticais) e a tela do módulo escolhido ao lado.
// No celular, cada módulo aparece com a própria tela, um embaixo do outro.
import { useCallback, useRef, useState } from 'react'
import { SHOTS, useContent } from '../data/content.js'
import { useReveal } from '../lib/reveal.js'
import { useDemoEvent, useMediaQuery } from '../lib/site.js'
import { tabKeys } from '../lib/tabs.js'
import SecHead from './SecHead.jsx'
import Shot from './Shot.jsx'

function Points({ points }) {
  return (
    <ul className="mt-5 grid gap-2 sm:grid-cols-3">
      {points.map((p) => (
        <li key={p} className="flex gap-2 text-[0.875rem] text-ink-2">
          <span className="mt-[0.45rem] inline-block size-1.5 shrink-0 bg-signal" aria-hidden />
          {p}
        </li>
      ))}
    </ul>
  )
}

export default function Platform() {
  const t = useContent().platform
  const ref = useRef(null)
  useReveal(ref)
  const wide = useMediaQuery('(min-width: 64rem)')
  const [active, setActive] = useState(t.modules[0].id)
  useDemoEvent(useCallback((id) => t.modules.some((m) => m.id === id) && setActive(id), [t.modules]))
  const ids = t.modules.map((m) => m.id)
  const m = t.modules.find((x) => x.id === active) ?? t.modules[0]
  return (
    <section ref={ref} id="plataforma" aria-labelledby="plataforma-titulo" className="border-t-[1.5px] border-ink bg-paper-2 py-20 sm:py-28">
      <div className="sheet">
        <SecHead id="plataforma-titulo" no={t.no} coord={t.coord} title={t.title} lead={t.lead} />
        {wide ? (
          <div className="mt-14 grid grid-cols-[22rem_1fr] gap-12">
            <div role="tablist" aria-orientation="vertical" aria-labelledby="plataforma-titulo" className="border-t-[1.5px] border-ink" onKeyDown={(e) => tabKeys(e, ids, active, setActive, true)}>
              {t.modules.map((x, i) => {
                const on = x.id === active
                return (
                  <button
                    key={x.id}
                    id={`tab-${x.id}`}
                    role="tab"
                    aria-selected={on}
                    aria-controls="painel-modulo"
                    tabIndex={on ? 0 : -1}
                    onClick={() => setActive(x.id)}
                    className={`flex w-full items-baseline gap-4 border-b-[1.5px] border-ink px-1 py-4 text-left transition-colors ${on ? 'bg-ink text-paper' : 'hover:bg-ink/5'}`}
                  >
                    <span className={`num flex items-center gap-2 font-mono text-[0.8125rem] ${on ? 'text-paper' : 'text-ink-2'}`}>
                      {on && <span className="size-2 bg-signal" aria-hidden />}
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="text-[1.125rem] font-bold" style={{ fontStretch: '106%' }}>
                      {x.title}
                    </span>
                  </button>
                )
              })}
            </div>
            <div id="painel-modulo" role="tabpanel" aria-labelledby={`tab-${m.id}`} tabIndex={0}>
              <Shot key={m.id} name={SHOTS[m.id]} alt={t.shotAlt(m.title)} />
              <p className="mt-6 max-w-2xl text-[1.0625rem] leading-relaxed">{m.text}</p>
              <Points points={m.points} />
            </div>
          </div>
        ) : (
          <ol className="mt-12 space-y-14">
            {t.modules.map((x, i) => (
              <li key={x.id} data-reveal>
                <h3 className="flex items-baseline gap-3 border-t-[1.5px] border-ink pt-4 text-[1.375rem] font-bold" style={{ fontStretch: '106%' }}>
                  <span className="num font-mono text-[0.8125rem] text-signal-text">{String(i + 1).padStart(2, '0')}</span>
                  {x.title}
                </h3>
                <p className="mt-3 text-[1rem] leading-relaxed text-ink-2">{x.text}</p>
                <div className="mt-5">
                  <Shot name={SHOTS[x.id]} alt={t.shotAlt(x.title)} />
                </div>
                <Points points={x.points} />
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  )
}
