// Demonstrações interativas (padrão de demo sem cadastro, logo após a apresentação da plataforma).
import { useRef } from 'react'
import { revealIn, useMotion } from '../lib/motion.js'
import DemoAccess from '../demos/DemoAccess.jsx'
import DemoAgent from '../demos/DemoAgent.jsx'
import DemoNetwork from '../demos/DemoNetwork.jsx'
import DemoRCA from '../demos/DemoRCA.jsx'

function Block({ id, eyebrow, title, text, children }) {
  return (
    <div id={id} className="scroll-mt-24">
      <div className="mb-8 max-w-[720px]" data-reveal>
        <span className="text-[13px] font-semibold uppercase tracking-[0.14em] text-brand-strong">{eyebrow}</span>
        <h3 className="mt-2 font-display text-[28px] font-bold leading-tight tracking-tight sm:text-[34px]">{title}</h3>
        <p className="lead mt-3 !text-[17px]">{text}</p>
      </div>
      <div data-reveal>{children}</div>
    </div>
  )
}

export default function Demos({ onAsk }) {
  const ref = useRef(null)
  useMotion(ref, () => revealIn(ref.current))
  return (
    <section id="demonstracoes" ref={ref} className="relative py-24 sm:py-32" aria-labelledby="demos-titulo">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-elevated/40 to-transparent" aria-hidden />
      <div className="page">
        <div className="mx-auto mb-20 max-w-[760px] text-center" data-reveal>
          <span className="eyebrow">Demonstrações</span>
          <h2 id="demos-titulo" className="h2 mt-4">
            Não precisa imaginar. Teste aqui.
          </h2>
          <p className="lead mt-4">Partes reais do jeito que a plataforma funciona, em miniatura. Clique, troque, repita.</p>
        </div>
        <div className="space-y-28">
          <Block id="demo-rede" eyebrow="Rede telecom" title="Uma falha, e você sabe na hora quem caiu." text="Clique num nó para simular a falha. O cálculo é o da plataforma: o que fica isolado, o que perde a redundância e quantos clientes são afetados.">
            <DemoNetwork />
          </Block>
          <Block id="demo-rca" eyebrow="Causa raiz" title="Da lentidão do cliente até o enlace que começou tudo." text="A análise encontra onde o problema nasceu, como se propagou salto a salto e a evidência em cada camada de dados.">
            <DemoRCA />
          </Block>
          <Block id="demo-acessos" eyebrow="Controle de acesso" title="Cada pessoa vê só o que deve, até o dispositivo." text="Escolha um perfil. As áreas, regiões e ações liberadas acendem; o resto some para essa pessoa, inclusive na IA e na API.">
            <DemoAccess />
          </Block>
          <Block id="demo-agente" eyebrow="Agente de IA" title="Pergunte o que aconteceu. Receba a resposta com a fonte." text="Um chat em português que consulta os dados de verdade e mostra de onde veio cada número.">
            <DemoAgent onAsk={onAsk} />
          </Block>
        </div>
      </div>
    </section>
  )
}
