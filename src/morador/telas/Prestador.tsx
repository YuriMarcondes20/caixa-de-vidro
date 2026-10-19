import { Hero } from '../../components/ui'
import { dataBR, moeda, moedaComSinal } from '../../format'
import { Voltar } from '../BarraAbas'
import { LinhaLancamento } from '../componentes'
import { lancamentosDoPrestador, prestador, resumoPrestador } from '../dados'
import type { Props } from '../tipos'

export default function Prestador({ nav, id }: Props & { id: string }) {
  const pr = prestador(id)
  if (!pr) {
    return (
      <main className="page">
        <Voltar rotulo={nav.anterior} onClick={nav.voltar} />
        <p className="empty">Prestador não encontrado.</p>
      </main>
    )
  }

  const lista = lancamentosDoPrestador(id)
  const r = resumoPrestador(id)
  const soma = lista.reduce((s, l) => s + l.valor, 0)

  return (
    <main className="page">
      <header className="cab">
        <Voltar rotulo={nav.anterior} onClick={nav.voltar} />
        <h1 className="page-title menor">{pr.nome}</h1>
        <p className="caption">
          {[pr.doc, pr.categoria].filter(Boolean).join(' · ')}
          {pr.contrato && (
            <>
              <br />
              {pr.contrato}
            </>
          )}
        </p>
      </header>

      <Hero>
        <section className="painel" aria-label="Total recebido">
          <p className="k">Recebido em 2026</p>
          <p className="figure">{moeda(r.recebido)}</p>
          <p className="caption">
            Fonte: balancetes de 2026
            {r.primeiro && r.ultimo ? ` · de ${dataBR(r.primeiro)} a ${dataBR(r.ultimo.data)}` : ''}
          </p>
          <div className="split">
            <div>
              <p className="k">Pagamentos</p>
              <span className="num">{r.pagamentos}</span>
            </div>
            <div>
              <p className="k">Com comprovante</p>
              <span className="num">
                {r.comComprovante} de {r.pagamentos}
              </span>
            </div>
          </div>
        </section>
      </Hero>

      <section className="section" aria-labelledby="hist">
        <h2 className="heading" id="hist">
          Histórico de serviços
        </h2>
        <ul className="list" style={{ marginTop: 'var(--space-3)' }}>
          {lista.map((l) => (
            <li className="item" key={l.id}>
              <LinhaLancamento l={l} onClick={() => nav.ir({ nome: 'lancamento', id: l.id })} />
            </li>
          ))}
        </ul>
        <div className="total">
          <span className="k">Soma dos pagamentos listados</span>
          <span className="num">{moedaComSinal(soma)}</span>
        </div>
        <p className="caption" style={{ marginTop: 'var(--space-2)' }}>
          Valores pagos pelo condomínio a este prestador. Toque num serviço para ver o comprovante e a origem.
        </p>
      </section>
    </main>
  )
}
