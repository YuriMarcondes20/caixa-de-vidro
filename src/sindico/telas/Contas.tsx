import { useState } from 'react'
import { Ic } from '../../components/ui'
import { moedaComSinal } from '../../format'
import { LinhaLancamento } from '../../morador/componentes'
import { PERIODO, lancamentosDoMes } from '../../morador/dados'
import type { FiltroContas, PropsS } from '../tipos'

export default function Contas({ nav, filtroInicial }: PropsS & { filtroInicial?: FiltroContas }) {
  const [filtro, setFiltro] = useState<FiltroContas>(filtroInicial ?? 'todos')
  const todos = lancamentosDoMes()
  const sem = todos.filter((l) => l.estado === 'sem').length
  const aguardando = todos.filter((l) => l.estado === 'aguardando').length
  const visiveis = todos.filter((l) => filtro === 'todos' || l.estado === filtro)
  const soma = visiveis.reduce((s, l) => s + l.valor, 0)

  return (
    <main className="page com-abas">
      <header className="cab">
        <div className="cab-linha">
          <h1 className="page-title">Contas do mês</h1>
          <span className="mes">{PERIODO.curto}</span>
        </div>
        <p className="ajuda">Confira os lançamentos e anexe os comprovantes que faltam. Os moradores veem tudo o que você registra aqui.</p>
        <button className="btn primary" onClick={() => nav.ir({ nome: 'novo-lancamento' })}>
          <Ic n="mais" size={18} />
          Novo lançamento
        </button>
        <div className="chips" role="group" aria-label="Filtrar lançamentos" style={{ margin: 0 }}>
          <button className="chip" aria-pressed={filtro === 'todos'} onClick={() => setFiltro('todos')}>
            Todos {todos.length}
          </button>
          <button className="chip crit" aria-pressed={filtro === 'sem'} onClick={() => setFiltro('sem')}>
            <Ic n="erro" size={14} />
            Sem comprovante {sem}
          </button>
          <button className="chip" aria-pressed={filtro === 'aguardando'} onClick={() => setFiltro('aguardando')}>
            <Ic n="espera" size={14} />
            Aguardando {aguardando}
          </button>
        </div>
      </header>

      {visiveis.length === 0 ? (
        <p className="empty">Nenhum lançamento neste filtro.</p>
      ) : (
        <>
          <ul className="list" style={{ marginTop: 'var(--space-3)' }}>
            {visiveis.map((l) => (
              <li className="item" key={l.id}>
                <LinhaLancamento l={l} onClick={() => nav.ir({ nome: 'lancamento', id: l.id })} />
              </li>
            ))}
          </ul>
          <div className="total">
            <span className="k">Soma dos lançamentos listados</span>
            <span className="num">{moedaComSinal(soma)}</span>
          </div>
        </>
      )}
    </main>
  )
}
