import { Ic } from '../../components/ui'
import { dataBR, moeda } from '../../format'
import { listaDecisoes } from '../../morador/dados'
import { CLASSE_DECISAO, ICONE_DECISAO, ROTULO_DECISAO } from '../../morador/telas/Decisoes'
import type { PropsS } from '../tipos'

export default function Decisoes({ nav }: PropsS) {
  const decisoes = listaDecisoes()

  return (
    <main className="page com-abas">
      <header className="cab">
        <h1 className="page-title">Decisões</h1>
        <p className="ajuda">
          O que os moradores decidiram nas assembleias. Toque numa decisão para atualizar o andamento: os moradores veem a mudança.
        </p>
      </header>

      <div className="pilha">
        {decisoes.map((d) => {
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
                <span className="mono-leve caption">
                  {moeda(d.gasto)} gastos de {moeda(d.aprovado)} · {pct}%
                </span>
              )}
              {d.pendencia && (
                <span className="caption atencao">
                  <Ic n="espera" size={14} /> {d.pendencia}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </main>
  )
}
