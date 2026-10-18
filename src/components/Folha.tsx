import { useEffect, useRef } from 'react'
import type { Lancamento } from '../data'
import { dataBR, moedaComSinal } from '../format'
import { IconeDocumento, Status } from './ui'

interface Props {
  lancamento: Lancamento
  explicacaoPedida: boolean
  onPedirExplicacao: () => void
  onFechar: () => void
}

/** Folha de detalhe de um lançamento (radius-xl, opaca para leitura). */
export function Folha({ lancamento: l, explicacaoPedida, onPedirExplicacao, onFechar }: Props) {
  const fecharRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    fecharRef.current?.focus()
    const aoTeclar = (e: KeyboardEvent) => e.key === 'Escape' && onFechar()
    addEventListener('keydown', aoTeclar)
    return () => removeEventListener('keydown', aoTeclar)
  }, [onFechar])

  const temComprovante = l.estado === 'com'

  return (
    <div className="scrim" onClick={onFechar}>
      <section
        className="folha"
        role="dialog"
        aria-modal="true"
        aria-labelledby="folha-titulo"
        onClick={(e) => e.stopPropagation()}
      >
        <Status estado={l.estado} />
        <h2 id="folha-titulo">{l.descricao}</h2>
        <p className={`figure ${l.valor > 0 ? 'in' : ''}`} style={l.valor > 0 ? { color: 'var(--positivo)' } : undefined}>
          {moedaComSinal(l.valor)}
        </p>
        <dl>
          <dt>Data</dt>
          <dd>{dataBR(l.data)}</dd>
          <dt>Categoria</dt>
          <dd>{l.categoria}</dd>
          <dt>Contexto</dt>
          <dd>{l.contexto}</dd>
          <dt>Comprovante</dt>
          <dd>{l.comprovante ?? 'Nenhum anexado'}</dd>
        </dl>
        <div className="acoes">
          {temComprovante && (
            <button className="btn primary">
              <IconeDocumento />
              Ver comprovante
            </button>
          )}
          <button
            className={`btn ${temComprovante ? 'text' : 'primary'}`}
            onClick={onPedirExplicacao}
            disabled={explicacaoPedida}
          >
            {explicacaoPedida ? 'Pedido enviado' : 'Pedir explicação'}
          </button>
          <button ref={fecharRef} className="btn glass" onClick={onFechar}>
            Fechar
          </button>
        </div>
      </section>
    </div>
  )
}
