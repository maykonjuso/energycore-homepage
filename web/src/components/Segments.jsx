// Faixa "feito para": segmentos atendidos, rolando devagar (sem logos de clientes inventados).
import { SEGMENTS } from '../data/content.js'

export default function Segments() {
  const items = [...SEGMENTS, ...SEGMENTS]
  return (
    <section aria-label="Para quem é" className="border-y border-line bg-surface/40 py-6">
      <div className="page flex items-center gap-6">
        <span className="hidden shrink-0 text-[12px] font-semibold uppercase tracking-[0.14em] text-faint md:block">Feito para</span>
        <div className="relative min-w-0 flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
          <ul className="marquee flex w-max gap-10">
            {items.map((s, i) => (
              <li key={i} className="flex items-center gap-2.5 whitespace-nowrap text-[15px] font-medium text-muted" aria-hidden={i >= SEGMENTS.length}>
                <s.icon size={18} className="text-brand" /> {s.label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
