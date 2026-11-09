// § 01 · Antes e depois do mesmo incidente (BAB: antes → depois → a ponte).
import { useRef } from 'react'
import { Check, X } from 'lucide-react'
import { useContent } from '../data/content.js'
import { useReveal } from '../lib/reveal.js'
import SecHead from './SecHead.jsx'

export default function Problem() {
  const t = useContent().problem
  const ref = useRef(null)
  useReveal(ref)
  return (
    <section ref={ref} aria-labelledby="problema" className="py-20 sm:py-28">
      <div className="sheet">
        <SecHead id="problema" no={t.no} coord={t.coord} title={t.title} />
        <div className="mt-12 grid border-[1.5px] border-ink md:grid-cols-2">
          <div className="border-b-[1.5px] border-ink p-6 sm:p-8 md:border-b-0 md:border-r-[1.5px]" data-reveal>
            <p className="label">{t.before.tag}</p>
            <p className="mt-4 text-[1.375rem] font-bold leading-snug sm:text-[1.625rem]" style={{ fontStretch: '106%' }}>
              {t.before.text}
            </p>
            <ol className="mt-8 space-y-0 border-t border-ink/20">
              {t.before.steps.map((s, i) => (
                <li key={s} className="flex items-center gap-3 border-b border-ink/20 py-3 text-ink-2">
                  <span className="num w-7 font-mono text-[0.75rem]">{String(i + 1).padStart(2, '0')}</span>
                  <X size={16} className="shrink-0 text-crit" aria-hidden />
                  <span className="text-[0.9375rem]">{s}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="bg-ink p-6 text-paper sm:p-8" data-reveal="120">
            <p className="font-mono text-[0.75rem] font-medium uppercase tracking-[0.12em] text-paper/80">{t.after.tag}</p>
            <p className="mt-4 text-[1.375rem] font-bold leading-snug sm:text-[1.625rem]" style={{ fontStretch: '106%' }}>
              {t.after.text}
            </p>
            <ol className="mt-8 border-t border-paper/25">
              {t.after.steps.map((s, i) => (
                <li key={s} className="flex items-center gap-3 border-b border-paper/25 py-3">
                  <span className="num w-7 font-mono text-[0.75rem] text-paper/80">{String(i + 1).padStart(2, '0')}</span>
                  <span className="grid size-4 shrink-0 place-items-center bg-signal text-ink" aria-hidden>
                    <Check size={12} strokeWidth={3} />
                  </span>
                  <span className="text-[0.9375rem]">{s}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
        <p className="mt-8 max-w-3xl text-[1.125rem] leading-relaxed sm:text-[1.25rem]" data-reveal>
          <span className="mr-2 inline-block size-2.5 bg-signal align-middle" aria-hidden />
          {t.bridge}
        </p>
      </div>
    </section>
  )
}
