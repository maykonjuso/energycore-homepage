// Como funciona: a linha que liga as etapas se desenha com a rolagem; os dados "andam" por ela.
import { useRef } from 'react'
import { PIPELINE } from '../data/content.js'
import { revealIn, useMotion } from '../lib/motion.js'

export default function HowItWorks() {
  const ref = useRef(null)
  useMotion(ref, (gsap) => {
    revealIn(ref.current)
    gsap.fromTo('[data-line]', { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top 70%', end: 'center 50%', scrub: true } })
  })
  return (
    <section ref={ref} className="page py-24 sm:py-32" aria-labelledby="como-titulo">
      <div className="max-w-[720px]" data-reveal>
        <span className="eyebrow">Como funciona</span>
        <h2 id="como-titulo" className="h2 mt-4">
          Do sensor à decisão, sem planilha no meio.
        </h2>
      </div>
      <div className="relative mt-14">
        <div className="absolute left-0 right-0 top-7 hidden h-0.5 bg-line lg:block" aria-hidden>
          <div data-line className="h-full origin-left bg-gradient-to-r from-brand via-accent to-brand" />
        </div>
        <ol className="grid gap-6 lg:grid-cols-4">
          {PIPELINE.map((p, i) => (
            <li key={p.title} className="relative" data-reveal>
              <span className="relative z-10 grid size-14 place-items-center rounded-2xl border border-line bg-surface text-brand shadow-sm">
                <p.icon size={24} />
              </span>
              <span className="mt-5 block font-mono text-[12px] text-faint">0{i + 1}</span>
              <h3 className="mt-1 font-display text-[20px] font-bold">{p.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted">{p.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
