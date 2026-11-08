// Demo do agente de IA: uma conversa encenada (digitando…, resposta com fontes e o cartão de causa raiz).
import { useCallback, useEffect, useRef, useState } from 'react'
import { Bot, Database, MessageCircle, Play, User } from 'lucide-react'
import { reducedMotion } from '../lib/motion.js'
import { useDemoEvent } from '../lib/site.js'

const QUESTION = 'Por que os clientes de São Paulo estão com lentidão desde as 9h?'
const ANSWER =
  'A causa raiz provável é o enlace L-0005, entre Metro SP 01 e OLT São Paulo 01: os erros de interface subiram às 09:10 UTC. Cinco minutos depois a perda de pacotes da OLT passou de 0,2% para 6,8%, e às 09:20 os clientes ligados a ela começaram a ter latência alta. Confiança alta.'
const SOURCES = ['energycore_find_root_cause', 'energycore_get_node_health', 'energycore_trace_lineage']

export default function DemoAgent({ onAsk }) {
  const ref = useRef(null)
  const [phase, setPhase] = useState(0) // 0 nada, 1 pergunta, 2 digitando, 3 resposta
  const [typed, setTyped] = useState('')
  const timers = useRef([])
  const play = useCallback(() => {
    timers.current.forEach(clearTimeout)
    clearInterval(timers.current.iv)
    if (reducedMotion()) {
      setPhase(3)
      setTyped(ANSWER)
      return
    }
    setPhase(1)
    setTyped('')
    timers.current = [setTimeout(() => setPhase(2), 700), setTimeout(() => {
      setPhase(3)
      let i = 0
      timers.current.iv = setInterval(() => {
        i += 4
        setTyped(ANSWER.slice(0, i))
        if (i >= ANSWER.length) clearInterval(timers.current.iv)
      }, 22)
    }, 2100)]
  }, [])
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (play(), io.disconnect()), { threshold: 0.4 })
    io.observe(ref.current)
    return () => {
      io.disconnect()
      timers.current.forEach(clearTimeout)
      clearInterval(timers.current.iv)
    }
  }, [play])
  useDemoEvent(useCallback((id) => id === 'agente' && setTimeout(play, 600), [play]))
  return (
    <div ref={ref} className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="card flex min-h-[380px] flex-col p-5 sm:p-6">
        <div className="flex items-center justify-between border-b border-line pb-3">
          <span className="flex items-center gap-2 font-semibold">
            <Bot size={18} className="text-brand" /> Chat do agente
          </span>
          <button className="btn-ghost h-9 px-3 text-[13px]" onClick={play}>
            <Play size={14} /> Repetir
          </button>
        </div>
        <div className="flex-1 space-y-4 py-5">
          {phase >= 1 && (
            <div className="flex justify-end gap-2">
              <p className="max-w-[80%] rounded-2xl rounded-br-md bg-brandbtn px-4 py-2.5 text-[15px] text-white">{QUESTION}</p>
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-elevated text-muted" aria-hidden>
                <User size={15} />
              </span>
            </div>
          )}
          {phase === 2 && (
            <div className="flex items-center gap-2 text-[13px] text-faint">
              <span className="grid size-8 place-items-center rounded-full bg-brand/15 text-brand" aria-hidden>
                <Bot size={15} />
              </span>
              <span className="flex gap-1" aria-label="Consultando os dados">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="size-1.5 animate-bounce rounded-full bg-faint" style={{ animationDelay: `${i * 120}ms` }} />
                ))}
              </span>
              consultando causa raiz, saúde e linhagem…
            </div>
          )}
          {phase === 3 && (
            <div className="flex gap-2">
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-brand/15 text-brand" aria-hidden>
                <Bot size={15} />
              </span>
              <div className="max-w-[88%] space-y-2">
                <p className="rounded-2xl rounded-tl-md bg-elevated px-4 py-2.5 text-[15px] leading-relaxed">{typed}</p>
                {typed.length >= ANSWER.length && (
                  <div className="flex flex-wrap gap-1.5">
                    {SOURCES.map((s) => (
                      <span key={s} className="flex items-center gap-1 rounded-md border border-line px-2 py-0.5 font-mono text-[11px] text-faint">
                        <Database size={11} /> {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <p className="text-[12px] text-faint">Encenação com a rede simulada. Na plataforma, o agente só usa os dados que a pessoa pode ver.</p>
      </div>
      <div className="card flex flex-col justify-between gap-5 p-6">
        <div>
          <h3 className="font-display text-[22px] font-bold">Pergunte em português.</h3>
          <p className="mt-2 text-[15px] leading-relaxed text-muted">
            O agente consulta topologia, saúde, linhagem, simulação de falha, causa raiz e relatórios por ferramentas, e cada número vem com a fonte. Também funciona como servidor MCP para outros clientes de IA.
          </p>
        </div>
        <button className="btn-primary" onClick={onAsk}>
          <MessageCircle size={17} /> Perguntar ao assistente
        </button>
      </div>
    </div>
  )
}
