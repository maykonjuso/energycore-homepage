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

Identidade "prancha técnica": papel, tinta e um único sinal (laranja de segurança), Archivo em largura expandida e
IBM Plex Mono para dados. Nada de gradiente, brilho ou desfoque.

- **Topo** com um diagrama unifilar animado desenhado a nanquim (concessionária → quadros → nobreaks → racks → núcleo →
  metro → OLT → clientes): a corrente corre nas linhas, um enlace cai e o carimbo mostra os clientes afetados. Pausável.
- **Faixa de leituras** da demonstração, **antes e depois** do mesmo incidente, **plataforma** em abas com a tela de cada
  módulo, **bancada de testes** (simular falha, causa raiz, controle de acesso, agente de IA), **do sensor à decisão**,
  **especificação de segurança**, **implantação**, **perguntas** (com FAQPage) e **contato**.
- **Português e inglês** (idioma do navegador ou o escolhido no topo; textos em `web/src/data/content.js`, com teste de
  paridade entre os dois). O assistente e o servidor respondem no idioma escolhido.
- **Acessibilidade**: símbolo da ONU no topo com tamanho do texto até 200%, alto contraste, animações e Libras (VLibras);
  contraste ≥ 7:1, teclado, Alt+1 para o conteúdo, sem rolagem lateral em 320 px ou com texto em 200%. Auditoria axe
  (WCAG A/AA/AAA) sem violações nos temas claro, escuro e alto contraste, nos dois idiomas.
- Animações sem biblioteca (CSS e IntersectionObserver): nada começa escondido sem JavaScript e tudo para com
  "reduzir movimento".
- **Assistente de IA**: responde só com `server/knowledge.md`, sugere demonstrações e sempre oferece falar com uma pessoa.
- **Contato**: envia para `contato@energycoreconsulting.com.br` com cópia para a pessoa; no GitHub Pages abre o e-mail
  já preenchido.

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
