// § 06 · Implantação em três etapas.
import { useRef } from 'react'
import { useContent } from '../data/content.js'
import { useReveal } from '../lib/reveal.js'
import SecHead from './SecHead.jsx'

export default function Steps() {
  const t = useContent().steps
  const ref = useRef(null)
  useReveal(ref)
  return (
    <section ref={ref} id="implantacao" aria-labelledby="implantacao-titulo" className="border-t-[1.5px] border-ink bg-ink py-20 text-paper sm:py-28">
      <div className="sheet">
        <header className="grid gap-4 border-t-[1.5px] border-paper pt-5 md:grid-cols-[9rem_1fr_auto] md:gap-8" data-reveal>
          <span className="flex items-center gap-2 pt-1.5 font-mono text-[0.75rem] font-medium uppercase tracking-[0.12em] text-paper/85">
            <span className="size-2 bg-signal" aria-hidden />
            {t.no}
          </span>
          <h2 id="implantacao-titulo" className="h2 max-w-3xl">
            {t.title}
          </h2>
          <span className="hidden pt-1.5 font-mono text-[0.75rem] uppercase tracking-[0.12em] text-paper/75 md:block" aria-hidden>
            {t.coord}
          </span>
        </header>
        <ol className="mt-14 grid gap-px bg-paper/30 md:grid-cols-3">
          {t.items.map(([title, text], i) => (
            <li key={title} className="bg-ink p-6 sm:p-8 md:first:pl-0" data-reveal={i * 100}>
              <span className="block text-[4.5rem] font-extrabold leading-none text-signal" style={{ fontStretch: '125%' }} aria-hidden>
                {i + 1}
              </span>
              <h3 className="mt-6 text-[1.5rem] font-bold" style={{ fontStretch: '108%' }}>
                {title}
              </h3>
              <p className="mt-2 text-[1rem] leading-relaxed text-paper/85">{text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
