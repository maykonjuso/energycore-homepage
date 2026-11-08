// Segurança e governança: grade de cartões que entram em sequência, com a tela real da ficha de acesso.
import { useRef } from 'react'
import { SECURITY } from '../data/content.js'
import { revealIn, useMotion } from '../lib/motion.js'
import Shot from './Shot.jsx'

export default function Security() {
  const ref = useRef(null)
  useMotion(ref, () => revealIn(ref.current))
  return (
    <section id="seguranca" ref={ref} className="relative overflow-hidden py-24 sm:py-32" aria-labelledby="seg-titulo">
      <div className="glow pointer-events-none absolute -right-40 top-20 h-[500px] w-[600px] opacity-60" aria-hidden />
      <div className="page grid items-center gap-14 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <div data-reveal>
            <span className="eyebrow">Segurança e governança</span>
            <h2 id="seg-titulo" className="h2 mt-4">
              Feita para empresas que passam por auditoria.
            </h2>
            <p className="lead mt-4">Permissão conferida no servidor, integração com o Active Directory e registro de tudo. A segurança não depende de esconder botões.</p>
          </div>
          <ul className="mt-10 grid gap-5 sm:grid-cols-2">
            {SECURITY.map((s) => (
              <li key={s.title} className="flex gap-3" data-reveal>
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand">
                  <s.icon size={19} />
                </span>
                <span>
                  <span className="block font-semibold">{s.title}</span>
                  <span className="mt-1 block text-[14px] leading-relaxed text-muted">{s.text}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div data-reveal className="relative">
          <Shot name="ficha" alt="Ficha de acesso de uma pessoa: páginas liberadas, áreas do datacenter e regiões da rede que ela enxerga e ações permitidas" />
          <div className="card absolute -bottom-6 -left-4 hidden max-w-[260px] p-4 sm:block">
            <p className="text-[12px] font-semibold uppercase tracking-wider text-faint">Revisão de acessos</p>
            <p className="mt-1 text-[14px]">Alertas de risco, “quem tem acesso a X” e auditoria exportável em CSV.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
