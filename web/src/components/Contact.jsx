// Contato: envia para contato@energycoreconsulting.com.br pelo servidor (com confirmação para a pessoa).
// Proteção contra robôs: campo escondido e tempo mínimo de preenchimento. Consentimento LGPD obrigatório.
import { useRef, useState } from 'react'
import { CheckCircle2, Clock, Mail, Send, ShieldCheck } from 'lucide-react'
import { FOOTER } from '../data/content.js'
import { revealIn, useMotion } from '../lib/motion.js'
import { useDemoEvent } from '../lib/site.js'

const TOPICS = [
  ['demonstracao', 'Quero uma demonstração'],
  ['proposta', 'Pedir proposta'],
  ['datacenter', 'Datacenter'],
  ['telecom', 'Telecom'],
  ['parceria', 'Parceria'],
  ['outro', 'Outro assunto'],
]
const EMPTY = { name: '', email: '', company: '', role: '', phone: '', topic: 'demonstracao', message: '', consent: false, website: '' }

export default function Contact() {
  const ref = useRef(null)
  const opened = useRef(Date.now())
  const [f, setF] = useState(EMPTY)
  const [state, setState] = useState('idle') // idle | sending | sent | error
  const [error, setError] = useState('')
  useMotion(ref, () => revealIn(ref.current))
  useDemoEvent((id) => id === 'contato' && setTimeout(() => ref.current?.querySelector('input[name=name]')?.focus({ preventScroll: true }), 900))
  const set = (k) => (e) => setF({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value })
  const submit = async (e) => {
    e.preventDefault()
    setState('sending')
    setError('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...f, elapsed_ms: Date.now() - opened.current }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(typeof body.detail === 'string' ? body.detail : 'Confira os campos e tente de novo.')
      }
      setState('sent')
    } catch (err) {
      setState('error')
      setError(err.message === 'Failed to fetch' ? `Não conseguimos enviar agora. Escreva para ${FOOTER.email}.` : err.message)
    }
  }
  return (
    <section id="contato" ref={ref} className="relative overflow-hidden py-24 sm:py-32" aria-labelledby="contato-titulo">
      <div className="grid-bg absolute inset-0 -z-10 opacity-40" aria-hidden />
      <div className="page grid gap-12 lg:grid-cols-[1fr_1.2fr]">
        <div data-reveal>
          <span className="eyebrow">Contato</span>
          <h2 id="contato-titulo" className="h2 mt-4">
            Vamos olhar para a sua operação.
          </h2>
          <p className="lead mt-4">Conte um pouco do cenário. Respondemos em até 1 dia útil com os próximos passos: demonstração, diagnóstico ou proposta.</p>
          <ul className="mt-10 space-y-5">
            {[
              [Mail, 'E-mail', <a key="m" href={`mailto:${FOOTER.email}`} className="hover:text-brand">{FOOTER.email}</a>],
              [Clock, 'Resposta', 'Em até 1 dia útil'],
              [ShieldCheck, 'Privacidade', 'Seus dados são usados só para responder a este contato.'],
            ].map(([Icon, k, v]) => (
              <li key={k} className="flex gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand">
                  <Icon size={18} />
                </span>
                <span>
                  <span className="block text-[13px] text-faint">{k}</span>
                  <span className="block font-medium">{v}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="card p-6 sm:p-8" data-reveal>
          {state === 'sent' ? (
            <div className="flex min-h-[420px] flex-col items-center justify-center text-center" role="status">
              <CheckCircle2 size={48} className="text-ok" />
              <h3 className="mt-4 font-display text-[24px] font-bold">Mensagem enviada.</h3>
              <p className="mt-2 max-w-sm text-muted">Obrigado, {f.name.split(' ')[0]}. Mandamos uma confirmação para {f.email} e respondemos em até 1 dia útil.</p>
              <button className="btn-ghost mt-6" onClick={() => (setF(EMPTY), setState('idle'), (opened.current = Date.now()))}>
                Enviar outra mensagem
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2" noValidate={false}>
              <label className="block space-y-1.5">
                <span className="text-[13px] font-medium text-muted">Nome *</span>
                <input name="name" required minLength={3} maxLength={120} autoComplete="name" value={f.name} onChange={set('name')} className="field" />
              </label>
              <label className="block space-y-1.5">
                <span className="text-[13px] font-medium text-muted">E-mail corporativo *</span>
                <input name="email" type="email" required autoComplete="email" value={f.email} onChange={set('email')} className="field" />
              </label>
              <label className="block space-y-1.5">
                <span className="text-[13px] font-medium text-muted">Empresa *</span>
                <input name="company" required minLength={2} maxLength={120} autoComplete="organization" value={f.company} onChange={set('company')} className="field" />
              </label>
              <label className="block space-y-1.5">
                <span className="text-[13px] font-medium text-muted">Cargo</span>
                <input name="role" maxLength={80} autoComplete="organization-title" value={f.role} onChange={set('role')} className="field" />
              </label>
              <label className="block space-y-1.5">
                <span className="text-[13px] font-medium text-muted">Telefone</span>
                <input name="phone" type="tel" maxLength={30} autoComplete="tel" value={f.phone} onChange={set('phone')} className="field" placeholder="(11) 90000-0000" />
              </label>
              <label className="block space-y-1.5">
                <span className="text-[13px] font-medium text-muted">Assunto</span>
                <select name="topic" value={f.topic} onChange={set('topic')} className="field">
                  {TOPICS.map(([v, l]) => (
                    <option key={v} value={v}>
                      {l}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block space-y-1.5 sm:col-span-2">
                <span className="text-[13px] font-medium text-muted">Mensagem *</span>
                <textarea name="message" required minLength={10} maxLength={4000} rows={5} value={f.message} onChange={set('message')} className="field h-auto py-3" placeholder="Quantos sites, que equipamentos, o que mais incomoda hoje…" />
              </label>
              {/* Armadilha para robôs: pessoas não veem este campo. */}
              <label className="absolute -left-[9999px]" aria-hidden>
                Site
                <input tabIndex={-1} autoComplete="off" value={f.website} onChange={set('website')} />
              </label>
              <label className="flex items-start gap-3 text-[14px] text-muted sm:col-span-2">
                <input type="checkbox" required checked={f.consent} onChange={set('consent')} className="mt-1 size-4 accent-[rgb(var(--brand))]" />
                <span>Autorizo a EnergyCore a usar estes dados para responder ao meu contato, conforme a LGPD. *</span>
              </label>
              {error && (
                <p className="rounded-xl border border-crit/30 bg-crit/10 px-4 py-3 text-[14px] text-crit sm:col-span-2" role="alert">
                  {error}
                </p>
              )}
              <button className="btn-primary sm:col-span-2" disabled={state === 'sending'}>
                {state === 'sending' ? 'Enviando…' : (
                  <>
                    Enviar mensagem <Send size={16} />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
