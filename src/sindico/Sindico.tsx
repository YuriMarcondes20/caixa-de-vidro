import { useEffect } from 'react'
import { useNavegacao } from '../navegacao'
import { BarraAbas } from '../morador/BarraAbas'
import { usePerguntas } from '../morador/usePerguntas'
import type { FiltroContas, NavS, TelaS } from './tipos'
import { ABAS_S } from './tipos'
import Contas from './telas/Contas'
import DecisaoAndamento from './telas/DecisaoAndamento'
import Decisoes from './telas/Decisoes'
import Inicio from './telas/Inicio'
import LancamentoDetalhe from './telas/LancamentoDetalhe'
import LancamentoNovo from './telas/LancamentoNovo'
import PerguntaResponder from './telas/PerguntaResponder'
import Perguntas from './telas/Perguntas'

const INICIO: TelaS = { nome: 'inicio' }

export default function Sindico({ onSair }: { onSair: () => void }) {
  const p = usePerguntas() // também faz a tela atualizar quando o síndico muda algo
  const n = useNavegacao<TelaS>('sindico', INICIO)
  const { topo } = n

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [topo])

  const aba = (nome: TelaS['nome'], filtro?: FiltroContas) =>
    n.trocarAba(nome === 'contas' ? { nome, filtro } : ({ nome } as TelaS))
  const nav: NavS = { ir: n.ir, voltar: n.voltar, aba, substituir: n.substituir }
  const ehAba = ABAS_S.some((a) => a.id === topo.nome)

  return (
    <>
      {topo.nome === 'inicio' && <Inicio nav={nav} p={p} onSair={() => n.sair(onSair)} />}
      {topo.nome === 'contas' && <Contas nav={nav} p={p} filtroInicial={topo.filtro} />}
      {topo.nome === 'lancamento' && <LancamentoDetalhe nav={nav} p={p} id={topo.id} novo={topo.novo} />}
      {topo.nome === 'novo-lancamento' && <LancamentoNovo nav={nav} p={p} />}
      {topo.nome === 'perguntas' && <Perguntas nav={nav} p={p} />}
      {topo.nome === 'pergunta' && <PerguntaResponder nav={nav} p={p} id={topo.id} />}
      {topo.nome === 'decisoes' && <Decisoes nav={nav} p={p} />}
      {topo.nome === 'decisao' && <DecisaoAndamento nav={nav} p={p} id={topo.id} />}
      {ehAba && <BarraAbas abas={ABAS_S} ativa={topo.nome} onAba={(id) => aba(id as TelaS['nome'])} />}
    </>
  )
}
