// Demo da rede: clique num nó para derrubar. Mesmo cálculo da plataforma, em miniatura: alcance a partir do
// núcleo sem o nó falho → isolados (perderam todos os caminhos) e degradados (perderam um dos pais).
import { useCallback, useMemo, useState } from 'react'
import { RotateCcw, Zap } from 'lucide-react'
import { useContent } from '../data/content.js'
import { fmt, useLang } from '../lib/i18n.js'
import { useDemoEvent } from '../lib/site.js'

const NODES = [
  { id: 'C1', x: 330, y: 44, layer: 'core' },
  { id: 'C2', x: 530, y: 44, layer: 'core' },
  { id: 'M1', x: 150, y: 140, layer: 'metro' },
  { id: 'M2', x: 360, y: 140, layer: 'metro' },
  { id: 'M3', x: 560, y: 140, layer: 'metro' },
  { id: 'M4', x: 740, y: 140, layer: 'metro' },
  { id: 'A1', label: 'OLT SP 01', x: 80, y: 250, layer: 'access' },
  { id: 'A2', label: 'eNodeB SP', x: 220, y: 250, layer: 'access' },
  { id: 'A3', label: 'OLT RJ 01', x: 330, y: 250, layer: 'access' },
  { id: 'A4', label: 'BTS RJ', x: 440, y: 250, layer: 'access' },
  { id: 'A5', label: 'OLT MG 06', x: 560, y: 250, layer: 'access' },
  { id: 'A6', label: 'eNodeB MG', x: 680, y: 250, layer: 'access' },
  { id: 'A7', label: 'OLT MG 07', x: 800, y: 250, layer: 'access' },
  ...['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7'].map((a, i) => ({ id: `K${i + 1}`, x: [80, 220, 330, 440, 560, 680, 800][i], y: 340, layer: 'cpe', customers: [1240, 860, 1105, 640, 1530, 720, 980][i], parent: a })),
]
const LINKS = [
  ['C1', 'C2'], ['C1', 'M1'], ['C2', 'M1'], ['C1', 'M2'], ['C2', 'M2'], ['C2', 'M3'], ['C1', 'M3'], ['C2', 'M4'],
  ['M1', 'A1'], ['M1', 'A2'], ['M2', 'A3'], ['M2', 'A4'], ['M3', 'A5'], ['M4', 'A5'], ['M3', 'A6'], ['M4', 'A7'],
  ...NODES.filter((n) => n.parent).map((n) => [n.parent, n.id]),
]
const byId = Object.fromEntries(NODES.map((n) => [n.id, n]))
// Forma por camada (não só cor): quadrado = núcleo, losango = metro, círculo = acesso, ponto = clientes.
const SIZE = { core: 15, metro: 13, access: 11, cpe: 6 }

export function impact(failed) {
  const alive = (id) => !failed.has(id)
  const reach = new Set(['C1', 'C2'].filter(alive))
  let changed = true
  while (changed) {
    changed = false
    for (const [a, b] of LINKS) {
      if (reach.has(a) && alive(b) && !reach.has(b)) {
        reach.add(b)
        changed = true
      }
    }
  }
  const parents = {}
  for (const [a, b] of LINKS) if (byId[a].layer !== 'core' || byId[b].layer !== 'core') (parents[b] ??= []).push(a)
  const isolated = NODES.filter((n) => alive(n.id) && !reach.has(n.id))
  const degraded = NODES.filter((n) => reach.has(n.id) && (parents[n.id]?.length ?? 0) > 1 && parents[n.id].some((p) => failed.has(p) || !reach.has(p)))
  const customers = NODES.filter((n) => n.layer === 'cpe' && (!reach.has(n.id) || failed.has(n.id) || failed.has(n.parent))).reduce((s, n) => s + n.customers, 0)
  return { reach, isolated, degraded, customers }
}

function Shape({ n, r, state }) {
  const fill = state === 'ok' ? 'rgb(var(--panel))' : state === 'degraded' ? 'rgb(var(--warn))' : 'rgb(var(--signal))'
  const stroke = state === 'ok' ? 'rgb(var(--ink))' : 'rgb(var(--ink))'
  const common = { fill, stroke, strokeWidth: 1.75, opacity: state === 'isolated' ? 0.5 : 1 }
  if (n.layer === 'core') return <rect x={n.x - r} y={n.y - r} width={r * 2} height={r * 2} {...common} />
  if (n.layer === 'metro') return <path d={`M${n.x} ${n.y - r - 2} L${n.x + r + 2} ${n.y} L${n.x} ${n.y + r + 2} L${n.x - r - 2} ${n.y} Z`} {...common} />
  if (n.layer === 'cpe') return <circle cx={n.x} cy={n.y} r={r} fill={state === 'ok' ? 'rgb(var(--ink))' : 'rgb(var(--signal))'} />
  return <circle cx={n.x} cy={n.y} r={r} {...common} />
}

export default function DemoNetwork() {
  const t = useContent().net
  const lang = useLang()
  const [failed, setFailed] = useState(() => new Set())
  const res = useMemo(() => impact(failed), [failed])
  const label = (n) => n.label ?? t.labels[n.id] ?? t.labels.cpe
  const toggle = (id) => {
    if (byId[id].layer === 'cpe') return
    setFailed((f) => {
      const next = new Set(f)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }
  useDemoEvent(useCallback((id) => (id === 'falha' || id === 'topologia') && setTimeout(() => setFailed(new Set(id === 'falha' ? ['M3'] : [])), 600), []))
  const state = (id) => (failed.has(id) ? 'failed' : res.isolated.some((n) => n.id === id) ? 'isolated' : res.degraded.some((n) => n.id === id) ? 'degraded' : 'ok')
  const down = (a, b) => failed.has(a) || failed.has(b) || !res.reach.has(a) || !res.reach.has(b)
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
      <div>
        <p className="mb-2 text-[0.8125rem] text-ink-2 sm:hidden">{t.scroll}</p>
        <div className="-mx-1 overflow-x-auto px-1">
          <svg viewBox="0 0 880 380" className="svg-halo h-auto w-full min-w-[42rem] sm:min-w-0" role="group" aria-label={t.aria}>
            {LINKS.map(([a, b]) => {
              const d = down(a, b)
              return (
                <line key={a + b} x1={byId[a].x} y1={byId[a].y} x2={byId[b].x} y2={byId[b].y} stroke={d ? 'rgb(var(--signal))' : 'rgb(var(--ink) / 0.55)'} strokeWidth={d ? 2 : 1.25} strokeDasharray={d ? '6 5' : undefined} />
              )
            })}
            {NODES.map((n) => {
              const s = state(n.id)
              const r = SIZE[n.layer]
              const clickable = n.layer !== 'cpe'
              return (
                <g
                  key={n.id}
                  onClick={() => toggle(n.id)}
                  onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), toggle(n.id))}
                  tabIndex={clickable ? 0 : undefined}
                  role={clickable ? 'button' : undefined}
                  aria-label={clickable ? `${label(n)}: ${failed.has(n.id) ? t.nodeOn : t.nodeOff}` : undefined}
                  aria-pressed={clickable ? failed.has(n.id) : undefined}
                  className={clickable ? 'cursor-pointer outline-none [&:focus-visible>*:first-child]:stroke-[3]' : ''}
                >
                  <Shape n={n} r={r} state={s} />
                  {s === 'failed' && (
                    <text x={n.x} y={n.y + 4.5} textAnchor="middle" fontSize="13" fontWeight="800" fill="rgb(var(--ink))">
                      ×
                    </text>
                  )}
                  {clickable && (
                    <text x={n.x} y={n.y - r - 9} textAnchor="middle" fontSize="12" fontFamily="IBM Plex Mono, monospace" fontWeight="600" fill="rgb(var(--ink))">
                      {label(n)}
                    </text>
                  )}
                  {n.layer === 'cpe' && (
                    <text x={n.x} y={n.y + 22} textAnchor="middle" fontSize="11" fontFamily="IBM Plex Mono, monospace" fill="rgb(var(--ink-2))">
                      {fmt(n.customers, lang)}
                    </text>
                  )}
                </g>
              )
            })}
          </svg>
        </div>
      </div>
      <div className="flex flex-col border-[1.5px] border-ink p-5" aria-live="polite">
        <p className="label flex items-center gap-2">
          <Zap size={14} aria-hidden /> {t.impact}
        </p>
        {failed.size === 0 ? (
          <p className="mt-4 text-[0.9375rem] leading-relaxed text-ink-2">
            {t.hint} <b className="text-ink">{t.try}</b>.
          </p>
        ) : (
          <>
            <div className="mt-4">
              <div className="num text-[2.75rem] font-extrabold leading-none" style={{ fontStretch: '110%' }}>
                {fmt(res.customers, lang)}
              </div>
              <div className="mt-1 text-[0.875rem] text-ink-2">{t.customers}</div>
            </div>
            <dl className="mt-5 grid grid-cols-3 border-[1.5px] border-ink text-center">
              {[
                [t.failed, failed.size],
                [t.isolated, res.isolated.length],
                [t.degraded, res.degraded.length],
              ].map(([k, v], i) => (
                <div key={k} className={`flex flex-col-reverse py-2 ${i < 2 ? 'border-r-[1.5px] border-ink' : ''}`}>
                  <dt className="font-mono text-[0.6875rem] uppercase tracking-wide text-ink-2">{k}</dt>
                  <dd className="num text-[1.375rem] font-bold">{v}</dd>
                </div>
              ))}
            </dl>
            {res.degraded.length > 0 && (
              <p className="mt-4 text-[0.875rem] leading-relaxed text-ink-2">
                <b className="text-ink">{t.degradedWord}</b> {t.degradedNote} {res.degraded.map(label).join(', ')}.
              </p>
            )}
          </>
        )}
        <div className="mt-auto flex flex-wrap gap-2 pt-5">
          <button type="button" className="btn-line min-h-11 px-3 text-[0.875rem]" onClick={() => setFailed(new Set(['M3']))}>
            <Zap size={15} aria-hidden /> {t.preset}
          </button>
          {failed.size > 0 && (
            <button type="button" className="btn-line min-h-11 px-3 text-[0.875rem]" onClick={() => setFailed(new Set())}>
              <RotateCcw size={15} aria-hidden /> {t.reset}
            </button>
          )}
        </div>
        <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-2 font-mono text-[0.6875rem] uppercase tracking-wide text-ink-2">
          {t.legend.map(([l, k]) => (
            <li key={k} className="flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
                {k === 'core' && <rect x="2" y="2" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="1.5" />}
                {k === 'metro' && <path d="M7 1 13 7 7 13 1 7Z" fill="none" stroke="currentColor" strokeWidth="1.5" />}
                {k === 'access' && <circle cx="7" cy="7" r="5" fill="none" stroke="currentColor" strokeWidth="1.5" />}
                {k === 'cpe' && <circle cx="7" cy="7" r="3" fill="currentColor" />}
              </svg>
              {l}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
