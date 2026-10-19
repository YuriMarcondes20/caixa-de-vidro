import { dataBR, dataCurta, moedaComSinal } from '../format'
import { IconeEstado, ROTULO_ESTADO, CLASSE_ESTADO } from '../components/ui'
import { decisao, lancamento, type Alvo, type Decisao, type EstadoDecisao, type Lancamento } from './dados'

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
        {dataCurta(l.data)} · {l.valor > 0 ? 'Entrada' : 'Gasto'} · {l.categoria}
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

const ORDEM_ETAPA: Record<EstadoDecisao, number> = { decidida: 0, execucao: 1, concluida: 2 }
const NOMES_ETAPA = ['Decidida', 'Em execução', 'Concluída']

/** As três etapas de uma decisão: decidida, em execução, concluída. */
export function EtapasDecisao({ d }: { d: Decisao }) {
  const idx = ORDEM_ETAPA[d.estado]
  const concluida = d.estado === 'concluida'
  return (
    <ol className="etapas" aria-label="Andamento">
      {NOMES_ETAPA.map((nome, i) => {
        const feito = i < idx || (concluida && i === idx)
        const atual = i === idx && !concluida
        const marca = feito ? '✓' : atual ? '●' : '○'
        return (
          <li key={nome}>
            <span className="etapa-barra" style={{ background: i <= idx ? 'var(--vidro)' : 'var(--line)' }} />
            <span className="etapa-nome" style={{ color: atual ? 'var(--vidro)' : i > idx ? 'var(--ink-muted)' : undefined }}>
              {marca} {nome}
            </span>
            <span className="caption">{d.etapas[i]}</span>
          </li>
        )
      })}
    </ol>
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
