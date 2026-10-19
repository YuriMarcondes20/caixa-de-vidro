import { CLASSE_ESTADO, IconeEstado } from '../../components/ui'
import { moeda } from '../../format'
import { Voltar } from '../BarraAbas'
import { PRESTADORES, resumoPrestador } from '../dados'
import type { Props } from '../tipos'

export default function Prestadores({ nav }: Props) {
  const linhas = PRESTADORES.map((p) => ({ p, r: resumoPrestador(p.id) })).sort((a, b) => b.r.recebido - a.r.recebido)
  const total = linhas.reduce((s, x) => s + x.r.recebido, 0)

  return (
    <main className="page">
      <header className="cab">
        <Voltar rotulo={nav.anterior} onClick={nav.voltar} />
        <h1 className="page-title">Prestadores de serviço</h1>
        <p className="caption">Quem recebeu dinheiro do condomínio em 2026 · fonte: balancetes. Toque num prestador para ver o histórico.</p>
      </header>

      <ul className="list" style={{ marginTop: 'var(--space-4)' }}>
        {linhas.map(({ p, r }) => {
          const estado = r.semComprovante > 0 ? 'sem' : r.aguardando > 0 ? 'aguardando' : 'com'
          const rotulo =
            estado === 'sem'
              ? `${r.semComprovante} sem comprovante`
              : estado === 'aguardando'
                ? `${r.aguardando} aguardando comprovante`
                : 'Todos com comprovante'
          return (
            <li className="item" key={p.id}>
              <button className="item-btn" onClick={() => nav.ir({ nome: 'prestador', id: p.id })}>
                <span className="desc">{p.nome}</span>
                <span className="amt">{moeda(r.recebido)}</span>
                <span className="caption">
                  {p.categoria} · {r.pagamentos} {r.pagamentos === 1 ? 'pagamento' : 'pagamentos'}
                </span>
                <span className={`proof ${CLASSE_ESTADO[estado]}`}>
                  <IconeEstado estado={estado} size={14} />
                  {rotulo}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
      <div className="total">
        <span className="k">Total pago a prestadores</span>
        <span className="num">{moeda(total)}</span>
      </div>
    </main>
  )
}
