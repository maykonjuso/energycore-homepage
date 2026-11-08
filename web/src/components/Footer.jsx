import { FOOTER, NAV } from '../data/content.js'
import { Wordmark } from './Logo.jsx'

export default function Footer() {
  return (
    <footer className="border-t border-line bg-surface/40">
      <div className="page grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Wordmark />
          <p className="mt-4 max-w-sm text-[14px] leading-relaxed text-muted">Plataforma e consultoria para a operação de datacenters e redes de telecom: energia, alarmes, topologia, causa raiz, IA e acesso controlado.</p>
        </div>
        <nav aria-label="Rodapé">
          <p className="text-[13px] font-semibold uppercase tracking-wider text-faint">Navegação</p>
          <ul className="mt-4 space-y-2 text-[14px]">
            {NAV.map((n) => (
              <li key={n.href}>
                <a href={n.href} className="text-muted hover:text-text">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="text-[13px] font-semibold uppercase tracking-wider text-faint">Contato</p>
          <ul className="mt-4 space-y-2 text-[14px] text-muted">
            <li>
              <a href={`mailto:${FOOTER.email}`} className="hover:text-text">
                {FOOTER.email}
              </a>
            </li>
            <li>{FOOTER.site}</li>
            <li>
              <a href="#contato" className="hover:text-text">
                Agendar uma demonstração
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="page flex flex-wrap items-center justify-between gap-3 py-5 text-[12px] text-faint">
          <span>© {new Date().getFullYear()} EnergyCore Consulting. Telas da plataforma com dados simulados.</span>
          <span>Seus dados de contato são tratados conforme a LGPD e usados só para responder.</span>
        </div>
      </div>
    </footer>
  )
}
