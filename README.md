# Homepage da EnergyCore

Site institucional da EnergyCore Consulting (energycoreconsulting.com.br): apresenta a plataforma com telas reais,
demonstrações interativas, contato por e-mail e um assistente de IA que tira dúvidas e leva às demonstrações.

## Rodar

```bash
# servidor (contato + assistente), porta 8200
cd server && uv sync && uv run uvicorn app:app --port 8200 --reload
# site em desenvolvimento, porta 5174 (encaminha /api para o servidor)
cd web && npm install && npm run dev
```

Abra http://localhost:5174. Para ver como em produção: `cd web && npm run build` e abra http://localhost:8200.

## O que tem na página

- **Topo** com a rede animada ao fundo, a tela real do produto flutuando e indicadores (parallax por profundidade, GSAP).
- **Plataforma**: seção fixa que troca módulo e tela conforme a rolagem (energia, alarmes, topologia, simulação de falha,
  tendências, acesso).
- **Demonstrações interativas**: simular falha na rede (cálculo real de isolados, degradados e clientes), causa raiz
  animada salto a salto, controle de acesso por perfil e conversa encenada com o agente de IA.
- Como funciona, segurança e governança, números do produto, implantação, perguntas frequentes, contato e rodapé.
- **Assistente de IA**: responde só com `server/knowledge.md`, sugere demonstrações (rola até elas e as dispara) e
  sempre oferece falar com uma pessoa. Com `ANTHROPIC_API_KEY` usa Claude (saída estruturada, cache da base, fallback de
  recusa); sem chave, responde pela base local.
- **Contato**: envia para `contato@energycoreconsulting.com.br` com cópia de confirmação para a pessoa; campo
  armadilha, tempo mínimo e limite por IP contra robôs; consentimento LGPD. Sem SMTP, grava em `server/.data/outbox`.
- Tema claro e escuro, celular, "reduzir movimento", teclado e leitores de tela (auditoria axe sem violações).

## Conteúdo

- Textos: `web/src/data/content.js` (só fatos do produto; nada de clientes ou números inventados).
- Base do assistente: `server/knowledge.md`.
- Telas: `web/public/produto/*-dark.webp` e `*-light.webp`, capturadas da plataforma com dados simulados.

## Testes

```bash
cd server && uv run pytest     # contato, anti-robô, limite, assistente local e com Claude (simulado), cabeçalhos
cd web && npm test             # demo da rede, demo de acesso, assistente, contato
```

## Publicar

`docker build -t energycore-homepage . && docker run -p 8000:8000 --env-file .env energycore-homepage`.
Para o e-mail chegar, configure SMTP e os registros SPF, DKIM e DMARC de energycoreconsulting.com.br.
