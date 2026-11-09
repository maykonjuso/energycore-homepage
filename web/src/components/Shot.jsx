// Tela real do produto (captura no tema atual) dentro de uma moldura com marcas de corte.
import { useTheme } from '../lib/site.js'
import { asset } from '../lib/env.js'

export default function Shot({ name, alt, eager = false, caption }) {
  const [dark] = useTheme()
  return (
    <figure className="crop">
      <span className="crop-b" aria-hidden />
      <img
        src={asset(`produto/${name}-${dark ? 'dark' : 'light'}.webp`)}
        alt={alt}
        width={1600}
        height={1000}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        className="block h-auto w-full border border-ink/25"
      />
      {caption && <figcaption className="label mt-3 flex justify-between gap-4">{caption}</figcaption>}
    </figure>
  )
}
