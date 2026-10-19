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
  | { nome: 'pergunta'; id: string; nova?: boolean }
  | { nome: 'prestadores' }
  | { nome: 'prestador'; id: string }

export type NomeTela = Tela['nome']

export const ABAS = ['inicio', 'lancamentos', 'orcamento', 'decisoes', 'perguntas'] as const
export type NomeAba = (typeof ABAS)[number]

/** Rótulos curtos e simples da barra de baixo. */
export const ROTULO_ABA: Record<NomeAba, string> = {
  inicio: 'Início',
  lancamentos: 'Contas',
  orcamento: 'Orçamento',
  decisoes: 'Decisões',
  perguntas: 'Perguntas'
}

export const ROTULO_TELA: Record<NomeTela, string> = {
  inicio: 'Início',
  lancamentos: 'Contas',
  lancamento: 'Lançamento',
  orcamento: 'Orçamento',
  decisoes: 'Decisões',
  decisao: 'Decisão',
  perguntas: 'Perguntas',
  'pergunta-nova': 'Fazer uma pergunta',
  pergunta: 'Pergunta',
  prestadores: 'Prestadores',
  prestador: 'Prestador'
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
