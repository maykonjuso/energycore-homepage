// Acessibilidade do site: tamanho do texto (até 200%), alto contraste, animações e VLibras.
import { useSyncExternalStore } from 'react'

const KEY = 'ec-site-a11y'
export const STEPS = [100, 112.5, 125, 150, 175, 200]
const DEFAULTS = { text: 100, contrast: false, motion: true, vlibras: false }
const read = () => {
  try {
    return { ...DEFAULTS, ...(JSON.parse(localStorage.getItem(KEY) || '{}') || {}) }
  } catch {
    return { ...DEFAULTS }
  }
}
let state = typeof window === 'undefined' ? DEFAULTS : read()
const listeners = new Set()
const systemReduce = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

export function apply(a = state) {
  if (typeof document === 'undefined') return
  const el = document.documentElement
  el.style.fontSize = a.text === 100 ? '' : `${a.text}%`
  // Texto ampliado: o menu de seções vira o botão de menu (cabe na barra sem rolagem lateral).
  if (a.text >= 125) el.dataset.large = 'on'
  else delete el.dataset.large
  if (a.contrast) el.dataset.contrast = 'high'
  else delete el.dataset.contrast
  el.dataset.motion = a.motion === false || systemReduce() ? 'off' : 'on'
  vlibras(a.vlibras)
}

export function setA11y(patch) {
  state = { ...state, ...patch }
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    /* sem armazenamento */
  }
  apply(state)
  listeners.forEach((fn) => fn())
}
export const resetA11y = () => setA11y({ ...DEFAULTS })
export const useA11y = () => [useSyncExternalStore((fn) => (listeners.add(fn), () => listeners.delete(fn)), () => state, () => DEFAULTS), setA11y]
export const motionOff = () => typeof document !== 'undefined' && document.documentElement.dataset.motion === 'off'

export function step(dir) {
  const i = Math.max(0, STEPS.indexOf(state.text))
  setA11y({ text: STEPS[Math.min(STEPS.length - 1, Math.max(0, i + dir))] })
}

// VLibras (tradutor de Libras do governo federal), carregado só quando pedido.
function vlibras(on) {
  if (typeof document === 'undefined') return
  const wrap = document.getElementById('vlibras-access-wrapper')
  if (!on) {
    if (wrap) wrap.style.display = 'none'
    return
  }
  if (wrap) wrap.style.display = ''
  if (document.getElementById('ec-vlibras')) return
  const s = Object.assign(document.createElement('script'), { id: 'ec-vlibras', src: 'https://vlibras.gov.br/app/vlibras-plugin.js', async: true })
  s.onload = () => {
    try {
      new window.VLibras.Widget('https://vlibras.gov.br/app')
    } catch {
      /* o plugin se inicia sozinho */
    }
  }
  document.body.appendChild(s)
}
export function openVlibras() {
  if (!state.vlibras) setA11y({ vlibras: true })
  const tryOpen = (n = 0) => (window.VLibrasWidget?.open ? window.VLibrasWidget.open() : n < 40 && setTimeout(() => tryOpen(n + 1), 150))
  tryOpen()
}

apply(state)
