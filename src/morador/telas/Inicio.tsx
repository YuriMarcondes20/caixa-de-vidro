import { useState } from 'react'
import { Hero, Ic } from '../../components/ui'
import { aplicarLetras, lerLetras, type Letras } from '../../letras'
import { moeda, moedaComSinal, percentual } from '../../format'
import { CONDOMINIO, PERIODO, PRESTADORES, RESUMO, diasDecorridos, lancamentosDoMes, totalOrcamento, variacao } from '../dados'
import type { Props } from '../tipos'

export default function Inicio({ nav, p, onSair }: Props & { onSair: () => void }) {
  const [letras, setLetras] = useState<Letras>(lerLetras)
  const semComprovante = lancamentosDoMes().filter((l) => l.estado === 'sem')
  const somaSem = semComprovante.reduce((s, l) => s + Math.abs(l.valor), 0)
  const aguardando = p.perguntas.filter((x) => !x.respondida)
  const maisAntiga = Math.max(0, ...aguardando.map(diasDecorridos))
  const orc = totalOrcamento()
  const v = variacao(orc.gasto, orc.previsto)

  function escolher(l: Letras) {
    aplicarLetras(l)
    setLetras(l)
  }

  return (
    <main className="page com-abas">
      <header className="cab">
        <div className="cab-linha">
          <span className="caption">{CONDOMINIO}</span>
          <button className="btn text" onClick={onSair}>
            Sair
          </button>
        </div>
        <h1 className="page-title">Contas do condomínio</h1>
        <p className="ajuda">Resumo do dinheiro do condomínio em {PERIODO.longo}. Toque nos cartões para ver os detalhes.</p>
      </header>

      <Hero>
        <section className="painel" aria-label="Dinheiro em conta">
          <p className="k">Dinheiro em conta no fim do mês</p>
          <p className="figure">{moeda(RESUMO.saldoFinal)}</p>
          <p className="caption">Fonte: balancete de setembro (relatório das contas do mês), conferido pelo conselho fiscal em 14/10</p>
          <div className="split">
            <div>
              <p className="k">Entrou no mês</p>
              <span className="num in">{moedaComSinal(RESUMO.entradas)}</span>
            </div>
            <div>
              <p className="k">Saiu no mês</p>
              <span className="num">{moedaComSinal(-RESUMO.gastos)}</span>
            </div>
          </div>
        </section>
      </Hero>

      <div className="grade2">
        <div className="stat">
          <p className="caption">Fundo de reserva</p>
          <p className="num">{moeda(RESUMO.fundoReserva)}</p>
          <p className="dica">Guardado para emergências e obras</p>
        </div>
        <div className="stat">
          <p className="caption">Contas em atraso</p>
          <p className="num">{RESUMO.inadimplencia}</p>
          <p className="dica">Moradores que ainda não pagaram</p>
        </div>
        <button className="stat link" onClick={() => nav.aba('orcamento')}>
          <p className="caption">Gastos do mês</p>
          <p className="num" style={{ color: v > 0 ? 'var(--atencao)' : undefined }}>
            {percentual(Math.abs(v))} {v >= 0 ? 'acima' : 'abaixo'} do previsto
          </p>
          <p className="dica">Toque para ver</p>
        </button>
        <button className="stat link" onClick={() => nav.aba('lancamentos')}>
          <p className="caption">Notas e recibos</p>
          <p className="num">
            {RESUMO.comprovantesCom} de {RESUMO.comprovantesTotal}
          </p>
          <p className="dica">Toque para ver</p>
        </button>
      </div>

      <section className="section" aria-labelledby="abertos">
        <h2 className="heading" id="abertos">
          O que precisa de atenção
        </h2>
        <div className="caixa-lista">
          {semComprovante.length > 0 && (
            <button className="ponto crit" onClick={() => nav.aba('lancamentos', 'sem')}>
              <Ic n="erro" size={22} />
              <span className="ponto-t">
                {semComprovante.length} {semComprovante.length === 1 ? 'gasto sem comprovante' : 'gastos sem comprovante'}
              </span>
              <span className="num">{moeda(somaSem)}</span>
            </button>
          )}
          {aguardando.length > 0 && (
            <button className="ponto warn" onClick={() => nav.aba('perguntas')}>
              <Ic n="espera" size={22} />
              <span className="ponto-t">
                {aguardando.length} {aguardando.length === 1 ? 'pergunta sem resposta' : 'perguntas sem resposta'}
              </span>
              <span className="caption" style={{ color: 'inherit' }}>
                {maisAntiga === 0 ? 'hoje' : `há ${maisAntiga} ${maisAntiga === 1 ? 'dia' : 'dias'}`}
              </span>
            </button>
          )}
          {semComprovante.length === 0 && aguardando.length === 0 && (
            <p className="empty">Nada precisa de atenção neste mês.</p>
          )}
        </div>
      </section>

      <section className="section" aria-labelledby="prest">
        <h2 className="heading" id="prest">
          Quem recebeu do condomínio
        </h2>
        <button className="cartao-link" onClick={() => nav.ir({ nome: 'prestadores' })}>
          <Ic n="pessoas" size={24} sw={1.5} />
          <span className="ponto-t">
            Veja quanto cada um dos {PRESTADORES.length} prestadores de serviço recebeu em 2026
          </span>
          <Ic n="avancar" size={20} />
        </button>
      </section>

      <section className="section letras" aria-labelledby="lt">
        <h2 className="heading" id="lt">
          Tamanho das letras
        </h2>
        <div className="seg" role="group" aria-labelledby="lt" style={{ marginTop: 'var(--space-3)' }}>
          <button aria-pressed={letras === 'normal'} onClick={() => escolher('normal')}>
            Normal
          </button>
          <button aria-pressed={letras === 'grande'} onClick={() => escolher('grande')}>
            Grande
          </button>
        </div>
      </section>
    </main>
  )
}
