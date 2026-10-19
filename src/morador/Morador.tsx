import { useCallback, useEffect, useRef, useState } from 'react'
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

/** Cada entrada do histórico do navegador guarda a pilha de telas inteira: voltar do celular restaura a tela anterior. */
interface EstadoHistorico {
  pilha: Tela[]
  /** Quantas entradas foram empilhadas desde a abertura do app. */
  d: number
}

const INICIO: Tela[] = [{ nome: 'inicio' }]

function estadoSalvo(): EstadoHistorico | null {
  const s = window.history.state as Partial<EstadoHistorico> | null
  return s && Array.isArray(s.pilha) && s.pilha.length > 0 && typeof s.d === 'number' ? (s as EstadoHistorico) : null
}

export default function Morador({ sessao, onSair }: { sessao: Sessao; onSair: () => void }) {
  const p = usePerguntas()
  const [pilha, setPilha] = useState<Tela[]>(() => estadoSalvo()?.pilha ?? INICIO)
  const pilhaRef = useRef(pilha)
  const profundidade = useRef(estadoSalvo()?.d ?? 0)
  pilhaRef.current = pilha
  const topo = pilha[pilha.length - 1]

  // Voltar do celular (ou do navegador) restaura a pilha guardada naquela entrada do histórico.
  useEffect(() => {
    if (!estadoSalvo()) window.history.replaceState({ pilha: INICIO, d: 0 } satisfies EstadoHistorico, '')
    const aoVoltar = (e: PopStateEvent) => {
      const s = e.state as Partial<EstadoHistorico> | null
      if (s && Array.isArray(s.pilha) && s.pilha.length > 0) {
        setPilha(s.pilha)
        profundidade.current = typeof s.d === 'number' ? s.d : 0
      }
    }
    window.addEventListener('popstate', aoVoltar)
    return () => window.removeEventListener('popstate', aoVoltar)
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [topo])

  const empurrar = useCallback((nova: Tela[]) => {
    profundidade.current += 1
    window.history.pushState({ pilha: nova, d: profundidade.current } satisfies EstadoHistorico, '')
    setPilha(nova)
  }, [])

  const ir = useCallback((t: Tela) => empurrar([...pilhaRef.current, t]), [empurrar])
  const voltar = useCallback(() => {
    if (pilhaRef.current.length > 1) window.history.back()
  }, [])
  const aba = useCallback(
    (n: NomeAba, filtro?: Filtro) => {
      // Tocar na aba em que já está não cria uma entrada nova no histórico.
      const atual = pilhaRef.current
      if (atual.length === 1 && atual[0].nome === n && !filtro) return
      empurrar([n === 'lancamentos' ? { nome: n, filtro } : { nome: n }])
    },
    [empurrar]
  )
  const substituir = useCallback((t: Tela) => {
    const nova = [...pilhaRef.current.slice(0, -1), t]
    window.history.replaceState({ pilha: nova, d: profundidade.current } satisfies EstadoHistorico, '')
    setPilha(nova)
  }, [])

  /** Ao sair, desfaz as entradas empilhadas: o "voltar" do celular não fica "morto" na tela de entrada. */
  const sair = useCallback(() => {
    const n = profundidade.current
    if (n <= 0) return onSair()
    const depois = () => {
      window.removeEventListener('popstate', depois)
      onSair()
    }
    window.addEventListener('popstate', depois)
    window.history.go(-n)
  }, [onSair])

  const anterior = pilha.length > 1 ? ROTULO_TELA[pilha[pilha.length - 2].nome] : 'Início'
  const nav: Nav = { ir, voltar, aba, substituir, anterior }
  const autor = `Morador do Bloco ${sessao.bloco ?? '—'}`
  const ehAba = (ABAS as readonly string[]).includes(topo.nome)

  return (
    <>
      {topo.nome === 'inicio' && <Inicio nav={nav} p={p} onSair={sair} />}
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
