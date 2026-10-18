import { Hero, Ic } from '../../components/ui'
import { BarraAcao, Voltar } from '../BarraAbas'
import { CartaoAlvo } from '../componentes'
import { PRAZO_DIAS, diasDecorridos } from '../dados'
import type { Props } from '../tipos'

export default function PerguntaDetalhe({ nav, p, id }: Props & { id: string }) {
  const q = p.perguntas.find((x) => x.id === id)
  if (!q) {
    return (
      <main className="page">
        <Voltar rotulo={nav.anterior} onClick={nav.voltar} />
        <p className="empty">Pergunta não encontrada.</p>
      </main>
    )
  }

  const dias = diasDecorridos(q)
  const vencida = !q.respondida && dias >= PRAZO_DIAS
  const seguindo = p.seguindo(q.id)
  const total = p.acompanham(q)
  const cor = vencida ? 'crit' : 'warn'

  return (
    <main className="page com-barra">
      <header className="cab">
        <Voltar rotulo={nav.anterior} onClick={nav.voltar} />
        {q.respondida ? (
          <span className="pill ok">
            <Ic n="ok" />
            Respondida em {q.dias} {q.dias === 1 ? 'dia' : 'dias'}
          </span>
        ) : (
          <span className={`pill ${cor}`}>
            <Ic n={vencida ? 'erro' : 'espera'} />
            {vencida ? 'Prazo vencido' : 'Aguardando resposta'}
          </span>
        )}
        <h1 className="page-title menor">{q.titulo}</h1>
        {q.texto && <p className="corpo">{q.texto}</p>}
        <p className="caption">
          {q.autor} · {q.criadaEm}
        </p>
      </header>

      <div style={{ marginTop: 'var(--space-3)' }}>
        <CartaoAlvo
          alvo={q.alvo}
          onClick={() => nav.ir(q.alvo.tipo === 'lancamento' ? { nome: 'lancamento', id: q.alvo.id } : { nome: 'decisao', id: q.alvo.id })}
        />
      </div>

      {q.resposta ? (
        <section className="cx resposta" aria-label="Resposta">
          <p className="cx-t">
            Resposta do {q.resposta.autor.toLowerCase()} · {q.resposta.quando}
          </p>
          <p className="corpo">{q.resposta.texto}</p>
        </section>
      ) : (
        <Hero>
          <section className="painel" aria-label="Prazo de resposta">
            <p className="k">Prazo de resposta</p>
            <p className="figure">
              {dias} <span className="figure-un">de {PRAZO_DIAS} dias</span>
            </p>
            <span className="trilho" aria-hidden="true">
              <span
                className="enchimento"
                style={{
                  width: `${Math.min(100, (dias / PRAZO_DIAS) * 100)}%`,
                  background: vencida ? 'var(--critico)' : 'var(--atencao)'
                }}
              />
            </span>
            <p className="caption" style={{ marginTop: 'var(--space-2)' }}>
              {vencida ? 'Prazo vencido em' : 'Vence em'} {q.vence} · prazo definido pelo conselho fiscal
            </p>
          </section>
        </Hero>
      )}

      <ol className="linha-tempo" aria-label="Andamento">
        {q.etapas.map((e) => (
          <li key={e.rotulo}>
            <span className={`ponto-t-bolinha ${e.estado}`} aria-hidden="true" />
            <div>
              <p className={`lt-rotulo ${e.estado}`}>{e.rotulo}</p>
              {e.quando && <p className="caption">{e.quando}</p>}
            </div>
          </li>
        ))}
      </ol>

      <BarraAcao>
        {seguindo ? (
          <button className="btn seguindo grow" aria-pressed="true" onClick={() => p.alternarSeguir(q.id)}>
            <Ic n="marcar" size={18} />
            Acompanhando · {total} {total === 1 ? 'morador' : 'moradores'}
          </button>
        ) : (
          <button className="btn primary grow" aria-pressed="false" onClick={() => p.alternarSeguir(q.id)}>
            Também quero saber · {total}
          </button>
        )}
      </BarraAcao>
    </main>
  )
}
