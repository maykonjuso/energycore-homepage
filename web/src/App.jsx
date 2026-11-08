import { useEffect, useRef } from 'react'
import Assistant from './components/Assistant.jsx'
import Contact from './components/Contact.jsx'
import Demos from './components/Demos.jsx'
import Facts from './components/Facts.jsx'
import Faq from './components/Faq.jsx'
import Footer from './components/Footer.jsx'
import Hero from './components/Hero.jsx'
import HowItWorks from './components/HowItWorks.jsx'
import Nav from './components/Nav.jsx'
import Platform from './components/Platform.jsx'
import Security from './components/Security.jsx'
import Segments from './components/Segments.jsx'
import Statement from './components/Statement.jsx'
import Steps from './components/Steps.jsx'
import { reducedMotion } from './lib/motion.js'

export default function App() {
  const assistant = useRef(null)
  useEffect(() => {
    if (!reducedMotion()) document.documentElement.classList.add('js-motion')
  }, [])
  return (
    <>
      <Nav />
      <main id="conteudo">
        <Hero />
        <Segments />
        <Statement />
        <Platform />
        <Facts />
        <Demos onAsk={() => assistant.current?.open()} />
        <HowItWorks />
        <Security />
        <Steps />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <Assistant ref={assistant} />
    </>
  )
}
