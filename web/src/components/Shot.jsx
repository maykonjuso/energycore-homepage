// Tela real do produto (captura), na versão do tema atual, dentro de uma moldura de navegador.
import { useTheme } from '../lib/site.js'
import { asset } from '../lib/env.js'

export default function Shot({ name, alt, className = '', bar = true, eager = false }) {
  const [dark] = useTheme()
  return (
    <div className={`frame ${className}`}>
      {bar && (
        <div className="frame-bar" aria-hidden>
          <i />
          <i />
          <i />
          <span className="ml-3 truncate rounded-md bg-surface/70 px-2 py-0.5 font-mono text-[11px] text-faint">app.energycoreconsulting.com.br</span>
        </div>
      )}
      <img
        src={asset(`produto/${name}-${dark ? 'dark' : 'light'}.webp`)}
        alt={alt}
        width={1600}
        height={1000}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        className="block h-auto w-full"
      />
    </div>
  )
}
