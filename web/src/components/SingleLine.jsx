// Diagrama unifilar do topo, desenhado a nanquim: energia (concessionária → QDAC → nobreaks → racks) alimenta
// o núcleo da rede, que desce para o metro, as OLTs e os clientes. A cada ciclo o enlace L-0005 cai: a corrente
// para de correr depois dele e o carimbo mostra quantos clientes foram afetados. Pausável (WCAG 2.2.2).
import { useEffect, useState } from 'react'
import { Pause, Play } from 'lucide-react'
import { useContent } from '../data/content.js'
import { fmt, useLang } from '../lib/i18n.js'
import { motionOff } from '../lib/a11y.js'

const AFFECTED = 1530 // clientes atrás da OLT MG 06 na rede da demonstração

// Fio com a corrente correndo por cima (pontos laranja), quando energizado.
function Wire({ d, live = true, fault = false, id }) {
  return (
    <g data-wire={id}>
      <path d={d} fill="none" stroke={fault ? 'rgb(var(--signal))' : 'rgb(var(--ink))'} strokeWidth={fault ? 2 : 1.5} strokeDasharray={fault ? '6 5' : undefined} />
      {live && !fault && <path d={d} fill="none" stroke="rgb(var(--signal))" strokeWidth="2.5" strokeLinecap="round" className="wire-flow" />}
    </g>
  )
}

function Box({ x, y, w, h = 30, label, sub, dim = false, alert = false }) {
  return (
    <g opacity={dim ? 0.35 : 1}>
      <rect x={x} y={y} width={w} height={h} fill="rgb(var(--panel))" stroke={alert ? 'rgb(var(--signal))' : 'rgb(var(--ink))'} strokeWidth={alert ? 2 : 1.5} />
      <text x={x + 8} y={y + (sub ? 13 : 19)} fontSize="11" fontFamily="IBM Plex Mono, monospace" fontWeight="600" fill="rgb(var(--ink))">
        {label}
      </text>
      {sub && (
        <text x={x + 8} y={y + 25} fontSize="9.5" fontFamily="IBM Plex Mono, monospace" fill="rgb(var(--ink-2))">
          {sub}
        </text>
      )}
    </g>
  )
}

// Grupo de clientes: pontos em grade.
function Clients({ x, y, n, count, dim, label }) {
  return (
    <g opacity={dim ? 0.3 : 1}>
      {Array.from({ length: n }, (_, i) => (
        <circle key={i} cx={x + (i % 6) * 9} cy={y + Math.floor(i / 6) * 9} r="2.6" fill={dim ? 'rgb(var(--signal))' : 'rgb(var(--ink))'} />
      ))}
      <text x={x} y={y + Math.ceil(n / 6) * 9 + 12} fontSize="10" fontFamily="IBM Plex Mono, monospace" fill="rgb(var(--ink-2))">
        {count} {label}
      </text>
    </g>
  )
}

export default function SingleLine() {
  const t = useContent().hero.diagram
  const lang = useLang()
  const [fault, setFault] = useState(false)
  const [paused, setPaused] = useState(() => motionOff())
  useEffect(() => {
    if (paused) return undefined
    const iv = setInterval(() => setFault((f) => !f), fault ? 5200 : 4200)
    return () => clearInterval(iv)
  }, [paused, fault])

  return (
    <figure className="relative">
      <svg viewBox="0 0 560 400" className="svg-halo h-auto w-full" role="img" aria-label={t.label}>
        {/* Moldura da prancha com régua de coordenadas */}
        <rect x="0.75" y="0.75" width="558.5" height="398.5" fill="none" stroke="rgb(var(--ink))" strokeWidth="1.5" />
        {Array.from({ length: 14 }, (_, i) => (
          <line key={i} x1={i * 40} y1="0" x2={i * 40} y2="6" stroke="rgb(var(--ink))" strokeWidth="1" />
        ))}
        {['A', 'B', 'C', 'D'].map((c, i) => (
          <text key={c} x={i * 140 + 66} y="17" fontSize="9" fontFamily="IBM Plex Mono, monospace" fill="rgb(var(--ink-2))">
            {c}
          </text>
        ))}

        {/* ---- Energia ---- */}
        <Box x={24} y={32} w={176} label={t.grid} />
        <Wire id="g-t" d="M112 62 V84" />
        {/* transformador: dois círculos */}
        <circle cx="112" cy="94" r="10" fill="none" stroke="rgb(var(--ink))" strokeWidth="1.5" />
        <circle cx="112" cy="108" r="10" fill="none" stroke="rgb(var(--ink))" strokeWidth="1.5" />
        <Wire id="t-q" d="M112 118 V140" />
        {/* barramento QDAC */}
        <line x1="44" y1="142" x2="196" y2="142" stroke="rgb(var(--ink))" strokeWidth="4" />
        <text x="44" y="135" fontSize="10" fontFamily="IBM Plex Mono, monospace" fontWeight="600" fill="rgb(var(--ink))">
          {t.qdac}
        </text>
        {/* disjuntores e nobreaks */}
        {[70, 160].map((x, i) => (
          <g key={x}>
            <Wire id={`q-u${i}`} d={`M${x} 144 V176`} />
            <rect x={x - 5} y={152} width="10" height="10" fill="rgb(var(--paper))" stroke="rgb(var(--ink))" strokeWidth="1.5" />
            <line x1={x - 5} y1={162} x2={x + 5} y2={152} stroke="rgb(var(--ink))" strokeWidth="1.2" />
            <Box x={x - 34} y={176} w={68} h={30} label={`UPS-0${i + 1}`} sub={i ? '58 %' : '61 %'} />
            <Wire id={`u-r${i}`} d={`M${x} 206 V236`} />
          </g>
        ))}
        <text x="88" y="226" fontSize="9.5" fontFamily="IBM Plex Mono, monospace" fill="rgb(var(--ink-2))">
          {t.ups}
        </text>
        {/* racks */}
        <line x1="44" y1="238" x2="196" y2="238" stroke="rgb(var(--ink))" strokeWidth="2.5" />
        {[48, 84, 120, 156].map((x, i) => (
          <g key={x}>
            <rect x={x} y={252} width="30" height="54" fill="rgb(var(--panel))" stroke="rgb(var(--ink))" strokeWidth="1.5" />
            {[0, 1, 2, 3].map((k) => (
              <line key={k} x1={x + 5} y1={262 + k * 11} x2={x + 25} y2={262 + k * 11} stroke="rgb(var(--ink) / 0.5)" />
            ))}
            {i === 3 && <rect x={x + 3} y={255} width="24" height="10" fill="rgb(var(--signal) / 0.25)" stroke="rgb(var(--signal))" />}
            <line x1={x + 15} y1="238" x2={x + 15} y2="252" stroke="rgb(var(--ink))" strokeWidth="1.5" />
          </g>
        ))}
        <text x="44" y="322" fontSize="9.5" fontFamily="IBM Plex Mono, monospace" fill="rgb(var(--ink-2))">
          {t.racks} · DC-01
        </text>

        {/* rack 4 hospeda o núcleo: a energia alimenta a rede */}
        <Wire id="dc-core" d="M186 270 H250 V47 H300" />

        {/* ---- Rede ---- */}
        <Box x={300} y={32} w={112} label={t.core} sub="CORE-01" />
        <Wire id="c-m" d="M356 62 V112" />
        <Box x={300} y={112} w={112} label={t.metro} sub="MET-MG-01" />
        <Wire id="m-o6" d="M330 142 V190" fault={fault} />
        <Wire id="m-o7" d="M392 142 V172 H468 V190" />
        {fault && (
          <g className="fault-blink">
            <line x1="322" y1="158" x2="338" y2="174" stroke="rgb(var(--signal))" strokeWidth="2.5" />
            <line x1="338" y1="158" x2="322" y2="174" stroke="rgb(var(--signal))" strokeWidth="2.5" />
          </g>
        )}
        <text x="276" y="170" fontSize="9" fontFamily="IBM Plex Mono, monospace" fill={fault ? 'rgb(var(--signal-text))' : 'rgb(var(--ink-2))'} fontWeight={fault ? 700 : 400}>
          L-0005
        </text>
        <Box x={286} y={190} w={92} label={t.olt} sub={fault ? '—' : 'up'} dim={fault} alert={fault} />
        <Box x={424} y={190} w={92} label="OLT MG 07" sub="up" />
        <Wire id="o6-k" d="M332 220 V246" live={!fault} />
        <Wire id="o7-k" d="M470 220 V246" />
        <Clients x={308} y={252} n={30} count={fmt(AFFECTED, lang)} dim={fault} label={t.clients} />
        <Clients x={446} y={252} n={24} count={fmt(980, lang)} label={t.clients} />

        {/* Carimbo (título da prancha) com o estado atual */}
        <g transform="translate(258 336)">
          <rect x="0" y="0" width="292" height="52" fill="rgb(var(--panel))" stroke="rgb(var(--ink))" strokeWidth="1.5" />
          <line x1="0" y1="20" x2="292" y2="20" stroke="rgb(var(--ink))" />
          <line x1="172" y1="20" x2="172" y2="52" stroke="rgb(var(--ink))" />
          <text x="8" y="14" fontSize="9.5" fontFamily="IBM Plex Mono, monospace" fontWeight="600" fill={fault ? 'rgb(var(--signal-text))' : 'rgb(var(--ok))'}>
            {fault ? `● ${t.fault}` : `● ${t.ok}`}
          </text>
          <text x="8" y="42" fontSize="17" fontFamily="Archivo, sans-serif" fontWeight="800" fill="rgb(var(--ink))">
            {fault ? fmt(AFFECTED, lang) : '0'}
          </text>
          <text x="60" y="42" fontSize="9" fontFamily="IBM Plex Mono, monospace" fill="rgb(var(--ink-2))">
            {t.affected}
          </text>
          <text x="180" y="33" fontSize="9" fontFamily="IBM Plex Mono, monospace" fill="rgb(var(--ink-2))">
            {t.origin}
          </text>
          <text x="180" y="45" fontSize="9.5" fontFamily="IBM Plex Mono, monospace" fontWeight="600" fill="rgb(var(--ink))">
            {fault ? 'L-0005 · MET-MG-01' : '—'}
          </text>
        </g>
      </svg>
      <button
        type="button"
        onClick={() => setPaused((p) => !p)}
        className="absolute bottom-3 left-3 inline-flex min-h-11 items-center gap-2 border border-ink/40 bg-panel px-3 font-mono text-[0.75rem] uppercase tracking-wider text-ink hover:border-ink"
        aria-pressed={paused}
      >
        {paused ? <Play size={14} aria-hidden /> : <Pause size={14} aria-hidden />} {paused ? t.play : t.pause}
      </button>
    </figure>
  )
}
