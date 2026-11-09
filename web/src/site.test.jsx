import { describe, expect, it, vi, beforeEach } from 'vitest'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import DemoNetwork from './demos/DemoNetwork.jsx'
import DemoAccess from './demos/DemoAccess.jsx'
import Assistant from './components/Assistant.jsx'
import Contact from './components/Contact.jsx'
import { act } from 'react'
import { CONTENT } from './data/content.js'
import { DEMO_TARGET } from './lib/site.js'
import { setLang } from './lib/i18n.js'
import Hero from './components/Hero.jsx'

const DEMO_LABEL = CONTENT.pt.demoLabel

beforeEach(() => vi.restoreAllMocks())

describe('demo da rede', () => {
  it('falha no Metro MG 01 isola a eNodeB MG e degrada a OLT MG 06', () => {
    render(<DemoNetwork />)
    fireEvent.click(screen.getByRole('button', { name: /Metro MG 01: clique para simular/ }))
    expect(screen.getByText('720', { selector: 'div.num' })).toBeInTheDocument() // clientes da eNodeB MG
    expect(screen.getByText(/OLT MG 06/, { selector: 'p' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Restaurar' }))
    expect(screen.getByText(/Clique num nó/)).toBeInTheDocument()
  })
  it('nó acessível por teclado', () => {
    render(<DemoNetwork />)
    const node = screen.getByRole('button', { name: /Núcleo 1: clique/ })
    fireEvent.keyDown(node, { key: 'Enter' })
    expect(screen.getByRole('button', { name: /Núcleo 1: em falha/ })).toBeInTheDocument()
  })
})

describe('demo de acesso', () => {
  it('trocar o perfil muda o que acende', () => {
    render(<DemoAccess />)
    fireEvent.click(screen.getByRole('radio', { name: /Administrador/ }))
    expect(screen.getByText(/O que Administrador enxerga/)).toBeInTheDocument()
  })
})

describe('assistente', () => {
  it('mostra a resposta e o botão da demonstração sugerida', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({ ok: true, json: async () => ({ reply: 'A simulação mostra os isolados.', demos: ['falha'], followups: ['E a causa raiz?'] }) })
    render(<Assistant />)
    fireEvent.click(screen.getByRole('button', { name: 'Abrir o assistente de IA' }))
    fireEvent.change(screen.getByLabelText('Sua pergunta'), { target: { value: 'Como simular falha?' } })
    fireEvent.click(screen.getByRole('button', { name: 'Enviar pergunta' }))
    expect(await screen.findByText('A simulação mostra os isolados.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: DEMO_LABEL.falha })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'E a causa raiz?' })).toBeInTheDocument()
    const body = JSON.parse(fetch.mock.calls[0][1].body)
    expect(body.messages.at(-1)).toEqual({ role: 'user', content: 'Como simular falha?' })
  })
  it('sem servidor, oferece falar com a equipe', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new TypeError('Failed to fetch'))
    render(<Assistant />)
    fireEvent.click(screen.getByRole('button', { name: 'Abrir o assistente de IA' }))
    fireEvent.click(screen.getByRole('button', { name: /Como é a implantação/ }))
    expect(await screen.findByText(/fale direto com a equipe|falar direto com a equipe/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: DEMO_LABEL.contato })).toBeInTheDocument()
  })
})

describe('contato', () => {
  it('envia e mostra a confirmação', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({ ok: true, json: async () => ({ ok: true }) })
    const { container } = render(<Contact />)
    const form = container.querySelector('form')
    fireEvent.change(form.querySelector('input[name=name]'), { target: { value: 'Ana Souza' } })
    fireEvent.change(form.querySelector('input[name=email]'), { target: { value: 'ana@x.com' } })
    fireEvent.change(form.querySelector('input[name=company]'), { target: { value: 'X' } })
    fireEvent.change(form.querySelector('textarea'), { target: { value: 'Quero uma demonstração.' } })
    fireEvent.click(within(form).getByRole('checkbox'))
    fireEvent.submit(form)
    await waitFor(() => expect(screen.getByText('Mensagem enviada.')).toBeInTheDocument())
    const body = JSON.parse(fetch.mock.calls[0][1].body)
    expect(body).toMatchObject({ name: 'Ana Souza', consent: true, website: '' })
    expect(body.elapsed_ms).toBeGreaterThanOrEqual(0)
  })
})

describe('conteúdo', () => {
  it('toda demo pedida pelo assistente tem destino e rótulo nos dois idiomas', () => {
    const ids = ['monitoramento', 'alarmes', 'topologia', 'falha', 'causa-raiz', 'tendencias', 'agente', 'acessos', 'implantacao', 'contato']
    for (const id of ids) {
      expect(DEMO_TARGET[id]).toBeTruthy()
      expect(CONTENT.pt.demoLabel[id]).toBeTruthy()
      expect(CONTENT.en.demoLabel[id]).toBeTruthy()
    }
    expect(CONTENT.pt.platform.modules.length).toBe(6)
    expect(CONTENT.pt.faq.items.every(([q]) => q.endsWith('?'))).toBe(true)
  })

  it('português e inglês têm exatamente as mesmas chaves e listas', () => {
    const shape = (v) =>
      Array.isArray(v) ? v.map(shape) : typeof v === 'function' ? 'fn' : v && typeof v === 'object' ? Object.fromEntries(Object.keys(v).sort().map((k) => [k, shape(v[k])])) : typeof v
    expect(shape(CONTENT.en)).toEqual(shape(CONTENT.pt))
  })
})

describe('idioma', () => {
  it('trocar para inglês muda os textos e o lang da página', () => {
    render(<Hero />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Do disjuntor')
    act(() => setLang('en'))
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('From the breaker')
    expect(document.documentElement.lang).toBe('en')
    act(() => setLang('pt'))
  })
})
