import { useEffect, useState } from 'react'
import { Menu, Moon, Sun, X } from 'lucide-react'
import { NAV } from '../data/content.js'
import { useTheme } from '../lib/site.js'
import { Wordmark } from './Logo.jsx'

export default function Nav() {
  const [dark, toggle] = useTheme()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? 'border-b border-line bg-bg/80 backdrop-blur-xl' : 'border-b border-transparent'}`}>
      <nav className="page flex h-[72px] items-center gap-6" aria-label="Principal">
        <a href="#topo" className="text-text" aria-label="EnergyCore, início">
          <Wordmark />
        </a>
        <ul className="ml-4 hidden items-center gap-1 lg:flex">
          {NAV.map((n) => (
            <li key={n.href}>
              <a href={n.href} className="rounded-lg px-3 py-2 text-[14px] font-medium text-muted transition-colors hover:text-text">
                {n.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="ml-auto flex items-center gap-2">
          <button onClick={toggle} className="grid size-10 place-items-center rounded-xl border border-line bg-surface/60 text-muted transition hover:text-text" aria-label={dark ? 'Usar tema claro' : 'Usar tema escuro'}>
            {dark ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <a href="#contato" className="btn-primary hidden h-10 px-4 text-[14px] sm:inline-flex">
            Falar com a equipe
          </a>
          <button onClick={() => setOpen(!open)} className="grid size-10 place-items-center rounded-xl border border-line bg-surface/60 lg:hidden" aria-label={open ? 'Fechar menu' : 'Abrir menu'} aria-expanded={open}>
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>
      {open && (
        <div className="border-t border-line bg-bg/95 backdrop-blur-xl lg:hidden">
          <ul className="page flex flex-col py-3">
            {[...NAV, { href: '#contato', label: 'Falar com a equipe' }].map((n) => (
              <li key={n.href}>
                <a href={n.href} onClick={() => setOpen(false)} className="block rounded-lg px-2 py-3 text-[16px] font-medium">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  )
}
