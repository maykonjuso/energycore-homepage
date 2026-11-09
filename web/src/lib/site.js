// Tema e "barramento" de demonstrações (o assistente pede uma demo; a seção correspondente reage).
import { useEffect, useState, useSyncExternalStore } from 'react'

const themeListeners = new Set()
const isDark = () => document.documentElement.classList.contains('dark')

export function setTheme(dark) {
  document.documentElement.classList.toggle('dark', dark)
  try {
    localStorage.setItem('ec-site-theme', dark ? 'dark' : 'light')
  } catch {
    /* sem armazenamento */
  }
  themeListeners.forEach((l) => l())
}

export function useTheme() {
  const dark = useSyncExternalStore((l) => (themeListeners.add(l), () => themeListeners.delete(l)), isDark, () => false)
  return [dark, () => setTheme(!dark)]
}

// Para onde rolar em cada demo pedida pelo assistente (a seção reage ao evento e abre a aba certa).
export const DEMO_TARGET = {
  monitoramento: 'plataforma',
  alarmes: 'plataforma',
  tendencias: 'plataforma',
  topologia: 'bancada',
  falha: 'bancada',
  'causa-raiz': 'bancada',
  agente: 'bancada',
  acessos: 'bancada',
  implantacao: 'implantacao',
  contato: 'contato',
}

export function showDemo(id) {
  const target = document.getElementById(DEMO_TARGET[id] ?? id)
  target?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  window.dispatchEvent(new CustomEvent('ec-demo', { detail: id }))
}

export function useDemoEvent(handler) {
  useEffect(() => {
    const on = (e) => handler(e.detail)
    window.addEventListener('ec-demo', on)
    return () => window.removeEventListener('ec-demo', on)
  }, [handler])
}

export function useMediaQuery(q) {
  const [m, setM] = useState(() => typeof window !== 'undefined' && window.matchMedia(q).matches)
  useEffect(() => {
    const mq = window.matchMedia(q)
    const on = () => setM(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [q])
  return m
}
