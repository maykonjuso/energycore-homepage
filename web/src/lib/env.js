// Onde o site está publicado e se há servidor (contato + assistente).
// No GitHub Pages o site é estático: sem VITE_API_URL, o contato abre o e-mail e o assistente some.
export const BASE = import.meta.env.BASE_URL // termina com "/"
export const API = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '')
export const STATIC = import.meta.env.VITE_STATIC === '1' && !API

export const asset = (path) => `${BASE}${path.replace(/^\//, '')}`
export const api = (path) => `${API}${path}`
