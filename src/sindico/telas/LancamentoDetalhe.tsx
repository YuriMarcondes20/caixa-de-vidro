import { useState } from 'react'
import { Ic, Status } from '../../components/ui'
import { dataBR, moedaComSinal } from '../../format'
import { Voltar } from '../../morador/BarraAbas'
import { lancamento } from '../../morador/dados'
import { anexarComprovante } from '../acoes'
import type { PropsS } from '../tipos'

export default function LancamentoDetalhe({ nav, id, novo }: PropsS & { id: string; novo?: boolean }) {
  const l = lancamento(id)
  const [numero, setNumero] = useState('')
  const [anexado, setAnexado] = useState(false)

  if (!l) {
    return (
      <main className="page">
        <Voltar onClick={nav.voltar} />
        <p className="empty">Lançamento não encontrado.</p>
      </main>
    )
  }

  const pendente = l.estado !== 'com'
  const valido = numero.trim().length >= 2

  function anexar() {
    if (!valido) return
    anexarComprovante(id, numero)
    setAnexado(true)
  }

  return (
    <main className="page">
      <header className="cab">
        <Voltar onClick={nav.voltar} />
        {novo && (
          <div className="sucesso" role="status">
            <Ic n="ok" size={22} />
            <span>
              <strong>Lançamento salvo.</strong> Os moradores já podem ver em "Contas do mês".
            </span>
          </div>
        )}
        {anexado && (
          <div className="sucesso" role="status">
            <Ic n="ok" size={22} />
            <span>
              <strong>Comprovante anexado.</strong> O lançamento agora aparece como "Com comprovante" para todos.
            </span>
          </div>
        )}
        <Status estado={l.estado} />
        <h1 className="page-title">{l.descricao}</h1>
        <p className={`figure ${l.valor > 0 ? 'in' : ''}`}>{moedaComSinal(l.valor)}</p>
      </header>

      <dl className="rows">
        <div className="row">
          <dt>Data</dt>
          <dd>{dataBR(l.data)}</dd>
        </div>
        <div className="row">
          <dt>Categoria</dt>
          <dd>{l.categoria}</dd>
        </div>
        {l.fornecedor && (
          <div className="row">
            <dt>Fornecedor</dt>
            <dd>
              {l.fornecedor.nome}
              {l.fornecedor.doc && (
                <>
                  <br />
                  <span className="mono-leve">{l.fornecedor.doc}</span>
                </>
              )}
            </dd>
          </div>
        )}
        <div className="row">
          <dt>Origem</dt>
          <dd>{l.origem}</dd>
        </div>
      </dl>

      <section className={`prova ${l.estado === 'com' ? 'ok' : ''}`} aria-label="Comprovante">
        <Ic n="documento" size={22} sw={1.5} />
        <div>
          <p className="prova-t">{l.estado === 'com' ? `Comprovante anexado: ${l.comprovante}` : 'Nenhum comprovante anexado'}</p>
          {l.nota && <p className="caption">{l.nota}</p>}
        </div>
      </section>

      {pendente && (
        <section className="cx" aria-label="Anexar comprovante">
          <p className="cx-t">Anexar comprovante</p>
          <div className="campo">
            <label className="rotulo" htmlFor="num">
              Número da nota ou do recibo
            </label>
            <input id="num" type="text" placeholder="Ex.: NF 1850" value={numero} onChange={(e) => setNumero(e.target.value)} />
          </div>
          <p className="caption" style={{ margin: 'var(--space-2) 0 var(--space-3)' }}>
            Ao anexar, o lançamento passa a aparecer como "Com comprovante" para todos os moradores.
          </p>
          <button className="btn primary" style={{ width: '100%' }} onClick={anexar} disabled={!valido}>
            Anexar comprovante
          </button>
        </section>
      )}
    </main>
  )
}
