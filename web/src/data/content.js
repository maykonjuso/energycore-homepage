// Textos da homepage. Fatos do produto apenas: nada de clientes, números de mercado ou depoimentos inventados.
import { Activity, Bell, Bot, Building2, Cable, Database, GitBranch, KeyRound, LineChart, Network, RadioTower, Search, Server, ShieldCheck, Workflow, Zap } from 'lucide-react'

export const NAV = [
  { href: '#plataforma', label: 'Plataforma' },
  { href: '#demonstracoes', label: 'Demonstrações' },
  { href: '#seguranca', label: 'Segurança' },
  { href: '#implantacao', label: 'Implantação' },
  { href: '#perguntas', label: 'Perguntas' },
]

export const HERO = {
  eyebrow: 'Datacenter e telecom em uma só plataforma',
  title: ['Infraestrutura crítica', 'sob controle,', 'do quadro ao cliente.'],
  lead: 'A EnergyCore junta a energia do datacenter e a rede de telecom numa visão só: o que está acontecendo agora, onde um problema começou e quem é afetado. Com IA que consulta os dados e acesso controlado até o dispositivo.',
  primary: { label: 'Agendar uma demonstração', href: '#contato' },
  secondary: { label: 'Ver a plataforma em ação', href: '#demonstracoes' },
  chips: [
    { label: 'PUE', value: '1,45', tone: 'ok' },
    { label: 'Carga total', value: '415,9 kW', tone: 'brand' },
    { label: 'Nós monitorados', value: '188', tone: 'brand' },
    { label: 'Alarme crítico', value: 'R07 · 88%', tone: 'crit' },
  ],
}

export const SEGMENTS = [
  { icon: Building2, label: 'Datacenters corporativos' },
  { icon: Server, label: 'Colocation e edge' },
  { icon: RadioTower, label: 'Operadoras de telecom' },
  { icon: Network, label: 'Provedores e NOC' },
  { icon: Zap, label: 'Facilities e energia' },
  { icon: ShieldCheck, label: 'Times de segurança e auditoria' },
]

export const STATEMENT =
  'Quando um quadro aquece ou um enlace cai, a equipe abre cinco telas, liga para três pessoas e ainda não sabe quem foi afetado. A EnergyCore mostra o problema, a origem e o impacto em segundos.'

// Módulos da plataforma (seção fixada com troca de tela conforme a rolagem).
export const MODULES = [
  {
    id: 'monitoramento',
    icon: Activity,
    title: 'Energia do datacenter',
    text: 'Da concessionária até a tomada de cada rack: quadros, nobreaks, refrigeração, sensores e PDUs, com leitura a cada 5 segundos e diagrama unifilar clicável.',
    points: ['PUE, carga total e autonomia ao vivo', 'Ficha de cada equipamento com 24 h de tendência', 'Rateio de energia por centro de custo'],
    shot: 'overview',
  },
  {
    id: 'alarmes',
    icon: Bell,
    title: 'Alarmes e incidentes',
    text: 'Limites ajustáveis, severidade clara, reconhecimento com comentário e incidentes que agrupam alarmes do mesmo local. Modo TV para a sala de operação.',
    points: ['Histórico e linha do tempo de cada alarme', 'Notificações no navegador', 'Quem reconheceu, quando e por quê'],
    shot: 'alarmes',
  },
  {
    id: 'topologia',
    icon: Network,
    title: 'Topologia da rede telecom',
    text: 'Núcleo, metro, acesso e clientes num mapa vivo. Foque um nó, veja a vizinhança, a linhagem a montante e a jusante e o painel completo do equipamento.',
    points: ['Painel por equipamento: interfaces, hardware e KPIs da tecnologia', 'Vista em camadas e em grafo', 'Busca por qualquer nó'],
    shot: 'topologia-foco',
  },
  {
    id: 'falha',
    icon: Zap,
    title: 'Simulação de falha',
    text: 'Antes da manutenção ou durante a crise: escolha um nó ou enlace e veja o que fica isolado, o que perde redundância e quantos clientes são afetados.',
    points: ['Isolados, degradados e enlaces afetados', 'Sites e clientes impactados', 'Cenário compartilhável por link'],
    shot: 'falha',
  },
  {
    id: 'tendencias',
    icon: LineChart,
    title: 'Tendências e relatórios',
    text: 'Compare medições no mesmo eixo, veja o período anterior, anote eventos e salve visões. Dashboards arrastáveis e exportação em CSV.',
    points: ['Zoom arrastando no gráfico', 'Visões salvas e anotações', 'Relatórios prontos'],
    shot: 'tendencias',
  },
  {
    id: 'acessos',
    icon: KeyRound,
    title: 'Acesso até o dispositivo',
    text: 'Cada pessoa vê e faz só o que deve: páginas, funções e alcance por unidade, região, site ou equipamento. Integração com o Active Directory e auditoria de tudo.',
    points: ['Permitir e negar, com prévia antes de salvar', 'Revisão periódica com alertas de risco', 'Tokens de API e usuários de serviço'],
    shot: 'ficha',
  },
]

export const RCA_STEPS = [
  { t: '09:10', node: 'L-0005 · enlace metro SP', kind: 'root', text: 'Erros de interface sobem 40x no enlace entre Metro SP 01 e OLT SP 01.' },
  { t: '09:15', node: 'OLT São Paulo 01', kind: 'hop', text: 'Perda de pacotes passa de 0,2% para 6,8% (5 min depois).' },
  { t: '09:20', node: 'Clientes São Paulo', kind: 'hop', text: '1.240 clientes com latência acima de 80 ms (10 min depois).' },
  { t: '09:21', node: 'Causa raiz provável', kind: 'end', text: 'Enlace L-0005 · confiança alta · evidência em bronze, silver e gold.' },
]

export const PIPELINE = [
  { icon: Cable, title: 'Coleta', text: 'Medidores, nobreaks, sensores e equipamentos de rede por protocolos padrão e integrações.' },
  { icon: Database, title: 'Lakehouse', text: 'Apache Iceberg + DuckDB em camadas bronze, silver e gold, com versão de cada tabela.' },
  { icon: Workflow, title: 'Análise', text: 'Saúde, linhagem, impacto de falha, correlações e causa raiz calculados sobre os dados.' },
  { icon: Bot, title: 'Ação', text: 'Alarmes, painéis, relatórios e um agente de IA que responde citando as fontes.' },
]

export const SECURITY = [
  { icon: KeyRound, title: 'Permissão granular', text: 'Página, função e alcance (unidade, região, site ou dispositivo). Negar sempre vence.' },
  { icon: ShieldCheck, title: 'Conferida no servidor', text: 'Vale nas telas, no chat do agente, no servidor MCP e na API. O que está fora do alcance nem aparece.' },
  { icon: Building2, title: 'Active Directory', text: 'Login com a conta da empresa, grupos do AD viram perfis e quem sai da empresa perde o acesso na sincronização.' },
  { icon: Search, title: 'Auditoria completa', text: 'Logins, mudanças, acessos negados, simulações e exportações registrados com quem, quando e de onde.' },
  { icon: GitBranch, title: 'Governança', text: 'Modelos de acesso, revisão periódica com alertas de risco e “quem tem acesso a este equipamento”.' },
  { icon: Bot, title: 'IA com limites', text: 'O agente só usa as ferramentas e os dados que a pessoa pode ver. Cada resposta mostra de onde veio.' },
]

export const STEPS = [
  { n: '01', title: 'Diagnóstico', text: 'Levantamos sites, equipamentos, protocolos e integrações (SNMP, Modbus, APIs, Active Directory) e definimos onde a plataforma roda.' },
  { n: '02', title: 'Piloto', text: 'Um site ou uma região com indicadores e alarmes reais, e o time de operação usando no dia a dia.' },
  { n: '03', title: 'Escala', text: 'Demais sites, permissões por unidade, integrações e treinamento das equipes.' },
]

export const FACTS = [
  { value: 5, suffix: ' s', label: 'entre leituras ao vivo' },
  { value: 5, suffix: ' níveis', label: 'de alcance de permissão, até o dispositivo' },
  { value: 3, suffix: ' camadas', label: 'de dados com evidência na causa raiz' },
  { value: 100, suffix: '%', label: 'das ações de acesso auditadas' },
]

export const FAQ = [
  { q: 'Funciona com equipamentos de vários fabricantes?', a: 'Sim. A coleta usa protocolos padrão e integrações, e o diagnóstico confirma cada equipamento antes do piloto.' },
  { q: 'Onde os dados ficam?', a: 'A plataforma pode rodar no ambiente da sua empresa ou em nuvem. Isso é definido no diagnóstico, junto com a política de retenção.' },
  { q: 'Quanto custa?', a: 'Depende do escopo: número de sites, equipamentos e integrações. Pelo contato, preparamos uma proposta para o seu cenário.' },
  { q: 'Posso testar antes?', a: 'Sim. Peça acesso à demonstração com dados simulados de um datacenter e de uma rede telecom com 188 nós.' },
  { q: 'Precisa instalar algo nos computadores da equipe?', a: 'Não. É tudo pelo navegador, também no celular, e há um modo TV para a sala de operação.' },
  { q: 'Como a IA trata os nossos dados?', a: 'O agente consulta os dados por ferramentas, respeitando as permissões de quem pergunta, e mostra a fonte de cada número.' },
]

export const FOOTER = {
  email: 'contato@energycoreconsulting.com.br',
  site: 'energycoreconsulting.com.br',
}
