// Dados fictícios de exemplo. Substitua por uma API quando o back-end existir.

export type Estado = 'com' | 'aguardando' | 'sem'

export interface Lancamento {
  id: string
  descricao: string
  /** Positivo = entrada, negativo = gasto. */
  valor: number
  /** yyyy-mm-dd */
  data: string
  categoria: string
  /** Complemento curto na linha da lista (ex.: "712 de 750"). */
  contexto?: string
  estado: Estado
  comprovante?: string
  fornecedor?: { nome: string; doc?: string }
  /** Liga o lançamento ao histórico do prestador (tela do prestador). */
  prestadorId?: string
  decisaoId?: string
  origem: string
  /** Nota do conselho fiscal quando falta ou aguarda comprovante. */
  nota?: string
}

export const CONDOMINIO = 'Condomínio Residencial Exemplo'
export const MES_ATUAL = '2026-09'
export const PERIODO = { longo: 'Setembro 2026', curto: 'Set. 2026' }
export const FONTE_BALANCETE = 'balancete de setembro · conferido em 14/10'

export const RESUMO = {
  saldoFinal: 219819.6,
  entradas: 375200,
  gastos: 351860.4,
  fundoReserva: 412300,
  inadimplencia: '5,1% · 38 un.',
  comprovantesCom: 136,
  comprovantesTotal: 142
}

const ATUAIS: Lancamento[] = [
  {
    id: 'l-folha',
    descricao: 'Folha — portaria e zeladoria',
    valor: -118240,
    data: '2026-09-30',
    categoria: 'Pessoal',
    estado: 'com',
    comprovante: 'Holerites',
    fornecedor: { nome: 'Folha própria do condomínio' },
    origem: 'Balancete set/2026 · pág. 2, linha 4'
  },
  {
    id: 'l-energia',
    descricao: 'Energia — áreas comuns',
    valor: -41380.4,
    data: '2026-09-28',
    categoria: 'Concessionárias',
    estado: 'com',
    comprovante: 'Fatura',
    fornecedor: { nome: 'Distribuidora de energia local' },
    prestadorId: 'p-energia',
    origem: 'Balancete set/2026 · pág. 3, linha 12'
  },
  {
    id: 'l-elevadores',
    descricao: 'Elevadores — manutenção',
    valor: -4820,
    data: '2026-09-22',
    categoria: 'Manutenção',
    estado: 'com',
    comprovante: 'NF 1832',
    fornecedor: { nome: 'Elevadores Exemplo Ltda', doc: 'CNPJ 00.000.000/0001-00' },
    prestadorId: 'p-elevadores',
    origem: 'Balancete set/2026 · pág. 4, linha 29'
  },
  {
    id: 'l-jardinagem',
    descricao: 'Jardinagem — áreas comuns',
    valor: -2150,
    data: '2026-09-18',
    categoria: 'Conservação',
    estado: 'aguardando',
    fornecedor: { nome: 'Jardins Exemplo ME', doc: 'CNPJ 00.000.000/0002-00' },
    prestadorId: 'p-jardins',
    origem: 'Balancete set/2026 · pág. 4, linha 33',
    nota: 'Conselho fiscal, 14/10: comprovante solicitado ao fornecedor. Prazo de entrega em andamento.'
  },
  {
    id: 'l-pintura',
    descricao: 'Pintura do muro — Portaria 2',
    valor: -9800,
    data: '2026-09-15',
    categoria: 'Manutenção',
    estado: 'sem',
    fornecedor: { nome: 'Pinturas Exemplo Ltda', doc: 'CNPJ 00.000.000/0003-00' },
    prestadorId: 'p-pinturas',
    origem: 'Balancete set/2026 · pág. 4, linha 37',
    nota: 'Conselho fiscal, 14/10: nota fiscal solicitada à administradora. Sem retorno até a publicação.'
  },
  {
    id: 'l-medicao',
    descricao: 'Impermeabilização — 1ª medição',
    valor: -18600,
    data: '2026-09-12',
    categoria: 'Obras',
    estado: 'com',
    comprovante: 'NF 0452',
    fornecedor: { nome: 'Impermeabilizações Exemplo S.A.', doc: 'CNPJ 00.000.000/0004-00' },
    prestadorId: 'p-imper',
    decisaoId: 'd-laje',
    origem: 'Balancete set/2026 · pág. 5, linha 8'
  },
  {
    id: 'l-eletrico',
    descricao: 'Material elétrico — Bloco 3',
    valor: -3620,
    data: '2026-09-11',
    categoria: 'Manutenção',
    estado: 'sem',
    fornecedor: { nome: 'Elétrica Exemplo Ltda', doc: 'CNPJ 00.000.000/0005-00' },
    prestadorId: 'p-eletrica',
    origem: 'Balancete set/2026 · pág. 4, linha 41',
    nota: 'Conselho fiscal, 14/10: nota fiscal solicitada à administradora. Sem retorno até a publicação.'
  },
  {
    id: 'l-taxas',
    descricao: 'Taxas condominiais',
    valor: 370240,
    data: '2026-09-10',
    categoria: 'Receita',
    contexto: '712 de 750',
    estado: 'com',
    comprovante: 'Extrato',
    fornecedor: { nome: 'Unidades do condomínio' },
    origem: 'Balancete set/2026 · pág. 1, linha 2'
  },
  // Agosto: não aparece na lista de setembro, mas é citado pela deliberação.
  {
    id: 'l-sinal',
    descricao: 'Impermeabilização — sinal de 30%',
    valor: -55800,
    data: '2026-08-05',
    categoria: 'Obras',
    estado: 'com',
    comprovante: 'NF 0417',
    fornecedor: { nome: 'Impermeabilizações Exemplo S.A.', doc: 'CNPJ 00.000.000/0004-00' },
    prestadorId: 'p-imper',
    decisaoId: 'd-laje',
    origem: 'Balancete ago/2026 · pág. 5, linha 3'
  }
]

export interface Prestador {
  id: string
  nome: string
  doc?: string
  categoria: string
  contrato?: string
}

export const PRESTADORES: Prestador[] = [
  { id: 'p-elevadores', nome: 'Elevadores Exemplo Ltda', doc: 'CNPJ 00.000.000/0001-00', categoria: 'Manutenção', contrato: 'Contrato vigente até 03/2027' },
  { id: 'p-jardins', nome: 'Jardins Exemplo ME', doc: 'CNPJ 00.000.000/0002-00', categoria: 'Conservação', contrato: 'Contrato mensal de jardinagem' },
  { id: 'p-pinturas', nome: 'Pinturas Exemplo Ltda', doc: 'CNPJ 00.000.000/0003-00', categoria: 'Manutenção' },
  { id: 'p-imper', nome: 'Impermeabilizações Exemplo S.A.', doc: 'CNPJ 00.000.000/0004-00', categoria: 'Obras', contrato: 'Deliberação AGE de 14/06/2026' },
  { id: 'p-eletrica', nome: 'Elétrica Exemplo Ltda', doc: 'CNPJ 00.000.000/0005-00', categoria: 'Manutenção' },
  { id: 'p-energia', nome: 'Distribuidora de energia local', categoria: 'Concessionárias', contrato: 'Fatura mensal das áreas comuns' }
]

const MESES_HISTORICO = ['01', '02', '03', '04', '05', '06', '07', '08']

/** Pagamentos de janeiro a agosto de 2026 (os de setembro estão em ATUAIS). Valores positivos = pago. */
function historico(
  prestadorId: string,
  descricao: string,
  categoria: string,
  dia: string,
  pagos: Array<number | null>,
  prefixo: string,
  primeiroNumero?: number
): Lancamento[] {
  const p = PRESTADORES.find((x) => x.id === prestadorId)!
  const saida: Lancamento[] = []
  pagos.forEach((valor, i) => {
    if (valor === null) return
    const mes = MESES_HISTORICO[i]
    saida.push({
      id: `h-${prestadorId}-${mes}`,
      descricao,
      valor: -valor,
      data: `2026-${mes}-${dia}`,
      categoria,
      estado: 'com',
      comprovante: primeiroNumero === undefined ? prefixo : `${prefixo} ${String(primeiroNumero + i).padStart(4, '0')}`,
      fornecedor: { nome: p.nome, doc: p.doc },
      prestadorId,
      origem: `Balancete ${mes}/2026`
    })
  })
  return saida
}

const HISTORICO: Lancamento[] = [
  ...historico('p-elevadores', 'Elevadores — manutenção', 'Manutenção', '22', [4650, 4650, 4650, 4820, 4820, 4820, 4820, 4820], 'NF', 1710),
  ...historico('p-jardins', 'Jardinagem — áreas comuns', 'Conservação', '18', [2150, 2150, 2150, 2150, 2150, 2150, 2150, 2150], 'NF', 230),
  ...historico(
    'p-energia',
    'Energia — áreas comuns',
    'Concessionárias',
    '28',
    [36210.8, 37940.15, 35118.6, 33870.4, 34560.9, 36420.3, 38115.75, 39802.2],
    'Fatura'
  ),
  ...historico('p-pinturas', 'Pintura da garagem — bloco 2', 'Manutenção', '09', [null, null, 8400, null, null, null, null, null], 'NF', 86),
  ...historico('p-eletrica', 'Manutenção elétrica — iluminação', 'Manutenção', '14', [null, 1890, null, null, 2740, null, null, null], 'NF', 5520)
]

export const LANCAMENTOS: Lancamento[] = [...ATUAIS, ...HISTORICO]

export interface CategoriaOrcamento {
  nome: string
  gasto: number
  previsto: number
}

export const ORCAMENTO: CategoriaOrcamento[] = [
  { nome: 'Manutenção', gasto: 52310, previsto: 45000 },
  { nome: 'Concessionárias', gasto: 98640.4, previsto: 92000 },
  { nome: 'Pessoal e encargos', gasto: 151420, previsto: 148000 },
  { nome: 'Administração', gasto: 18410, previsto: 18500 },
  { nome: 'Conservação e limpeza', gasto: 24880, previsto: 28000 },
  { nome: 'Outras despesas', gasto: 6200, previsto: 6200 }
]

export const ORCAMENTO_FONTE = 'Orçamento aprovado na AGO de 22/03/2026'

export type EstadoDecisao = 'decidida' | 'execucao' | 'concluida'

export interface Decisao {
  id: string
  assembleia: 'AGE' | 'AGO'
  /** yyyy-mm-dd */
  data: string
  titulo: string
  pauta: number
  estado: EstadoDecisao
  /** Data/previsão de cada etapa: decidida, em execução, concluída. */
  etapas: [string, string, string]
  aprovado?: number
  gasto?: number
  financiamento?: string
  resumo?: string
  pendencia?: string
  votos: { presentes: number; favor: number; contra: number; abstencoes: number }
  lancamentos: string[]
  linkOrcamento?: boolean
}

export const DECISOES: Decisao[] = [
  {
    id: 'd-laje',
    assembleia: 'AGE',
    data: '2026-06-14',
    titulo: 'Impermeabilização das lajes — blocos 1 a 6',
    pauta: 2,
    estado: 'execucao',
    etapas: ['14/06', 'desde 05/08', 'prevista 12/2026'],
    aprovado: 186000,
    gasto: 74400,
    financiamento: 'fundo de obras + rateio extra em 6 parcelas',
    votos: { presentes: 257, favor: 214, contra: 31, abstencoes: 12 },
    lancamentos: ['l-sinal', 'l-medicao']
  },
  {
    id: 'd-portao',
    assembleia: 'AGE',
    data: '2026-06-14',
    titulo: 'Troca do portão da Portaria 1',
    pauta: 4,
    estado: 'decidida',
    etapas: ['14/06', 'a iniciar', 'sem previsão'],
    pendencia: 'Aguardando 3 cotações · 1 recebida',
    votos: { presentes: 257, favor: 198, contra: 41, abstencoes: 18 },
    lancamentos: []
  },
  {
    id: 'd-reajuste',
    assembleia: 'AGO',
    data: '2026-03-22',
    titulo: 'Reajuste da taxa condominial em 6,5%',
    pauta: 3,
    estado: 'concluida',
    etapas: ['22/03', 'abril', 'abril'],
    resumo: 'Aplicado a partir do boleto de abril',
    votos: { presentes: 389, favor: 301, contra: 62, abstencoes: 26 },
    lancamentos: []
  },
  {
    id: 'd-orcamento',
    assembleia: 'AGO',
    data: '2026-03-22',
    titulo: 'Aprovação do orçamento 2026',
    pauta: 1,
    estado: 'concluida',
    etapas: ['22/03', '22/03', '22/03'],
    aprovado: 4052400,
    resumo: 'R$ 4.052.400,00 no ano · ver previsto × realizado',
    votos: { presentes: 389, favor: 356, contra: 21, abstencoes: 12 },
    lancamentos: [],
    linkOrcamento: true
  }
]

export type Alvo = { tipo: 'lancamento' | 'decisao'; id: string }

export interface EtapaPergunta {
  rotulo: string
  quando?: string
  estado: 'feito' | 'atual' | 'pendente'
}

export interface Pergunta {
  id: string
  titulo: string
  /** Texto completo, quando maior que o título. */
  texto?: string
  /** "Morador do Bloco 7" */
  autor: string
  criadaEm: string
  /** Só em perguntas criadas agora: dias contados a partir daqui. */
  criadaEmIso?: string
  alvo: Alvo
  respondida: boolean
  /** Dias decorridos (aguardando) ou dias até responder (respondida). */
  dias: number
  vence: string
  acompanham: number
  resposta?: { autor: string; texto: string; quando: string }
  etapas: EtapaPergunta[]
}

export const PRAZO_DIAS = 10

export const PERGUNTAS_SEED: Pergunta[] = [
  {
    id: 'p-pintura',
    titulo: 'Por que a pintura do muro não tem nota fiscal?',
    autor: 'Morador do Bloco 7',
    criadaEm: '14/10/2026, 09:20',
    alvo: { tipo: 'lancamento', id: 'l-pintura' },
    respondida: false,
    dias: 4,
    vence: '24/10/2026',
    acompanham: 12,
    etapas: [
      { rotulo: 'Enviada', quando: '14/10, 09:20', estado: 'feito' },
      { rotulo: 'Encaminhada ao síndico pelo conselho fiscal', quando: '14/10, 18:02', estado: 'feito' },
      { rotulo: 'Aguardando resposta do síndico', estado: 'atual' },
      { rotulo: 'Resposta publicada', estado: 'pendente' }
    ]
  },
  {
    id: 'p-energia',
    titulo: 'A energia passou 7% do previsto. Mudou a tarifa?',
    autor: 'Morador do Bloco 15',
    criadaEm: '02/10/2026, 19:41',
    alvo: { tipo: 'lancamento', id: 'l-energia' },
    respondida: true,
    dias: 2,
    vence: '12/10/2026',
    acompanham: 8,
    resposta: {
      autor: 'Síndico',
      texto:
        'Reajuste da distribuidora em setembro e bombas de recalque operando mais horas durante o reparo do Bloco 12.',
      quando: '04/10/2026'
    },
    etapas: [
      { rotulo: 'Enviada', quando: '02/10, 19:41', estado: 'feito' },
      { rotulo: 'Encaminhada ao síndico pelo conselho fiscal', quando: '03/10, 08:15', estado: 'feito' },
      { rotulo: 'Resposta publicada', quando: '04/10', estado: 'feito' }
    ]
  },
  {
    id: 'p-bloco4',
    titulo: 'Quando a impermeabilização chega ao Bloco 4?',
    autor: 'Morador do Bloco 4',
    criadaEm: '25/09/2026, 12:05',
    alvo: { tipo: 'decisao', id: 'd-laje' },
    respondida: true,
    dias: 3,
    vence: '05/10/2026',
    acompanham: 21,
    resposta: {
      autor: 'Síndico',
      texto: 'O cronograma da empreiteira prevê o Bloco 4 na primeira quinzena de novembro.',
      quando: '28/09/2026'
    },
    etapas: [
      { rotulo: 'Enviada', quando: '25/09, 12:05', estado: 'feito' },
      { rotulo: 'Encaminhada ao síndico pelo conselho fiscal', quando: '25/09, 17:30', estado: 'feito' },
      { rotulo: 'Resposta publicada', quando: '28/09', estado: 'feito' }
    ]
  }
]

export function lancamento(id: string): Lancamento | undefined {
  return LANCAMENTOS.find((l) => l.id === id)
}

export function decisao(id: string): Decisao | undefined {
  return DECISOES.find((d) => d.id === id)
}

export function lancamentosDoMes(): Lancamento[] {
  return LANCAMENTOS.filter((l) => l.data.startsWith(MES_ATUAL)).sort((a, b) => b.data.localeCompare(a.data))
}

export function totalOrcamento(): { gasto: number; previsto: number } {
  return ORCAMENTO.reduce(
    (t, c) => ({ gasto: t.gasto + c.gasto, previsto: t.previsto + c.previsto }),
    { gasto: 0, previsto: 0 }
  )
}

/** Variação em % sobre o previsto (positivo = acima). */
export function variacao(gasto: number, previsto: number): number {
  return (gasto / previsto - 1) * 100
}

export function diasDecorridos(p: Pergunta): number {
  if (!p.criadaEmIso || p.respondida) return p.dias
  return Math.max(0, Math.floor((Date.now() - new Date(p.criadaEmIso).getTime()) / 86400000))
}

export function tituloAlvo(a: Alvo): string {
  return (a.tipo === 'lancamento' ? lancamento(a.id)?.descricao : decisao(a.id)?.titulo) ?? ''
}
export const UNIDADES = 750

export function prestador(id: string): Prestador | undefined {
  return PRESTADORES.find((p) => p.id === id)
}

/** Histórico do prestador, do mais recente para o mais antigo. */
export function lancamentosDoPrestador(id: string): Lancamento[] {
  return LANCAMENTOS.filter((l) => l.prestadorId === id).sort((a, b) => b.data.localeCompare(a.data))
}

export interface ResumoPrestador {
  recebido: number
  pagamentos: number
  comComprovante: number
  semComprovante: number
  aguardando: number
  primeiro?: string
  ultimo?: Lancamento
}

/** Somas feitas sobre os lançamentos listados: o total sempre bate com o histórico. */
export function resumoPrestador(id: string): ResumoPrestador {
  const lista = lancamentosDoPrestador(id)
  return {
    recebido: lista.reduce((s, l) => s + Math.abs(l.valor), 0),
    pagamentos: lista.length,
    comComprovante: lista.filter((l) => l.estado === 'com').length,
    semComprovante: lista.filter((l) => l.estado === 'sem').length,
    aguardando: lista.filter((l) => l.estado === 'aguardando').length,
    primeiro: lista.length ? lista[lista.length - 1].data : undefined,
    ultimo: lista[0]
  }
}
