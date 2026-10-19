import { useState } from 'react'
import { Ic } from '../../components/ui'
import { moedaComSinal } from '../../format'
import { PRAZO_DIAS, diasDecorridos, lancamento, type Pergunta } from '../../morador/dados'
import type { PropsS } from '../tipos'

type FiltroP = 'todas' | 'sem' | 'respondidas'

function sobre(p: Pergunta): string | null {
  if (p.alvo.tipo !== 'lancamento') return null
  const l = lancamento(p.alvo.id)
  return l ? `Sobre: ${l.descricao} · ${moedaComSinal(l.valor)}` : null
}

export default function Perguntas({ nav, p }: PropsS) {
  const [filtro, setFiltro] = useState<FiltroP>('todas')
  // As que esperam resposta vêm primeiro, da mais antiga para a mais nova.
  const ordenadas = [...p.perguntas].sort((a, b) => {
    if (a.respondida !== b.respondida) return a.respondida ? 1 : -1
    return diasDecorridos(b) - diasDecorridos(a)
  })
  const sem = ordenadas.filter((q) => !q.respondida)
  const respondidas = ordenadas.filter((q) => q.respondida)
  const visiveis = filtro === 'todas' ? ordenadas : filtro === 'sem' ? sem : respondidas

  return (
    <main className="page com-abas">
      <header className="cab">
        <h1 className="page-title">Perguntas dos moradores</h1>
        <p className="ajuda">
          Toque numa pergunta para responder. A resposta fica visível para todos os moradores. O prazo é de {PRAZO_DIAS} dias.
        </p>
        <div className="chips" role="group" aria-label="Filtrar perguntas" style={{ margin: 0 }}>
          <button className="chip" aria-pressed={filtro === 'todas'} onClick={() => setFiltro('todas')}>
            Todas {ordenadas.length}
          </button>
          <button className="chip" aria-pressed={filtro === 'sem'} onClick={() => setFiltro('sem')}>
            Sem resposta {sem.length}
          </button>
          <button className="chip" aria-pressed={filtro === 'respondidas'} onClick={() => setFiltro('respondidas')}>
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
            const n = p.acompanham(q)
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
                    {vencida ? `Prazo vencido · ${dias} de ${PRAZO_DIAS} dias` : `Espera resposta · ${dias} de ${PRAZO_DIAS} dias`}
                  </span>
                )}
                <span className="cartao-titulo">{q.titulo}</span>
                {ref && <span className="ref">{ref}</span>}
                <span className="caption">
                  {q.autor} · {n} {n === 1 ? 'acompanha' : 'acompanham'}
                </span>
              </button>
            )
          })}
        </div>
      )}
    </main>
  )
}
