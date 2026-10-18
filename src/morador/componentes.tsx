import { dataBR, dataCurta, moedaComSinal } from '../format'
import { IconeEstado, ROTULO_ESTADO, CLASSE_ESTADO } from '../components/ui'
import { decisao, lancamento, type Alvo, type Lancamento } from './dados'

/** Rótulo curto do comprovante, à direita do valor: "valor → prova" na mesma coluna. */
function rotuloProva(l: Lancamento): string {
  if (l.estado === 'com') return l.comprovante ?? ROTULO_ESTADO.com
  if (l.estado === 'aguardando') return 'Aguardando'
  return ROTULO_ESTADO.sem
}

export function LinhaLancamento({
  l,
  onClick,
  caixa = false
}: {
  l: Lancamento
  onClick?: () => void
  /** Desenha a linha como cartão próprio (fora de uma lista). */
  caixa?: boolean
}) {
  const conteudo = (
    <>
      <span className="desc">{l.descricao}</span>
      <span className={`amt ${l.valor > 0 ? 'in' : ''}`}>{moedaComSinal(l.valor)}</span>
      <span className="caption">
        {dataCurta(l.data)} · {l.categoria}
        {l.contexto ? ` · ${l.contexto}` : ''}
      </span>
      <span className={`proof ${CLASSE_ESTADO[l.estado]}`}>
        <IconeEstado estado={l.estado} size={14} />
        {rotuloProva(l)}
      </span>
    </>
  )
  const classe = `item-btn ${caixa ? 'caixa' : ''}`
  return onClick ? (
    <button className={classe} onClick={onClick}>
      {conteudo}
    </button>
  ) : (
    <div className={classe}>{conteudo}</div>
  )
}

/** Cartão "Sobre": o lançamento ou a decisão a que a pergunta se refere. */
export function CartaoAlvo({ alvo, onClick }: { alvo: Alvo; onClick?: () => void }) {
  if (alvo.tipo === 'lancamento') {
    const l = lancamento(alvo.id)
    return l ? <LinhaLancamento l={l} onClick={onClick} caixa /> : null
  }
  const d = decisao(alvo.id)
  if (!d) return null
  const corpo = (
    <>
      <span className="desc">{d.titulo}</span>
      <span className="caption">
        Decisão · {d.assembleia} de {dataBR(d.data)}
      </span>
    </>
  )
  return onClick ? (
    <button className="item-btn caixa um" onClick={onClick}>
      {corpo}
    </button>
  ) : (
    <div className="item-btn caixa um">{corpo}</div>
  )
}
