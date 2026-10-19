import { Hero, Ic } from '../../components/ui'
import { dataBR, moeda } from '../../format'
import { BarraAcao, Voltar } from '../BarraAbas'
import { LinhaLancamento } from '../componentes'
import { UNIDADES, decisao, lancamento, type EstadoDecisao } from '../dados'
import type { Props } from '../tipos'

const ORDEM: Record<EstadoDecisao, number> = { decidida: 0, execucao: 1, concluida: 2 }
const NOMES = ['Decidida', 'Em execução', 'Concluída']

export default function DecisaoDetalhe({ nav, id }: Props & { id: string }) {
  const d = decisao(id)
  if (!d) {
    return (
      <main className="page">
        <Voltar onClick={nav.voltar} />
        <p className="empty">Decisão não encontrada.</p>
      </main>
    )
  }

  const idx = ORDEM[d.estado]
  const concluida = d.estado === 'concluida'
  const vinculados = d.lancamentos.map(lancamento).filter((l) => l !== undefined)
  const { presentes, favor, contra, abstencoes } = d.votos
  const pct = (n: number) => (n / presentes) * 100
  const executado = d.aprovado && d.gasto !== undefined ? Math.round((d.gasto / d.aprovado) * 100) : null

  return (
    <main className="page com-barra">
      <header className="cab">
        <Voltar onClick={nav.voltar} />
        <h1 className="page-title menor">{d.titulo}</h1>
        <p className="caption">
          {d.assembleia} de {dataBR(d.data)} · item {d.pauta} da pauta
        </p>
      </header>

      <ol className="etapas" aria-label="Andamento">
        {NOMES.map((nome, i) => {
          const feito = i < idx || (concluida && i === idx)
          const atual = i === idx && !concluida
          const marca = feito ? '✓' : atual ? '●' : '○'
          return (
            <li key={nome}>
              <span className="etapa-barra" style={{ background: i <= idx ? 'var(--vidro)' : 'var(--line)' }} />
              <span className="etapa-nome" style={{ color: atual ? 'var(--vidro)' : i > idx ? 'var(--ink-muted)' : undefined }}>
                {marca} {nome}
              </span>
              <span className="caption">{d.etapas[i]}</span>
            </li>
          )
        })}
      </ol>

      {d.aprovado !== undefined && (
        <Hero espelhado>
          <section className="painel" aria-label="Dinheiro da deliberação">
            <div className="split" style={{ marginTop: 0 }}>
              <div>
                <p className="k">Aprovado</p>
                <span className="num">{moeda(d.aprovado)}</span>
              </div>
              {d.gasto !== undefined && (
                <div>
                  <p className="k">Gasto até agora</p>
                  <span className="num">{moeda(d.gasto)}</span>
                </div>
              )}
            </div>
            {executado !== null && (
              <>
                <span className="trilho" aria-hidden="true" style={{ marginTop: 'var(--space-3)' }}>
                  <span className="enchimento" style={{ width: `${executado}%`, background: 'var(--vidro)' }} />
                </span>
                <p className="caption" style={{ marginTop: 'var(--space-2)' }}>
                  {executado}% executado{d.financiamento ? ` · ${d.financiamento}` : ''}
                </p>
              </>
            )}
          </section>
        </Hero>
      )}

      {d.pendencia && (
        <section className="prova">
          <Ic n="espera" size={22} sw={1.5} />
          <div>
            <p className="prova-t">Pendência</p>
            <p className="caption">{d.pendencia}</p>
          </div>
        </section>
      )}

      <section className="cx" aria-label="Votação">
        <p className="cx-t">
          Votação · {presentes} de {UNIDADES} unidades presentes
        </p>
        <div className="votos" aria-hidden="true">
          <span style={{ width: `${pct(favor)}%`, background: 'var(--positivo)' }} />
          <span style={{ width: `${pct(contra)}%`, background: 'var(--atencao)' }} />
          <span style={{ width: `${pct(abstencoes)}%`, background: 'var(--line)' }} />
        </div>
        <p className="num caption-ink">
          {favor} a favor · {contra} contra · {abstencoes} abstenções
        </p>
      </section>

      {vinculados.length > 0 && (
        <section aria-label="Lançamentos vinculados" style={{ marginTop: 'var(--space-3)' }}>
          <ul className="list">
            {vinculados.map((l) => (
              <li className="item" key={l.id}>
                <LinhaLancamento l={l} onClick={() => nav.ir({ nome: 'lancamento', id: l.id })} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {d.resumo && !d.linkOrcamento && (
        <section className="cx">
          <p className="caption-ink">{d.resumo}</p>
        </section>
      )}

      {d.linkOrcamento && (
        <button className="cartao-link" onClick={() => nav.aba('orcamento')}>
          <Ic n="orcamento" size={18} sw={1.5} />
          <span className="ponto-t">Ver previsto × realizado</span>
          <Ic n="avancar" size={16} />
        </button>
      )}

      <BarraAcao>
        <button className="btn primary grow" onClick={() => nav.ir({ nome: 'pergunta-nova', alvo: { tipo: 'decisao', id: d.id } })}>
          <Ic n="perguntas" size={18} sw={1.5} />
          Perguntar sobre isto
        </button>
      </BarraAcao>
    </main>
  )
}
