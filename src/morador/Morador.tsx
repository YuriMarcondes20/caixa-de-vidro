import { useEffect } from 'react'
import { useNavegacao } from '../navegacao'
import type { Sessao } from '../sessao'
import { BarraAbas, type Aba } from './BarraAbas'
import DecisaoDetalhe from './telas/DecisaoDetalhe'
import Decisoes from './telas/Decisoes'
import Inicio from './telas/Inicio'
import LancamentoDetalhe from './telas/LancamentoDetalhe'
import Lancamentos from './telas/Lancamentos'
import Orcamento from './telas/Orcamento'
import PerguntaDetalhe from './telas/PerguntaDetalhe'
import PerguntaNova from './telas/PerguntaNova'
import Perguntas from './telas/Perguntas'
import Prestador from './telas/Prestador'
import Prestadores from './telas/Prestadores'
import { ABAS, ROTULO_ABA, ROTULO_TELA, type Filtro, type Nav, type NomeAba, type Tela } from './tipos'
import { usePerguntas } from './usePerguntas'

const INICIO: Tela = { nome: 'inicio' }
const BARRA: Aba[] = ABAS.map((n) => ({ id: n, rotulo: ROTULO_ABA[n], icone: n }))

export default function Morador({ sessao, onSair }: { sessao: Sessao; onSair: () => void }) {
  const p = usePerguntas()
  const n = useNavegacao<Tela>('morador', INICIO)
  const { pilha, topo } = n

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [topo])

  const aba = (nome: NomeAba, filtro?: Filtro) => n.trocarAba(nome === 'lancamentos' ? { nome, filtro } : { nome })
  const anterior = pilha.length > 1 ? ROTULO_TELA[pilha[pilha.length - 2].nome] : 'Início'
  const nav: Nav = { ir: n.ir, voltar: n.voltar, aba, substituir: n.substituir, anterior }
  const autor = `Morador do Bloco ${sessao.bloco ?? '—'}`
  const ehAba = (ABAS as readonly string[]).includes(topo.nome)

  return (
    <>
      {topo.nome === 'inicio' && <Inicio nav={nav} p={p} onSair={() => n.sair(onSair)} />}
      {topo.nome === 'lancamentos' && <Lancamentos nav={nav} p={p} filtroInicial={topo.filtro} />}
      {topo.nome === 'lancamento' && <LancamentoDetalhe nav={nav} p={p} id={topo.id} />}
      {topo.nome === 'orcamento' && <Orcamento nav={nav} p={p} />}
      {topo.nome === 'decisoes' && <Decisoes nav={nav} p={p} />}
      {topo.nome === 'decisao' && <DecisaoDetalhe nav={nav} p={p} id={topo.id} />}
      {topo.nome === 'perguntas' && <Perguntas nav={nav} p={p} />}
      {topo.nome === 'pergunta-nova' && <PerguntaNova nav={nav} p={p} alvo={topo.alvo} autor={autor} />}
      {topo.nome === 'pergunta' && <PerguntaDetalhe nav={nav} p={p} id={topo.id} nova={topo.nova} />}
      {topo.nome === 'prestadores' && <Prestadores nav={nav} p={p} />}
      {topo.nome === 'prestador' && <Prestador nav={nav} p={p} id={topo.id} />}
      {ehAba && <BarraAbas abas={BARRA} ativa={topo.nome} onAba={(id) => aba(id as NomeAba)} />}
    </>
  )
}
