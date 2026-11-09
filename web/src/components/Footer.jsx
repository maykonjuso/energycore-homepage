// Rodapé: carimbo da última folha, links e o nome grande cortado na borda.
import { ArrowUp } from 'lucide-react'
import { EMAIL, SITE, useContent } from '../data/content.js'
import { Wordmark } from './Logo.jsx'

export default function Footer() {
  const c = useContent()
  const t = c.footer
  return (
    <footer className="overflow-hidden border-t-[1.5px] border-ink">
      <div className="sheet grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Wordmark size={30} />
          <p className="mt-4 max-w-sm text-[1rem] text-ink-2">{t.tagline}</p>
        </div>
        <nav aria-label="Rodapé">
          <ul className="space-y-1">
            {c.nav.links.map(([href, label]) => (
              <li key={href}>
                <a href={href} className="inline-flex min-h-10 items-center text-[0.9375rem] hover:underline hover:decoration-signal hover:decoration-2 hover:underline-offset-4">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="space-y-4 text-[0.9375rem]">
          <a href={`mailto:${EMAIL}`} className="block break-all font-semibold underline decoration-signal decoration-2 underline-offset-4">
            {EMAIL}
          </a>
          <p className="text-ink-2">
            <span className="font-semibold text-ink">{t.a11y}.</span> {t.a11yNote}
          </p>
          <a href="#topo" className="inline-flex min-h-11 items-center gap-2 font-mono text-[0.75rem] uppercase tracking-wider hover:text-signal-text">
            <ArrowUp size={14} aria-hidden /> {t.top}
          </a>
        </div>
      </div>
      <div className="sheet flex flex-wrap items-center justify-between gap-3 border-t border-ink/25 py-4 font-mono text-[0.75rem] uppercase tracking-wider text-ink-2">
        <span>
          © {new Date().getFullYear()} EnergyCore Consulting · {SITE}
        </span>
        <span>{t.sheet}</span>
      </div>
      {/* Nome gigante só de enfeite: desenhado em SVG, fora da leitura e do cálculo de contraste de texto. */}
      <svg viewBox="0 0 1000 128" className="block h-auto w-full" aria-hidden="true" focusable="false">
        <text x="500" y="122" textAnchor="middle" fontSize="150" fontWeight="900" letterSpacing="-4" fill="rgb(var(--ink) / 0.07)" style={{ fontStretch: '125%', textTransform: 'uppercase' }}>
          ENERGYCORE
        </text>
      </svg>
    </footer>
  )
}
