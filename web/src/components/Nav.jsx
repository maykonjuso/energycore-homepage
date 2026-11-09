// Barra do topo: marca, seções, idioma (PT/EN), tema, acessibilidade e o botão de demonstração.
import { useEffect, useState } from 'react'
import { Menu, Moon, Sun, X } from 'lucide-react'
import { useContent } from '../data/content.js'
import { setLang, useLang } from '../lib/i18n.js'
import { useTheme } from '../lib/site.js'
import A11yMenu from './A11yMenu.jsx'
import { Wordmark } from './Logo.jsx'

function LangSwitch() {
  const lang = useLang()
  const t = useContent().nav
  return (
    <div role="group" aria-label={t.lang} className="flex border-[1.5px] border-ink font-mono text-[0.75rem] font-semibold">
      {[
        ['pt', 'PT', 'Português'],
        ['en', 'EN', 'English'],
      ].map(([v, l, full]) => (
        <button key={v} type="button" lang={v === 'en' ? 'en' : 'pt-BR'} onClick={() => setLang(v)} aria-pressed={lang === v} aria-label={full} className={`min-h-10 min-w-10 px-2 ${lang === v ? 'bg-ink text-paper' : 'text-ink hover:bg-ink/10'}`}>
          {l}
        </button>
      ))}
    </div>
  )
}

export default function Nav() {
  const t = useContent().nav
  const [dark, toggle] = useTheme()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])
  return (
    <header className={`sticky top-0 z-40 bg-paper transition-[border-color] ${scrolled ? 'border-b-[1.5px] border-ink' : 'border-b-[1.5px] border-transparent'}`}>
      <div className="sheet flex h-[4.25rem] items-center gap-2 sm:gap-4">
        <a href="#topo" className="shrink-0" aria-label="EnergyCore">
          <Wordmark />
        </a>
        <nav aria-label={t.main} className="nav-desktop ml-6 hidden lg:block">
          <ul className="flex items-center gap-1">
            {t.links.map(([href, label]) => (
              <li key={href}>
                <a href={href} className="inline-flex min-h-11 items-center px-3 text-[0.9375rem] font-medium hover:underline hover:decoration-signal hover:decoration-2 hover:underline-offset-8">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <LangSwitch />
          <button type="button" onClick={toggle} aria-label={dark ? t.theme[1] : t.theme[0]} title={dark ? t.theme[1] : t.theme[0]} className="nav-theme-btn hidden size-11 place-items-center hover:text-signal-text sm:grid">
            {dark ? <Sun size={20} aria-hidden /> : <Moon size={20} aria-hidden />}
          </button>
          <A11yMenu />
          <a href="#contato" className="nav-cta btn-ink ml-1 hidden min-h-11 sm:inline-flex">
            {t.cta}
          </a>
          <button type="button" className="nav-burger grid size-11 place-items-center lg:hidden" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="menu-movel" aria-label={open ? t.close : t.menu}>
            {open ? <X size={22} aria-hidden /> : <Menu size={22} aria-hidden />}
          </button>
        </div>
      </div>
      {open && (
        <nav id="menu-movel" aria-label={t.main} className="nav-mobile border-t-[1.5px] border-ink bg-paper lg:hidden">
          <ul className="sheet py-3">
            {t.links.map(([href, label], i) => (
              <li key={href} className="border-b border-ink/15 last:border-0">
                <a href={href} onClick={() => setOpen(false)} className="flex min-h-12 items-center justify-between text-[1.0625rem] font-semibold">
                  {label} <span className="label">0{i + 1}</span>
                </a>
              </li>
            ))}
            <li className="nav-theme border-b border-ink/15 sm:hidden">
              <button type="button" onClick={toggle} className="flex min-h-12 w-full items-center justify-between text-[1.0625rem] font-semibold">
                {dark ? t.theme[1] : t.theme[0]} {dark ? <Sun size={20} aria-hidden /> : <Moon size={20} aria-hidden />}
              </button>
            </li>
            <li className="nav-cta-mobile pt-3 sm:hidden">
              <a href="#contato" onClick={() => setOpen(false)} className="btn-ink w-full">
                {t.cta}
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  )
}
