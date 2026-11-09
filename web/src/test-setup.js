// Testes em português (o navegador do jsdom diz inglês e o localStorage pode não existir).
Object.defineProperty(navigator, 'language', { value: 'pt-BR', configurable: true })
try {
  localStorage.setItem('ec-site-lang', 'pt')
} catch {
  /* sem armazenamento */
}
import '@testing-library/jest-dom/vitest'
window.matchMedia ??= (q) => ({ matches: false, media: q, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} })
globalThis.IntersectionObserver ??= class { observe() {} unobserve() {} disconnect() {} }
globalThis.ResizeObserver ??= class { observe() {} unobserve() {} disconnect() {} }
window.scrollTo ??= () => {}
Element.prototype.scrollIntoView ??= function () {}
Element.prototype.scrollTo ??= function () {}
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
afterEach(() => cleanup())
