// § 04 · Do sensor à decisão: quatro estações ligadas por uma linha, como um esquema de processo.
import { useRef } from 'react'
import { useContent } from '../data/content.js'
import { useReveal } from '../lib/reveal.js'
import SecHead from './SecHead.jsx'

export default function Pipeline() {
  const t = useContent().pipeline
  const ref = useRef(null)
  useReveal(ref)
  return (
    <section ref={ref} aria-labelledby="pipeline-titulo" className="border-t-[1.5px] border-ink bg-paper-2 py-20 sm:py-28">
      <div className="sheet">
        <SecHead id="pipeline-titulo" no={t.no} coord={t.coord} title={t.title} />
        <ol className="relative mt-14 grid gap-10 md:grid-cols-4 md:gap-6">
          <span className="absolute left-[0.6rem] top-0 h-full w-[1.5px] bg-ink md:left-0 md:top-[0.6rem] md:h-[1.5px] md:w-full" aria-hidden />
          {t.stations.map(([title, text], i) => (
            <li key={title} className="relative pl-10 md:pl-0 md:pt-10" data-reveal={i * 90}>
              <span className="absolute left-0 top-0 grid size-[1.2rem] place-items-center border-[1.5px] border-ink bg-paper" aria-hidden>
                <span className={`size-2 ${i === t.stations.length - 1 ? 'bg-signal' : 'bg-ink'}`} />
              </span>
              <span className="num font-mono text-[0.75rem] text-ink-2">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="mt-1 text-[1.375rem] font-bold" style={{ fontStretch: '108%' }}>
                {title}
              </h3>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-2">{text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
