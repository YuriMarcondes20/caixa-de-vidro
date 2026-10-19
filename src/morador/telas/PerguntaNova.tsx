import { useState } from 'react'
import { Ic } from '../../components/ui'
import { BarraAcao, Voltar } from '../BarraAbas'
import { CartaoAlvo } from '../componentes'
import { listaDecisoes, lancamentosDoMes, type Alvo } from '../dados'
import type { Props } from '../tipos'

const LIMITE = 500
const MINIMO = 10

export default function PerguntaNova({ nav, p, alvo: alvoInicial, autor }: Props & { alvo?: Alvo; autor: string }) {
  const [alvo, setAlvo] = useState<Alvo | undefined>(alvoInicial)
  const [texto, setTexto] = useState('')

  const existentes = alvo ? p.perguntas.filter((x) => x.alvo.tipo === alvo.tipo && x.alvo.id === alvo.id) : []
  const valido = !!alvo && texto.trim().length >= MINIMO

  function escolher(valor: string) {
    if (!valor) return setAlvo(undefined)
    const [tipo, id] = valor.split(':')
    setAlvo({ tipo: tipo as Alvo['tipo'], id })
  }

  function enviar() {
    if (!alvo || !valido) return
    const id = p.criar(texto, alvo, autor)
    nav.substituir({ nome: 'pergunta', id, nova: true })
  }

  return (
    <main className="page com-barra">
      <header className="cab">
        <Voltar rotulo="Cancelar" onClick={nav.voltar} />
        <h1 className="page-title">Fazer uma pergunta</h1>
      </header>

      <div className="form">
        <div className="campo">
          <span className="rotulo">Sobre</span>
          {alvoInicial ? (
            <CartaoAlvo alvo={alvoInicial} />
          ) : (
            <select
              className="seletor"
              aria-label="Sobre"
              value={alvo ? `${alvo.tipo}:${alvo.id}` : ''}
              onChange={(e) => escolher(e.target.value)}
            >
              <option value="">Escolha um lançamento ou uma decisão</option>
              <optgroup label="Lançamentos">
                {lancamentosDoMes().map((l) => (
                  <option key={l.id} value={`lancamento:${l.id}`}>
                    {l.descricao}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Decisões">
                {listaDecisoes().map((d) => (
                  <option key={d.id} value={`decisao:${d.id}`}>
                    {d.titulo}
                  </option>
                ))}
              </optgroup>
            </select>
          )}
          {!alvoInicial && alvo && <CartaoAlvo alvo={alvo} />}
        </div>

        <div className="campo">
          <label className="rotulo" htmlFor="pergunta">
            Sua pergunta
          </label>
          <textarea
            id="pergunta"
            rows={4}
            maxLength={LIMITE}
            placeholder="Pergunte sobre o fato: o quê, quanto, por quê."
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
          />
          <span className="contador">
            <span>{texto.trim().length > 0 && texto.trim().length < MINIMO ? `Escreva ao menos ${MINIMO} caracteres.` : ''}</span>
            <span>
              {texto.length} de {LIMITE}
            </span>
          </span>
        </div>

        {existentes.length > 0 && (
          <button className="aviso" onClick={() => nav.ir({ nome: 'pergunta', id: existentes[0].id })}>
            <Ic n="info" size={18} />
            <span>
              Já existe {existentes.length} {existentes.length === 1 ? 'pergunta' : 'perguntas'} sobre{' '}
              {alvo?.tipo === 'lancamento' ? 'este lançamento' : 'esta decisão'}. <strong>Acompanhar ela</strong> soma sua voz
              sem repetir o pedido.
            </span>
          </button>
        )}

        <section className="cx" aria-label="Como funciona">
          <p className="cx-t">Como funciona</p>
          <ol className="passos">
            <li>O conselho fiscal recebe e encaminha ao síndico.</li>
            <li>A resposta fica pública para todos os moradores.</li>
            <li>Sem resposta em 10 dias, o atraso fica visível.</li>
          </ol>
          <p className="caption" style={{ marginTop: 'var(--space-2)' }}>
            Publicada como {autor}. Seu nome e apartamento não aparecem.
          </p>
        </section>
      </div>

      <BarraAcao>
        <button className="btn primary grow" onClick={enviar} disabled={!valido}>
          Enviar pergunta
        </button>
      </BarraAcao>
    </main>
  )
}
