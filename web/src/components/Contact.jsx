// § 08 · Contato: envia pelo servidor (com confirmação para a pessoa). No site estático (GitHub Pages),
// abre o e-mail de quem escreve já preenchido. Proteção contra robôs: campo escondido e tempo mínimo. LGPD.
import { useRef, useState } from 'react'
import { ArrowRight, Check } from 'lucide-react'
import { EMAIL, useContent } from '../data/content.js'
import { STATIC, api } from '../lib/env.js'
import { useLang } from '../lib/i18n.js'
import { useReveal } from '../lib/reveal.js'
import { useDemoEvent } from '../lib/site.js'
import SecHead from './SecHead.jsx'

const EMPTY = { name: '', email: '', company: '', role: '', phone: '', topic: 'demonstracao', message: '', consent: false, website: '' }

function mailto(f, t) {
  const topic = t.topics.find(([v]) => v === f.topic)?.[1] ?? f.topic
  const L = t.bodyLabels
  const extra = [[L.company, f.company], [L.role, f.role], [L.phone, f.phone]].filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`)
  const body = [f.message, '', `${L.name}: ${f.name}`, `${L.email}: ${f.email}`, ...extra].join('\n')
  return `mailto:${EMAIL}?subject=${encodeURIComponent(t.subject(topic, f.company || f.name))}&body=${encodeURIComponent(body)}`
}

function Field({ label, required, req, children, wide }) {
  return (
    <label className={`block ${wide ? 'sm:col-span-2' : ''}`}>
      <span className="label flex gap-1.5">
        {label}
        {required && (
          <span className="text-signal-text" aria-hidden>
            *
          </span>
        )}
        {required && <span className="sr-only">({req})</span>}
      </span>
      {children}
    </label>
  )
}

export default function Contact() {
  const t = useContent().contact
  const lang = useLang()
  const ref = useRef(null)
  useReveal(ref)
  const opened = useRef(Date.now())
  const [f, setF] = useState(EMPTY)
  const [state, setState] = useState('idle')
  const [error, setError] = useState('')
  useDemoEvent((id) => id === 'contato' && setTimeout(() => ref.current?.querySelector('input[name=name]')?.focus({ preventScroll: true }), 800))
  const set = (k) => (e) => setF({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value })
  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (STATIC) {
      window.location.href = mailto(f, t)
      setState('sent')
      return
    }
    setState('sending')
    try {
      const res = await fetch(api('/api/contact'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...f, lang, elapsed_ms: Date.now() - opened.current }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(typeof body.detail === 'string' ? body.detail : t.errorGeneric)
      }
      setState('sent')
    } catch (err) {
      setState('error')
      setError(err.message === 'Failed to fetch' ? t.errorOffline(EMAIL) : err.message)
    }
  }
  const first = f.name.split(' ')[0]
  return (
    <section ref={ref} id="contato" aria-labelledby="contato-titulo" className="border-t-[1.5px] border-ink bg-paper-2 py-20 sm:py-28">
      <div className="sheet">
        <SecHead id="contato-titulo" no={t.no} coord={t.coord} title={t.title} lead={t.lead} />
        <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_1.6fr]">
          <div className="space-y-6 border-t-[1.5px] border-ink pt-6" data-reveal>
            <div>
              <p className="label">{t.emailLabel}</p>
              <p className="mt-1 text-[1.125rem] font-semibold">
                <a href={`mailto:${EMAIL}`} className="break-all underline decoration-signal decoration-2 underline-offset-4 hover:text-signal-text">
                  {EMAIL}
                </a>
              </p>
            </div>
            {[t.reply, t.privacy].map((x) => (
              <div key={x} className="flex items-center gap-2.5 text-[0.9375rem]">
                <span className="grid size-4 place-items-center bg-ink text-paper" aria-hidden>
                  <Check size={11} strokeWidth={3} />
                </span>
                {x}
              </div>
            ))}
          </div>
          <div className="border-[1.5px] border-ink bg-panel p-6 sm:p-8" data-reveal="100">
            {state === 'sent' ? (
              <div className="flex min-h-[24rem] flex-col items-start justify-center" role="status">
                <span className="grid size-12 place-items-center bg-signal text-ink" aria-hidden>
                  <Check size={26} strokeWidth={3} />
                </span>
                <h3 className="mt-5 text-[1.75rem] font-bold" style={{ fontStretch: '108%' }}>
                  {STATIC ? t.sentStaticTitle : t.sentTitle}
                </h3>
                <p className="mt-2 max-w-md text-ink-2">
                  {STATIC ? (
                    <>
                      {t.sentStatic(first)}{' '}
                      <a className="font-semibold underline underline-offset-4" href={`mailto:${EMAIL}`}>
                        {EMAIL}
                      </a>
                      .
                    </>
                  ) : (
                    t.sent(first, f.email)
                  )}
                </p>
                <button type="button" className="btn-line mt-6" onClick={() => (setF(EMPTY), setState('idle'), (opened.current = Date.now()))}>
                  {t.again}
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                <Field label={t.fields.name} required req={t.required}>
                  <input name="name" required minLength={3} maxLength={120} autoComplete="name" value={f.name} onChange={set('name')} className="field" />
                </Field>
                <Field label={t.fields.email} required req={t.required}>
                  <input name="email" type="email" required autoComplete="email" value={f.email} onChange={set('email')} className="field" />
                </Field>
                <Field label={t.fields.company} required req={t.required}>
                  <input name="company" required minLength={2} maxLength={120} autoComplete="organization" value={f.company} onChange={set('company')} className="field" />
                </Field>
                <Field label={t.fields.role}>
                  <input name="role" maxLength={80} autoComplete="organization-title" value={f.role} onChange={set('role')} className="field" />
                </Field>
                <Field label={t.fields.phone}>
                  <input name="phone" type="tel" maxLength={30} autoComplete="tel" value={f.phone} onChange={set('phone')} className="field" placeholder={t.phonePh} />
                </Field>
                <Field label={t.fields.topic}>
                  <select name="topic" value={f.topic} onChange={set('topic')} className="field cursor-pointer">
                    {t.topics.map(([v, l]) => (
                      <option key={v} value={v}>
                        {l}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label={t.fields.message} required req={t.required} wide>
                  <textarea name="message" required minLength={10} maxLength={4000} rows={4} value={f.message} onChange={set('message')} className="field min-h-28 py-3" placeholder={t.messagePh} />
                </Field>
                {/* Armadilha para robôs: pessoas não veem este campo. */}
                <label className="absolute -left-[9999px]" aria-hidden>
                  Site
                  <input tabIndex={-1} autoComplete="off" value={f.website} onChange={set('website')} />
                </label>
                <label className="flex items-start gap-3 text-[0.9375rem] text-ink-2 sm:col-span-2">
                  <input type="checkbox" required checked={f.consent} onChange={set('consent')} className="mt-1 size-5 shrink-0 accent-[rgb(var(--ink))]" />
                  <span>
                    {t.consent} <span aria-hidden className="text-signal-text">*</span>
                  </span>
                </label>
                {error && (
                  <p className="border-l-[3px] border-crit bg-paper px-4 py-3 text-[0.9375rem] text-crit sm:col-span-2" role="alert">
                    {error}
                  </p>
                )}
                <button type="submit" className="btn-ink sm:col-span-2 sm:justify-self-start" disabled={state === 'sending'}>
                  {state === 'sending' ? t.sending : t.send} <ArrowRight size={18} aria-hidden />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
