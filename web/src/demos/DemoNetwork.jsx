// Demo da rede: clique num nó para simular a falha. O cálculo é o mesmo da plataforma, em miniatura:
// alcance a partir do núcleo sem o nó falho → isolados (perderam todos os caminhos) e degradados
// (perderam um dos pais, sem redundância).
import { useCallback, useMemo, useState } from 'react'
import { RotateCcw, Zap } from 'lucide-react'
import { useDemoEvent } from '../lib/site.js'

const NODES = [
  { id: 'C1', label: 'Núcleo 1', x: 330, y: 40, layer: 'core' },
  { id: 'C2', label: 'Núcleo 2', x: 530, y: 40, layer: 'core' },
  { id: 'M1', label: 'Metro SP', x: 150, y: 140, layer: 'metro' },
  { id: 'M2', label: 'Metro RJ', x: 360, y: 140, layer: 'metro' },
  { id: 'M3', label: 'Metro MG 01', x: 560, y: 140, layer: 'metro' },
  { id: 'M4', label: 'Metro MG 02', x: 740, y: 140, layer: 'metro' },
  { id: 'A1', label: 'OLT SP 01', x: 80, y: 250, layer: 'access', customers: 0 },
  { id: 'A2', label: 'eNodeB SP', x: 220, y: 250, layer: 'access', customers: 0 },
  { id: 'A3', label: 'OLT RJ 01', x: 330, y: 250, layer: 'access', customers: 0 },
  { id: 'A4', label: 'BTS RJ', x: 440, y: 250, layer: 'access', customers: 0 },
  { id: 'A5', label: 'OLT MG 06', x: 560, y: 250, layer: 'access', customers: 0 },
  { id: 'A6', label: 'eNodeB MG', x: 680, y: 250, layer: 'access', customers: 0 },
  { id: 'A7', label: 'OLT MG 07', x: 800, y: 250, layer: 'access', customers: 0 },
  ...['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7'].map((a, i) => ({ id: `K${i + 1}`, label: 'Clientes', x: [80, 220, 330, 440, 560, 680, 800][i], y: 340, layer: 'cpe', customers: [1240, 860, 1105, 640, 1530, 720, 980][i], parent: a })),
]
const LINKS = [
  ['C1', 'C2'], ['C1', 'M1'], ['C2', 'M1'], ['C1', 'M2'], ['C2', 'M2'], ['C2', 'M3'], ['C1', 'M3'], ['C2', 'M4'],
  ['M1', 'A1'], ['M1', 'A2'], ['M2', 'A3'], ['M2', 'A4'], ['M3', 'A5'], ['M4', 'A5'], ['M3', 'A6'], ['M4', 'A7'],
  ...NODES.filter((n) => n.parent).map((n) => [n.parent, n.id]),
]
const byId = Object.fromEntries(NODES.map((n) => [n.id, n]))
const COLOR = { core: 'rgb(var(--brand))', metro: 'rgb(var(--warn))', access: 'rgb(var(--accent))', cpe: 'rgb(var(--ok))' }

function impact(failed) {
  const alive = (id) => !failed.has(id)
  const reach = new Set(['C1', 'C2'].filter(alive))
  const parents = {}
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
  for (const [a, b] of LINKS) if (byId[a].layer !== 'core' || byId[b].layer !== 'core') (parents[b] ??= []).push(a)
  const isolated = NODES.filter((n) => alive(n.id) && !reach.has(n.id))
  const degraded = NODES.filter((n) => reach.has(n.id) && (parents[n.id]?.length ?? 0) > 1 && parents[n.id].some((p) => failed.has(p) || !reach.has(p)))
  const customers = NODES.filter((n) => n.layer === 'cpe' && (!reach.has(n.id) || failed.has(n.id) || failed.has(n.parent))).reduce((s, n) => s + n.customers, 0)
  return { reach, isolated, degraded, customers }
}

export default function DemoNetwork() {
  const [failed, setFailed] = useState(() => new Set())
  const res = useMemo(() => impact(failed), [failed])
  const toggle = (id) => {
    if (byId[id].layer === 'cpe') return
    setFailed((f) => {
      const n = new Set(f)
      n.has(id) ? n.delete(id) : n.add(id)
      return n
    })
  }
  useDemoEvent(useCallback((id) => (id === 'falha' || id === 'topologia') && setTimeout(() => setFailed(new Set(id === 'falha' ? ['M3'] : [])), 700), []))
  const state = (id) => (failed.has(id) ? 'failed' : res.isolated.some((n) => n.id === id) ? 'isolated' : res.degraded.some((n) => n.id === id) ? 'degraded' : 'ok')
  const linkState = (a, b) => (failed.has(a) || failed.has(b) || !res.reach.has(a) || !res.reach.has(b) ? 'down' : 'up')
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
      <div className="card overflow-hidden p-3 sm:p-5">
        <p className="mb-2 text-[12px] text-faint sm:hidden">Arraste para o lado para ver a rede inteira.</p>
        <div className="-mx-3 overflow-x-auto px-3 sm:mx-0 sm:px-0">
        <svg viewBox="0 0 880 380" className="h-auto w-full min-w-[720px] sm:min-w-0" role="group" aria-label="Rede telecom de exemplo. Clique num nó para simular a falha.">
          {LINKS.map(([a, b]) => {
            const s = linkState(a, b)
            return (
              <line
                key={a + b}
                x1={byId[a].x}
                y1={byId[a].y}
                x2={byId[b].x}
                y2={byId[b].y}
                stroke={s === 'down' ? 'rgb(var(--crit))' : 'rgb(var(--faint) / 0.45)'}
                strokeWidth={s === 'down' ? 2 : 1.3}
                strokeDasharray={s === 'down' ? '5 5' : undefined}
                className={s === 'up' && byId[b].layer !== 'cpe' ? 'dash-flow' : undefined}
                style={s === 'up' && byId[b].layer !== 'cpe' ? { stroke: 'rgb(var(--brand) / 0.45)' } : undefined}
              />
            )
          })}
          {NODES.map((n) => {
            const s = state(n.id)
            const r = n.layer === 'core' ? 15 : n.layer === 'metro' ? 13 : n.layer === 'access' ? 11 : 8
            const clickable = n.layer !== 'cpe'
            return (
              <g
                key={n.id}
                onClick={() => toggle(n.id)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), toggle(n.id))}
                tabIndex={clickable ? 0 : -1}
                role={clickable ? 'button' : undefined}
                aria-label={clickable ? `${n.label}: ${failed.has(n.id) ? 'em falha, clique para restaurar' : 'clique para simular falha'}` : undefined}
                className={clickable ? 'cursor-pointer outline-none [&:focus-visible>circle:first-of-type]:stroke-[rgb(var(--text))]' : ''}
              >
                <circle cx={n.x} cy={n.y} r={r} fill={s === 'ok' ? COLOR[n.layer] : s === 'degraded' ? 'rgb(var(--warn))' : 'rgb(var(--crit))'} opacity={s === 'isolated' ? 0.45 : 1} stroke="transparent" strokeWidth="3" />
                {s === 'failed' && <text x={n.x} y={n.y + 4} textAnchor="middle" fontSize="12" fontWeight="800" fill="white">×</text>}
                {(s === 'degraded' || s === 'failed') && <circle cx={n.x} cy={n.y} r={r + 4} fill="none" stroke={s === 'failed' ? 'rgb(var(--crit))' : 'rgb(var(--warn))'} strokeWidth="2" className="pulse-ring" />}
                {n.layer !== 'cpe' && (
                  <text x={n.x} y={n.y - r - 7} textAnchor="middle" fontSize="12" fontWeight="600" fill="rgb(var(--muted))">
                    {n.label}
                  </text>
                )}
                {n.layer === 'cpe' && (
                  <text x={n.x} y={n.y + 24} textAnchor="middle" fontSize="11" fill="rgb(var(--faint))" className="num">
                    {n.customers.toLocaleString('pt-BR')}
                  </text>
                )}
              </g>
            )
          })}
        </svg>
        </div>
      </div>
      <div className="card flex flex-col p-5" aria-live="polite">
        <div className="flex items-center gap-2 text-[13px] font-semibold uppercase tracking-wider text-faint">
          <Zap size={15} className="text-warn" /> Impacto da falha
        </div>
        {failed.size === 0 ? (
          <p className="mt-4 text-[15px] leading-relaxed text-muted">Clique num nó (núcleo, metro ou acesso) para simular a falha. Experimente o <b className="text-text">Metro MG 01</b>.</p>
        ) : (
          <>
            <div className="mt-4">
              <div className="num font-display text-[44px] font-extrabold leading-none text-crit">{res.customers.toLocaleString('pt-BR')}</div>
              <div className="mt-1 text-[14px] text-muted">clientes afetados</div>
            </div>
            <dl className="mt-5 grid grid-cols-3 gap-2 text-center">
              {[
                ['Em falha', failed.size, 'text-crit'],
                ['Isolados', res.isolated.length, 'text-crit'],
                ['Degradados', res.degraded.length, 'text-warn'],
              ].map(([k, v, c]) => (
                <div key={k} className="rounded-xl bg-elevated p-2">
                  <dd className={`num font-display text-[22px] font-bold ${c}`}>{v}</dd>
                  <dt className="text-[11px] text-faint">{k}</dt>
                </div>
              ))}
            </dl>
            {res.degraded.length > 0 && (
              <p className="mt-4 text-[13px] leading-relaxed text-muted">
                <b className="text-warn">Degradado</b> continua no ar, mas perdeu a redundância: {res.degraded.map((n) => n.label).join(', ')}.
              </p>
            )}
          </>
        )}
        <div className="mt-auto flex flex-wrap gap-2 pt-5">
          <button className="btn-ghost h-10 px-3 text-[14px]" onClick={() => setFailed(new Set(['M3']))}>
            <Zap size={15} /> Falha no Metro MG 01
          </button>
          {failed.size > 0 && (
            <button className="btn-ghost h-10 px-3 text-[14px]" onClick={() => setFailed(new Set())}>
              <RotateCcw size={15} /> Restaurar
            </button>
          )}
        </div>
        <div className="mt-4 flex flex-wrap gap-3 text-[11px] text-faint">
          {[['Núcleo', 'core'], ['Metro', 'metro'], ['Acesso', 'access'], ['Clientes', 'cpe']].map(([l, k]) => (
            <span key={k} className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full" style={{ background: COLOR[k] }} /> {l}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
