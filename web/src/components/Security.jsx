// § 05 · Segurança como folha de especificação: item e descrição em linhas com régua.
import { useRef } from 'react'
import { useContent } from '../data/content.js'
import { useReveal } from '../lib/reveal.js'
import SecHead from './SecHead.jsx'

export default function Security() {
  const t = useContent().security
  const ref = useRef(null)
  useReveal(ref)
  return (
    <section ref={ref} id="seguranca" aria-labelledby="seguranca-titulo" className="border-t-[1.5px] border-ink py-20 sm:py-28">
      <div className="sheet">
        <SecHead id="seguranca-titulo" no={t.no} coord={t.coord} title={t.title} lead={t.lead} />
        <dl className="mt-12 border-t-[1.5px] border-ink">
          {t.rows.map(([k, v], i) => (
            <div key={k} className="grid gap-2 border-b border-ink/25 py-5 md:grid-cols-[3rem_18rem_1fr] md:gap-6" data-reveal={i * 60}>
              <span className="num font-mono text-[0.8125rem] text-ink-2" aria-hidden>
                {String(i + 1).padStart(2, '0')}
              </span>
              <dt className="text-[1.125rem] font-bold" style={{ fontStretch: '106%' }}>
                {k}
              </dt>
              <dd className="text-[1rem] leading-relaxed text-ink-2">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
