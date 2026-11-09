// Topo: título à esquerda (marca-texto laranja na frase final), diagrama unifilar animado à direita
// e o carimbo da prancha (projeto, escopo, leitura, folha).
import { ArrowDown, ArrowRight } from 'lucide-react'
import { useContent } from '../data/content.js'
import SingleLine from './SingleLine.jsx'

export default function Hero() {
  const t = useContent().hero
  return (
    <section id="topo" aria-labelledby="titulo" className="relative pb-16 pt-8 sm:pt-12 lg:pb-24">
      <div className="sheet">
        <div className="ticks mb-8" aria-hidden />
        <div className="grid items-start gap-12 lg:grid-cols-[1.3fr_1fr] lg:gap-12">
          <div>
            <p className="label flex items-center gap-3">
              <span className="inline-block size-2.5 bg-signal" aria-hidden /> {t.kicker}
            </p>
            <h1 id="titulo" className="display mt-6 text-[2.375rem] sm:text-[3.5rem] lg:text-[3.6rem] xl:text-[4.25rem]">
              {t.title.map((line, i) => (
                <span key={i} className="block">
                  {i === t.marked ? <span className="marker">{line}</span> : line}
                </span>
              ))}
            </h1>
            <p className="lead mt-8 max-w-[34rem]">{t.lead}</p>
            <div className="mt-10 flex flex-wrap gap-3">
              <a href="#contato" className="btn-ink">
                {t.primary} <ArrowRight size={18} aria-hidden />
              </a>
              <a href="#bancada" className="btn-line">
                {t.secondary} <ArrowDown size={18} aria-hidden />
              </a>
            </div>
            <dl className="mt-12 grid max-w-[34rem] grid-cols-2 border-[1.5px] border-ink sm:grid-cols-4">
              {t.block.map(([k, v], i) => (
                <div key={k} className={`px-3 py-2.5 ${i % 2 ? '' : 'border-r-[1.5px] border-ink'} ${i < 2 ? 'border-b-[1.5px] border-ink sm:border-b-0' : ''} sm:border-r-[1.5px] sm:last:border-r-0`}>
                  <dt className="label !text-[0.6875rem]">{k}</dt>
                  <dd className="mt-0.5 font-mono text-[0.8125rem] font-semibold">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <SingleLine />
        </div>
      </div>
    </section>
  )
}
