import { useState } from 'react'
import { Hero } from '../../components/ui'
import { moeda, percentual } from '../../format'
import { ORCAMENTO, ORCAMENTO_FONTE, totalOrcamento, variacao } from '../dados'
import type { Props } from '../tipos'

/** Posição do "previsto" na barra: deixa folga à direita para mostrar o que passou. */
const POSICAO_PREVISTO = 76.9
const LIMITE_ATENCAO = 5

function rotuloVariacao(v: number): string {
  const arred = Math.round(Math.abs(v) * 10) / 10
  if (arred === 0) return 'No previsto'
  return `${percentual(arred)} ${v > 0 ? 'acima' : 'abaixo'}`
}

export default function Orcamento({ nav }: Props) {
  const [periodo, setPeriodo] = useState<'mes' | 'ano'>('mes')
  const total = totalOrcamento()
  const vt = variacao(total.gasto, total.previsto)

  return (
    <main className="page com-abas">
      <header className="cab">
        <h1 className="page-title">Orçamento</h1>
        <p className="ajuda">Compara quanto estava previsto gastar com quanto foi gasto de verdade.</p>
        <div className="seg" role="group" aria-label="Período">
          <button aria-pressed={periodo === 'mes'} onClick={() => setPeriodo('mes')}>
            Setembro
          </button>
          <button aria-pressed={periodo === 'ano'} onClick={() => setPeriodo('ano')}>
            Acumulado 2026
          </button>
        </div>
      </header>

      {periodo === 'ano' ? (
        <section className="painel" style={{ marginTop: 'var(--space-4)' }}>
          <p className="k">Acumulado 2026</p>
          <p className="caption">O acumulado do ano ainda não está disponível neste exemplo. Veja o mês de setembro.</p>
        </section>
      ) : (
        <>
          <Hero espelhado>
            <section className="painel" aria-label="Total do mês">
              <p className="k">Gasto em setembro</p>
              <p className="figure">{moeda(total.gasto)}</p>
              <p className="corpo">
                de <span className="mono-leve">{moeda(total.previsto)}</span> previstos ·{' '}
                <strong style={{ color: vt >= LIMITE_ATENCAO || vt > 0 ? 'var(--atencao)' : undefined }}>
                  {rotuloVariacao(vt)}
                </strong>
              </p>
              <p className="caption" style={{ marginTop: 'var(--space-2)' }}>
                {ORCAMENTO_FONTE}
              </p>
            </section>
          </Hero>

          <ul className="list" style={{ marginTop: 'var(--space-3)' }}>
            {ORCAMENTO.map((c) => {
              const v = variacao(c.gasto, c.previsto)
              const alerta = v >= LIMITE_ATENCAO
              const largura = Math.min(100, (c.gasto / c.previsto) * POSICAO_PREVISTO)
              return (
                <li className="item" key={c.nome}>
                  <button className="orc-item" onClick={() => nav.aba('lancamentos')}>
                    <span className="orc-topo">
                      <span className="desc">{c.nome}</span>
                      <span className="orc-var" style={{ color: alerta ? 'var(--atencao)' : undefined }}>
                        {rotuloVariacao(v)}
                      </span>
                    </span>
                    <span className="trilho" aria-hidden="true">
                      <span className="enchimento" style={{ width: `${largura}%`, background: alerta ? 'var(--atencao)' : 'var(--vidro)' }} />
                      <span className="marcador" style={{ left: `${POSICAO_PREVISTO}%` }} />
                    </span>
                    <span className="mono-leve caption">
                      {moeda(c.gasto)} de {moeda(c.previsto)}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
          <p className="caption" style={{ marginTop: 'var(--space-2)' }}>
            O risquinho na barra marca o valor previsto: se a barra passa dele, gastou-se mais que o previsto. Toque numa linha para ver os gastos.
          </p>
        </>
      )}
    </main>
  )
}
