import { useCallback, useEffect, useState } from 'react'
import type { Sessao } from '../sessao'
import { BarraAbas } from './BarraAbas'
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
import { ABAS, ROTULO_TELA, type Filtro, type Nav, type NomeAba, type Tela } from './tipos'
import { usePerguntas } from './usePerguntas'

export default function Morador({ sessao, onSair }: { sessao: Sessao; onSair: () => void }) {
  const p = usePerguntas()
  const [pilha, setPilha] = useState<Tela[]>([{ nome: 'inicio' }])
  const topo = pilha[pilha.length - 1]

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [topo])

  const ir = useCallback((t: Tela) => setPilha((s) => [...s, t]), [])
  const voltar = useCallback(() => setPilha((s) => (s.length > 1 ? s.slice(0, -1) : s)), [])
  const aba = useCallback(
    (n: NomeAba, filtro?: Filtro) => setPilha([n === 'lancamentos' ? { nome: n, filtro } : { nome: n }]),
    []
  )
  const substituir = useCallback((t: Tela) => setPilha((s) => [...s.slice(0, -1), t]), [])

  const anterior = pilha.length > 1 ? ROTULO_TELA[pilha[pilha.length - 2].nome] : 'Início'
  const nav: Nav = { ir, voltar, aba, substituir, anterior }
  const autor = `Morador do Bloco ${sessao.bloco ?? '—'}`
  const ehAba = (ABAS as readonly string[]).includes(topo.nome)

  return (
    <>
      {topo.nome === 'inicio' && <Inicio nav={nav} p={p} onSair={onSair} />}
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
      {ehAba && <BarraAbas ativa={topo.nome as NomeAba} onAba={aba} />}
    </>
  )
}
