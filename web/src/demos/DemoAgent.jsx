// Demo do agente de IA: conversa encenada (pergunta, consultando…, resposta com as fontes).
import { useCallback, useEffect, useRef, useState } from 'react'
import { MessageCircle, Play } from 'lucide-react'
import { useContent } from '../data/content.js'
import { motionOff } from '../lib/a11y.js'
import { useDemoEvent } from '../lib/site.js'

const SOURCES = ['energycore_find_root_cause', 'energycore_get_node_health', 'energycore_trace_lineage']

export default function DemoAgent({ onAsk }) {
  const t = useContent().agent
  const [phase, setPhase] = useState(0) // 0 nada · 1 pergunta · 2 consultando · 3 resposta
  const [typed, setTyped] = useState('')
  const timers = useRef({ list: [], iv: null })
  const play = useCallback(() => {
    timers.current.list.forEach(clearTimeout)
    clearInterval(timers.current.iv)
    if (motionOff()) {
      setPhase(3)
      setTyped(t.answer)
      return
    }
    setPhase(1)
    setTyped('')
    timers.current.list = [
      setTimeout(() => setPhase(2), 600),
      setTimeout(() => {
        setPhase(3)
        let i = 0
        timers.current.iv = setInterval(() => {
          i += 5
          setTyped(t.answer.slice(0, i))
          if (i >= t.answer.length) clearInterval(timers.current.iv)
        }, 20)
      }, 1900),
    ]
  }, [t.answer])
  useEffect(() => {
    play()
    const cur = timers.current
    return () => (cur.list.forEach(clearTimeout), clearInterval(cur.iv))
  }, [play])
  useDemoEvent(useCallback((id) => id === 'agente' && setTimeout(play, 500), [play]))
  const complete = typed.length >= t.answer.length
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
      <div className="flex min-h-[22rem] flex-col border-[1.5px] border-ink">
        <div className="flex items-center justify-between border-b-[1.5px] border-ink px-4 py-2">
          <span className="label !text-ink">{t.chat}</span>
          <button type="button" className="inline-flex min-h-11 items-center gap-2 px-2 font-mono text-[0.75rem] uppercase tracking-wider hover:text-signal-text" onClick={play}>
            <Play size={14} aria-hidden /> {t.replay}
          </button>
        </div>
        <div className="flex-1 space-y-4 p-4 sm:p-5">
          {phase >= 1 && <p className="ml-auto max-w-[85%] bg-ink px-4 py-3 text-[0.9375rem] text-paper">{t.question}</p>}
          {phase === 2 && (
            <p className="flex items-center gap-2 font-mono text-[0.8125rem] text-ink-2" aria-label={t.thinkingAria}>
              <span className="inline-block size-2 animate-pulse bg-signal" aria-hidden /> {t.thinking}
            </p>
          )}
          {phase === 3 && (
            <div className="max-w-[92%]">
              <p className="border-l-[3px] border-signal bg-panel px-4 py-3 text-[0.9375rem] leading-relaxed">{typed}</p>
              {complete && (
                <ul className="mt-2 flex flex-wrap gap-1.5">
                  {SOURCES.map((s) => (
                    <li key={s} className="border border-ink/40 px-2 py-0.5 font-mono text-[0.6875rem] text-ink-2">
                      {s}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
        <p className="border-t border-ink/20 px-4 py-3 text-[0.8125rem] text-ink-2">{t.note}</p>
      </div>
      <div className="flex flex-col justify-between gap-5 bg-ink p-5 text-paper">
        <div>
          <h3 className="text-[1.375rem] font-bold" style={{ fontStretch: '106%' }}>
            {t.sideTitle}
          </h3>
          <p className="mt-2 text-[0.9375rem] leading-relaxed text-paper/85">{t.side}</p>
        </div>
        {onAsk ? (
          <button type="button" className="btn bg-paper text-ink hover:shadow-[4px_4px_0_rgb(var(--signal))]" onClick={onAsk}>
            <MessageCircle size={17} aria-hidden /> {t.ask}
          </button>
        ) : (
          <a className="btn bg-paper text-ink hover:shadow-[4px_4px_0_rgb(var(--signal))]" href="#contato">
            <MessageCircle size={17} aria-hidden /> {t.talk}
          </a>
        )}
      </div>
    </div>
  )
}
