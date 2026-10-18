import { useMemo, useState } from 'react'
import { periodo, type Estado, type Lancamento } from './data'
import { dataBR, moeda, moedaComSinal } from './format'
import { Folha } from './components/Folha'
import { CLASSE_ESTADO, Icone, ROTULO_ESTADO } from './components/ui'

type Filtro = 'todos' | Estado

const FILTROS: { id: Filtro; rotulo: string }[] = [
  { id: 'todos', rotulo: 'Todos' },
  { id: 'com', rotulo: ROTULO_ESTADO.com },
  { id: 'aguardando', rotulo: ROTULO_ESTADO.aguardando },
  { id: 'sem', rotulo: ROTULO_ESTADO.sem }
]

const CHAVE_PEDIDOS = 'caixa-de-vidro:pedidos'

function lerPedidos(): string[] {
  try {
    return JSON.parse(localStorage.getItem(CHAVE_PEDIDOS) ?? '[]')
  } catch {
    return []
  }
}

export default function Morador() {
  const [filtro, setFiltro] = useState<Filtro>('todos')
  const [aberto, setAberto] = useState<Lancamento | null>(null)
  const [pedidos, setPedidos] = useState<string[]>(lerPedidos)

  const entradas = useMemo(
    () => periodo.lancamentos.filter((l) => l.valor > 0).reduce((s, l) => s + l.valor, 0),
    []
  )
  const gastos = useMemo(
    () => periodo.lancamentos.filter((l) => l.valor < 0).reduce((s, l) => s + l.valor, 0),
    []
  )
  const visiveis = periodo.lancamentos
    .filter((l) => filtro === 'todos' || l.estado === filtro)
    .sort((a, b) => b.data.localeCompare(a.data))
  const somaVisiveis = visiveis.reduce((s, l) => s + l.valor, 0)

  function pedirExplicacao(id: string) {
    const proximos = pedidos.includes(id) ? pedidos : [...pedidos, id]
    setPedidos(proximos)
    try {
      localStorage.setItem(CHAVE_PEDIDOS, JSON.stringify(proximos))
    } catch {
      /* sem armazenamento: o pedido vale só nesta sessão */
    }
  }

  return (
    <>

      <h1 className="page-title">Prestação de contas — {periodo.rotulo}</h1>
      <p className="page-sub">Cada número com a sua origem.</p>

      <div className="hero">
        <div className="blob b1" />
        <div className="blob b2" />
        <section className="painel" aria-label="Saldo em caixa">
          <p className="k">Saldo em caixa</p>
          <p className="figure">{moeda(periodo.saldoEmCaixa)}</p>
          <p className="caption">
            Fonte: {periodo.fonteSaldo} · atualizado {periodo.atualizadoEm}
          </p>
          <div className="split">
            <div>
              <p className="k">Entradas em {periodo.rotulo}</p>
              <span className="num in">{moedaComSinal(entradas)}</span>
            </div>
            <div>
              <p className="k">Gastos em {periodo.rotulo}</p>
              <span className="num">{moedaComSinal(gastos)}</span>
            </div>
          </div>
        </section>
      </div>

      <section className="section" aria-labelledby="lanc">
        <h2 className="heading" id="lanc">
          Lançamentos
        </h2>
        <div className="chips" role="group" aria-label="Filtrar por comprovante">
          {FILTROS.map((f) => (
            <button
              key={f.id}
              className="chip"
              aria-pressed={filtro === f.id}
              onClick={() => setFiltro(f.id)}
            >
              {f.rotulo}
            </button>
          ))}
        </div>

        {visiveis.length === 0 ? (
          <p className="empty">Nenhum lançamento neste filtro.</p>
        ) : (
          <>
            <ul className="list">
              {visiveis.map((l) => (
                <li className="item" key={l.id}>
                  <button className="item-btn" onClick={() => setAberto(l)}>
                    <span className="desc">{l.descricao}</span>
                    <span className={`amt ${l.valor > 0 ? 'in' : ''}`}>{moedaComSinal(l.valor)}</span>
                    <span className="caption">
                      {dataBR(l.data)} · {l.categoria} · {l.contexto}
                    </span>
                    <span className={`proof ${CLASSE_ESTADO[l.estado]}`}>
                      <Icone estado={l.estado} />
                      {l.estado === 'com' ? <span className="lnk">{l.comprovante}</span> : ROTULO_ESTADO[l.estado]}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            <div className="total">
              <span className="k">Soma dos lançamentos listados</span>
              <span className="num">{moedaComSinal(somaVisiveis)}</span>
            </div>
          </>
        )}
      </section>

      {aberto && (
        <Folha
          lancamento={aberto}
          explicacaoPedida={pedidos.includes(aberto.id)}
          onPedirExplicacao={() => pedirExplicacao(aberto.id)}
          onFechar={() => setAberto(null)}
        />
      )}
    </>
  )
}
