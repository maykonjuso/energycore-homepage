// § 07 · Perguntas frequentes (details/summary nativos: teclado e leitor de tela sem esforço).
import { useRef } from 'react'
import { Plus } from 'lucide-react'
import { useContent } from '../data/content.js'
import { useReveal } from '../lib/reveal.js'
import SecHead from './SecHead.jsx'

export default function Faq() {
  const t = useContent().faq
  const ref = useRef(null)
  useReveal(ref)
  const schema = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: t.items.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) }
  return (
    <section ref={ref} id="perguntas" aria-labelledby="perguntas-titulo" className="border-t-[1.5px] border-ink py-20 sm:py-28">
      <div className="faq-grid sheet grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        <SecHead id="perguntas-titulo" no={t.no} coord={t.coord} title={t.title} />
        <div className="border-t-[1.5px] border-ink lg:mt-0">
          {t.items.map(([q, a]) => (
            <details key={q} className="group border-b border-ink/25" data-reveal>
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-6 py-4 text-[1.0625rem] font-semibold [&::-webkit-details-marker]:hidden">
                {q}
                <Plus size={20} className="shrink-0 transition-transform group-open:rotate-45" aria-hidden />
              </summary>
              <p className="max-w-[60ch] pb-5 text-[1rem] leading-relaxed text-ink-2">{a}</p>
            </details>
          ))}
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </section>
  )
}
