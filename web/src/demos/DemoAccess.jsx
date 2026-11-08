// Demo de acesso: escolha um perfil e veja o que ele enxerga (áreas do datacenter, regiões da rede) e o que
// pode fazer. Mesmo jeito de mostrar do resumo de acesso da plataforma.
import { useState } from 'react'
import { Bell, Bot, Download, KeyRound, LineChart, Network, Server, ShieldCheck, SlidersHorizontal, Zap } from 'lucide-react'

const DC = ['Geral do site', 'Distribuição CA', 'Nobreaks', 'Refrigeração', 'Racks e PDU', 'Sensores']
const TEL = ['Núcleo nacional', 'São Paulo', 'Rio de Janeiro', 'Minas Gerais']
const ACTIONS = [
  ['ack', Bell, 'Reconhecer'],
  ['export', Download, 'Exportar'],
  ['simulate', Zap, 'Simular falha'],
  ['trends', LineChart, 'Tendências'],
  ['limits', SlidersHorizontal, 'Limites'],
  ['agent', Bot, 'Agente IA'],
  ['admin', KeyRound, 'Acessos'],
]
const PROFILES = [
  { id: 'admin', name: 'Administrador', desc: 'Acesso total, inclusive aos acessos dos outros.', dc: DC, tel: TEL, act: ACTIONS.map((a) => a[0]) },
  { id: 'noc-mg', name: 'NOC Minas Gerais', desc: 'Só a rede de Minas. Simula falha e usa o agente.', dc: [], tel: ['Minas Gerais'], act: ['ack', 'simulate', 'trends', 'agent'] },
  { id: 'energia', name: 'Facilities · energia', desc: 'Energia e refrigeração do datacenter. Edita limites.', dc: ['Geral do site', 'Distribuição CA', 'Nobreaks', 'Refrigeração'], tel: [], act: ['ack', 'export', 'trends', 'limits'] },
  { id: 'auditor', name: 'Auditoria', desc: 'Vê tudo, não altera nada.', dc: DC, tel: TEL, act: ['trends', 'export'] },
]

function Tile({ on, label, i }) {
  return (
    <span
      className={`rounded-lg border px-2.5 py-1.5 text-[13px] font-medium transition-all duration-500 ${on ? 'border-ok/40 bg-ok/15 text-ok' : 'border-line bg-elevated/50 text-faint'}`}
      style={{ transitionDelay: `${i * 40}ms` }}
    >
      {label}
    </span>
  )
}

export default function DemoAccess() {
  const [p, setP] = useState(PROFILES[1])
  return (
    <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
      <div className="space-y-2" role="radiogroup" aria-label="Perfil de exemplo">
        {PROFILES.map((x) => (
          <button
            key={x.id}
            role="radio"
            aria-checked={x.id === p.id}
            onClick={() => setP(x)}
            className={`w-full rounded-2xl border p-4 text-left transition-all ${x.id === p.id ? 'border-brand bg-brand/10 shadow-[0_10px_30px_-18px_rgb(var(--glow))]' : 'border-line bg-surface/60 hover:border-brand/40'}`}
          >
            <span className="flex items-center gap-2 font-semibold">
              {x.id === 'admin' && <ShieldCheck size={16} className="text-brand" />} {x.name}
            </span>
            <span className="mt-1 block text-[13px] text-muted">{x.desc}</span>
          </button>
        ))}
      </div>
      <div className="card p-5 sm:p-7" aria-live="polite">
        <p className="text-[13px] font-semibold uppercase tracking-wider text-faint">O que {p.name} enxerga</p>
        <div className="mt-5 space-y-5">
          <div>
            <p className="mb-2 flex items-center gap-1.5 text-[13px] font-semibold text-muted">
              <Server size={15} /> Datacenter
            </p>
            <div className="flex flex-wrap gap-1.5">
              {DC.map((d, i) => (
                <Tile key={d} label={d} on={p.dc.includes(d)} i={i} />
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 flex items-center gap-1.5 text-[13px] font-semibold text-muted">
              <Network size={15} /> Rede telecom
            </p>
            <div className="flex flex-wrap gap-1.5">
              {TEL.map((d, i) => (
                <Tile key={d} label={d} on={p.tel.includes(d)} i={i + 6} />
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-[13px] font-semibold text-muted">Pode fazer</p>
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
              {ACTIONS.map(([id, Icon, label], i) => {
                const on = p.act.includes(id)
                return (
                  <span
                    key={id}
                    className={`flex flex-col items-center gap-1.5 rounded-xl border px-1 py-3 text-center transition-all duration-500 ${on ? 'border-ok/40 bg-ok/15 text-ok' : 'border-line bg-elevated/40 text-faint opacity-60'}`}
                    style={{ transitionDelay: `${i * 35}ms` }}
                  >
                    <Icon size={18} />
                    <span className="text-[11px] font-medium leading-tight">{label}</span>
                  </span>
                )
              })}
            </div>
          </div>
        </div>
        <p className="mt-6 border-t border-line pt-4 text-[13px] text-muted">
          O que está fora do alcance nem aparece: nem na busca, nem nos alarmes, nem nas respostas do agente de IA. E a regra vale também na API.
        </p>
      </div>
    </div>
  )
}
