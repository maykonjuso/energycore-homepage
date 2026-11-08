// Campo de rede animado (canvas): nós em camadas, enlaces e pacotes trafegando; um nó em alerta pulsa.
// Pausa fora da tela e com "reduzir movimento" desenha um quadro só.
import { useEffect, useRef } from 'react'
import { reducedMotion } from '../lib/motion.js'

const css = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim()
const rgba = (v, a) => `rgba(${v.split(' ').join(',')},${a})`

export default function NetworkField({ className = '', density = 1 }) {
  const ref = useRef(null)
  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    let w = 0
    let h = 0
    let nodes = []
    let links = []
    let packets = []
    let raf = 0
    let visible = true
    let t = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let seed = 11
    const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280)

    function build() {
      seed = 11
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      nodes = []
      links = []
      const layers = [
        { n: 3, y: 0.16, r: 6, k: 'core' },
        { n: Math.round(7 * density), y: 0.36, r: 4.5, k: 'metro' },
        { n: Math.round(16 * density), y: 0.58, r: 3.2, k: 'access' },
        { n: Math.round(34 * density), y: 0.82, r: 2, k: 'cpe' },
      ]
      const byLayer = layers.map((L) =>
        Array.from({ length: L.n }, (_, i) => {
          const node = { x: ((i + 0.5) / L.n) * w + (rnd() - 0.5) * (w / L.n) * 0.6, y: L.y * h + (rnd() - 0.5) * h * 0.08, r: L.r, k: L.k, phase: rnd() * 6.28 }
          nodes.push(node)
          return node
        }),
      )
      for (let l = 1; l < byLayer.length; l++)
        byLayer[l].forEach((n) => {
          const parents = [...byLayer[l - 1]].sort((a, b) => Math.abs(a.x - n.x) - Math.abs(b.x - n.x)).slice(0, l < 3 ? 2 : 1)
          parents.forEach((p) => links.push([p, n]))
        })
      byLayer[0].forEach((a, i) => byLayer[0][i + 1] && links.push([a, byLayer[0][i + 1]]))
      packets = Array.from({ length: Math.round(26 * density) }, () => ({ link: links[Math.floor(rnd() * links.length)], p: rnd(), v: 0.003 + rnd() * 0.006 }))
    }

    function draw() {
      const brand = css('--brand')
      const line = css('--faint')
      const warn = css('--warn')
      const crit = css('--crit')
      const ok = css('--ok')
      ctx.clearRect(0, 0, w, h)
      ctx.lineWidth = 1
      for (const [a, b] of links) {
        ctx.strokeStyle = rgba(line, 0.18)
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.stroke()
      }
      for (const pk of packets) {
        const [a, b] = pk.link
        const x = a.x + (b.x - a.x) * pk.p
        const y = a.y + (b.y - a.y) * pk.p
        ctx.fillStyle = rgba(brand, 0.9)
        ctx.beginPath()
        ctx.arc(x, y, 1.8, 0, 6.28)
        ctx.fill()
      }
      const color = { core: brand, metro: brand, access: ok, cpe: ok }
      nodes.forEach((n, i) => {
        const pulse = 0.55 + 0.45 * Math.sin(t * 0.03 + n.phase)
        ctx.fillStyle = rgba(color[n.k], n.k === 'cpe' ? 0.45 : 0.75 * pulse + 0.2)
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r, 0, 6.28)
        ctx.fill()
        if (i === 9 || i === 22) {
          const rr = n.r + 4 + ((t * 0.4) % 18)
          ctx.strokeStyle = rgba(i === 9 ? warn : crit, Math.max(0, 1 - ((t * 0.4) % 18) / 18))
          ctx.lineWidth = 1.5
          ctx.beginPath()
          ctx.arc(n.x, n.y, rr, 0, 6.28)
          ctx.stroke()
        }
      })
    }

    function loop() {
      t++
      packets.forEach((pk) => {
        pk.p += pk.v
        if (pk.p > 1) {
          pk.p = 0
          pk.link = links[Math.floor(Math.random() * links.length)]
        }
      })
      draw()
      if (visible) raf = requestAnimationFrame(loop)
    }

    build()
    draw()
    const still = reducedMotion()
    if (!still) raf = requestAnimationFrame(loop)
    const ro = new ResizeObserver(() => (build(), draw()))
    ro.observe(canvas)
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      cancelAnimationFrame(raf)
      if (visible && !still) raf = requestAnimationFrame(loop)
    })
    io.observe(canvas)
    const mo = new MutationObserver(draw) // troca de tema
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      mo.disconnect()
    }
  }, [density])
  return <canvas ref={ref} className={`block h-full w-full ${className}`} aria-hidden />
}
