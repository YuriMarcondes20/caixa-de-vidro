import { Ic, Status } from '../../components/ui'
import { dataBR, moedaComSinal } from '../../format'
import { BarraAcao, Voltar } from '../BarraAbas'
import { decisao, lancamento } from '../dados'
import type { Props } from '../tipos'

export default function LancamentoDetalhe({ nav, p, id }: Props & { id: string }) {
  const l = lancamento(id)
  if (!l) {
    return (
      <main className="page">
        <Voltar onClick={nav.voltar} />
        <p className="empty">Lançamento não encontrado.</p>
      </main>
    )
  }

  const d = l.decisaoId ? decisao(l.decisaoId) : undefined
  const relacionadas = p.perguntas.filter((x) => x.alvo.tipo === 'lancamento' && x.alvo.id === l.id)
  const acompanham = relacionadas.reduce((s, x) => s + p.acompanham(x), 0)

  return (
    <main className="page com-barra">
      <header className="cab">
        <Voltar onClick={nav.voltar} />
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
              {l.prestadorId ? (
                <button className="link-inline" onClick={() => nav.ir({ nome: 'prestador', id: l.prestadorId! })}>
                  {l.fornecedor.nome}
                </button>
              ) : (
                l.fornecedor.nome
              )}
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
          <dt>Decisão da assembleia</dt>
          <dd>
            {d ? (
              <button className="link-inline" onClick={() => nav.ir({ nome: 'decisao', id: d.id })}>
                {d.titulo}
              </button>
            ) : (
              'Nenhuma vinculada'
            )}
          </dd>
        </div>
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
          {l.estado === 'com' && <p className="caption">Anexado ao balancete e conferido pelo conselho fiscal.</p>}
        </div>
      </section>

      {relacionadas.length > 0 && (
        <button className="cartao-link" onClick={() => nav.ir({ nome: 'pergunta', id: relacionadas[0].id })}>
          <Ic n="perguntas" size={18} sw={1.5} />
          <span className="ponto-t">
            {relacionadas.length} {relacionadas.length === 1 ? 'pergunta pública' : 'perguntas públicas'} · {acompanham}{' '}
            moradores acompanham
          </span>
          <Ic n="avancar" size={16} />
        </button>
      )}

      <BarraAcao>
        <button className="btn primary grow" onClick={() => nav.ir({ nome: 'pergunta-nova', alvo: { tipo: 'lancamento', id: l.id } })}>
          <Ic n="perguntas" size={18} sw={1.5} />
          Perguntar sobre isto
        </button>
      </BarraAcao>
    </main>
  )
}
