// Demo de acesso: escolha um perfil e veja o que ele enxerga e pode fazer.
import { useState } from 'react'
import { Bell, Bot, Download, KeyRound, LineChart, Network, Server, SlidersHorizontal, Zap } from 'lucide-react'
import { useContent } from '../data/content.js'

const ICONS = { ack: Bell, export: Download, simulate: Zap, trends: LineChart, limits: SlidersHorizontal, agent: Bot, admin: KeyRound }
const ALL = Object.keys(ICONS)
// Índices das áreas liberadas em cada perfil (os nomes vêm do idioma escolhido).
const PROFILES = [
  { id: 'admin', dc: [0, 1, 2, 3, 4, 5], tel: [0, 1, 2, 3], act: ALL },
  { id: 'noc-mg', dc: [], tel: [3], act: ['ack', 'simulate', 'trends', 'agent'] },
  { id: 'energia', dc: [0, 1, 2, 3], tel: [], act: ['ack', 'export', 'trends', 'limits'] },
  { id: 'auditor', dc: [0, 1, 2, 3, 4, 5], tel: [0, 1, 2, 3], act: ['trends', 'export'] },
]

function Tile({ on, label, t }) {
  return (
    <li className={`flex items-center gap-2 border-[1.5px] px-2.5 py-1.5 text-[0.8125rem] font-medium transition-colors ${on ? 'border-ink bg-ink text-paper' : 'border-ink/30 text-ink-2'}`}>
      <span className={`size-2 ${on ? 'bg-signal' : 'border border-ink/50'}`} aria-hidden />
      {label}
      <span className="sr-only">({on ? t.visible : t.hidden})</span>
    </li>
  )
}

export default function DemoAccess() {
  const t = useContent().access
  const [pid, setPid] = useState('noc-mg')
  const p = PROFILES.find((x) => x.id === pid)
  const name = t.profiles[pid][0]
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[18rem_minmax(0,1fr)]">
      <div role="radiogroup" aria-label={t.group} className="border-t-[1.5px] border-ink">
        {PROFILES.map((x) => {
          const [n, d] = t.profiles[x.id]
          const on = x.id === pid
          return (
            <button key={x.id} type="button" role="radio" aria-checked={on} onClick={() => setPid(x.id)} className={`block w-full border-b-[1.5px] border-ink p-4 text-left transition-colors ${on ? 'bg-ink text-paper' : 'hover:bg-ink/5'}`}>
              <span className="font-semibold">{n}</span>
              <span className={`mt-1 block text-[0.8125rem] ${on ? 'text-paper/80' : 'text-ink-2'}`}>{d}</span>
            </button>
          )
        })}
      </div>
      <div aria-live="polite">
        <p className="label">{t.sees(name)}</p>
        <div className="mt-5 space-y-6">
          <div>
            <p className="mb-2 flex items-center gap-1.5 text-[0.875rem] font-semibold">
              <Server size={15} aria-hidden /> {t.dc}
            </p>
            <ul className="flex flex-wrap gap-1.5">
              {t.dcAreas.map((d, i) => (
                <Tile key={d} label={d} on={p.dc.includes(i)} t={t} />
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-2 flex items-center gap-1.5 text-[0.875rem] font-semibold">
              <Network size={15} aria-hidden /> {t.tel}
            </p>
            <ul className="flex flex-wrap gap-1.5">
              {t.telAreas.map((d, i) => (
                <Tile key={d} label={d} on={p.tel.includes(i)} t={t} />
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-2 text-[0.875rem] font-semibold">{t.can}</p>
            <ul className="grid grid-cols-2 gap-1.5 sm:grid-cols-4 xl:grid-cols-7">
              {ALL.map((id) => {
                const Icon = ICONS[id]
                const on = p.act.includes(id)
                return (
                  <li key={id} className={`flex flex-col items-center gap-1.5 border-[1.5px] px-1 py-3 text-center ${on ? 'border-ink bg-ink text-paper' : 'border-ink/30 text-ink-2'}`}>
                    <Icon size={18} aria-hidden />
                    <span className="text-[0.75rem] font-medium leading-tight">{t.actions[id]}</span>
                    <span className="sr-only">({on ? t.allowed : t.denied})</span>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
        <p className="mt-6 border-t border-ink/20 pt-4 text-[0.875rem] text-ink-2">{t.note}</p>
      </div>
    </div>
  )
}
