import { useState } from 'react'
import { Ic } from '../../components/ui'
import { moedaComSinal } from '../../format'
import { PRAZO_DIAS, diasDecorridos, lancamento, type Pergunta } from '../dados'
import type { Props } from '../tipos'

type FiltroPergunta = 'todas' | 'sem' | 'respondidas'

function sobre(p: Pergunta): string | null {
  if (p.alvo.tipo !== 'lancamento') return null
  const l = lancamento(p.alvo.id)
  return l ? `Sobre: ${l.descricao} · ${moedaComSinal(l.valor)}` : null
}

export default function Perguntas({ nav, p }: Props) {
  const [filtro, setFiltro] = useState<FiltroPergunta>('todas')
  const sem = p.perguntas.filter((x) => !x.respondida)
  const respondidas = p.perguntas.filter((x) => x.respondida)
  const visiveis = filtro === 'todas' ? p.perguntas : filtro === 'sem' ? sem : respondidas

  return (
    <main className="page com-abas">
      <header className="cab">
        <div className="cab-linha">
          <h1 className="page-title">Perguntas</h1>
          <button className="btn primary" onClick={() => nav.ir({ nome: 'pergunta-nova' })}>
            <Ic n="mais" size={16} />
            Fazer pergunta
          </button>
        </div>
        <p className="caption">
          Perguntas e respostas são públicas para todos os moradores. Prazo de resposta definido pelo conselho: {PRAZO_DIAS}{' '}
          dias.
        </p>
        <div className="seg tres" role="group" aria-label="Filtro">
          <button aria-pressed={filtro === 'todas'} onClick={() => setFiltro('todas')}>
            Todas {p.perguntas.length}
          </button>
          <button aria-pressed={filtro === 'sem'} onClick={() => setFiltro('sem')}>
            Sem resposta {sem.length}
          </button>
          <button aria-pressed={filtro === 'respondidas'} onClick={() => setFiltro('respondidas')}>
            Respondidas {respondidas.length}
          </button>
        </div>
      </header>

      {visiveis.length === 0 ? (
        <p className="empty">Nenhuma pergunta neste filtro.</p>
      ) : (
        <div className="pilha">
          {visiveis.map((q) => {
            const dias = diasDecorridos(q)
            const vencida = !q.respondida && dias >= PRAZO_DIAS
            const ref = sobre(q)
            return (
              <button
                className={`cartao ${!q.respondida ? (vencida ? 'borda-crit' : 'borda-warn') : ''}`}
                key={q.id}
                onClick={() => nav.ir({ nome: 'pergunta', id: q.id })}
              >
                {q.respondida ? (
                  <span className="estado ok">
                    <Ic n="ok" size={14} />
                    Respondida em {q.dias} {q.dias === 1 ? 'dia' : 'dias'}
                  </span>
                ) : (
                  <span className={`estado ${vencida ? 'crit' : 'warn'}`}>
                    <Ic n={vencida ? 'erro' : 'espera'} size={14} />
                    {vencida ? `Prazo vencido · ${dias} de ${PRAZO_DIAS} dias` : `Sem resposta · ${dias} de ${PRAZO_DIAS} dias`}
                  </span>
                )}
                <span className="cartao-titulo">{q.titulo}</span>
                {q.resposta && (
                  <span className="resp-previa">
                    {q.resposta.autor}: {q.resposta.texto}
                  </span>
                )}
                {ref && <span className="ref">{ref}</span>}
                {!q.respondida && (
                  <span className="trilho fino" aria-hidden="true">
                    <span
                      className="enchimento"
                      style={{
                        width: `${Math.min(100, (dias / PRAZO_DIAS) * 100)}%`,
                        background: vencida ? 'var(--critico)' : 'var(--atencao)'
                      }}
                    />
                  </span>
                )}
                <span className="caption">
                  {q.autor} · {p.acompanham(q)} {p.acompanham(q) === 1 ? 'acompanha' : 'acompanham'}
                </span>
              </button>
            )
          })}
        </div>
      )}
    </main>
  )
}
