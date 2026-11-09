// Assistente de IA do site: responde só com o conteúdo da EnergyCore (no idioma escolhido) e oferece botões
// que levam à demonstração certa. Sempre há o caminho para falar com uma pessoa.
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { ArrowUp, MessageSquare, PlayCircle, UserRound, X } from 'lucide-react'
import { useContent } from '../data/content.js'
import { api } from '../lib/env.js'
import { useLang } from '../lib/i18n.js'
import { showDemo } from '../lib/site.js'

const Assistant = forwardRef(function Assistant(_, ref) {
  const c = useContent()
  const t = c.assistant
  const lang = useLang()
  const [open, setOpen] = useState(false)
  const [teaser, setTeaser] = useState(false)
  const [msgs, setMsgs] = useState([])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const listRef = useRef(null)
  const inputRef = useRef(null)
  useImperativeHandle(ref, () => ({ open: () => setOpen(true) }))
  // Aviso discreto: uma vez por visita, depois de passar do topo, e some sozinho.
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
      setTimeout(() => inputRef.current?.focus(), 120)
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
        body: JSON.stringify({ lang, messages: next.slice(-12).map(({ role, content }) => ({ role, content })) }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(typeof data.detail === 'string' ? data.detail : 'erro')
      setMsgs((m) => [...m, { role: 'assistant', content: data.reply, demos: data.demos ?? [], followups: data.followups ?? [] }])
    } catch (err) {
      const msg = err.message && err.message !== 'erro' && !err.message.includes('fetch') ? err.message : t.error
      setMsgs((m) => [...m, { role: 'assistant', content: msg, demos: ['contato'], followups: [] }])
    } finally {
      setBusy(false)
    }
  }
  const demo = (id) => {
    showDemo(id)
    if (window.matchMedia('(max-width: 40rem)').matches) setOpen(false)
  }
  const chip = 'min-h-10 border-[1.5px] border-ink/40 px-3 py-1.5 text-left text-[0.8125rem] hover:border-ink'

  return (
    <>
      {teaser && !open && (
        <aside aria-label={t.title} className="fixed bottom-24 right-5 z-50 hidden w-[17rem] border-[1.5px] border-ink bg-panel p-4 text-[0.875rem] shadow-[5px_5px_0_rgb(var(--ink))] sm:block">
          <button type="button" className="absolute right-1 top-1 grid size-9 place-items-center text-ink-2 hover:text-ink" onClick={() => setTeaser(false)} aria-label={t.teaserClose}>
            <X size={15} aria-hidden />
          </button>
          <p className="pr-6">{t.teaser}</p>
          <button type="button" className="mt-2 min-h-10 font-semibold underline decoration-signal decoration-2 underline-offset-4" onClick={() => setOpen(true)}>
            {t.teaserOpen}
          </button>
        </aside>
      )}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="fixed bottom-5 right-5 z-50 flex min-h-14 items-center gap-2.5 border-[1.5px] border-ink bg-ink px-4 font-semibold text-paper shadow-[5px_5px_0_rgb(var(--signal))] transition-transform hover:-translate-y-0.5"
        aria-label={open ? t.close : t.open}
        aria-expanded={open}
      >
        {open ? <X size={20} aria-hidden /> : <MessageSquare size={20} aria-hidden />}
        <span className="hidden sm:inline">{open ? t.closeShort : t.fab}</span>
      </button>
      {open && (
        <section className="fixed inset-x-3 bottom-24 z-50 flex max-h-[min(40rem,calc(100svh-8rem))] flex-col border-[1.5px] border-ink bg-panel shadow-[6px_6px_0_rgb(var(--ink))] sm:inset-x-auto sm:right-5 sm:w-[25rem]" role="dialog" aria-label={t.title}>
          <header className="flex items-center gap-3 border-b-[1.5px] border-ink px-4 py-3">
            <span className="min-w-0 flex-1">
              <span className="block font-bold">{t.title}</span>
              <span className="block text-[0.75rem] text-ink-2">{t.subtitle}</span>
            </span>
            <a href="#contato" onClick={() => setOpen(false)} className="inline-flex min-h-10 items-center gap-1 px-2 font-mono text-[0.75rem] uppercase tracking-wider hover:text-signal-text" title={t.personTitle}>
              <UserRound size={14} aria-hidden /> {t.person}
            </a>
          </header>
          <div ref={listRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-4" aria-live="polite">
            <p className="max-w-[92%] border-l-[3px] border-signal bg-paper px-3.5 py-2.5 text-[0.875rem] leading-relaxed">{t.greeting}</p>
            {msgs.map((m, i) =>
              m.role === 'user' ? (
                <p key={i} className="ml-auto max-w-[85%] bg-ink px-3.5 py-2 text-[0.875rem] text-paper">
                  {m.content}
                </p>
              ) : (
                <div key={i} className="max-w-[92%] space-y-2">
                  <p className="border-l-[3px] border-signal bg-paper px-3.5 py-2.5 text-[0.875rem] leading-relaxed">{m.content}</p>
                  {m.demos?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {m.demos.map((d) => (
                        <button key={d} type="button" onClick={() => demo(d)} className="inline-flex min-h-10 items-center gap-1.5 border-[1.5px] border-ink bg-ink px-3 text-[0.8125rem] font-medium text-paper hover:bg-signal hover:text-ink">
                          <PlayCircle size={14} aria-hidden /> {c.demoLabel[d] ?? d}
                        </button>
                      ))}
                    </div>
                  )}
                  {m.followups?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {m.followups.map((f) => (
                        <button key={f} type="button" onClick={() => ask(f)} className={chip}>
                          {f}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ),
            )}
            {msgs.length === 0 && (
              <div className="flex flex-wrap gap-1.5">
                {t.suggestions.map((s) => (
                  <button key={s} type="button" onClick={() => ask(s)} className={chip}>
                    {s}
                  </button>
                ))}
              </div>
            )}
            {busy && (
              <p className="flex items-center gap-2 font-mono text-[0.75rem] text-ink-2" aria-label={t.thinking}>
                <span className="inline-block size-2 animate-pulse bg-signal" aria-hidden /> {t.thinking}…
              </p>
            )}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              ask(input)
            }}
            className="flex items-center gap-2 border-t-[1.5px] border-ink p-3"
          >
            <label className="sr-only" htmlFor="assistente-pergunta">
              {t.input}
            </label>
            <input id="assistente-pergunta" ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} maxLength={600} placeholder={t.placeholder} className="field min-h-11 min-w-0 flex-1 text-[0.875rem]" />
            <button type="submit" className="grid size-11 shrink-0 place-items-center bg-ink text-paper disabled:opacity-40" disabled={!input.trim() || busy} aria-label={t.send}>
              <ArrowUp size={18} aria-hidden />
            </button>
          </form>
          <p className="px-4 pb-3 text-[0.75rem] text-ink-2">{t.disclaimer}</p>
        </section>
      )}
    </>
  )
})

export default Assistant
