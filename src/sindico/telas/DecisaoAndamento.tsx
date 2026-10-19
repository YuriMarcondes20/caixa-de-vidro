import { useState } from 'react'
import { Ic } from '../../components/ui'
import { dataBR, moeda } from '../../format'
import { Voltar } from '../../morador/BarraAbas'
import { EtapasDecisao } from '../../morador/componentes'
import { decisao, type EstadoDecisao } from '../../morador/dados'
import { ROTULO_DECISAO } from '../../morador/telas/Decisoes'
import { atualizarDecisao } from '../acoes'
import type { PropsS } from '../tipos'

const OPCOES: EstadoDecisao[] = ['decidida', 'execucao', 'concluida']

export default function DecisaoAndamento({ nav, id }: PropsS & { id: string }) {
  const d = decisao(id)
  const [mudou, setMudou] = useState<EstadoDecisao | null>(null)

  if (!d) {
    return (
      <main className="page">
        <Voltar onClick={nav.voltar} />
        <p className="empty">Decisão não encontrada.</p>
      </main>
    )
  }

  function escolher(e: EstadoDecisao) {
    if (!d || e === d.estado) return
    atualizarDecisao(d.id, e)
    setMudou(e)
  }

  return (
    <main className="page">
      <header className="cab">
        <Voltar onClick={nav.voltar} />
        {mudou && (
          <div className="sucesso" role="status">
            <Ic n="ok" size={22} />
            <span>
              <strong>Andamento atualizado.</strong> Os moradores já veem esta decisão como "{ROTULO_DECISAO[mudou]}".
            </span>
          </div>
        )}
        <h1 className="page-title menor">{d.titulo}</h1>
        <p className="caption">
          {d.assembleia} de {dataBR(d.data)} · item {d.pauta} da pauta
        </p>
      </header>

      <EtapasDecisao d={d} />

      <section className="cx" aria-labelledby="and">
        <p className="cx-t" id="and">
          Como está esta decisão agora?
        </p>
        <div className="chips" role="group" aria-labelledby="and" style={{ margin: 0 }}>
          {OPCOES.map((e) => (
            <button
              key={e}
              className="chip"
              aria-pressed={d.estado === e}
              onClick={() => escolher(e)}
            >
              {ROTULO_DECISAO[e]}
            </button>
          ))}
        </div>
        <p className="caption" style={{ marginTop: 'var(--space-3)' }}>
          Ao mudar, os moradores veem o novo andamento na hora. Use "Em execução" quando a obra ou o serviço começar e "Concluída" quando terminar.
        </p>
      </section>

      {d.aprovado !== undefined && (
        <section className="cx" aria-label="Dinheiro da decisão">
          <p className="cx-t">Dinheiro</p>
          <p className="corpo">
            Aprovado: <span className="mono-leve">{moeda(d.aprovado)}</span>
          </p>
          {d.gasto !== undefined && (
            <p className="corpo">
              Gasto até agora: <span className="mono-leve">{moeda(d.gasto)}</span>
            </p>
          )}
          {d.financiamento && <p className="caption">{d.financiamento}</p>}
        </section>
      )}
    </main>
  )
}
