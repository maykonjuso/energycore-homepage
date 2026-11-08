import { useRef, useState } from 'react'
import { Plus } from 'lucide-react'
import { FAQ } from '../data/content.js'
import { revealIn, useMotion } from '../lib/motion.js'

export default function Faq() {
  const ref = useRef(null)
  const [open, setOpen] = useState(0)
  useMotion(ref, () => revealIn(ref.current))
  return (
    <section id="perguntas" ref={ref} className="page py-24 sm:py-32" aria-labelledby="faq-titulo">
      <div className="mx-auto max-w-[820px]">
        <div className="text-center" data-reveal>
          <span className="eyebrow">Perguntas frequentes</span>
          <h2 id="faq-titulo" className="h2 mt-4">
            O que costumam nos perguntar.
          </h2>
        </div>
        <div className="mt-12 divide-y divide-line rounded-2xl border border-line bg-surface/60" data-reveal>
          {FAQ.map((f, i) => (
            <div key={f.q}>
              <h3>
                <button
                  className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left text-[16px] font-semibold sm:px-7"
                  aria-expanded={open === i}
                  aria-controls={`faq-${i}`}
                  onClick={() => setOpen(open === i ? -1 : i)}
                >
                  {f.q}
                  <Plus size={18} className={`shrink-0 text-brand transition-transform duration-300 ${open === i ? 'rotate-45' : ''}`} />
                </button>
              </h3>
              <div id={`faq-${i}`} className={`grid transition-all duration-300 ${open === i ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                <p className="overflow-hidden px-5 text-[15px] leading-relaxed text-muted sm:px-7">
                  <span className="block pb-5">{f.a}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
