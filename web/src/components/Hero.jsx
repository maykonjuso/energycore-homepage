// Topo: rede animada ao fundo (depth 0), brilho (1), tela real do produto flutuando (3) com indicadores
// orbitando (2) e o título entrando palavra por palavra (4). Ao rolar, as camadas se separam (parallax).
import { useRef } from 'react'
import { ArrowRight, PlayCircle } from 'lucide-react'
import { HERO } from '../data/content.js'
import { parallax, useMotion } from '../lib/motion.js'
import NetworkField from './NetworkField.jsx'
import Shot from './Shot.jsx'

const TONE = { ok: 'text-ok', brand: 'text-brand-strong', crit: 'text-crit' }
const CHIP_POS = ['-left-6 top-[18%]', '-right-8 top-[10%]', '-right-10 bottom-[26%]', '-left-10 bottom-[12%]']

export default function Hero() {
  const ref = useRef(null)
  useMotion(ref, (gsap) => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    tl.fromTo('[data-hero="eyebrow"]', { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 })
      .fromTo('[data-hero="word"]', { yPercent: 110, opacity: 0, rotate: 2 }, { yPercent: 0, opacity: 1, rotate: 0, duration: 0.9, stagger: 0.045 }, '-=0.3')
      .fromTo('[data-hero="lead"]', { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, '-=0.5')
      // fromTo (fim explícito): os botões têm transição CSS e o .from() poderia gravar o meio da transição como fim.
      .fromTo('[data-hero="cta"] > *', { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, clearProps: 'transform,opacity' }, '-=0.4')
      .fromTo('[data-hero="shot"]', { y: 80, opacity: 0, scale: 0.94 }, { y: 0, opacity: 1, scale: 1, duration: 1.3, ease: 'elastic.out(1, 0.75)' }, '-=0.6')
      .fromTo('[data-hero="chip"]', { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, stagger: 0.12, ease: 'back.out(2)', clearProps: 'transform' }, '-=0.8')
    parallax(ref.current, ref.current)
    // Ao sair, os indicadores se espalham para fora (orbitavam a tela).
    // Saída no elemento de fora, com início explícito: voltar a rolagem devolve os indicadores.
    gsap.utils.toArray('[data-hero="chip-out"]').forEach((el, i) =>
      gsap.fromTo(
        el,
        { x: 0, y: 0, opacity: 1 },
        { x: (i % 2 ? 1 : -1) * 120, y: -60, opacity: 0, ease: 'none', immediateRender: false, scrollTrigger: { trigger: ref.current, start: 'center center', end: 'bottom top', scrub: true } },
      ),
    )
  })
  return (
    <section id="topo" ref={ref} className="relative overflow-hidden pb-24 pt-[104px] sm:pt-[150px]">
      <div className="absolute inset-0" data-depth="0" aria-hidden>
        <div className="grid-bg absolute inset-0 opacity-60" />
        <NetworkField className="absolute inset-0 opacity-70 [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_60%,transparent)]" />
      </div>
      <div className="glow pointer-events-none absolute left-1/2 top-[38%] h-[520px] w-[900px] -translate-x-1/2" data-depth="1" aria-hidden />
      <div className="page relative" data-depth="4">
        <div className="mx-auto max-w-[860px] text-center">
          <span className="eyebrow" data-hero="eyebrow">
            <span className="size-1.5 animate-pulse rounded-full bg-ok" /> {HERO.eyebrow}
          </span>
          <h1 className="mt-5 font-display text-[34px] font-extrabold leading-[1.06] tracking-tight sm:mt-6 sm:text-[64px] lg:text-[72px]">
            {HERO.title.map((line, i) => (
              <span key={i} className="block overflow-hidden pb-1">
                {line.split(' ').map((w, j) => (
                  <span key={j} data-hero="word" className={`inline-block pr-[0.22em] ${i === 2 ? 'bg-gradient-to-r from-brand to-accent bg-clip-text text-transparent' : ''}`}>
                    {w}
                  </span>
                ))}
              </span>
            ))}
          </h1>
          <p className="lead mx-auto mt-5 max-w-[680px] !text-[16px] sm:mt-6 sm:!text-[19px]" data-hero="lead">
            {HERO.lead}
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3 sm:mt-9" data-hero="cta">
            <a href={HERO.primary.href} className="btn-primary">
              {HERO.primary.label} <ArrowRight size={17} />
            </a>
            <a href={HERO.secondary.href} className="btn-ghost">
              <PlayCircle size={17} /> {HERO.secondary.label}
            </a>
          </div>
        </div>
      </div>
      <div className="page relative mt-16 sm:mt-20" data-depth="3">
        <div className="relative mx-auto max-w-[1060px]" data-hero="shot">
          <div className="float-loop-slow">
            <Shot name="overview" alt="Visão geral da plataforma EnergyCore: carga total, carga crítica, nobreaks, alarmes, PUE e diagrama unifilar" eager />
          </div>
          {HERO.chips.map((c, i) => (
            // Fora: saída com a rolagem · meio: entrada · dentro: flutuar (CSS). Cada um mexe só no próprio transform.
            <div key={c.label} data-hero="chip-out" className={`absolute hidden md:block ${CHIP_POS[i]}`}>
              <div data-hero="chip">
                <div className="card float-loop px-4 py-3" style={{ animationDelay: `${-i * 2.2}s` }}>
                  <div className="text-[11px] font-medium uppercase tracking-wider text-faint">{c.label}</div>
                  <div className={`num font-display text-[22px] font-bold ${TONE[c.tone]}`}>{c.value}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
