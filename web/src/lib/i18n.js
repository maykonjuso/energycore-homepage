// Idioma do site (pt | en): escolha guardada, senão o idioma do navegador. Atualiza o lang do <html>.
import { useSyncExternalStore } from 'react'

const KEY = 'ec-site-lang'
const detect = () => {
  try {
    const saved = localStorage.getItem(KEY)
    if (saved === 'pt' || saved === 'en') return saved
  } catch {
    /* sem armazenamento */
  }
  return (navigator.language || 'pt').toLowerCase().startsWith('pt') ? 'pt' : 'en'
}

let lang = typeof window === 'undefined' ? 'pt' : detect()
const listeners = new Set()

export function setLang(next) {
  lang = next === 'en' ? 'en' : 'pt'
  try {
    localStorage.setItem(KEY, lang)
  } catch {
    /* sem armazenamento */
  }
  document.documentElement.lang = lang === 'en' ? 'en' : 'pt-BR'
  listeners.forEach((fn) => fn())
}

export const getLang = () => lang
export const useLang = () => useSyncExternalStore((fn) => (listeners.add(fn), () => listeners.delete(fn)), () => lang, () => 'pt')
export const fmt = (n, l = lang) => n.toLocaleString(l === 'en' ? 'en-US' : 'pt-BR')
