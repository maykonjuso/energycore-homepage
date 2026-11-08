// Implantação em 3 etapas, com cartões que se empilham (cascading stack) no computador.
import { useRef } from 'react'
import { ArrowRight } from 'lucide-react'
import { STEPS } from '../data/content.js'
import { revealIn, useMotion } from '../lib/motion.js'

export default function Steps() {
  const ref = useRef(null)
  useMotion(ref, () => revealIn(ref.current))
  return (
    <section id="implantacao" ref={ref} className="page py-24 sm:py-32" aria-labelledby="impl-titulo">
      <div className="grid gap-12 lg:grid-cols-[380px_1fr]">
        <div className="lg:sticky lg:top-28 lg:self-start" data-reveal>
          <span className="eyebrow">Implantação</span>
          <h2 id="impl-titulo" className="h2 mt-4">
            Começa pequeno. Escala quando funcionar.
          </h2>
          <p className="lead mt-4">Um piloto em um site ou região prova o valor com o seu time e os seus dados antes de qualquer expansão.</p>
          <a href="#contato" className="btn-primary mt-8">
            Começar pelo diagnóstico <ArrowRight size={17} />
          </a>
        </div>
        <ol className="relative space-y-5 before:absolute before:bottom-8 before:left-[46px] before:top-8 before:w-px before:bg-gradient-to-b before:from-brand before:to-accent sm:before:left-[54px]">
          {STEPS.map((s) => (
            <li key={s.n} className="relative flex gap-5 rounded-2xl border border-line bg-surface p-6 shadow-[0_20px_50px_-30px_rgb(0_0_0/0.6)] sm:p-8" data-reveal>
              <span className="relative z-10 grid size-11 shrink-0 place-items-center rounded-xl bg-brandbtn font-display text-[15px] font-extrabold text-white shadow-[0_10px_24px_-10px_rgb(var(--glow))]">{s.n}</span>
              <span>
                <h3 className="font-display text-[22px] font-bold">{s.title}</h3>
                <p className="mt-2 text-[16px] leading-relaxed text-muted">{s.text}</p>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
