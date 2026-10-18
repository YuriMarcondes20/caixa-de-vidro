import type { Alvo } from './dados'
import type { PerguntasApi } from './usePerguntas'

export type Filtro = 'todos' | 'entradas' | 'gastos' | 'sem'

export type Tela =
  | { nome: 'inicio' }
  | { nome: 'lancamentos'; filtro?: Filtro }
  | { nome: 'lancamento'; id: string }
  | { nome: 'orcamento' }
  | { nome: 'decisoes' }
  | { nome: 'decisao'; id: string }
  | { nome: 'perguntas' }
  | { nome: 'pergunta-nova'; alvo?: Alvo }
  | { nome: 'pergunta'; id: string }

export type NomeTela = Tela['nome']

export const ABAS = ['inicio', 'lancamentos', 'orcamento', 'decisoes', 'perguntas'] as const
export type NomeAba = (typeof ABAS)[number]

export const ROTULO_TELA: Record<NomeTela, string> = {
  inicio: 'Início',
  lancamentos: 'Lançamentos',
  lancamento: 'Lançamento',
  orcamento: 'Orçamento',
  decisoes: 'Decisões',
  decisao: 'Decisão',
  perguntas: 'Perguntas',
  'pergunta-nova': 'Pedir explicação',
  pergunta: 'Pergunta'
}

export interface Nav {
  ir: (t: Tela) => void
  voltar: () => void
  aba: (n: NomeAba, filtro?: Filtro) => void
  substituir: (t: Tela) => void
  /** Rótulo da tela anterior, para o link de voltar. */
  anterior: string
}

export interface Props {
  nav: Nav
  p: PerguntasApi
}
