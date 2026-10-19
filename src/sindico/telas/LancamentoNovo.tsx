import { useState } from 'react'
import { BarraAcao, Voltar } from '../../morador/BarraAbas'
import { PRESTADORES, type Lancamento } from '../../morador/dados'
import { criarLancamento, lerValor } from '../acoes'
import type { PropsS } from '../tipos'

const CATEGORIAS = ['Manutenção', 'Conservação', 'Concessionárias', 'Pessoal', 'Obras', 'Administração', 'Outras despesas']
// O mês em aberto da demonstração é setembro de 2026 (o balancete mais recente).
const PRIMEIRO_DIA = '2026-09-01'
const ULTIMO_DIA = '2026-09-30'

export default function LancamentoNovo({ nav }: PropsS) {
  const [tipo, setTipo] = useState<'gasto' | 'entrada'>('gasto')
  const [descricao, setDescricao] = useState('')
  const [valorTexto, setValorTexto] = useState('')
  const [data, setData] = useState(ULTIMO_DIA)
  const [categoria, setCategoria] = useState(CATEGORIAS[0])
  const [prestadorId, setPrestadorId] = useState('')
  const [numero, setNumero] = useState('')

  const valor = lerValor(valorTexto)
  const dataOk = data >= PRIMEIRO_DIA && data <= ULTIMO_DIA
  const valido = descricao.trim().length >= 3 && Number.isFinite(valor) && valor > 0 && dataOk

  let aviso = ''
  if (valorTexto.trim() && !(Number.isFinite(valor) && valor > 0)) aviso = 'Digite o valor só com números. Exemplo: 1.250,00'
  else if (!dataOk) aviso = 'Escolha uma data de setembro de 2026, o mês em aberto.'

  function salvar() {
    if (!valido) return
    const prestador = tipo === 'gasto' ? PRESTADORES.find((p) => p.id === prestadorId) : undefined
    const comComprovante = numero.trim().length >= 2
    const id = `n-${Date.now()}`
    const novo: Lancamento = {
      id,
      descricao: descricao.trim(),
      valor: tipo === 'gasto' ? -valor : valor,
      data,
      categoria: tipo === 'entrada' ? 'Receita' : categoria,
      estado: comComprovante ? 'com' : 'aguardando',
      comprovante: comComprovante ? numero.trim() : undefined,
      fornecedor: prestador ? { nome: prestador.nome, doc: prestador.doc } : undefined,
      prestadorId: prestador?.id,
      origem: 'Lançado pelo síndico',
      nota: comComprovante ? undefined : 'Síndico: o comprovante será anexado assim que o documento chegar.'
    }
    criarLancamento(novo)
    nav.substituir({ nome: 'lancamento', id, novo: true })
  }

  return (
    <main className="page com-barra">
      <header className="cab">
        <Voltar rotulo="Cancelar" onClick={nav.voltar} />
        <h1 className="page-title">Novo lançamento</h1>
        <p className="ajuda">Registre um gasto ou uma entrada de dinheiro. Os moradores veem o que você lançar.</p>
      </header>

      <div className="form">
        <div className="campo">
          <span className="rotulo" id="tp">
            O que foi?
          </span>
          <div className="papeis" role="radiogroup" aria-labelledby="tp">
            {(['gasto', 'entrada'] as const).map((t) => (
              <button
                key={t}
                type="button"
                role="radio"
                aria-checked={tipo === t}
                className="chip"
                onClick={() => setTipo(t)}
              >
                {t === 'gasto' ? 'Gasto (saiu dinheiro)' : 'Entrada (entrou dinheiro)'}
              </button>
            ))}
          </div>
        </div>

        <div className="campo">
          <label className="rotulo" htmlFor="desc">
            Descrição
          </label>
          <input
            id="desc"
            type="text"
            placeholder={tipo === 'gasto' ? 'Ex.: Conserto do portão da garagem' : 'Ex.: Aluguel do salão de festas'}
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />
        </div>

        <div className="campo">
          <label className="rotulo" htmlFor="valor">
            Valor (R$)
          </label>
          <input
            id="valor"
            type="text"
            inputMode="decimal"
            placeholder="Ex.: 1.250,00"
            value={valorTexto}
            onChange={(e) => setValorTexto(e.target.value)}
          />
        </div>

        <div className="campo">
          <label className="rotulo" htmlFor="data">
            Data
          </label>
          <input id="data" type="date" min={PRIMEIRO_DIA} max={ULTIMO_DIA} value={data} onChange={(e) => setData(e.target.value)} />
        </div>

        {tipo === 'gasto' && (
          <>
            <div className="campo">
              <label className="rotulo" htmlFor="cat">
                Tipo de gasto
              </label>
              <select id="cat" className="seletor" value={categoria} onChange={(e) => setCategoria(e.target.value)}>
                {CATEGORIAS.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="campo">
              <label className="rotulo" htmlFor="prest">
                Quem recebeu
              </label>
              <select id="prest" className="seletor" value={prestadorId} onChange={(e) => setPrestadorId(e.target.value)}>
                <option value="">Outro (sem cadastro)</option>
                {PRESTADORES.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nome}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}

        <div className="campo">
          <label className="rotulo" htmlFor="comp">
            Número da nota ou do recibo
          </label>
          <input id="comp" type="text" placeholder="Ex.: NF 1850" value={numero} onChange={(e) => setNumero(e.target.value)} />
          <span className="contador">
            <span>Ainda não tem? Deixe em branco: fica "Aguardando comprovante" e você anexa depois.</span>
          </span>
        </div>

        {aviso && (
          <p className="erro" role="alert">
            {aviso}
          </p>
        )}
      </div>

      <BarraAcao>
        <button className="btn primary grow" onClick={salvar} disabled={!valido}>
          Salvar lançamento
        </button>
      </BarraAcao>
    </main>
  )
}
