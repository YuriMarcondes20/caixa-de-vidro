import type { NomeIcone } from '../components/ui'
import type { PerguntasApi } from '../morador/usePerguntas'

export type FiltroContas = 'todos' | 'sem' | 'aguardando'

export type TelaS =
  | { nome: 'inicio' }
  | { nome: 'contas'; filtro?: FiltroContas }
  | { nome: 'lancamento'; id: string; novo?: boolean }
  | { nome: 'novo-lancamento' }
  | { nome: 'perguntas' }
  | { nome: 'pergunta'; id: string }
  | { nome: 'decisoes' }
  | { nome: 'decisao'; id: string }

export const ABAS_S: { id: TelaS['nome']; rotulo: string; icone: NomeIcone }[] = [
  { id: 'inicio', rotulo: 'Início', icone: 'inicio' },
  { id: 'contas', rotulo: 'Contas', icone: 'lancamentos' },
  { id: 'perguntas', rotulo: 'Perguntas', icone: 'perguntas' },
  { id: 'decisoes', rotulo: 'Decisões', icone: 'decisoes' }
]

export interface NavS {
  ir: (t: TelaS) => void
  voltar: () => void
  aba: (nome: TelaS['nome'], filtro?: FiltroContas) => void
  substituir: (t: TelaS) => void
}

export interface PropsS {
  nav: NavS
  p: PerguntasApi
}
