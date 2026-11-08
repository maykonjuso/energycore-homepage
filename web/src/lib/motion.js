// Animações com GSAP + ScrollTrigger (técnicas da skill epic-design: revelação em sequência, parallax por
// profundidade, palavras que acendem com a rolagem, contadores). Tudo desliga com "reduzir movimento".
import { useEffect, useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export const reducedMotion = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
export const coarse = () => typeof window !== 'undefined' && window.matchMedia?.('(pointer: coarse)').matches

const useIso = typeof window !== 'undefined' ? useLayoutEffect : useEffect

// Liga as animações de uma seção. `setup(gsap, ScrollTrigger)` roda num contexto que é limpo ao desmontar.
export function useMotion(ref, setup, deps = []) {
  useIso(() => {
    if (!ref.current || reducedMotion()) return undefined
    const ctx = gsap.context(() => setup(gsap, ScrollTrigger), ref)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

// Revela os [data-reveal] da seção em sequência quando entram na tela.
export function revealIn(root) {
  const items = gsap.utils.toArray(root.querySelectorAll('[data-reveal]'))
  ScrollTrigger.batch(items, {
    start: 'top 88%',
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.08, clearProps: 'transform,will-change', overwrite: true }),
  })
}

// Parallax por profundidade: data-depth 0..5 anda 0,1x..1,2x da rolagem (só transform).
const DEPTH_SPEED = { 0: 0.1, 1: 0.25, 2: 0.5, 3: 0.8, 4: 1, 5: 1.2 }
export function parallax(root, section) {
  if (coarse()) return
  root.querySelectorAll('[data-depth]').forEach((el) => {
    const speed = DEPTH_SPEED[el.dataset.depth] ?? 1
    if (speed === 1) return
    gsap.to(el, { yPercent: (1 - speed) * 40, ease: 'none', scrollTrigger: { trigger: section ?? root, start: 'top top', end: 'bottom top', scrub: true } })
  })
}

// Contador que sobe até o valor quando aparece.
export function countUp(el, to, { decimals = 0, duration = 1.6 } = {}) {
  const obj = { v: 0 }
  gsap.to(obj, {
    v: to,
    duration,
    ease: 'power2.out',
    scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    onUpdate: () => (el.textContent = obj.v.toLocaleString('pt-BR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })),
  })
}

export { gsap, ScrollTrigger }
