// Revelação ao rolar, sem biblioteca: só o que está abaixo da tela quando a página abre começa escondido,
// e aparece ao entrar na tela. Com animações desligadas (ou sem JS) tudo já aparece.
import { useEffect } from 'react'
import { motionOff } from './a11y.js'

export function useReveal(ref) {
  useEffect(() => {
    const root = ref.current
    if (!root || motionOff() || typeof IntersectionObserver === 'undefined') return undefined
    const items = [...root.querySelectorAll('[data-reveal]')]
    const below = items.filter((el) => el.getBoundingClientRect().top > window.innerHeight * 0.92)
    below.forEach((el) => el.classList.add('is-pre'))
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          const el = e.target
          const delay = Number(el.dataset.reveal || 0)
          setTimeout(() => el.classList.remove('is-pre'), delay)
          io.unobserve(el)
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    )
    below.forEach((el) => io.observe(el))
    return () => {
      io.disconnect()
      items.forEach((el) => el.classList.remove('is-pre'))
    }
  }, [ref])
}
