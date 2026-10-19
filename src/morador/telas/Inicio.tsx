import { Hero, Ic } from '../../components/ui'
import { moeda, moedaComSinal, percentual } from '../../format'
import { CONDOMINIO, PERIODO, PRESTADORES, RESUMO, diasDecorridos, lancamentosDoMes, totalOrcamento, variacao } from '../dados'
import type { Props } from '../tipos'

export default function Inicio({ nav, p, onSair }: Props & { onSair: () => void }) {
  const semComprovante = lancamentosDoMes().filter((l) => l.estado === 'sem')
  const somaSem = semComprovante.reduce((s, l) => s + Math.abs(l.valor), 0)
  const aguardando = p.perguntas.filter((x) => !x.respondida)
  const maisAntiga = Math.max(0, ...aguardando.map(diasDecorridos))
  const orc = totalOrcamento()
  const v = variacao(orc.gasto, orc.previsto)

  return (
    <main className="page com-abas">
      <header className="cab">
        <div className="cab-linha">
          <span className="caption">{CONDOMINIO}</span>
          <span className="mes">{PERIODO.longo}</span>
        </div>
        <div className="cab-linha">
          <h1 className="page-title">Prestação de contas</h1>
          <button className="btn text" onClick={onSair}>
            Sair
          </button>
        </div>
      </header>

      <Hero>
        <section className="painel" aria-label="Saldo do mês">
          <p className="k">Saldo final em conta</p>
          <p className="figure">{moeda(RESUMO.saldoFinal)}</p>
          <p className="caption">Balancete de setembro · conferido pelo conselho em 14/10</p>
          <div className="split">
            <div>
              <p className="k">Entradas</p>
              <span className="num in">{moedaComSinal(RESUMO.entradas)}</span>
            </div>
            <div>
              <p className="k">Gastos</p>
              <span className="num">{moedaComSinal(-RESUMO.gastos)}</span>
            </div>
          </div>
        </section>
      </Hero>

      <div className="grade2">
        <div className="stat">
          <p className="caption">Fundo de reserva</p>
          <p className="num">{moeda(RESUMO.fundoReserva)}</p>
        </div>
        <div className="stat">
          <p className="caption">Inadimplência</p>
          <p className="num">{RESUMO.inadimplencia}</p>
        </div>
        <button className="stat link" onClick={() => nav.aba('orcamento')}>
          <p className="caption">Orçamento do mês</p>
          <p className="num" style={{ color: v > 0 ? 'var(--atencao)' : undefined }}>
            {v >= 0 ? '+' : '−'}
            {percentual(Math.abs(v))} do previsto
          </p>
        </button>
        <button className="stat link" onClick={() => nav.aba('lancamentos')}>
          <p className="caption">Comprovantes</p>
          <p className="num">
            {RESUMO.comprovantesCom} de {RESUMO.comprovantesTotal}
          </p>
        </button>
      </div>

      <section className="section" aria-labelledby="abertos">
        <h2 className="heading" id="abertos">
          Pontos em aberto
        </h2>
        <div className="caixa-lista">
          {semComprovante.length > 0 && (
            <button className="ponto crit" onClick={() => nav.aba('lancamentos', 'sem')}>
              <Ic n="erro" size={18} />
              <span className="ponto-t">
                {semComprovante.length} {semComprovante.length === 1 ? 'gasto sem comprovante' : 'gastos sem comprovante'}
              </span>
              <span className="num">{moeda(somaSem)}</span>
            </button>
          )}
          {aguardando.length > 0 && (
            <button className="ponto warn" onClick={() => nav.aba('perguntas')}>
              <Ic n="espera" size={18} />
              <span className="ponto-t">
                {aguardando.length} {aguardando.length === 1 ? 'pergunta sem resposta' : 'perguntas sem resposta'}
              </span>
              <span className="caption" style={{ color: 'inherit' }}>
                {maisAntiga === 0 ? 'hoje' : `há ${maisAntiga} ${maisAntiga === 1 ? 'dia' : 'dias'}`}
              </span>
            </button>
          )}
          {semComprovante.length === 0 && aguardando.length === 0 && (
            <p className="empty">Nenhum ponto em aberto neste mês.</p>
          )}
        </div>
      </section>

      <section className="section" aria-labelledby="prest">
        <h2 className="heading" id="prest">
          Prestadores de serviço
        </h2>
        <button className="cartao-link" onClick={() => nav.ir({ nome: 'prestadores' })}>
          <Ic n="pessoas" size={18} sw={1.5} />
          <span className="ponto-t">
            {PRESTADORES.length} prestadores receberam em 2026 · veja quanto cada um recebeu
          </span>
          <Ic n="avancar" size={16} />
        </button>
      </section>
    </main>
  )
}
