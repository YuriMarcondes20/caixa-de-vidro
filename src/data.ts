export type Estado = 'com' | 'aguardando' | 'sem'

export interface Lancamento {
  id: string
  descricao: string
  /** Positivo = entrada, negativo = gasto. */
  valor: number
  /** ISO yyyy-mm-dd */
  data: string
  categoria: string
  contexto: string
  estado: Estado
  /** Rótulo do documento quando há comprovante (ex.: "NF 1832"). */
  comprovante?: string
}

export interface Periodo {
  rotulo: string
  saldoEmCaixa: number
  fonteSaldo: string
  atualizadoEm: string
  lancamentos: Lancamento[]
}

// Dados fictícios de exemplo. Substitua por uma API quando o back-end existir.
export const periodo: Periodo = {
  rotulo: 'outubro',
  saldoEmCaixa: 218436.12,
  fonteSaldo: 'extrato bancário',
  atualizadoEm: 'hoje, 09:12',
  lancamentos: [
    {
      id: 'l1',
      descricao: 'Taxas condominiais — outubro',
      valor: 386240,
      data: '2026-10-10',
      categoria: 'Receita',
      contexto: '712 de 750 unidades pagas',
      estado: 'com',
      comprovante: 'Extrato'
    },
    {
      id: 'l2',
      descricao: 'Elevadores — manutenção mensal',
      valor: -4820,
      data: '2026-10-12',
      categoria: 'Manutenção',
      contexto: 'contrato vigente até 03/2027',
      estado: 'com',
      comprovante: 'NF 1832'
    },
    {
      id: 'l3',
      descricao: 'Jardinagem — áreas comuns',
      valor: -2150,
      data: '2026-10-08',
      categoria: 'Conservação',
      contexto: 'lançado há 6 dias',
      estado: 'aguardando'
    },
    {
      id: 'l4',
      descricao: 'Portaria — folha de pagamento',
      valor: -38900,
      data: '2026-10-05',
      categoria: 'Pessoal',
      contexto: '6 funcionários',
      estado: 'com',
      comprovante: 'Holerites'
    },
    {
      id: 'l5',
      descricao: 'Reparo da bomba da piscina',
      valor: -3260,
      data: '2026-10-03',
      categoria: 'Manutenção',
      contexto: 'sem nota fiscal anexada',
      estado: 'sem'
    }
  ]
}
