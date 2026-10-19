import { useState } from 'react'
import { Ic } from '../../components/ui'
import { BarraAcao, Voltar } from '../../morador/BarraAbas'
import { CartaoAlvo } from '../../morador/componentes'
import { PRAZO_DIAS, diasDecorridos } from '../../morador/dados'
import { publicarResposta } from '../acoes'
import type { PropsS } from '../tipos'

const LIMITE = 800
const MINIMO = 10

export default function PerguntaResponder({ nav, p, id }: PropsS & { id: string }) {
  const q = p.perguntas.find((x) => x.id === id)
  const [texto, setTexto] = useState('')
  const [publicada, setPublicada] = useState(false)

  if (!q) {
    return (
      <main className="page">
        <Voltar onClick={nav.voltar} />
        <p className="empty">Pergunta não encontrada.</p>
      </main>
    )
  }

  const dias = diasDecorridos(q)
  const restante = PRAZO_DIAS - dias
  const vencida = restante <= 0
  const valido = texto.trim().length >= MINIMO

  function publicar() {
    if (!q || !valido) return
    publicarResposta(q.id, texto, dias)
    setPublicada(true)
  }

  return (
    <main className={`page ${q.respondida ? '' : 'com-barra'}`}>
      <header className="cab">
        <Voltar onClick={nav.voltar} />
        {publicada && (
          <div className="sucesso" role="status">
            <Ic n="ok" size={22} />
            <span>
              <strong>Resposta publicada.</strong> Todos os moradores já podem ler.
            </span>
          </div>
        )}
        {q.respondida ? (
          <span className="pill ok">
            <Ic n="ok" />
            Respondida em {q.dias} {q.dias === 1 ? 'dia' : 'dias'}
          </span>
        ) : (
          <span className={`pill ${vencida ? 'crit' : 'warn'}`}>
            <Ic n={vencida ? 'erro' : 'espera'} />
            {vencida ? 'Prazo vencido' : 'Esperando a sua resposta'}
          </span>
        )}
        <h1 className="page-title menor">{q.titulo}</h1>
        {q.texto && <p className="corpo">{q.texto}</p>}
        <p className="caption">
          {q.autor} · {q.criadaEm} · {p.acompanham(q)} {p.acompanham(q) === 1 ? 'morador acompanha' : 'moradores acompanham'}
        </p>
      </header>

      <div style={{ marginTop: 'var(--space-3)' }}>
        <CartaoAlvo
          alvo={q.alvo}
          onClick={() => nav.ir(q.alvo.tipo === 'lancamento' ? { nome: 'lancamento', id: q.alvo.id } : { nome: 'decisao', id: q.alvo.id })}
        />
      </div>

      {q.respondida && q.resposta ? (
        <section className="cx resposta" aria-label="Resposta publicada">
          <p className="cx-t">
            Sua resposta · {q.resposta.quando}
          </p>
          <p className="corpo">{q.resposta.texto}</p>
        </section>
      ) : (
        <>
          <section className="cx" aria-label="Prazo">
            <p className="cx-t">Prazo de resposta</p>
            <p className="corpo">
              {vencida
                ? `O prazo de ${PRAZO_DIAS} dias já passou${restante < 0 ? ` há ${-restante} ${-restante === 1 ? 'dia' : 'dias'}` : ''}. O atraso aparece para todos os moradores.`
                : `Faltam ${restante} ${restante === 1 ? 'dia' : 'dias'} (a pergunta tem ${dias} de ${PRAZO_DIAS} dias).`}
            </p>
            <span className="trilho" aria-hidden="true" style={{ marginTop: 'var(--space-2)' }}>
              <span
                className="enchimento"
                style={{ width: `${Math.min(100, (dias / PRAZO_DIAS) * 100)}%`, background: vencida ? 'var(--critico)' : 'var(--atencao)' }}
              />
            </span>
          </section>

          <div className="form">
            <div className="campo">
              <label className="rotulo" htmlFor="resp">
                Sua resposta
              </label>
              <textarea
                id="resp"
                rows={6}
                maxLength={LIMITE}
                placeholder="Escreva de forma simples e direta. Se puder, cite o documento ou o valor."
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
              />
              <span className="contador">
                <span>{texto.trim().length > 0 && texto.trim().length < MINIMO ? `Escreva ao menos ${MINIMO} caracteres.` : 'A resposta fica pública para todos os moradores.'}</span>
                <span>
                  {texto.length} de {LIMITE}
                </span>
              </span>
            </div>
          </div>

          <BarraAcao>
            <button className="btn primary grow" onClick={publicar} disabled={!valido}>
              Publicar resposta
            </button>
          </BarraAcao>
        </>
      )}
    </main>
  )
}
