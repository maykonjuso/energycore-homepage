# EnergyCore — base de conhecimento do assistente da homepage

Fonte única do assistente. Se algo não estiver aqui, o assistente diz que não sabe e oferece o contato.

## Empresa
- EnergyCore Consulting. Site: energycoreconsulting.com.br. E-mail: contato@energycoreconsulting.com.br.
- Consultoria e plataforma para operação de infraestrutura crítica: datacenters e redes de telecom.
- Não divulgamos preços na homepage: cada projeto é dimensionado (número de sites, equipamentos, integrações). O caminho é o formulário de contato ou o e-mail.

## Plataforma EnergyCore (o que oferecemos)
1. **Monitoramento de energia do datacenter** — da entrada da concessionária até a tomada de cada rack: quadros de distribuição CA (QDAC), distribuição crítica (QDCPD), nobreaks (UPS), refrigeração (chillers e CRACs), carregadores de veículos elétricos, sensores (temperatura, umidade, inundação, fumaça, acesso) e racks/PDUs. Leituras a cada 5 segundos, diagrama unifilar clicável, ficha de cada equipamento com tendência de 24 h. Indicadores como PUE, carga total, carga crítica e autonomia de bateria.
2. **Alarmes e incidentes** — cada leitura é comparada com limites ajustáveis; alarmes por severidade (crítico, sério, atenção, informativo), reconhecimento com comentário, histórico, incidentes (2+ alarmes no mesmo local em menos de 2 horas), linha do tempo, notificações no navegador e modo TV para a sala de operação.
3. **Rede telecom: topologia, linhagem e simulação de falha** — mapa de forças da rede (núcleo, metro, acesso e clientes/CPEs), vizinhança em 1 ou 2 saltos, vista em camadas, linhagem a montante e a jusante, simulação de falha de nós e enlaces mostrando nós isolados, degradados (perderam redundância), enlaces afetados, sites e clientes afetados.
4. **Painel do ponto de rede** — por equipamento: interfaces e tráfego, hardware (fontes, ventiladores, firmware, uptime), CPU/memória/temperatura e indicadores da tecnologia (OLT, eNodeB, BTS, switch metro…), janelas de 6, 12 e 24 h.
5. **Análise de causa raiz (RCA)** — detecta incidentes e aponta onde o problema começou, como se propagou (com atraso de cada salto), alternativas consideradas, confiança e a evidência em cada camada de dados (bruto de 5 min → hora → estado atual).
6. **Lakehouse** — dados em Apache Iceberg consultados com DuckDB, em camadas bronze → silver → gold (arquitetura medalhão), com versionamento de tabelas.
7. **Tendências, dashboards e relatórios** — várias medições no mesmo eixo de tempo, comparação com o período anterior, zoom, anotações, visões salvas, dashboard arrastável, rateio de energia por centro de custo, exportação CSV e relatórios.
8. **Agente de IA** — chat em português que consulta os dados de verdade por ferramentas (topologia, saúde, linhagem, simulação de falha, causa raiz, correlações, relatórios), cita as fontes e mostra o cartão de causa raiz. Também disponível como servidor MCP para outros clientes de IA.
9. **Controle de acesso granular** — permissões por página, por função e por alcance (tudo, unidade, área ou região, site ou dispositivo). Grupos, permitir e negar (negar vence), pessoas com nome, CPF e e-mail (senha gerada e enviada por e-mail), usuários de serviço, tokens de API com validade, modelos de acesso, copiar acesso, revisão periódica com alertas de risco, "quem tem acesso a X", auditoria completa com exportação, políticas de senha e sessão. Tudo conferido no servidor, inclusive no chat do agente e na API.
10. **Integração com Active Directory** — login com a conta da empresa (LDAPS/StartTLS), criação automática da conta, grupos do AD viram grupos do EnergyCore, foto do AD e sincronização que desativa quem saiu.

## Segurança e privacidade
- Sessão em cookie HttpOnly, bloqueio por tentativas, senhas com hash scrypt, tokens só exibidos uma vez, auditoria de logins, mudanças e acessos negados.
- Dados pessoais (CPF) mascarados para quem não tem permissão. Atenção à LGPD: o formulário de contato pede consentimento e os dados são usados só para responder ao contato.

## Como funciona a implantação
1. **Diagnóstico** — levantamento dos sites, equipamentos, protocolos e integrações (SNMP, Modbus, APIs, AD).
2. **Piloto** — um site ou região, com indicadores e alarmes reais e o time de operação usando.
3. **Escala** — demais sites, permissões por unidade, integrações e treinamento.
- A demonstração pública usa dados simulados plausíveis (datacenter DC-01 com cerca de 415 kW de carga total e PUE perto de 1,45; rede telecom simulada com 188 nós em São Paulo, Rio de Janeiro, Minas Gerais e núcleo nacional).

## Para quem
- Operadores e gestores de datacenter (colocation, corporativo, edge).
- Operadoras e provedores de telecom (NOC).
- Equipes de facilities, energia e engenharia que precisam de visão única e auditável.

## Perguntas frequentes
- **Funciona com equipamentos de vários fabricantes?** Sim, a coleta é feita por protocolos padrão e integrações; o levantamento no diagnóstico confirma cada equipamento.
- **Os dados ficam onde?** A plataforma pode ser implantada no ambiente do cliente ou em nuvem; isso é definido no diagnóstico.
- **Tem app de celular?** A interface é responsiva e funciona no navegador do celular; há modo TV para a sala de operação.
- **Quanto custa?** Depende do escopo; peça uma proposta pelo contato.
- **Posso testar?** Sim: peça acesso à demonstração pelo formulário de contato.
