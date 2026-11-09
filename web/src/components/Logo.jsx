import { asset } from '../lib/env.js'

// Logo da EnergyCore (PNG usado como máscara: assume a cor do texto, nos dois temas).
export default function Logo({ height = 34, mark = false, className = '', label = 'EnergyCore Consulting' }) {
  const src = asset(mark ? 'brand/mark.png' : 'brand/logo.png')
  const ratio = mark ? 191 / 197 : 309 / 281
  return (
    <span
      {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })}
      className={`inline-block bg-current ${className}`}
      style={{ height, width: height * ratio, WebkitMask: `url(${src}) center / contain no-repeat`, mask: `url(${src}) center / contain no-repeat` }}
    />
  )
}

// Símbolo + nome: o nome em largura expandida, como letreiro técnico.
export function Wordmark({ size = 28 }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <Logo mark height={size} label="" className="text-ink" />
      <span className="text-[0.9375rem] font-extrabold uppercase leading-none tracking-[0.02em] wm-text sm:text-[1.125rem]" style={{ fontStretch: '125%' }}>
        EnergyCore
      </span>
    </span>
  )
}
