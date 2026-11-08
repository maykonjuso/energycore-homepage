// Logo da EnergyCore (PNG branco usado como máscara: assume a cor do texto, nos dois temas).
export default function Logo({ height = 34, mark = false, className = '' }) {
  const src = mark ? '/brand/mark.png' : '/brand/logo.png'
  const ratio = mark ? 191 / 197 : 309 / 281
  return (
    <span
      role="img"
      aria-label="EnergyCore Consulting"
      className={`inline-block bg-current ${className}`}
      style={{ height, width: height * ratio, WebkitMask: `url(${src}) center / contain no-repeat`, mask: `url(${src}) center / contain no-repeat` }}
    />
  )
}

// Símbolo + nome em texto (fica legível em tamanhos pequenos, como no menu).
export function Wordmark({ size = 30 }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <Logo mark height={size} className="text-brand" />
      <span className="flex flex-col leading-none">
        <span className="font-display text-[19px] font-extrabold tracking-tight">EnergyCore</span>
        <span className="mt-[3px] text-[9px] font-semibold uppercase tracking-[0.3em] text-muted">Consulting</span>
      </span>
    </span>
  )
}
