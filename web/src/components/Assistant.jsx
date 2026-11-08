// Assistente de IA do site: responde só com o conteúdo da EnergyCore e oferece botões que levam à
// demonstração certa (rola até ela e a dispara). Sempre há o caminho para falar com uma pessoa.
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { ArrowUp, Bot, PlayCircle, Sparkles, UserRound, X } from 'lucide-react'
import { DEMO_LABEL, showDemo } from '../lib/site.js'
import { api } from '../lib/env.js'

const SUGGESTIONS = ['Como funciona a simulação de falha?', 'O que o controle de acesso permite?', 'Integra com o Active Directory?', 'Como é a implantação?']
const GREETING = {
  role: 'assistant',
  content: 'Olá! Sou o assistente da EnergyCore. Posso explicar a plataforma e mostrar cada parte funcionando aqui na página. O que você quer saber?',
  demos: [],
  followups: [],
}

const Assistant = forwardRef(function Assistant(_, ref) {
  const [open, setOpen] = useState(false)
  const [teaser, setTeaser] = useState(false)
  const [msgs, setMsgs] = useState([GREETING])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const listRef = useRef(null)
  const inputRef = useRef(null)
  useImperativeHandle(ref, () => ({ open: () => setOpen(true) }))
  // Aviso discreto: uma vez por visita, depois que a pessoa passou do topo, e some sozinho.
  useEffect(() => {
    let shown = false
    try {
      shown = sessionStorage.getItem('ec-teaser') === '1'
    } catch {
      /* sem armazenamento */
    }
    if (shown) return undefined
    let hide
    const onScroll = () => {
      if (window.scrollY < window.innerHeight * 1.5) return
      window.removeEventListener('scroll', onScroll)
      setTeaser(true)
      try {
        sessionStorage.setItem('ec-teaser', '1')
      } catch {
        /* sem armazenamento */
      }
      hide = setTimeout(() => setTeaser(false), 12000)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => (window.removeEventListener('scroll', onScroll), clearTimeout(hide))
  }, [])
  useEffect(() => {
    if (open) {
      setTeaser(false)
      setTimeout(() => inputRef.current?.focus(), 150)
    }
  }, [open])
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [msgs, busy])
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const ask = async (text) => {
    const q = text.trim()
    if (!q || busy) return
    const next = [...msgs, { role: 'user', content: q }]
    setMsgs(next)
    setInput('')
    setBusy(true)
    try {
      const res = await fetch(api('/api/assistant'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next.filter((m) => m !== GREETING).slice(-12).map(({ role, content }) => ({ role, content })) }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(typeof data.detail === 'string' ? data.detail : 'erro')
      setMsgs((m) => [...m, { role: 'assistant', content: data.reply, demos: data.demos ?? [], followups: data.followups ?? [] }])
    } catch (err) {
      setMsgs((m) => [
        ...m,
        { role: 'assistant', content: err.message && err.message !== 'erro' && !err.message.includes('fetch') ? err.message : 'Não consegui responder agora. Você pode falar direto com a equipe pelo contato.', demos: ['contato'], followups: [] },
      ])
    } finally {
      setBusy(false)
    }
  }

  const demo = (id) => {
    showDemo(id)
    if (window.matchMedia('(max-width: 640px)').matches) setOpen(false)
  }

  return (
    <>
      {teaser && !open && (
        <div className="card fixed bottom-24 right-5 z-50 hidden w-[270px] p-4 text-[14px] shadow-2xl sm:block">
          <button className="absolute right-2 top-2 text-faint hover:text-text" onClick={() => setTeaser(false)} aria-label="Fechar aviso">
            <X size={14} />
          </button>
          <p className="pr-4">
            Quer ver uma <b>simulação de falha</b> ou entender o <b>controle de acesso</b>? Pergunte aqui.
          </p>
          <button className="mt-2 font-semibold text-brand-strong hover:underline" onClick={() => setOpen(true)}>
            Abrir o assistente
          </button>
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-5 right-5 z-50 flex h-14 items-center gap-2 rounded-full bg-brandbtn pl-4 pr-5 font-semibold text-white shadow-[0_18px_40px_-12px_rgb(var(--glow))] transition hover:-translate-y-0.5"
        aria-label={open ? 'Fechar o assistente' : 'Abrir o assistente de IA'}
        aria-expanded={open}
      >
        {open ? <X size={20} /> : <Sparkles size={20} />}
        <span className="hidden sm:inline">{open ? 'Fechar' : 'Pergunte à EnergyCore'}</span>
      </button>
      {open && (
        <section
          className="fixed inset-x-3 bottom-24 z-50 flex max-h-[min(640px,calc(100svh-120px))] flex-col overflow-hidden rounded-3xl border border-line bg-surface shadow-2xl sm:inset-x-auto sm:right-5 sm:w-[400px]"
          role="dialog"
          aria-label="Assistente de IA da EnergyCore"
        >
          <header className="flex items-center gap-3 border-b border-line bg-elevated/60 px-4 py-3">
            <span className="grid size-9 place-items-center rounded-full bg-brandbtn text-white">
              <Bot size={18} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-semibold">Assistente EnergyCore</span>
              <span className="block text-[12px] text-faint">Responde com base no conteúdo da EnergyCore</span>
            </span>
            <a href="#contato" onClick={() => setOpen(false)} className="flex items-center gap-1 rounded-lg px-2 py-1 text-[12px] font-medium text-muted hover:text-text" title="Falar com uma pessoa">
              <UserRound size={14} /> Pessoa
            </a>
          </header>
          <div ref={listRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-4" aria-live="polite">
            {msgs.map((m, i) =>
              m.role === 'user' ? (
                <p key={i} className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-brandbtn px-3.5 py-2 text-[14px] text-white">
                  {m.content}
                </p>
              ) : (
                <div key={i} className="max-w-[92%] space-y-2">
                  <p className="rounded-2xl rounded-tl-md bg-elevated px-3.5 py-2.5 text-[14px] leading-relaxed">{m.content}</p>
                  {m.demos?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {m.demos.map((d) => (
                        <button key={d} onClick={() => demo(d)} className="flex items-center gap-1.5 rounded-full border border-brand/40 bg-brand/10 px-3 py-1.5 text-[13px] font-medium text-brand-strong hover:bg-brand/20">
                          <PlayCircle size={14} /> {DEMO_LABEL[d] ?? d}
                        </button>
                      ))}
                    </div>
                  )}
                  {m.followups?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {m.followups.map((f) => (
                        <button key={f} onClick={() => ask(f)} className="rounded-full border border-line px-3 py-1.5 text-left text-[13px] text-muted hover:border-brand/40 hover:text-text">
                          {f}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ),
            )}
            {msgs.length === 1 && (
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTIONS.map((s) => (
                  <button key={s} onClick={() => ask(s)} className="rounded-full border border-line px-3 py-1.5 text-left text-[13px] text-muted hover:border-brand/40 hover:text-text">
                    {s}
                  </button>
                ))}
              </div>
            )}
            {busy && (
              <div className="flex items-center gap-1.5 px-1" aria-label="Pensando">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="size-1.5 animate-bounce rounded-full bg-faint" style={{ animationDelay: `${i * 120}ms` }} />
                ))}
              </div>
            )}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              ask(input)
            }}
            className="flex items-center gap-2 border-t border-line p-3"
          >
            <label className="sr-only" htmlFor="assistente-pergunta">
              Sua pergunta
            </label>
            <input
              id="assistente-pergunta"
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={600}
              placeholder="Pergunte sobre a plataforma…"
              className="h-11 min-w-0 flex-1 rounded-xl border border-line bg-bg px-3 text-[14px] outline-none focus:border-brand"
            />
            <button className="grid size-11 shrink-0 place-items-center rounded-xl bg-brandbtn text-white disabled:opacity-40" disabled={!input.trim() || busy} aria-label="Enviar pergunta">
              <ArrowUp size={18} />
            </button>
          </form>
          <p className="px-4 pb-3 text-[11px] text-faint">IA pode errar. Para proposta e detalhes do seu cenário, fale com a equipe.</p>
        </section>
      )}
    </>
  )
})

export default Assistant
