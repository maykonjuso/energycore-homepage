// Números do próprio produto (não de mercado), com contador.
import { useRef } from 'react'
import { FACTS } from '../data/content.js'
import { countUp, useMotion } from '../lib/motion.js'

export default function Facts() {
  const ref = useRef(null)
  useMotion(ref, () => ref.current.querySelectorAll('[data-count]').forEach((el) => countUp(el, Number(el.dataset.count))))
  return (
    <section ref={ref} className="border-y border-line bg-surface/40" aria-label="A plataforma em números">
      <dl className="page grid grid-cols-2 gap-8 py-14 lg:grid-cols-4">
        {FACTS.map((f) => (
          <div key={f.label}>
            <dd className="num font-display text-[40px] font-extrabold leading-none tracking-tight text-text sm:text-[48px]">
              <span data-count={f.value}>{f.value}</span>
              <span className="text-brand">{f.suffix}</span>
            </dd>
            <dt className="mt-2 text-[14px] text-muted">{f.label}</dt>
          </div>
        ))}
      </dl>
    </section>
  )
}
