// Frase do problema: as palavras acendem conforme a rolagem (word-by-word scroll lighting).
import { useRef } from 'react'
import { STATEMENT } from '../data/content.js'
import { useMotion } from '../lib/motion.js'

export default function Statement() {
  const ref = useRef(null)
  useMotion(ref, (gsap, ST) => {
    const words = gsap.utils.toArray('.word-light')
    ST.create({
      trigger: ref.current,
      start: 'top 75%',
      end: 'bottom 45%',
      scrub: true,
      onUpdate: (self) => {
        const n = Math.round(self.progress * words.length)
        words.forEach((w, i) => w.classList.toggle('on', i < n))
      },
    })
  })
  return (
    <section ref={ref} className="page py-28 sm:py-36" aria-label="O problema">
      <p className="mx-auto max-w-[980px] text-center font-display text-[26px] font-bold leading-[1.35] tracking-tight sm:text-[38px]">
        {STATEMENT.split(' ').map((w, i) => (
          <span key={i} className={`word-light ${/segundos\.?$/.test(w) ? 'text-brand' : ''}`}>
            {w}{' '}
          </span>
        ))}
      </p>
    </section>
  )
}
