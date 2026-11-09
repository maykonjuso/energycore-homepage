import { useEffect, useRef } from 'react'
import { useContent } from './data/content.js'
import { STATIC } from './lib/env.js'
import { useLang } from './lib/i18n.js'
import Assistant from './components/Assistant.jsx'
import Bench from './components/Bench.jsx'
import Contact from './components/Contact.jsx'
import Faq from './components/Faq.jsx'
import Footer from './components/Footer.jsx'
import Hero from './components/Hero.jsx'
import Nav from './components/Nav.jsx'
import Pipeline from './components/Pipeline.jsx'
import Platform from './components/Platform.jsx'
import Problem from './components/Problem.jsx'
import Readout from './components/Readout.jsx'
import Security from './components/Security.jsx'
import Steps from './components/Steps.jsx'

export default function App() {
  const c = useContent()
  const lang = useLang()
  const assistant = useRef(null)
  // Título e descrição no idioma escolhido (abas, buscadores e leitores de tela).
  useEffect(() => {
    document.title = c.meta.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', c.meta.description)
    document.querySelector('meta[property="og:locale"]')?.setAttribute('content', lang === 'en' ? 'en_US' : 'pt_BR')
  }, [c, lang])
  // Alt+1: ir para o conteúdo (padrão eMAG).
  useEffect(() => {
    const onKey = (e) => {
      if (e.altKey && (e.code === 'Digit1' || e.key === '1')) {
        e.preventDefault()
        document.getElementById('conteudo')?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
  return (
    <>
      <a href="#conteudo" className="skip-link">
        {c.skip}
      </a>
      <Nav />
      <main id="conteudo" tabIndex={-1} className="outline-none">
        <Hero />
        <Readout />
        <Problem />
        <Platform />
        <Bench onAsk={STATIC ? undefined : () => assistant.current?.open()} />
        <Pipeline />
        <Security />
        <Steps />
        <Faq />
        <Contact />
      </main>
      <Footer />
      {!STATIC && <Assistant ref={assistant} />}
    </>
  )
}
