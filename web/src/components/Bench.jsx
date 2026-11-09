// § 03 · Bancada de testes: quatro demonstrações em abas (falha, causa raiz, acesso e agente).
import { useCallback, useRef, useState } from 'react'
import { useContent } from '../data/content.js'
import { useReveal } from '../lib/reveal.js'
import { useDemoEvent } from '../lib/site.js'
import { tabKeys } from '../lib/tabs.js'
import DemoAccess from '../demos/DemoAccess.jsx'
import DemoAgent from '../demos/DemoAgent.jsx'
import DemoNetwork from '../demos/DemoNetwork.jsx'
import DemoRCA from '../demos/DemoRCA.jsx'
import SecHead from './SecHead.jsx'

const MAP = { topologia: 'falha', falha: 'falha', 'causa-raiz': 'causa-raiz', acessos: 'acessos', agente: 'agente' }

export default function Bench({ onAsk }) {
  const t = useContent().bench
  const ref = useRef(null)
  useReveal(ref)
  const ids = Object.keys(t.tabs)
  const [tab, setTab] = useState(ids[0])
  useDemoEvent(useCallback((id) => MAP[id] && setTab(MAP[id]), []))
  return (
    <section ref={ref} id="bancada" aria-labelledby="bancada-titulo" className="border-t-[1.5px] border-ink py-20 sm:py-28">
      <div className="sheet">
        <SecHead id="bancada-titulo" no={t.no} coord={t.coord} title={t.title} lead={t.lead} />
        <div role="tablist" aria-label={t.tablist} className="mt-12 flex flex-wrap border-b-[1.5px] border-ink" onKeyDown={(e) => tabKeys(e, ids, tab, setTab)}>
          {ids.map((id, i) => {
            const on = id === tab
            return (
              <button
                key={id}
                id={`tab-${id}`}
                role="tab"
                aria-selected={on}
                aria-controls={`painel-${id}`}
                tabIndex={on ? 0 : -1}
                onClick={() => setTab(id)}
                className={`-mb-[1.5px] flex min-h-12 items-center gap-2.5 border-[1.5px] px-4 text-[0.9375rem] font-semibold ${on ? 'border-ink border-b-paper bg-paper' : 'border-transparent text-ink-2 hover:text-ink'}`}
              >
                <span className="num font-mono text-[0.75rem]">{String.fromCharCode(65 + i)}</span>
                {t.tabs[id]}
              </button>
            )
          })}
        </div>
        <div id={`painel-${tab}`} role="tabpanel" aria-labelledby={`tab-${tab}`} className="border-x-[1.5px] border-b-[1.5px] border-ink p-4 sm:p-7">
          {tab === 'falha' && <DemoNetwork />}
          {tab === 'causa-raiz' && <DemoRCA />}
          {tab === 'acessos' && <DemoAccess />}
          {tab === 'agente' && <DemoAgent onAsk={onAsk} />}
        </div>
      </div>
    </section>
  )
}
