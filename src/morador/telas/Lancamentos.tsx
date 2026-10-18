import { useMemo, useState } from 'react'
import { Ic } from '../../components/ui'
import { moedaComSinal } from '../../format'
import { FONTE_BALANCETE, PERIODO, lancamentosDoMes } from '../dados'
import { LinhaLancamento } from '../componentes'
import type { Filtro, Props } from '../tipos'

export default function Lancamentos({ nav, filtroInicial }: Props & { filtroInicial?: Filtro }) {
  const [filtro, setFiltro] = useState<Filtro>(filtroInicial ?? 'todos')
  const [busca, setBusca] = useState('')
  const todos = useMemo(lancamentosDoMes, [])
  const semCount = todos.filter((l) => l.estado === 'sem').length

  const termo = busca.trim().toLowerCase()
  const visiveis = todos.filter((l) => {
    if (filtro === 'entradas' && l.valor <= 0) return false
    if (filtro === 'gastos' && l.valor >= 0) return false
    if (filtro === 'sem' && l.estado !== 'sem') return false
    if (!termo) return true
    return `${l.descricao} ${l.fornecedor?.nome ?? ''} ${l.categoria}`.toLowerCase().includes(termo)
  })
  const soma = visiveis.reduce((s, l) => s + l.valor, 0)

  return (
    <main className="page com-abas">
      <header className="cab">
        <div className="cab-linha">
          <h1 className="page-title">Lançamentos</h1>
          <span className="mes">{PERIODO.curto}</span>
        </div>
        <div className="busca">
          <label htmlFor="busca" className="sr-only">
            Buscar lançamento
          </label>
          <Ic n="busca" size={18} />
          <input
            id="busca"
            type="search"
            placeholder="Buscar por descrição ou fornecedor"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
        <div className="chips" role="group" aria-label="Filtrar lançamentos" style={{ margin: 0 }}>
          <button className="chip" aria-pressed={filtro === 'todos'} onClick={() => setFiltro('todos')}>
            Todos {todos.length}
          </button>
          <button className="chip" aria-pressed={filtro === 'entradas'} onClick={() => setFiltro('entradas')}>
            Entradas
          </button>
          <button className="chip" aria-pressed={filtro === 'gastos'} onClick={() => setFiltro('gastos')}>
            Gastos
          </button>
          <button className="chip crit" aria-pressed={filtro === 'sem'} onClick={() => setFiltro('sem')}>
            <Ic n="erro" size={14} />
            Sem comprovante {semCount}
          </button>
        </div>
        <p className="caption">Fonte: {FONTE_BALANCETE}</p>
      </header>

      {visiveis.length === 0 ? (
        <p className="empty">Nenhum lançamento encontrado com esse filtro.</p>
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
