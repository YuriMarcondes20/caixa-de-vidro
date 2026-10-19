import { useState } from 'react'
import { Ic, type NomeIcone } from '../../components/ui'
import { dataBR, moeda } from '../../format'
import { listaDecisoes, type EstadoDecisao } from '../dados'
import type { Props } from '../tipos'

type FiltroDecisao = 'todas' | EstadoDecisao

export const ROTULO_DECISAO: Record<EstadoDecisao, string> = {
  decidida: 'Decidida',
  execucao: 'Em execução',
  concluida: 'Concluída'
}

export const ICONE_DECISAO: Record<EstadoDecisao, NomeIcone> = {
  decidida: 'neutro',
  execucao: 'andamento',
  concluida: 'ok'
}

export const CLASSE_DECISAO: Record<EstadoDecisao, string> = {
  decidida: 'dec',
  execucao: 'exec',
  concluida: 'conc'
}

export default function Decisoes({ nav }: Props) {
  const [filtro, setFiltro] = useState<FiltroDecisao>('todas')
  const contar = (e: EstadoDecisao) => listaDecisoes().filter((d) => d.estado === e).length
  const visiveis = listaDecisoes().filter((d) => filtro === 'todas' || d.estado === filtro)

  const filtros: { id: FiltroDecisao; rotulo: string }[] = [
    { id: 'todas', rotulo: `Todas ${listaDecisoes().length}` },
    { id: 'execucao', rotulo: `Em execução ${contar('execucao')}` },
    { id: 'decidida', rotulo: `Decididas ${contar('decidida')}` },
    { id: 'concluida', rotulo: `Concluídas ${contar('concluida')}` }
  ]

  return (
    <main className="page com-abas">
      <header className="cab">
        <h1 className="page-title">Decisões</h1>
        <p className="ajuda">O que os moradores decidiram nas reuniões (assembleias) de 2026 e como está andando cada decisão.</p>
        <div className="chips" role="group" aria-label="Filtrar decisões" style={{ margin: 0 }}>
          {filtros.map((f) => (
            <button key={f.id} className="chip" aria-pressed={filtro === f.id} onClick={() => setFiltro(f.id)}>
              {f.rotulo}
            </button>
          ))}
        </div>
      </header>

      <div className="pilha">
        {visiveis.map((d) => {
          const pct = d.aprovado && d.gasto !== undefined ? Math.round((d.gasto / d.aprovado) * 100) : null
          return (
            <button className="cartao" key={d.id} onClick={() => nav.ir({ nome: 'decisao', id: d.id })}>
              <span className="cartao-topo">
                <span className="caption">
                  {d.assembleia} · {dataBR(d.data)}
                </span>
                <span className={`tag ${CLASSE_DECISAO[d.estado]}`}>
                  <Ic n={ICONE_DECISAO[d.estado]} size={14} />
                  {ROTULO_DECISAO[d.estado]}
                </span>
              </span>
              <span className="cartao-titulo">{d.titulo}</span>
              {pct !== null && d.aprovado && d.gasto !== undefined && (
                <>
                  <span className="trilho fino" aria-hidden="true">
                    <span className="enchimento" style={{ width: `${pct}%`, background: 'var(--vidro)' }} />
                  </span>
                  <span className="mono-leve caption">
                    {moeda(d.gasto)} gastos de {moeda(d.aprovado)} · {pct}%
                  </span>
                </>
              )}
              {d.pendencia && (
                <span className="caption atencao">
                  <Ic n="espera" size={14} /> {d.pendencia}
                </span>
              )}
              {d.resumo && <span className="caption">{d.resumo}</span>}
            </button>
          )
        })}
      </div>
    </main>
  )
}
